import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tziapyvkkhohhraaaita.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6aWFweXZra2hvaGhyYWFhaXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzIxNDgsImV4cCI6MjA5NDk0ODE0OH0.nkbaHMnXJBUrxXKd7Ppj0HejS98FqvINRjXD3fKCXz4'

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)