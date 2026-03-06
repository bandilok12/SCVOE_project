-- Create trigger to auto-assign admin role to specific email
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Assign admin role if email is admin@agrihub.com
    IF NEW.email = 'admin@agrihub.com' THEN
        UPDATE public.user_roles 
        SET role = 'admin' 
        WHERE user_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger that fires after new user profile is created
DROP TRIGGER IF EXISTS on_profile_created_assign_admin ON public.profiles;
CREATE TRIGGER on_profile_created_assign_admin
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.assign_admin_role();