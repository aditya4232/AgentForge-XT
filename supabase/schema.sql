-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (synced from WorkOS)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workos_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  nodes JSONB DEFAULT '[]'::jsonb,
  edges JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Executions table
CREATE TABLE IF NOT EXISTS executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'running', 'success', 'failed')) DEFAULT 'pending',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  logs JSONB DEFAULT '[]'::jsonb,
  error TEXT
);

-- Node templates (pre-built node types)
CREATE TABLE IF NOT EXISTS node_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT NOT NULL,
  config_schema JSONB,
  is_trigger BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_executions_workflow_id ON executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON executions(status);
CREATE INDEX IF NOT EXISTS idx_node_templates_category ON node_templates(category);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (true);

-- RLS Policies for workflows
CREATE POLICY "Users can view own workflows" ON workflows
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM profiles WHERE workos_id = current_setting('app.current_user_id', true)
    )
  );

CREATE POLICY "Users can create workflows" ON workflows
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM profiles WHERE workos_id = current_setting('app.current_user_id', true)
    )
  );

CREATE POLICY "Users can update own workflows" ON workflows
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM profiles WHERE workos_id = current_setting('app.current_user_id', true)
    )
  );

CREATE POLICY "Users can delete own workflows" ON workflows
  FOR DELETE USING (
    user_id IN (
      SELECT id FROM profiles WHERE workos_id = current_setting('app.current_user_id', true)
    )
  );

-- RLS Policies for executions
CREATE POLICY "Users can view own executions" ON executions
  FOR SELECT USING (
    workflow_id IN (
      SELECT id FROM workflows WHERE user_id IN (
        SELECT id FROM profiles WHERE workos_id = current_setting('app.current_user_id', true)
      )
    )
  );

-- Everyone can view node templates
CREATE POLICY "Anyone can view node templates" ON node_templates
  FOR SELECT USING (true);

-- Insert default node templates
INSERT INTO node_templates (type, name, description, icon, category, is_trigger, config_schema) VALUES
  ('webhook', 'Webhook', 'Trigger workflow via HTTP webhook', 'Globe', 'triggers', true, '{"url": {"type": "string", "label": "Webhook URL"}}'),
  ('schedule', 'Schedule', 'Trigger workflow on a schedule', 'Clock', 'triggers', true, '{"cron": {"type": "string", "label": "Cron Expression"}}'),
  ('manual', 'Manual Trigger', 'Manually trigger the workflow', 'Play', 'triggers', true, '{}'),
  ('http_request', 'HTTP Request', 'Make an HTTP request', 'Send', 'actions', false, '{"url": {"type": "string"}, "method": {"type": "select", "options": ["GET", "POST", "PUT", "DELETE"]}}'),
  ('email', 'Send Email', 'Send an email notification', 'Mail', 'actions', false, '{"to": {"type": "string"}, "subject": {"type": "string"}, "body": {"type": "text"}}'),
  ('delay', 'Delay', 'Wait for a specified duration', 'Timer', 'actions', false, '{"seconds": {"type": "number"}}'),
  ('condition', 'Condition', 'Conditional branching', 'GitBranch', 'logic', false, '{"condition": {"type": "string"}}'),
  ('switch', 'Switch', 'Multiple condition routing', 'Shuffle', 'logic', false, '{"cases": {"type": "array"}}'),
  ('loop', 'Loop', 'Iterate over items', 'Repeat', 'logic', false, '{"items": {"type": "string"}}'),
  ('transform', 'Transform', 'Transform data', 'Wand', 'data', false, '{"expression": {"type": "string"}}'),
  ('filter', 'Filter', 'Filter items', 'Filter', 'data', false, '{"condition": {"type": "string"}}'),
  ('merge', 'Merge', 'Merge multiple inputs', 'Merge', 'data', false, '{}')
ON CONFLICT (type) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for workflows
DROP TRIGGER IF EXISTS update_workflows_updated_at ON workflows;
CREATE TRIGGER update_workflows_updated_at
    BEFORE UPDATE ON workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
