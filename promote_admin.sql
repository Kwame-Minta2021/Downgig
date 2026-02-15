-- Enable the admin role for the specified user
UPDATE public.profiles
SET role = 'admin',
    status = 'approved'
WHERE email = 'frederickminta@gmail.com';

-- Verify the update
SELECT email, role, status FROM public.profiles WHERE email = 'frederickminta@gmail.com';
