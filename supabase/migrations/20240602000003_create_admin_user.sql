-- Create admin user if it doesn't exist
DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@achomejayateknik.com') INTO admin_exists;
  
  IF NOT admin_exists THEN
    -- This is just for demo purposes. In a real app, you would use a secure password
    -- and proper user management through the Supabase dashboard or edge functions
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
    VALUES (
      gen_random_uuid(),
      'admin@achomejayateknik.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      'authenticated'
    );
  END IF;
END
$$;
