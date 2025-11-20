-- Create firms table
CREATE TABLE public.firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  firm_name TEXT NOT NULL,
  service_states TEXT[] DEFAULT '{}',
  min_budget INTEGER DEFAULT 2000,
  notification_email TEXT NOT NULL,
  logo_url TEXT,
  firm_slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID REFERENCES public.firms(id) ON DELETE CASCADE NOT NULL,
  case_type TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT,
  immigration_status TEXT NOT NULL,
  timeline TEXT NOT NULL,
  budget TEXT NOT NULL,
  previous_attorney BOOLEAN NOT NULL,
  previous_attorney_details TEXT,
  case_details TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  preferred_contact TEXT NOT NULL,
  best_time TEXT NOT NULL,
  score TEXT NOT NULL CHECK (score IN ('hot', 'qualified', 'unqualified')),
  status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'contacted', 'scheduled', 'converted', 'not_fit', 'closed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for firms
CREATE POLICY "Users can view their own firm"
  ON public.firms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own firm"
  ON public.firms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own firm"
  ON public.firms FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for leads
CREATE POLICY "Firms can view their own leads"
  ON public.leads FOR SELECT
  USING (
    firm_id IN (
      SELECT id FROM public.firms WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Firms can update their own leads"
  ON public.leads FOR UPDATE
  USING (
    firm_id IN (
      SELECT id FROM public.firms WHERE user_id = auth.uid()
    )
  );

-- Enable realtime for leads table
ALTER TABLE public.leads REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;

-- Create function to automatically create firm profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_slug TEXT;
BEGIN
  -- Generate unique slug from email
  new_slug := split_part(NEW.email, '@', 1) || '-' || substring(NEW.id::text from 1 for 8);
  
  -- Insert firm profile
  INSERT INTO public.firms (user_id, email, firm_name, notification_email, firm_slug)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'firm_name',
    NEW.email,
    new_slug
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_leads_firm_id ON public.leads(firm_id);
CREATE INDEX idx_leads_score ON public.leads(score);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_firms_firm_slug ON public.firms(firm_slug);