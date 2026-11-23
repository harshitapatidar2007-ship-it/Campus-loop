-- CampusLoop Supabase Seed Data

INSERT INTO campuses (id, name, code, city, state, domain)
VALUES ('00000000-0000-0000-0000-000000000001', 'Apex Institute of Technology', 'AIT-DELHI', 'New Delhi', 'Delhi', 'apex.edu.in')
ON CONFLICT DO NOTHING;

INSERT INTO pickup_points (id, campus_id, name, building, description, operating_hours, is_safe_zone)
VALUES 
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Central Library Entrance', 'Dr. APJ Abdul Kalam Library Building', 'Foyer area near security desk.', '08:30 AM - 09:00 PM', true),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Main Canteen Food Court', 'Student Amenities Block', 'Near green recycling station.', '09:00 AM - 07:30 PM', true),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'CSE Department Lobby', 'Turing Computer Center', 'Ground floor lobby in front of Systems Lab.', '08:00 AM - 06:30 PM', true)
ON CONFLICT DO NOTHING;
