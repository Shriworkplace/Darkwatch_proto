-- DARKWATCH Database Schema for Supabase (PostgreSQL)

-- 1. Organizations
CREATE TABLE organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Threats (Raw imported data)
CREATE TABLE threats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source TEXT NOT NULL,
    email TEXT,
    username TEXT,
    password TEXT,
    ip_address TEXT,
    breach_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Incidents (Matched threats enriched with Risk & AI Analysis)
CREATE TABLE incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    threat_id UUID REFERENCES threats(id) ON DELETE CASCADE,
    
    -- Risk Engine outputs
    risk_score INTEGER NOT NULL,
    severity TEXT NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    
    -- Status
    status TEXT DEFAULT 'NEW', -- 'NEW', 'INVESTIGATING', 'CONTAINED', 'RESOLVED'
    
    -- AI Analyst outputs (JSON format)
    ai_analysis JSONB, 
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Alerts (Notifications for the UI)
CREATE TABLE alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Setup
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
-- Threats are global (simulated public data), so we'll leave RLS off for them, or allow read-only.
ALTER TABLE threats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own organizations" ON organizations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own organizations" ON organizations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own organizations" ON organizations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own organizations" ON organizations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read threats" ON threats FOR SELECT USING (true);
CREATE POLICY "Service role can insert threats" ON threats FOR INSERT WITH CHECK (true); -- Usually restricted in prod, open for simulation

CREATE POLICY "Users can view incidents for their orgs" ON incidents FOR SELECT USING (
    organization_id IN (SELECT id FROM organizations WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update incidents for their orgs" ON incidents FOR UPDATE USING (
    organization_id IN (SELECT id FROM organizations WHERE user_id = auth.uid())
);
-- Insertion of incidents is typically done by the server action

CREATE POLICY "Users can view their own alerts" ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON alerts FOR UPDATE USING (auth.uid() = user_id);

-- Setup Realtime
alter publication supabase_realtime add table incidents;
alter publication supabase_realtime add table alerts;
