ALTER TABLE public.quotes
    ADD COLUMN IF NOT EXISTS original_total numeric(12, 2),
    ADD COLUMN IF NOT EXISTS discount_mode text,
    ADD COLUMN IF NOT EXISTS discount_value numeric(12, 2) NOT NULL DEFAULT 0;

UPDATE public.quotes
SET original_total = total_amount
WHERE original_total IS NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'quotes_discount_mode_check'
          AND conrelid = 'public.quotes'::regclass
    ) THEN
        ALTER TABLE public.quotes
            ADD CONSTRAINT quotes_discount_mode_check
            CHECK (discount_mode IS NULL OR discount_mode IN ('fixed', 'final_price'));
    END IF;
END $$;
