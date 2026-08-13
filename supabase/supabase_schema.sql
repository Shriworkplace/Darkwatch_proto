-- DARKWATCH Supabase Schema Initialization

-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations Table
CREATE TABLE public.organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable RLS for Organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own organizations" 
ON public.organizations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own organizations" 
ON public.organizations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own organizations" 
ON public.organizations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own organizations" 
ON public.organizations FOR DELETE 
USING (auth.uid() = user_id);


-- 2. Monitored Assets Table (Emails/Usernames linked to an Org)
CREATE TABLE public.monitored_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('email', 'username', 'domain')),
    asset_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.monitored_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assets of their organizations" 
ON public.monitored_assets FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.organizations o WHERE o.id = monitored_assets.organization_id AND o.user_id = auth.uid()
));

CREATE POLICY "Users can insert assets for their organizations" 
ON public.monitored_assets FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.organizations o WHERE o.id = monitored_assets.organization_id AND o.user_id = auth.uid()
));

CREATE POLICY "Users can delete assets of their organizations" 
ON public.monitored_assets FOR DELETE 
USING (EXISTS (
    SELECT 1 FROM public.organizations o WHERE o.id = monitored_assets.organization_id AND o.user_id = auth.uid()
));


-- 3. Incidents Table
CREATE TABLE public.incidents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    risk_score INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'INVESTIGATING', 'CONTAINED', 'RESOLVED')),
    exposed_data JSONB DEFAULT '{}'::jsonb,
    risk_factors JSONB DEFAULT '[]'::jsonb,
    ai_analysis JSONB DEFAULT '{}'::jsonb,
    timeline JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view incidents of their organizations" 
ON public.incidents FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.organizations o WHERE o.id = incidents.organization_id AND o.user_id = auth.uid()
));

CREATE POLICY "Users can update incidents of their organizations" 
ON public.incidents FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM public.organizations o WHERE o.id = incidents.organization_id AND o.user_id = auth.uid()
));


-- 4. Alerts Table
CREATE TABLE public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    incident_id UUID REFERENCES public.incidents(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view alerts of their organizations" 
ON public.alerts FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.organizations o WHERE o.id = alerts.organization_id AND o.user_id = auth.uid()
));

CREATE POLICY "Users can update alerts of their organizations" 
ON public.alerts FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM public.organizations o WHERE o.id = alerts.organization_id AND o.user_id = auth.uid()
));

-- Functions to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_org_modtime 
BEFORE UPDATE ON public.organizations 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_inc_modtime 
BEFORE UPDATE ON public.incidents 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
