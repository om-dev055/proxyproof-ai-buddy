-- Enable RLS on both tables
ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active sessions (for QR validation)
CREATE POLICY "Allow read access to all sessions"
ON public.session
FOR SELECT
USING (true);

-- Allow anyone to create/update sessions (teacher functionality - no auth yet)
CREATE POLICY "Allow insert sessions"
ON public.session
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update sessions"
ON public.session
FOR UPDATE
USING (true);

-- Allow anyone to read attendance records
CREATE POLICY "Allow read access to attendance"
ON public.attendance
FOR SELECT
USING (true);

-- Allow anyone to insert attendance records (student functionality - no auth yet)
CREATE POLICY "Allow insert attendance"
ON public.attendance
FOR INSERT
WITH CHECK (true);

-- Enable realtime for attendance table
ALTER TABLE public.attendance REPLICA IDENTITY FULL;