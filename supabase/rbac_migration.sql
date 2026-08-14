-- RBAC MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor to upgrade from v1 to v2 Role-Based Access Control

-- 1. Create team_members table to allow multiple users per organization
CREATE TABLE team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'VIEWER', -- 'ADMIN', 'ANALYST', 'VIEWER'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 2. Migrate existing organization owners to the new team_members table as ADMINs
INSERT INTO team_members (organization_id, user_id, role)
SELECT id, user_id, 'ADMIN' FROM organizations;

-- 3. Update existing policies for `organizations` to use team_members
DROP POLICY IF EXISTS "Users can view their own organizations" ON organizations;
CREATE POLICY "Users can view their orgs via team_members" ON organizations FOR SELECT USING (
    id IN (SELECT organization_id FROM team_members WHERE user_id = auth.uid())
);

-- (Keep insert as is, new org creators become admins via a trigger or application logic)

-- 4. Update existing policies for `incidents` to use team_members
DROP POLICY IF EXISTS "Users can view incidents for their orgs" ON incidents;
CREATE POLICY "Team members can view incidents" ON incidents FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM team_members WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can update incidents for their orgs" ON incidents;
CREATE POLICY "Admins and Analysts can update incidents" ON incidents FOR UPDATE USING (
    organization_id IN (
        SELECT organization_id FROM team_members 
        WHERE user_id = auth.uid() AND role IN ('ADMIN', 'ANALYST')
    )
);

-- 5. Policies for team_members table itself
CREATE POLICY "Users can view team members of their orgs" ON team_members FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Only admins can insert team members" ON team_members FOR INSERT WITH CHECK (
    organization_id IN (SELECT organization_id FROM team_members WHERE user_id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "Only admins can delete team members" ON team_members FOR DELETE USING (
    organization_id IN (SELECT organization_id FROM team_members WHERE user_id = auth.uid() AND role = 'ADMIN')
);
