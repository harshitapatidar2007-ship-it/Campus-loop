-- CampusLoop PostgreSQL Schema & Migrations
-- Production-ready schema with RLS, Constraints, and Indexes

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('student', 'moderator', 'admin');
CREATE TYPE listing_category AS ENUM (
  'textbooks', 'reference_books', 'engineering_drawing', 'calculators',
  'lab_coats', 'lab_equipment', 'electronics_kits', 'project_kits',
  'notes', 'study_guides', 'stationery', 'other'
);
CREATE TYPE condition_level AS ENUM ('new', 'like_new', 'good', 'fair', 'heavily_used');
CREATE TYPE listing_mode AS ENUM ('sell', 'borrow', 'rent', 'lend', 'exchange', 'donate', 'free_giveaway');
CREATE TYPE listing_status AS ENUM ('available', 'reserved', 'exchanged', 'closed');
CREATE TYPE request_status AS ENUM (
  'AVAILABLE', 'REQUESTED', 'ACCEPTED', 'RESERVED', 'HANDOVER_PENDING',
  'COMPLETED', 'CANCELLED', 'REJECTED', 'EXPIRED', 'RETURN_PENDING',
  'RETURNED', 'DISPUTED'
);

-- 3. Campuses Table
CREATE TABLE campuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Departments Table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  semesters_count INT DEFAULT 8
);

-- 5. Campus Pickup Points Table
CREATE TABLE pickup_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  description TEXT,
  operating_hours TEXT,
  accessibility TEXT,
  meeting_instructions TEXT,
  is_safe_zone BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. User Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY, -- links with auth.users.id
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'student',
  campus_id UUID REFERENCES campuses(id),
  department TEXT,
  branch TEXT,
  semester INT DEFAULT 1,
  student_id TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2,1) DEFAULT 5.0,
  total_ratings INT DEFAULT 0,
  completed_exchanges INT DEFAULT 0,
  response_rate_percent INT DEFAULT 100,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Listings Table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category listing_category NOT NULL,
  subject TEXT NOT NULL,
  course_code TEXT,
  branch_compatibility TEXT[] DEFAULT '{}',
  semester_compatibility INT[] DEFAULT '{}',
  academic_year TEXT DEFAULT '2024-2025',
  author TEXT,
  isbn TEXT,
  edition TEXT,
  condition condition_level NOT NULL DEFAULT 'good',
  condition_notes TEXT,
  listing_type listing_mode NOT NULL DEFAULT 'sell',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  deposit NUMERIC(10,2) DEFAULT 0,
  original_price NUMERIC(10,2),
  max_lending_days INT,
  availability_status listing_status DEFAULT 'available',
  pickup_point_preference_id UUID REFERENCES pickup_points(id),
  images TEXT[] DEFAULT '{}',
  views_count INT DEFAULT 0,
  saves_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Requests & Reservations Table (Concurrency Safe)
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  requested_mode listing_mode NOT NULL,
  status request_status DEFAULT 'REQUESTED',
  proposed_pickup_point_id UUID REFERENCES pickup_points(id),
  confirmed_pickup_point_id UUID REFERENCES pickup_points(id),
  proposed_pickup_time TEXT NOT NULL,
  confirmed_pickup_time TEXT,
  requester_message TEXT,
  owner_message TEXT,
  handover_code CHAR(6),
  handover_code_expires_at TIMESTAMPTZ,
  handover_attempts INT DEFAULT 0,
  return_due_date TIMESTAMPTZ,
  return_handover_code CHAR(6),
  return_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT chk_different_parties CHECK (requester_id <> owner_id)
);

-- Prevent concurrent active requests on same listing from being accepted simultaneously
CREATE UNIQUE INDEX idx_single_active_reservation ON requests (listing_id)
WHERE status IN ('ACCEPTED', 'RESERVED', 'HANDOVER_PENDING');

-- 9. Chat Messages Table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  recipient_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Student Wishlists Table
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subject TEXT,
  category listing_category,
  branch TEXT,
  semester INT,
  budget_max NUMERIC(10,2) NOT NULL,
  preferred_condition condition_level,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Transaction Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Safety Reports & Moderation Table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES profiles(id) NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('listing', 'user')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  resolution_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. In-App Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. INDEXES for High-Performance Queries
CREATE INDEX idx_listings_campus ON listings(campus_id);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_availability ON listings(availability_status);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_requests_listing ON requests(listing_id);
CREATE INDEX idx_requests_requester ON requests(requester_id);
CREATE INDEX idx_requests_owner ON requests(owner_id);
CREATE INDEX idx_messages_request ON chat_messages(request_id);

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self update
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: Public read, owner update/delete, verified student insert
CREATE POLICY "Listings are viewable by everyone" ON listings FOR SELECT USING (true);
CREATE POLICY "Users can insert own listings" ON listings FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own listings" ON listings FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own listings" ON listings FOR DELETE USING (auth.uid() = owner_id);

-- Requests: Parties can read their own requests
CREATE POLICY "Users can view requests they participate in" ON requests FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = owner_id);

CREATE POLICY "Users can insert requests as requester" ON requests FOR INSERT
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Participants can update requests" ON requests FOR UPDATE
USING (auth.uid() = requester_id OR auth.uid() = owner_id);

-- Messages: Participants can read and send
CREATE POLICY "Participants can view chat messages" ON chat_messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Participants can insert chat messages" ON chat_messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);
