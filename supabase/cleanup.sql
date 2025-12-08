-- =====================================================
-- AgentForge-XT: Auto-Cleanup Functions for Free Tier
-- =====================================================
-- Run this in your Supabase SQL Editor to enable
-- automatic cleanup of old data to stay within limits
-- =====================================================

-- Enable pg_cron extension for scheduled jobs (requires Supabase Pro or self-hosted)
-- For free tier, you can run this manually or via external cron
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- =====================================================
-- 1. Function to clean up old inactive workflows (15 days)
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_old_workflows()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete workflows that haven't been updated in 15 days
    -- and don't have any recent executions
    WITH inactive_workflows AS (
        SELECT w.id
        FROM workflows w
        LEFT JOIN executions e ON e.workflow_id = w.id 
            AND e.created_at > NOW() - INTERVAL '15 days'
        WHERE w.updated_at < NOW() - INTERVAL '15 days'
            AND w.is_active = false
            AND e.id IS NULL
        LIMIT 100  -- Process in batches to avoid timeout
    )
    DELETE FROM workflows
    WHERE id IN (SELECT id FROM inactive_workflows);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log the cleanup
    INSERT INTO cleanup_logs (type, deleted_count, executed_at)
    VALUES ('workflows', deleted_count, NOW())
    ON CONFLICT DO NOTHING;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. Function to clean up old executions (7 days)
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_old_executions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete execution logs older than 7 days
    DELETE FROM executions
    WHERE created_at < NOW() - INTERVAL '7 days'
    AND id IN (
        SELECT id FROM executions 
        WHERE created_at < NOW() - INTERVAL '7 days'
        LIMIT 500  -- Process in batches
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log the cleanup
    INSERT INTO cleanup_logs (type, deleted_count, executed_at)
    VALUES ('executions', deleted_count, NOW())
    ON CONFLICT DO NOTHING;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. Function to clean up expired user settings API keys
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_expired_api_keys()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Revoke API keys not used in 30 days
    UPDATE api_keys
    SET is_active = false
    WHERE last_used_at < NOW() - INTERVAL '30 days'
        AND is_active = true;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. Create cleanup logs table
-- =====================================================
CREATE TABLE IF NOT EXISTS cleanup_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    deleted_count INTEGER DEFAULT 0,
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. Create usage_tracking table for analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    ai_calls INTEGER DEFAULT 0,
    executions INTEGER DEFAULT 0,
    storage_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_date 
ON usage_tracking(user_id, date DESC);

-- =====================================================
-- 6. Function to increment usage counters
-- =====================================================
CREATE OR REPLACE FUNCTION increment_usage(
    p_user_id UUID,
    p_ai_calls INTEGER DEFAULT 0,
    p_executions INTEGER DEFAULT 0,
    p_storage_bytes BIGINT DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO usage_tracking (user_id, date, ai_calls, executions, storage_bytes)
    VALUES (p_user_id, CURRENT_DATE, p_ai_calls, p_executions, p_storage_bytes)
    ON CONFLICT (user_id, date) 
    DO UPDATE SET
        ai_calls = usage_tracking.ai_calls + EXCLUDED.ai_calls,
        executions = usage_tracking.executions + EXCLUDED.executions,
        storage_bytes = usage_tracking.storage_bytes + EXCLUDED.storage_bytes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. Function to get user usage stats
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_usage(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    total_ai_calls BIGINT,
    total_executions BIGINT,
    total_storage_bytes BIGINT,
    daily_stats JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(ai_calls), 0)::BIGINT as total_ai_calls,
        COALESCE(SUM(executions), 0)::BIGINT as total_executions,
        COALESCE(MAX(storage_bytes), 0)::BIGINT as total_storage_bytes,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'date', date,
                    'ai_calls', ai_calls,
                    'executions', executions
                ) ORDER BY date DESC
            ),
            '[]'::jsonb
        ) as daily_stats
    FROM usage_tracking
    WHERE user_id = p_user_id
        AND date >= CURRENT_DATE - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. Master cleanup function (call this from cron or Edge Function)
-- =====================================================
CREATE OR REPLACE FUNCTION run_all_cleanups()
RETURNS JSONB AS $$
DECLARE
    workflows_deleted INTEGER;
    executions_deleted INTEGER;
    keys_deactivated INTEGER;
BEGIN
    SELECT cleanup_old_workflows() INTO workflows_deleted;
    SELECT cleanup_old_executions() INTO executions_deleted;
    SELECT cleanup_expired_api_keys() INTO keys_deactivated;
    
    RETURN jsonb_build_object(
        'timestamp', NOW(),
        'workflows_deleted', workflows_deleted,
        'executions_deleted', executions_deleted,
        'api_keys_deactivated', keys_deactivated
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. RLS Policies for new tables
-- =====================================================

-- Enable RLS
ALTER TABLE cleanup_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Cleanup logs are admin only
CREATE POLICY "Admin access to cleanup_logs"
ON cleanup_logs FOR ALL
USING (false)
WITH CHECK (false);

-- Users can view their own usage
CREATE POLICY "Users view own usage"
ON usage_tracking FOR SELECT
USING (
    user_id IN (
        SELECT id FROM profiles 
        WHERE firebase_uid = current_setting('request.jwt.claims')::json->>'sub'
    )
);

-- =====================================================
-- 10. Grant execute permissions
-- =====================================================
GRANT EXECUTE ON FUNCTION increment_usage TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_usage TO authenticated;

-- =====================================================
-- SETUP INSTRUCTIONS:
-- =====================================================
-- 1. Run this entire script in Supabase SQL Editor
-- 2. For automatic cleanup, you have these options:
--
--    Option A: Supabase Edge Function (Recommended for free tier)
--    - Create a cron job edge function that calls run_all_cleanups()
--    - Trigger it daily via Supabase scheduled functions or external cron
--
--    Option B: External Cron (e.g., GitHub Actions)
--    - Create a GitHub Action that runs daily
--    - Uses Supabase client to call the function
--
--    Option C: Supabase pg_cron (Requires Pro plan)
--    - SELECT cron.schedule('nightly-cleanup', '0 3 * * *', 'SELECT run_all_cleanups()');
--
-- =====================================================
