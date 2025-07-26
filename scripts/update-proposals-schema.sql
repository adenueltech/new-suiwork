-- Add client_id column to proposals table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'proposals' AND column_name = 'client_id'
    ) THEN
        ALTER TABLE proposals ADD COLUMN client_id UUID REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add is_read column to proposals table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'proposals' AND column_name = 'is_read'
    ) THEN
        ALTER TABLE proposals ADD COLUMN is_read BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add freelancer_name column to proposals table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'proposals' AND column_name = 'freelancer_name'
    ) THEN
        ALTER TABLE proposals ADD COLUMN freelancer_name TEXT;
    END IF;
END $$;

-- Add proposed_timeline column to proposals table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'proposals' AND column_name = 'proposed_timeline'
    ) THEN
        ALTER TABLE proposals ADD COLUMN proposed_timeline TEXT;
        -- Rename existing timeline column to proposed_timeline if it exists
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'proposals' AND column_name = 'timeline'
        ) THEN
            UPDATE proposals SET proposed_timeline = timeline;
        END IF;
    END IF;
END $$;

-- Add proposed_budget column to proposals table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'proposals' AND column_name = 'proposed_budget'
    ) THEN
        ALTER TABLE proposals ADD COLUMN proposed_budget DECIMAL(10,2);
        -- Rename existing budget column to proposed_budget if it exists
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'proposals' AND column_name = 'budget'
        ) THEN
            UPDATE proposals SET proposed_budget = budget;
        END IF;
    END IF;
END $$;

-- Keep the budget column for backward compatibility
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'proposals' AND column_name = 'budget'
    ) THEN
        ALTER TABLE proposals ADD COLUMN budget DECIMAL(10,2);
    END IF;
END $$;

-- Add trigger to keep budget and proposed_budget in sync
DO $$
BEGIN
    -- Drop the trigger if it exists
    DROP TRIGGER IF EXISTS sync_budget_columns ON proposals;
    
    -- Create the function
    CREATE OR REPLACE FUNCTION sync_budget_columns()
    RETURNS TRIGGER AS $$
    BEGIN
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
            IF NEW.budget IS NULL AND NEW.proposed_budget IS NOT NULL THEN
                NEW.budget := NEW.proposed_budget;
            ELSIF NEW.proposed_budget IS NULL AND NEW.budget IS NOT NULL THEN
                NEW.proposed_budget := NEW.budget;
            END IF;
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    -- Create the trigger
    CREATE TRIGGER sync_budget_columns
    BEFORE INSERT OR UPDATE ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION sync_budget_columns();
END $$;

-- Add cover_letter column to proposals table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'proposals' AND column_name = 'cover_letter'
    ) THEN
        ALTER TABLE proposals ADD COLUMN cover_letter TEXT;
    END IF;
END $$;

-- Create index on client_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'proposals' AND indexname = 'idx_proposals_client_id'
    ) THEN
        CREATE INDEX idx_proposals_client_id ON proposals(client_id);
    END IF;
END $$;