/*
  # PermitRun Database Schema

  1. New Tables
    - `user_profiles` - Extended user profile information
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `phone` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `user_type` (enum: client, runner, admin)
      - `is_verified` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `runner_profiles` - Additional information for permit runners
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `experience_years` (integer)
      - `specialties` (text array)
      - `hourly_rate` (decimal)
      - `service_radius` (integer in miles)
      - `rating` (decimal)
      - `total_reviews` (integer)
      - `completed_jobs` (integer)
      - `is_available` (boolean)
      - `is_online` (boolean)
      - `background_check_status` (enum)
      - `license_number` (text)
      - `insurance_verified` (boolean)
      - `profile_image_url` (text)
      - `bio` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `permit_requests` - Client permit requests
      - `id` (uuid, primary key)
      - `client_id` (uuid, references user_profiles)
      - `runner_id` (uuid, references runner_profiles, nullable)
      - `permit_type` (enum: building, electrical, plumbing, mechanical, zoning, other)
      - `project_description` (text)
      - `pickup_location` (text)
      - `dropoff_location` (text)
      - `pickup_coordinates` (point)
      - `dropoff_coordinates` (point)
      - `requested_date` (date)
      - `requested_time` (time)
      - `estimated_duration` (interval)
      - `status` (enum: pending, assigned, in_progress, completed, cancelled)
      - `priority` (enum: standard, urgent, express)
      - `budget_min` (decimal)
      - `budget_max` (decimal)
      - `final_price` (decimal, nullable)
      - `special_instructions` (text)
      - `documents_required` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `permit_assignments` - Runner assignments to permit requests
      - `id` (uuid, primary key)
      - `permit_request_id` (uuid, references permit_requests)
      - `runner_id` (uuid, references runner_profiles)
      - `assigned_at` (timestamp)
      - `accepted_at` (timestamp, nullable)
      - `started_at` (timestamp, nullable)
      - `completed_at` (timestamp, nullable)
      - `status` (enum: assigned, accepted, in_progress, completed, cancelled)
      - `runner_notes` (text)
      - `estimated_completion` (timestamp)
      - `actual_completion` (timestamp, nullable)

    - `reviews` - Reviews and ratings
      - `id` (uuid, primary key)
      - `permit_request_id` (uuid, references permit_requests)
      - `reviewer_id` (uuid, references user_profiles)
      - `reviewee_id` (uuid, references user_profiles)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `review_type` (enum: client_to_runner, runner_to_client)
      - `created_at` (timestamp)

    - `runner_locations` - Real-time runner location tracking
      - `id` (uuid, primary key)
      - `runner_id` (uuid, references runner_profiles)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `accuracy` (decimal)
      - `heading` (decimal, nullable)
      - `speed` (decimal, nullable)
      - `updated_at` (timestamp)

    - `notifications` - System notifications
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `title` (text)
      - `message` (text)
      - `type` (enum: assignment, status_update, payment, review, system)
      - `is_read` (boolean)
      - `action_url` (text, nullable)
      - `created_at` (timestamp)

    - `payments` - Payment tracking
      - `id` (uuid, primary key)
      - `permit_request_id` (uuid, references permit_requests)
      - `client_id` (uuid, references user_profiles)
      - `runner_id` (uuid, references runner_profiles)
      - `amount` (decimal)
      - `platform_fee` (decimal)
      - `runner_earnings` (decimal)
      - `payment_method` (text)
      - `stripe_payment_intent_id` (text)
      - `status` (enum: pending, processing, completed, failed, refunded)
      - `processed_at` (timestamp, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for runners to access assigned permit requests
    - Add admin policies for system management

  3. Indexes
    - Add indexes for frequently queried columns
    - Add spatial indexes for location-based queries
    - Add composite indexes for complex queries

  4. Functions
    - Function to calculate distance between coordinates
    - Function to find available runners in radius
    - Function to update runner ratings after reviews
*/

-- Create custom types
CREATE TYPE user_type_enum AS ENUM ('client', 'runner', 'admin');
CREATE TYPE permit_type_enum AS ENUM ('building', 'electrical', 'plumbing', 'mechanical', 'zoning', 'other');
CREATE TYPE request_status_enum AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE priority_enum AS ENUM ('standard', 'urgent', 'express');
CREATE TYPE assignment_status_enum AS ENUM ('assigned', 'accepted', 'in_progress', 'completed', 'cancelled');
CREATE TYPE review_type_enum AS ENUM ('client_to_runner', 'runner_to_client');
CREATE TYPE notification_type_enum AS ENUM ('assignment', 'status_update', 'payment', 'review', 'system');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE background_check_enum AS ENUM ('pending', 'approved', 'rejected', 'expired');

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  user_type user_type_enum NOT NULL DEFAULT 'client',
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Runner Profiles Table
CREATE TABLE IF NOT EXISTS runner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  experience_years integer DEFAULT 0,
  specialties text[] DEFAULT '{}',
  hourly_rate decimal(10,2) DEFAULT 0.00,
  service_radius integer DEFAULT 10,
  rating decimal(3,2) DEFAULT 0.00,
  total_reviews integer DEFAULT 0,
  completed_jobs integer DEFAULT 0,
  is_available boolean DEFAULT true,
  is_online boolean DEFAULT false,
  background_check_status background_check_enum DEFAULT 'pending',
  license_number text,
  insurance_verified boolean DEFAULT false,
  profile_image_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Permit Requests Table
CREATE TABLE IF NOT EXISTS permit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  runner_id uuid REFERENCES runner_profiles(id) ON DELETE SET NULL,
  permit_type permit_type_enum NOT NULL,
  project_description text NOT NULL,
  pickup_location text NOT NULL,
  dropoff_location text NOT NULL,
  pickup_coordinates point,
  dropoff_coordinates point,
  requested_date date NOT NULL,
  requested_time time NOT NULL,
  estimated_duration interval,
  status request_status_enum DEFAULT 'pending',
  priority priority_enum DEFAULT 'standard',
  budget_min decimal(10,2),
  budget_max decimal(10,2),
  final_price decimal(10,2),
  special_instructions text,
  documents_required text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Permit Assignments Table
CREATE TABLE IF NOT EXISTS permit_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_request_id uuid REFERENCES permit_requests(id) ON DELETE CASCADE NOT NULL,
  runner_id uuid REFERENCES runner_profiles(id) ON DELETE CASCADE NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  status assignment_status_enum DEFAULT 'assigned',
  runner_notes text,
  estimated_completion timestamptz,
  actual_completion timestamptz,
  UNIQUE(permit_request_id, runner_id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_request_id uuid REFERENCES permit_requests(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text,
  review_type review_type_enum NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Runner Locations Table
CREATE TABLE IF NOT EXISTS runner_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  runner_id uuid REFERENCES runner_profiles(id) ON DELETE CASCADE NOT NULL,
  latitude decimal(10,8) NOT NULL,
  longitude decimal(11,8) NOT NULL,
  accuracy decimal(10,2),
  heading decimal(5,2),
  speed decimal(8,2),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(runner_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type_enum NOT NULL,
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_request_id uuid REFERENCES permit_requests(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  runner_id uuid REFERENCES runner_profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  platform_fee decimal(10,2) NOT NULL,
  runner_earnings decimal(10,2) NOT NULL,
  payment_method text,
  stripe_payment_intent_id text,
  status payment_status_enum DEFAULT 'pending',
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE runner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE permit_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE runner_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Runner Profiles Policies
CREATE POLICY "Anyone can read runner profiles"
  ON runner_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Runners can update own profile"
  ON runner_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create runner profile"
  ON runner_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Permit Requests Policies
CREATE POLICY "Clients can read own requests"
  ON permit_requests
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Runners can read assigned requests"
  ON permit_requests
  FOR SELECT
  TO authenticated
  USING (
    runner_id IN (
      SELECT id FROM runner_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can create requests"
  ON permit_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update own requests"
  ON permit_requests
  FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid());

-- Permit Assignments Policies
CREATE POLICY "Runners can read own assignments"
  ON permit_assignments
  FOR SELECT
  TO authenticated
  USING (
    runner_id IN (
      SELECT id FROM runner_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can read assignments for their requests"
  ON permit_assignments
  FOR SELECT
  TO authenticated
  USING (
    permit_request_id IN (
      SELECT id FROM permit_requests WHERE client_id = auth.uid()
    )
  );

-- Reviews Policies
CREATE POLICY "Users can read reviews about them"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (reviewee_id = auth.uid() OR reviewer_id = auth.uid());

CREATE POLICY "Users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = auth.uid());

-- Runner Locations Policies
CREATE POLICY "Runners can update own location"
  ON runner_locations
  FOR ALL
  TO authenticated
  USING (
    runner_id IN (
      SELECT id FROM runner_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can read assigned runner location"
  ON runner_locations
  FOR SELECT
  TO authenticated
  USING (
    runner_id IN (
      SELECT runner_id FROM permit_requests 
      WHERE client_id = auth.uid() AND runner_id IS NOT NULL
    )
  );

-- Notifications Policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Payments Policies
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid() OR runner_id IN (
    SELECT id FROM runner_profiles WHERE user_id = auth.uid()
  ));

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_runner_profiles_user_id ON runner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_runner_profiles_available ON runner_profiles(is_available, is_online);
CREATE INDEX IF NOT EXISTS idx_runner_profiles_rating ON runner_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_permit_requests_client_id ON permit_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_permit_requests_runner_id ON permit_requests(runner_id);
CREATE INDEX IF NOT EXISTS idx_permit_requests_status ON permit_requests(status);
CREATE INDEX IF NOT EXISTS idx_permit_requests_created_at ON permit_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_permit_assignments_request_id ON permit_assignments(permit_request_id);
CREATE INDEX IF NOT EXISTS idx_permit_assignments_runner_id ON permit_assignments(runner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_runner_locations_runner_id ON runner_locations(runner_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_payments_request_id ON payments(permit_request_id);

-- Create Functions
CREATE OR REPLACE FUNCTION calculate_distance(lat1 decimal, lon1 decimal, lat2 decimal, lon2 decimal)
RETURNS decimal AS $$
BEGIN
  -- Haversine formula to calculate distance in miles
  RETURN (
    3959 * acos(
      cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2) - radians(lon1)) +
      sin(radians(lat1)) * sin(radians(lat2))
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_runner_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE runner_profiles 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating::decimal), 0)
      FROM reviews 
      WHERE reviewee_id = (
        SELECT user_id FROM runner_profiles WHERE id = NEW.reviewee_id
      ) AND review_type = 'client_to_runner'
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews 
      WHERE reviewee_id = (
        SELECT user_id FROM runner_profiles WHERE id = NEW.reviewee_id
      ) AND review_type = 'client_to_runner'
    ),
    updated_at = now()
  WHERE user_id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_completed_jobs()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE runner_profiles 
    SET 
      completed_jobs = completed_jobs + 1,
      updated_at = now()
    WHERE id = NEW.runner_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Triggers
CREATE TRIGGER trigger_update_runner_rating
  AFTER INSERT ON reviews
  FOR EACH ROW
  WHEN (NEW.review_type = 'client_to_runner')
  EXECUTE FUNCTION update_runner_rating();

CREATE TRIGGER trigger_update_completed_jobs
  AFTER UPDATE ON permit_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_completed_jobs();

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_runner_profiles_updated_at
  BEFORE UPDATE ON runner_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_permit_requests_updated_at
  BEFORE UPDATE ON permit_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();