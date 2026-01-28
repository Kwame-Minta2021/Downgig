-- Migration: Admin Approval System & Onboarding
-- Description: Adds columns for approval workflow (projects) and expanded profile details (phone, social links).
-- Updates constraints and RLS policies.

-- 1. Update Profiles Table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS headline TEXT; -- For " Professional Headline" in onboarding

-- 2. Update Projects Table Constraints
-- Drop old constraint if exists (safe approach varies, assuming standard naming or replacing)
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Add new constraint including 'pending_approval' and 'rejected'
ALTER TABLE public.projects 
ADD CONSTRAINT projects_status_check 
CHECK (status IN ('open', 'in_progress', 'completed', 'pending_approval', 'rejected'));

-- 3. RLS Policies for Enforcement

-- Prevent Unapproved Developers from creating Proposals
DROP POLICY IF EXISTS "Developers can create proposals" ON public.proposals;
CREATE POLICY "Approved developers can create proposals" ON public.proposals 
FOR INSERT WITH CHECK (
  auth.uid() = developer_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND status = 'approved'
  )
);

-- Prevent Unapproved Clients from creating Projects
DROP POLICY IF EXISTS "Clients can create projects" ON public.projects;
CREATE POLICY "Approved clients can create projects" ON public.projects 
FOR INSERT WITH CHECK (
  auth.uid() = client_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND status = 'approved'
  )
);

-- Allow Admins to View Pending Projects (Already covered by public view? No, we might want to hide pending from public)
-- Update Public View Policy to exclude pending_approval unless it's the owner or admin
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON public.projects;

CREATE POLICY "Projects viewable by owner, admin and public (if open)" ON public.projects
FOR SELECT USING (
  -- Public can see open/in_progress/completed
  status IN ('open', 'in_progress', 'completed') 
  OR 
  -- Owner can see everything
  auth.uid() = client_id 
  OR 
  -- Admin can see everything
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Function to Approve/Reject Project
CREATE OR REPLACE FUNCTION public.manage_project_status(project_id BIGINT, new_status TEXT)
RETURNS VOID AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access Denied: Admins only';
  END IF;

  UPDATE public.projects 
  SET status = new_status 
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
