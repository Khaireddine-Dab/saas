-- ============================================================================
-- SCHEMA DRIVERS - Table unique pour la gestion des livreurs
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.drivers (
  -- Identifiants et infos de base
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'suspended', 'on-break', 'offline')),
  
  -- Informations de contact supplémentaires
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  
  -- Véhicule
  vehicle_type TEXT CHECK (vehicle_type IS NULL OR vehicle_type IN ('motorcycle', 'car', 'van', 'truck')),
  vehicle_license_plate TEXT UNIQUE,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_capacity_kg INTEGER DEFAULT 50,
  vehicle_status TEXT DEFAULT 'active' CHECK (vehicle_status IS NULL OR vehicle_status IN ('active', 'inactive', 'maintenance')),
  vehicle_last_inspection TIMESTAMP WITH TIME ZONE,
  
  -- Documents
  license_status TEXT DEFAULT 'pending' CHECK (license_status IN ('pending', 'verified', 'rejected', 'expired')),
  license_expiry_date DATE,
  license_verified_at TIMESTAMP WITH TIME ZONE,
  
  id_status TEXT DEFAULT 'pending' CHECK (id_status IN ('pending', 'verified', 'rejected', 'expired')),
  id_expiry_date DATE,
  id_verified_at TIMESTAMP WITH TIME ZONE,
  
  insurance_status TEXT DEFAULT 'pending' CHECK (insurance_status IN ('pending', 'verified', 'rejected', 'expired')),
  insurance_expiry_date DATE,
  insurance_verified_at TIMESTAMP WITH TIME ZONE,
  
  registration_status TEXT DEFAULT 'pending' CHECK (registration_status IN ('pending', 'verified', 'rejected', 'expired')),
  registration_expiry_date DATE,
  registration_verified_at TIMESTAMP WITH TIME ZONE,
  
  background_check_status TEXT DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'verified', 'rejected', 'expired')),
  background_check_expiry_date DATE,
  background_check_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Performances
  total_deliveries INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  completion_rate DECIMAL(5,2) DEFAULT 100.0 CHECK (completion_rate >= 0 AND completion_rate <= 100),
  avg_delivery_time_minutes INTEGER DEFAULT 0,
  acceptance_rate DECIMAL(5,2) DEFAULT 100.0 CHECK (acceptance_rate >= 0 AND acceptance_rate <= 100),
  
  -- Localisation actuelle
  current_lat DECIMAL(10,7),
  current_lng DECIMAL(10,7),
  current_address TEXT,
  location_updated_at TIMESTAMP WITH TIME ZONE,
  
  -- Compte bancaire
  bank_name TEXT,
  account_number TEXT,
  account_holder TEXT,
  
  -- Gains
  total_earnings DECIMAL(12,2) DEFAULT 0,
  earnings_this_month DECIMAL(12,2) DEFAULT 0,
  earnings_this_week DECIMAL(12,2) DEFAULT 0,
  last_payout_date TIMESTAMP WITH TIME ZONE,
  
  -- Dates importantes
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5),
  CONSTRAINT valid_completion_rate CHECK (completion_rate >= 0 AND completion_rate <= 100),
  CONSTRAINT valid_acceptance_rate CHECK (acceptance_rate >= 0 AND acceptance_rate <= 100)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_drivers_status ON public.drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_email ON public.drivers(email);
CREATE INDEX IF NOT EXISTS idx_drivers_phone ON public.drivers(phone);
CREATE INDEX IF NOT EXISTS idx_drivers_rating ON public.drivers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_drivers_created_at ON public.drivers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drivers_vehicle_license_plate ON public.drivers(vehicle_license_plate);
CREATE INDEX IF NOT EXISTS idx_drivers_location ON public.drivers(current_lat, current_lng) WHERE status = 'active';

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Politique : Admins peuvent voir tous les drivers
CREATE POLICY "Admins can view all drivers" ON public.drivers
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Politique : Les drivers peuvent voir leurs propres données
CREATE POLICY "Drivers can view their own data" ON public.drivers
  FOR SELECT USING (auth.uid() = id);

-- Politique : Admins peuvent modifier les drivers
CREATE POLICY "Admins can update drivers" ON public.drivers
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- TRIGGER POUR METTRE À JOUR updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_drivers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS drivers_updated_at_trigger ON public.drivers;

CREATE TRIGGER drivers_updated_at_trigger
BEFORE UPDATE ON public.drivers
FOR EACH ROW
EXECUTE FUNCTION update_drivers_updated_at();

-- ============================================================================
-- TABLE D'HISTORIQUE DE LOCALISATION (optionnel)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.driver_location_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  address TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_driver_location_history ON public.driver_location_history(driver_id, created_at DESC);

-- ============================================================================
-- TABLE DE NOTATION (optionnel)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.driver_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  comment TEXT,
  order_id UUID,
  rated_by_email TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_driver_ratings ON public.driver_ratings(driver_id, created_at DESC);

-- ============================================================================
-- DONNÉES INITIALES (optionnel - à décommenter si besoin)
-- ============================================================================

-- INSERT INTO public.drivers (
--   name, email, phone, status, 
--   vehicle_type, vehicle_license_plate, vehicle_make, vehicle_model, vehicle_year,
--   rating, completion_rate, acceptance_rate,
--   license_status, id_status, insurance_status,
--   total_deliveries, total_earnings
-- ) VALUES 
-- (
--   'Ahmed Hassan', 'ahmed.hassan@example.com', '+216 92 123 456', 'active',
--   'car', 'TN-2024-001', 'Toyota', 'Corolla', 2023,
--   4.8, 98, 96,
--   'verified', 'verified', 'verified',
--   245, 5500.50
-- ),
-- (
--   'Fatima Ali', 'fatima.ali@example.com', '+216 93 234 567', 'active',
--   'motorcycle', 'TN-2024-002', 'Honda', 'CB500', 2022,
--   4.5, 95, 94,
--   'verified', 'verified', 'verified',
--   189, 3200.75
-- ),
-- (
--   'Mohamed Ben Salah', 'mohamed.ben@example.com', '+216 94 345 678', 'inactive',
--   'van', 'TN-2024-003', 'Mercedes', 'Sprinter', 2021,
--   4.2, 92, 90,
--   'verified', 'verified', 'expired',
--   156, 2800.00
-- );
