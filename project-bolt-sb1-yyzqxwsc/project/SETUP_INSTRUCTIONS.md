# College Grievance Management System - Setup Instructions

## Database Setup Required

The application code is ready, but you need to set up the database tables in Supabase.

### Steps to Set Up the Database:

1. **Go to Supabase SQL Editor**
   - Open your browser and go to: https://supabase.com/dashboard
   - Log in to your Supabase account
   - Select your project
   - Click on "SQL Editor" in the left sidebar

2. **Run the Database Setup Script**
   - Click "New Query"
   - Copy the entire contents of the `setup_database.sql` file (located in the project root)
   - Paste it into the SQL editor
   - Click "Run" to execute the script

3. **Verify the Setup**
   - Go to "Table Editor" in the left sidebar
   - You should see two new tables: `profiles` and `grievances`

4. **Start Using the Application**
   - The dev server should already be running
   - Open the application in your browser
   - Create a new account (Student, Faculty, or Admin)
   - Start submitting and managing grievances!

## What the Database Setup Does:

- Creates `profiles` table to store user information
- Creates `grievances` table to store all grievance submissions
- Sets up Row Level Security (RLS) policies for data protection
- Configures proper relationships between tables
- Creates indexes for faster queries
- Sets up automatic triggers for timestamps

## Troubleshooting:

If you encounter any errors:
1. Make sure you're logged into the correct Supabase project
2. Check that your `.env` file has the correct Supabase credentials
3. Try running the SQL script again (it's safe to run multiple times)
