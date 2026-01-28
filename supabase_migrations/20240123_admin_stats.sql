
-- Optimized Admin Stats Function
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
  v_client_count INT;
  v_developer_count INT;
  v_pending_count INT;
  v_total_volume NUMERIC;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access Denied';
  END IF;

  -- Get Counts
  SELECT COUNT(*) INTO v_client_count FROM public.profiles WHERE role = 'client';
  SELECT COUNT(*) INTO v_developer_count FROM public.profiles WHERE role = 'developer';
  SELECT COUNT(*) INTO v_pending_count FROM public.profiles WHERE status = 'pending';
  
  -- Get Volume (Sum)
  SELECT COALESCE(SUM(amount), 0) INTO v_total_volume FROM public.transactions;

  RETURN jsonb_build_object(
    'clientCount', v_client_count,
    'developerCount', v_developer_count,
    'pendingCount', v_pending_count,
    'totalVolume', v_total_volume
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
