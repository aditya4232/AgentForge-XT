-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Profiles table (synced from Firebase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- User Settings table (stores encrypted API keys)
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- AI Configuration
  openai_api_key_encrypted TEXT,
  openai_base_url TEXT DEFAULT 'https://api.openai.com/v1',
  openai_default_model TEXT DEFAULT 'gpt-4-turbo-preview',
  
  -- n8n Configuration
  n8n_url TEXT DEFAULT 'http://localhost:5678',
  n8n_api_key_encrypted TEXT,
  
  -- Qdrant Configuration
  qdrant_url TEXT DEFAULT 'http://localhost:6333',
  qdrant_api_key_encrypted TEXT,
  
  -- Preferences
  auto_save BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'dark',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- ============================================
-- Workflows table
-- ============================================
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  nodes JSONB DEFAULT '[]'::jsonb,
  edges JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false,
  n8n_workflow_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Executions table
-- ============================================
CREATE TABLE IF NOT EXISTS executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  n8n_execution_id TEXT,
  status TEXT CHECK (status IN ('pending', 'running', 'success', 'failed')) DEFAULT 'pending',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  logs JSONB DEFAULT '[]'::jsonb,
  error TEXT,
  input_data JSONB,
  output_data JSONB
);

-- ============================================
-- Node templates (pre-built node types)
-- ============================================
CREATE TABLE IF NOT EXISTS node_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT NOT NULL,
  config_schema JSONB,
  is_trigger BOOLEAN DEFAULT false,
  n8n_node_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Webhook endpoints table
-- ============================================
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  path TEXT NOT NULL UNIQUE,
  method TEXT DEFAULT 'POST',
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  trigger_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- API Keys table (for external access)
-- ============================================
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  scopes TEXT[] DEFAULT ARRAY['workflows:read', 'workflows:execute'],
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid ON profiles(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_is_active ON workflows(is_active);
CREATE INDEX IF NOT EXISTS idx_executions_workflow_id ON executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON executions(status);
CREATE INDEX IF NOT EXISTS idx_executions_started_at ON executions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_node_templates_category ON node_templates(category);
CREATE INDEX IF NOT EXISTS idx_webhooks_path ON webhooks(path);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON api_keys(key_prefix);

-- ============================================
-- Enable Row Level Security
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for profiles
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (firebase_uid = current_setting('app.current_user_id', true));

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (firebase_uid = current_setting('app.current_user_id', true));

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (true);

-- ============================================
-- RLS Policies for user_settings
-- ============================================
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM profiles WHERE firebase_uid = current_setting('app.current_user_id', true)
    )
  );

DROP POLICY IF EXISTS "Users can manage own settings" ON user_settings;
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (
    user_id IN (
      SELECT id FROM profiles WHERE firebase_uid = current_setting('app.current_user_id', true)
    )
  );

-- ============================================
-- RLS Policies for workflows
-- ============================================
DROP POLICY IF EXISTS "Users can view own workflows" ON workflows;
CREATE POLICY "Users can view own workflows" ON workflows
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM profiles WHERE firebase_uid = current_setting('app.current_user_id', true)
    )
  );

DROP POLICY IF EXISTS "Users can create workflows" ON workflows;
CREATE POLICY "Users can create workflows" ON workflows
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM profiles WHERE firebase_uid = current_setting('app.current_user_id', true)
    )
  );

DROP POLICY IF EXISTS "Users can update own workflows" ON workflows;
CREATE POLICY "Users can update own workflows" ON workflows
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM profiles WHERE firebase_uid = current_setting('app.current_user_id', true)
    )
  );

DROP POLICY IF EXISTS "Users can delete own workflows" ON workflows;
CREATE POLICY "Users can delete own workflows" ON workflows
  FOR DELETE USING (
    user_id IN (
      SELECT id FROM profiles WHERE firebase_uid = current_setting('app.current_user_id', true)
    )
  );

-- ============================================
-- RLS Policies for executions
-- ============================================
DROP POLICY IF EXISTS "Users can view own executions" ON executions;
CREATE POLICY "Users can view own executions" ON executions
  FOR SELECT USING (
    workflow_id IN (
      SELECT id FROM workflows WHERE user_id IN (
        SELECT id FROM profiles WHERE firebase_uid = current_setting('app.current_user_id', true)
      )
    )
  );

DROP POLICY IF EXISTS "Users can create executions" ON executions;
CREATE POLICY "Users can create executions" ON executions
  FOR INSERT WITH CHECK (
    workflow_id IN (
      SELECT id FROM workflows WHERE user_id IN (
        SELECT id FROM profiles WHERE firebase_uid = current_setting('app.current_user_id', true)
      )
    )
  );

-- ============================================
-- RLS Policies for webhooks
-- ============================================
DROP POLICY IF EXISTS "Users can manage own webhooks" ON webhooks;
CREATE POLICY "Users can manage own webhooks" ON webhooks
  FOR ALL USING (
    workflow_id IN (
      SELECT id FROM workflows WHERE user_id IN (
        SELECT id FROM profiles WHERE firebase_uid = current_setting('app.current_user_id', true)
      )
    )
  );

-- ============================================
-- RLS Policies for API keys
-- ============================================
DROP POLICY IF EXISTS "Users can manage own api keys" ON api_keys;
CREATE POLICY "Users can manage own api keys" ON api_keys
  FOR ALL USING (
    user_id IN (
      SELECT id FROM profiles WHERE firebase_uid = current_setting('app.current_user_id', true)
    )
  );

-- ============================================
-- Everyone can view node templates
-- ============================================
DROP POLICY IF EXISTS "Anyone can view node templates" ON node_templates;
CREATE POLICY "Anyone can view node templates" ON node_templates
  FOR SELECT USING (true);

-- ============================================
-- Insert default node templates
-- ============================================
INSERT INTO node_templates (type, name, description, icon, category, is_trigger, n8n_node_type, config_schema) VALUES
  ('webhook', 'Webhook', 'Trigger workflow via HTTP webhook', 'Globe', 'triggers', true, 'n8n-nodes-base.webhook', '{"url": {"type": "string", "label": "Webhook URL"}}'),
  ('schedule', 'Schedule', 'Trigger workflow on a schedule', 'Clock', 'triggers', true, 'n8n-nodes-base.cron', '{"cron": {"type": "string", "label": "Cron Expression"}}'),
  ('manual', 'Manual Trigger', 'Manually trigger the workflow', 'Play', 'triggers', true, 'n8n-nodes-base.manualTrigger', '{}'),
  ('chat_trigger', 'Chat Trigger', 'Trigger on chat message', 'MessageSquare', 'triggers', true, 'n8n-nodes-base.chatTrigger', '{}'),
  ('http_request', 'HTTP Request', 'Make an HTTP request', 'Send', 'actions', false, 'n8n-nodes-base.httpRequest', '{"url": {"type": "string"}, "method": {"type": "select", "options": ["GET", "POST", "PUT", "DELETE"]}}'),
  ('email', 'Send Email', 'Send an email notification', 'Mail', 'actions', false, 'n8n-nodes-base.emailSend', '{"to": {"type": "string"}, "subject": {"type": "string"}, "body": {"type": "text"}}'),
  ('slack', 'Slack', 'Send message to Slack', 'Hash', 'actions', false, 'n8n-nodes-base.slack', '{"channel": {"type": "string"}, "message": {"type": "text"}}'),
  ('delay', 'Delay', 'Wait for a specified duration', 'Timer', 'actions', false, 'n8n-nodes-base.wait', '{"seconds": {"type": "number"}}'),
  ('condition', 'Condition', 'Conditional branching', 'GitBranch', 'logic', false, 'n8n-nodes-base.if', '{"condition": {"type": "string"}}'),
  ('switch', 'Switch', 'Multiple condition routing', 'Shuffle', 'logic', false, 'n8n-nodes-base.switch', '{"cases": {"type": "array"}}'),
  ('loop', 'Loop', 'Iterate over items', 'Repeat', 'logic', false, 'n8n-nodes-base.splitInBatches', '{"items": {"type": "string"}}'),
  ('transform', 'Transform', 'Transform data', 'Wand', 'data', false, 'n8n-nodes-base.set', '{"expression": {"type": "string"}}'),
  ('filter', 'Filter', 'Filter items', 'Filter', 'data', false, 'n8n-nodes-base.filter', '{"condition": {"type": "string"}}'),
  ('merge', 'Merge', 'Merge multiple inputs', 'Merge', 'data', false, 'n8n-nodes-base.merge', '{}'),
  ('code', 'Code', 'Run custom JavaScript', 'Code', 'data', false, 'n8n-nodes-base.code', '{"code": {"type": "text"}}'),
  ('openai', 'OpenAI', 'AI chat completion', 'Bot', 'ai', false, '@n8n/n8n-nodes-langchain.openAi', '{"prompt": {"type": "text"}, "model": {"type": "select", "options": ["gpt-4", "gpt-3.5-turbo"]}}'),
  ('agent', 'AI Agent', 'Autonomous AI agent', 'Brain', 'ai', false, '@n8n/n8n-nodes-langchain.agent', '{"systemPrompt": {"type": "text"}}'),
  ('vector_store', 'Vector Store', 'Store/retrieve embeddings', 'Database', 'ai', false, '@n8n/n8n-nodes-langchain.vectorStore', '{"operation": {"type": "select", "options": ["insert", "search"]}}'),
  ('rag', 'RAG Chain', 'Retrieval Augmented Generation', 'BookOpen', 'ai', false, '@n8n/n8n-nodes-langchain.chainRetrievalQa', '{}')
ON CONFLICT (type) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  n8n_node_type = EXCLUDED.n8n_node_type;

-- ============================================
-- Function to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- Triggers for updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workflows_updated_at ON workflows;
CREATE TRIGGER update_workflows_updated_at
    BEFORE UPDATE ON workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Function to automatically create user settings
-- ============================================
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS create_user_settings_on_profile ON profiles;
CREATE TRIGGER create_user_settings_on_profile
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_user_settings();
