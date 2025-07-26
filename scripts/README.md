# Database Scripts

This directory contains SQL scripts for managing the database schema.

## Update Proposals Schema

The `update-proposals-schema.sql` script adds the following columns to the proposals table if they don't already exist:

- `client_id`: References the client who posted the job
- `is_read`: Boolean flag to track if the proposal has been read by the client
- `freelancer_name`: The name of the freelancer who submitted the proposal
- `proposed_timeline`: The timeline proposed by the freelancer (renamed from timeline)
- `proposed_budget`: The budget proposed by the freelancer (renamed from budget)
- `budget`: Kept for backward compatibility (synced with proposed_budget)
- `cover_letter`: The cover letter submitted with the proposal

### How to Run

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `update-proposals-schema.sql` into the editor
4. Click "Run" to execute the script

The script uses conditional logic to only add columns that don't already exist, so it's safe to run multiple times.

## Troubleshooting

If you encounter errors when submitting proposals, it's likely because the proposals table schema needs to be updated. Run the `update-proposals-schema.sql` script to fix these issues.

Common errors include:
- "could not find client_id of proposal in the schema"
- "column is_read does not exist"
- "column freelancer_name does not exist"
- "could not find budget column in the proposal schema"

After running the script, restart your application to ensure the changes take effect.

## Budget Column Handling

The script includes special handling for the `budget` column:

1. It adds both `budget` and `proposed_budget` columns if they don't exist
2. It creates a trigger to keep these columns in sync
3. This ensures backward compatibility with code that uses either column name

This approach allows the application to work with both old and new code without errors.