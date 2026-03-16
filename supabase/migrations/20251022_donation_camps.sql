-- Create donation_camps table
CREATE TABLE IF NOT EXISTS donation_camps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_name TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  organizer_name TEXT NOT NULL,
  organizer_email TEXT NOT NULL,
  organizer_phone TEXT NOT NULL,
  camp_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  expected_donors INTEGER DEFAULT 0,
  actual_donors INTEGER DEFAULT 0,
  units_collected INTEGER DEFAULT 0,
  description TEXT,
  facilities TEXT[], -- Array of available facilities like ['parking', 'refreshments', 'medical-staff']
  status TEXT DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create camp_registrations table (for donors registering for camps)
CREATE TABLE IF NOT EXISTS camp_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id UUID REFERENCES donation_camps(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
  registration_date TIMESTAMP DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  donated BOOLEAN DEFAULT FALSE,
  donation_date TIMESTAMP,
  blood_units_donated INTEGER DEFAULT 0,
  notes TEXT,
  UNIQUE(camp_id, donor_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_donation_camps_status ON donation_camps(status);
CREATE INDEX idx_donation_camps_date ON donation_camps(camp_date);
CREATE INDEX idx_donation_camps_city ON donation_camps(city);
CREATE INDEX idx_camp_registrations_camp ON camp_registrations(camp_id);
CREATE INDEX idx_camp_registrations_donor ON camp_registrations(donor_id);

-- Row Level Security Policies for donation_camps
ALTER TABLE donation_camps ENABLE ROW LEVEL SECURITY;

-- Anyone can view upcoming and ongoing camps
CREATE POLICY "Anyone can view active camps"
ON donation_camps FOR SELECT
USING (status IN ('Upcoming', 'Ongoing'));

-- Authenticated users can view all camps
CREATE POLICY "Authenticated users can view all camps"
ON donation_camps FOR SELECT
USING (auth.role() = 'authenticated');

-- Only admins can create, update, and delete camps
CREATE POLICY "Admins can manage camps"
ON donation_camps FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Row Level Security Policies for camp_registrations
ALTER TABLE camp_registrations ENABLE ROW LEVEL SECURITY;

-- Donors can view their own registrations
CREATE POLICY "Donors can view own registrations"
ON camp_registrations FOR SELECT
USING (
  donor_id IN (
    SELECT id FROM donors WHERE user_id = auth.uid()
  )
);

-- Donors can register for camps
CREATE POLICY "Donors can register for camps"
ON camp_registrations FOR INSERT
WITH CHECK (
  donor_id IN (
    SELECT id FROM donors WHERE user_id = auth.uid()
  )
);

-- Donors can cancel their registrations (delete)
CREATE POLICY "Donors can cancel registrations"
ON camp_registrations FOR DELETE
USING (
  donor_id IN (
    SELECT id FROM donors WHERE user_id = auth.uid()
  )
);

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
ON camp_registrations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Admins can update registrations (mark attendance, donation status)
CREATE POLICY "Admins can update registrations"
ON camp_registrations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Trigger to update camp statistics when registrations change
CREATE OR REPLACE FUNCTION update_camp_statistics()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE donation_camps
    SET 
      actual_donors = (
        SELECT COUNT(DISTINCT donor_id)
        FROM camp_registrations
        WHERE camp_id = NEW.camp_id AND attended = TRUE
      ),
      units_collected = (
        SELECT COALESCE(SUM(blood_units_donated), 0)
        FROM camp_registrations
        WHERE camp_id = NEW.camp_id AND donated = TRUE
      ),
      updated_at = NOW()
    WHERE id = NEW.camp_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE donation_camps
    SET 
      actual_donors = (
        SELECT COUNT(DISTINCT donor_id)
        FROM camp_registrations
        WHERE camp_id = OLD.camp_id AND attended = TRUE
      ),
      units_collected = (
        SELECT COALESCE(SUM(blood_units_donated), 0)
        FROM camp_registrations
        WHERE camp_id = OLD.camp_id AND donated = TRUE
      ),
      updated_at = NOW()
    WHERE id = OLD.camp_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_camp_statistics
AFTER INSERT OR UPDATE OR DELETE ON camp_registrations
FOR EACH ROW
EXECUTE FUNCTION update_camp_statistics();

-- Trigger to update donor total_donations when they donate at a camp
CREATE OR REPLACE FUNCTION update_donor_donations_from_camp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.donated = TRUE AND (OLD IS NULL OR OLD.donated = FALSE) THEN
    UPDATE donors
    SET 
      total_donations = total_donations + NEW.blood_units_donated,
      last_donation_date = CURRENT_DATE
    WHERE id = NEW.donor_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_donor_donations
AFTER INSERT OR UPDATE ON camp_registrations
FOR EACH ROW
EXECUTE FUNCTION update_donor_donations_from_camp();

-- Insert some sample donation camps for testing
INSERT INTO donation_camps (
  camp_name,
  organization_name,
  organizer_name,
  organizer_email,
  organizer_phone,
  camp_date,
  start_time,
  end_time,
  location,
  address,
  city,
  state,
  pincode,
  expected_donors,
  actual_donors,
  units_collected,
  description,
  facilities,
  status
) VALUES
(
  'City Hospital Blood Drive 2025',
  'City Hospital Blood Bank',
  'Dr. Sarah Johnson',
  'sarah.johnson@cityhospital.com',
  '+1-555-0123',
  '2025-11-15',
  '09:00:00',
  '17:00:00',
  'City Hospital Main Building',
  '123 Healthcare Avenue',
  'Mumbai',
  'Maharashtra',
  '400001',
  200,
  0,
  0,
  'Annual blood donation camp organized by City Hospital. All donors will receive free health checkup and refreshments.',
  ARRAY['parking', 'refreshments', 'medical-staff', 'rest-area', 'certificates'],
  'Upcoming'
),
(
  'Community Blood Donation Camp',
  'Red Cross Society',
  'John Smith',
  'john.smith@redcross.org',
  '+1-555-0124',
  '2025-10-30',
  '10:00:00',
  '16:00:00',
  'Community Center Hall',
  '456 Community Street',
  'Delhi',
  'Delhi',
  '110001',
  150,
  0,
  0,
  'Community initiative to help local hospitals maintain blood supply. Walk-ins welcome!',
  ARRAY['parking', 'refreshments', 'medical-staff', 'certificates'],
  'Upcoming'
),
(
  'Corporate Blood Donation Drive',
  'Tech Solutions Inc.',
  'Emily Davis',
  'emily.davis@techsolutions.com',
  '+1-555-0125',
  '2025-12-01',
  '11:00:00',
  '15:00:00',
  'Tech Solutions Office Campus',
  '789 Innovation Park',
  'Bangalore',
  'Karnataka',
  '560001',
  100,
  0,
  0,
  'Corporate social responsibility initiative. Open to all employees and their families.',
  ARRAY['parking', 'refreshments', 'medical-staff', 'rest-area'],
  'Upcoming'
);

-- Create a view for camp statistics
CREATE OR REPLACE VIEW camp_statistics AS
SELECT
  COUNT(*) as total_camps,
  COUNT(*) FILTER (WHERE status = 'Upcoming') as upcoming_camps,
  COUNT(*) FILTER (WHERE status = 'Completed') as completed_camps,
  COALESCE(SUM(actual_donors), 0) as total_donors_served,
  COALESCE(SUM(units_collected), 0) as total_units_collected
FROM donation_camps;

COMMENT ON TABLE donation_camps IS 'Stores information about blood donation camps organized by various organizations';
COMMENT ON TABLE camp_registrations IS 'Tracks donor registrations and attendance for donation camps';
COMMENT ON VIEW camp_statistics IS 'Provides aggregate statistics about all donation camps';
