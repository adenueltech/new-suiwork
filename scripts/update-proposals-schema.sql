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