/*
  # Welcome Page Database Schema

  1. New Tables
    - `demo_requests` - Store demo request submissions
    - `newsletter_subscriptions` - Store email subscriptions
    - `testimonials` - Store customer testimonials
    - `pricing_plans` - Store pricing plan information
    - `features` - Store feature information
    - `integrations` - Store integration information
    - `faqs` - Store frequently asked questions

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for public access where needed
*/

-- Demo Requests Table
CREATE TABLE IF NOT EXISTS demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  company_size text NOT NULL,
  phone text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit demo requests"
  ON demo_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view demo requests"
  ON demo_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  status text DEFAULT 'active'
);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text NOT NULL,
  company text NOT NULL,
  avatar_url text,
  quote text NOT NULL,
  rating integer DEFAULT 5,
  metrics jsonb DEFAULT '{}',
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials"
  ON testimonials
  FOR SELECT
  TO anon
  USING (true);

-- Pricing Plans Table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  period text DEFAULT 'per user/month',
  description text NOT NULL,
  features jsonb DEFAULT '[]',
  is_popular boolean DEFAULT false,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pricing plans"
  ON pricing_plans
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Features Table
CREATE TABLE IF NOT EXISTS features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  benefits jsonb DEFAULT '[]',
  image_url text,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view features"
  ON features
  FOR SELECT
  TO anon
  USING (true);

-- Integrations Table
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NOT NULL,
  category text NOT NULL,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view integrations"
  ON integrations
  FOR SELECT
  TO anon
  USING (true);

-- FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view FAQs"
  ON faqs
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Insert sample data
INSERT INTO testimonials (author_name, author_role, company, avatar_url, quote, rating, metrics, is_featured, display_order) VALUES
('Sarah Johnson', 'Head of HR', 'TechCorp Solutions', 'https://i.pinimg.com/736x/82/47/0b/82470b4ed44c3edacfcd4201e2297050.jpg', 'TalentTrack revolutionized our hiring process. We''ve reduced time-to-hire by 60% and improved candidate quality significantly. The AI matching is incredibly accurate.', 5, '{"timeSaved": "60%", "qualityImproved": "45%"}', true, 1),
('Michael Chen', 'Talent Acquisition Manager', 'StartupXYZ', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1', 'The analytics and reporting features give us incredible insights into our recruitment performance. We can now make data-driven decisions that actually impact our bottom line.', 5, '{"efficiency": "75%", "costReduction": "30%"}', true, 2),
('Emma Rodriguez', 'HR Director', 'Global Enterprises', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1', 'The collaborative features have transformed how our team works together. Everyone stays informed, and we make faster, better hiring decisions as a result.', 5, '{"teamAlignment": "90%", "decisionSpeed": "50%"}', true, 3),
('David Kim', 'VP of People Operations', 'InnovateCorp', 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1', 'Implementation was seamless, and the ROI was immediate. Our hiring costs dropped by 40% while candidate satisfaction increased dramatically.', 5, '{"costSavings": "40%", "satisfaction": "95%"}', true, 4);

INSERT INTO pricing_plans (name, price, period, description, features, is_popular, display_order) VALUES
('Starter', 49, 'per user/month', 'Perfect for small teams getting started', '["Up to 5 active job postings", "Basic candidate management", "Email integration", "Standard reporting", "Community support"]', false, 1),
('Professional', 99, 'per user/month', 'Ideal for growing companies', '["Unlimited job postings", "Advanced candidate matching", "Video interview platform", "Custom workflows", "Analytics dashboard", "Priority support", "API access"]', true, 2),
('Enterprise', 199, 'per user/month', 'For large organizations with complex needs', '["Everything in Professional", "Advanced AI features", "Custom integrations", "Dedicated account manager", "SLA guarantee", "Custom training", "White-label options"]', false, 3);

INSERT INTO features (title, description, icon, category, benefits, image_url, is_featured, display_order) VALUES
('AI-Powered Candidate Matching', 'Advanced machine learning algorithms analyze candidate profiles and match them with job requirements, reducing screening time by 70%.', 'Users', 'Candidate Management', '["Smart skill matching", "Automated scoring", "Bias reduction", "Cultural fit analysis"]', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', true, 1),
('Intelligent Interview Scheduling', 'Seamlessly coordinate interviews across time zones with automated calendar integration and smart conflict resolution.', 'Calendar', 'Interview Management', '["Multi-timezone support", "Calendar sync", "Automated reminders", "Rescheduling automation"]', 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', true, 2),
('Real-time Analytics Dashboard', 'Comprehensive insights into your recruitment pipeline with predictive analytics and performance metrics.', 'BarChart3', 'Analytics & Reporting', '["Pipeline visualization", "Predictive hiring", "ROI tracking", "Custom reports"]', 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', true, 3),
('Collaborative Hiring Platform', 'Built-in communication tools that keep your entire hiring team aligned and informed throughout the process.', 'MessageSquare', 'Collaboration', '["Team messaging", "Feedback collection", "Decision tracking", "Stakeholder updates"]', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1', true, 4);

INSERT INTO integrations (name, logo_url, category, is_featured, display_order) VALUES
('LinkedIn', 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1', 'Job Boards', true, 1),
('Indeed', 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1', 'Job Boards', true, 2),
('Google Workspace', 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1', 'Productivity', true, 3),
('Microsoft 365', 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1', 'Productivity', true, 4),
('Slack', 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1', 'Communication', true, 5),
('Zoom', 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1', 'Video Conferencing', true, 6);

INSERT INTO faqs (question, answer, category, display_order) VALUES
('How quickly can we get started with TalentTrack?', 'Most teams are up and running within 24 hours. Our onboarding process includes data migration, team training, and custom configuration to match your existing workflows.', 'getting-started', 1),
('Does TalentTrack integrate with our existing HR systems?', 'Yes! We offer native integrations with 50+ popular HR tools including Workday, BambooHR, Greenhouse, and more. Our API also supports custom integrations.', 'integrations', 2),
('What kind of support do you provide?', 'We offer 24/7 support via chat, email, and phone. Professional and Enterprise plans include dedicated account managers and priority support with guaranteed response times.', 'support', 3),
('Is our candidate data secure?', 'Absolutely. We''re SOC 2 Type II certified, GDPR compliant, and use enterprise-grade encryption. Your data is stored in secure, geographically distributed data centers.', 'security', 4),
('Can we customize the platform for our specific needs?', 'Yes! TalentTrack is highly customizable. You can create custom fields, workflows, email templates, and even white-label the platform for Enterprise customers.', 'customization', 5),
('What''s included in the free trial?', 'The 14-day free trial includes full access to all Professional features, unlimited candidates, dedicated onboarding support, and sample data to help you explore the platform.', 'trial', 6);