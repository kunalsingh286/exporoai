-- ==============================================================================
-- 1. CUSTOM TRADE ENUMS
-- ==============================================================================
CREATE TYPE public.trade_flow_type AS ENUM (
    'PHYSICAL_GOODS', 
    'INTANGIBLE_SERVICES'
);

CREATE TYPE public.txn_status_type AS ENUM (
    'PARSING', 
    'READY_FOR_REVIEW', 
    'SCHEMA_COMPILED', 
    'FAILED'
);

-- ==============================================================================
-- 2. ORGANIZATIONS TABLE
-- ==============================================================================
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    iec_code VARCHAR(10) UNIQUE,
    pan_number VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organizations_pan_number ON public.organizations(pan_number);

-- ==============================================================================
-- 3. CREDIT WALLET BALANCE SUB-LEDGER TABLE
-- ==============================================================================
CREATE TABLE public.credit_wallet_balance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE UNIQUE,
    wallet_credits INT NOT NULL DEFAULT 20,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. TRADE TRANSACTIONS LEDGER CORE TABLE
-- ==============================================================================
CREATE TABLE public.trade_transactions_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    stream_type public.trade_flow_type NOT NULL,
    status public.txn_status_type NOT NULL DEFAULT 'PARSING',
    raw_document_url TEXT NOT NULL,
    extracted_tokens JSONB DEFAULT '{}'::jsonb,
    hs_code VARCHAR(10),
    customs_shipping_bill_no VARCHAR(50),
    firc_reference VARCHAR(50),
    fema_variance_percentage NUMERIC(5,2),
    compiled_icegate_payload JSONB DEFAULT NULL,
    compiled_unified_edf_payload JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 5. ZERO-DOLLAR INFRASTRUCTURE SECURITY (RLS & Isolation)
-- ==============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_wallet_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_transactions_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant Isolation: Organizations"
ON public.organizations
FOR ALL
TO authenticated
USING (id = (((select auth.jwt()) -> 'app_metadata' ->> 'organization_id')::uuid))
WITH CHECK (id = (((select auth.jwt()) -> 'app_metadata' ->> 'organization_id')::uuid));

CREATE POLICY "Tenant Isolation: Credit Wallet"
ON public.credit_wallet_balance
FOR ALL
TO authenticated
USING (organization_id = (((select auth.jwt()) -> 'app_metadata' ->> 'organization_id')::uuid))
WITH CHECK (organization_id = (((select auth.jwt()) -> 'app_metadata' ->> 'organization_id')::uuid));

CREATE POLICY "Tenant Isolation: Trade Transactions"
ON public.trade_transactions_ledger
FOR ALL
TO authenticated
USING (organization_id = (((select auth.jwt()) -> 'app_metadata' ->> 'organization_id')::uuid))
WITH CHECK (organization_id = (((select auth.jwt()) -> 'app_metadata' ->> 'organization_id')::uuid));

-- ==============================================================================
-- UTILITY TRIGGER: Auto-update updated_at columns
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_credit_wallet_updated_at
BEFORE UPDATE ON public.credit_wallet_balance
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_trade_transactions_updated_at
BEFORE UPDATE ON public.trade_transactions_ledger
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
