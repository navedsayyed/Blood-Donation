-- Migration: Add urgent_blood_requests table
-- Description: Creates table for urgent blood requests with notifications to nearby donors

-- Create urgent_blood_requests table
CREATE TABLE IF NOT EXISTS urgent_blood_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blood_group VARCHAR(5) NOT NULL,
    units_needed INTEGER NOT NULL DEFAULT 1,
    hospital_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    patient_name VARCHAR(255),
    urgency_level VARCHAR(20) DEFAULT 'high' CHECK (urgency_level IN ('critical', 'high', 'medium')),
    additional_notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fulfilled_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX idx_urgent_requests_status ON urgent_blood_requests(status);
CREATE INDEX idx_urgent_requests_blood_group ON urgent_blood_requests(blood_group);
CREATE INDEX idx_urgent_requests_city ON urgent_blood_requests(city);
CREATE INDEX idx_urgent_requests_created_at ON urgent_blood_requests(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_urgent_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_urgent_requests_timestamp
    BEFORE UPDATE ON urgent_blood_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_urgent_requests_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE urgent_blood_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Allow admins to insert urgent requests
CREATE POLICY "Admins can create urgent requests"
    ON urgent_blood_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Policy: Allow admins to update urgent requests
CREATE POLICY "Admins can update urgent requests"
    ON urgent_blood_requests
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Policy: Allow admins to delete urgent requests
CREATE POLICY "Admins can delete urgent requests"
    ON urgent_blood_requests
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Policy: Allow all authenticated users to view active requests
CREATE POLICY "All authenticated users can view active urgent requests"
    ON urgent_blood_requests
    FOR SELECT
    TO authenticated
    USING (status = 'active');

-- Policy: Allow admins to view all requests
CREATE POLICY "Admins can view all urgent requests"
    ON urgent_blood_requests
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Create notification logs table (optional - for tracking notifications sent)
CREATE TABLE IF NOT EXISTS urgent_request_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES urgent_blood_requests(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
    notification_type VARCHAR(20) DEFAULT 'email' CHECK (notification_type IN ('email', 'sms', 'push')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending'))
);

-- Create index for notification logs
CREATE INDEX idx_notification_request_id ON urgent_request_notifications(request_id);
CREATE INDEX idx_notification_donor_id ON urgent_request_notifications(donor_id);

-- Enable RLS for notification logs
ALTER TABLE urgent_request_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow admins to view notification logs
CREATE POLICY "Admins can view notification logs"
    ON urgent_request_notifications
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Policy: Allow system to insert notifications
CREATE POLICY "System can insert notifications"
    ON urgent_request_notifications
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create a function to get matching donors for urgent request
CREATE OR REPLACE FUNCTION get_matching_donors_for_urgent_request(
    p_blood_group VARCHAR(5),
    p_city VARCHAR(100),
    p_state VARCHAR(100)
)
RETURNS TABLE (
    donor_id UUID,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    blood_group VARCHAR(5),
    city VARCHAR(100),
    distance_km NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id as donor_id,
        d.full_name,
        d.email,
        d.phone,
        d.blood_group,
        d.city,
        0::NUMERIC as distance_km -- In production, calculate actual distance
    FROM donors d
    WHERE d.blood_group = p_blood_group
        AND d.city = p_city
        AND d.available_to_donate = true
    ORDER BY d.last_donation_date ASC NULLS FIRST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_matching_donors_for_urgent_request TO authenticated;

-- Insert sample data (optional - for testing)
-- INSERT INTO urgent_blood_requests (
--     blood_group, 
--     units_needed, 
--     hospital_name, 
--     city, 
--     state, 
--     contact_number,
--     patient_name,
--     urgency_level
-- ) VALUES 
--     ('A+', 2, 'City Hospital', 'Mumbai', 'Maharashtra', '+91-9876543210', 'John Doe', 'critical'),
--     ('O-', 3, 'General Hospital', 'Nashik', 'Maharashtra', '+91-9876543211', 'Jane Smith', 'high');

COMMENT ON TABLE urgent_blood_requests IS 'Stores urgent blood donation requests created by admins';
COMMENT ON TABLE urgent_request_notifications IS 'Tracks notifications sent to donors for urgent requests';
COMMENT ON FUNCTION get_matching_donors_for_urgent_request IS 'Returns list of donors matching blood group and location for urgent request';