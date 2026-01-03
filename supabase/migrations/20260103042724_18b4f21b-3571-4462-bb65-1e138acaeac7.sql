-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'cashier', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  points_balance INTEGER NOT NULL DEFAULT 0,
  must_change_password BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create transactions table for points history
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'redeem')),
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create catalog_items table for rewards
CREATE TABLE public.catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Cashiers can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'cashier') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Cashiers can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'cashier') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Cashiers can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'cashier') OR public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Cashiers can insert transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'cashier') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Cashiers can view all transactions"
  ON public.transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'cashier') OR public.has_role(auth.uid(), 'admin'));

-- Catalog items policies (public read)
CREATE POLICY "Anyone can view active catalog items"
  ON public.catalog_items FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage catalog items"
  ON public.catalog_items FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, must_change_password)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    true
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample catalog items
INSERT INTO public.catalog_items (name, description, points_cost, category, image_url) VALUES
  ('Free Coffee', 'Redeem for a free regular coffee', 500, 'drinks', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'),
  ('10% Discount', 'Get 10% off your next purchase', 1000, 'discounts', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'),
  ('Movie Ticket', 'One free movie ticket', 2500, 'entertainment', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400'),
  ('Shopping Voucher $25', 'Shopping voucher worth $25', 5000, 'shopping', 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400');