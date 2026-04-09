// Supabase Configuration
const SUPABASE_URL = 'https://toehvsxrozosshmwpanc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZWh2c3hyb3pvc3NobXdwYW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MTY2NzAsImV4cCI6MjA5MTA5MjY3MH0.gZwMMGmsDv6p_GtolUqaUHUDhdtAFNxe72WPIRpHLg0';

// Only these Google accounts can access admin.html.
const ADMIN_EMAIL_ALLOWLIST = [
  'uistudio.28@gmail.com'
];
// Expose values explicitly for scripts that read from window.
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
window.ADMIN_EMAIL_ALLOWLIST = ADMIN_EMAIL_ALLOWLIST;
