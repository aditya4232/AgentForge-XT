-- Retention Policy for User Data (10 Days)

-- 1. Create a function to clean up old executions
CREATE OR REPLACE FUNCTION cleanup_old_executions()
RETURNS void AS $$
BEGIN
  DELETE FROM executions
  WHERE started_at < NOW() - INTERVAL '10 days';
END;
$$ LANGUAGE plpgsql;

-- 2. Create a function to clean up old temp logs or artifacts if any
-- (Assuming we will have a logs table later or referencing existing one)
-- For now, just executions as they grow fast.

-- 3. How to run this?
-- Since we are on Supabase Free Tier (likely) or standard Postgres, we can use pg_cron if enabled.
-- Enable pg_cron:
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule it daily:
-- SELECT cron.schedule('0 0 * * *', $$SELECT cleanup_old_executions()$$);

-- ALTERNATIVE (If pg_cron not available):
-- We can call this function via an RPB (Remote Procedure Call) from a Vercel Cron Job.
-- Vercel Cron Jobs are free.

-- Create an RPC endpoint wrapper if needed (Supabase exposes functions as RPC automatically if not private)
