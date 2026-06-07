-- ============================================================================
-- SCHEMA FRAUD CHECKS - Tables pour la gestion des alertes fraude
-- ============================================================================

-- Table: booking_fraud_checks
CREATE TABLE IF NOT EXISTS public.booking_fraud_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  booking_id BIGINT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  level TEXT NOT NULL CHECK (level IN ('safe', 'suspicious', 'high_risk', 'blocked')),
  signals JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendation TEXT NOT NULL CHECK (recommendation IN ('approve', 'review', 'reject')),
  ai_reasoning TEXT NULL,
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT booking_fraud_checks_pkey PRIMARY KEY (id),
  CONSTRAINT booking_fraud_checks_booking_id_key UNIQUE (booking_id),
  CONSTRAINT booking_fraud_checks_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_booking_fraud_checks_booking_id 
ON public.booking_fraud_checks USING btree (booking_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_booking_fraud_checks_level 
ON public.booking_fraud_checks USING btree (level) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_booking_fraud_checks_checked_at 
ON public.booking_fraud_checks USING btree (checked_at DESC) TABLESPACE pg_default;

-- Table: order_fraud_checks
CREATE TABLE IF NOT EXISTS public.order_fraud_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  order_id BIGINT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  level TEXT NOT NULL CHECK (level IN ('safe', 'suspicious', 'high_risk', 'blocked')),
  signals JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendation TEXT NOT NULL CHECK (recommendation IN ('approve', 'review', 'reject')),
  ai_reasoning TEXT NULL,
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT order_fraud_checks_pkey PRIMARY KEY (id),
  CONSTRAINT order_fraud_checks_order_id_key UNIQUE (order_id),
  CONSTRAINT order_fraud_checks_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_order_fraud_checks_order_id 
ON public.order_fraud_checks USING btree (order_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_order_fraud_checks_level 
ON public.order_fraud_checks USING btree (level) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_order_fraud_checks_checked_at 
ON public.order_fraud_checks USING btree (checked_at DESC) TABLESPACE pg_default;

-- Grant permissions
GRANT SELECT ON public.booking_fraud_checks TO authenticated;
GRANT SELECT ON public.order_fraud_checks TO authenticated;
GRANT ALL ON public.booking_fraud_checks TO service_role;
GRANT ALL ON public.order_fraud_checks TO service_role;
