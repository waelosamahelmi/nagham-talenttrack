import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  Calendar, 
  BarChart3, 
  ArrowRight, 
  CheckCircle, 
  Shield,
  Zap,
  Globe,
  Award,
  Clock,
  TrendingUp,
  MessageSquare,
  FileText,
  Star,
  Play,
  ChevronDown,
  ChevronUp,
  Target,
  Brain,
  Smartphone,
  Database,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  Filter,
  Download,
  Upload,
  Video,
  Mic,
  Eye,
  Lock,
  Workflow,
  PieChart,
  BarChart,
  LineChart,
  Settings,
  Bell,
  UserCheck,
  FileCheck,
  Calendar as CalendarIcon,
  MessageCircle,
  Headphones,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Rocket,
  Heart,
  ThumbsUp,
  Coffee,
  Laptop,
  X,
  Loader2,
  Send,
  ExternalLink
} from 'lucide-react';
import { 
  supabase,
  demoRequestsApi,
  newsletterApi,
  testimonialsApi,
  pricingApi,
  featuresApi,
  integrationsApi,
  faqsApi,
  type Testimonial,
  type PricingPlan,
  type Feature,
  type Integration,
  type FAQ
} from '../../lib/supabase';
import toast from 'react-hot-toast';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  // State for dynamic content
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  
  // UI state
  const [activeFeature, setActiveFeature] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [demoFormData, setDemoFormData] = useState({
    name: '',
    email: '',
    company: '',
    company_size: '',
    phone: '',
    message: ''
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmittingDemo, setIsSubmittingDemo] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [
          testimonialsData,
          pricingData,
          featuresData,
          integrationsData,
          faqsData
        ] = await Promise.all([
          testimonialsApi.getFeatured(),
          pricingApi.getAll(),
          featuresApi.getFeatured(),
          integrationsApi.getFeatured(),
          faqsApi.getAll()
        ]);

        setTestimonials(testimonialsData || []);
        setPricingPlans(pricingData || []);
        setFeatures(featuresData || []);
        setIntegrations(integrationsData || []);
        setFaqs(faqsData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load page data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  // Auto-rotate features
  useEffect(() => {
    if (features.length > 0) {
      const interval = setInterval(() => {
        setActiveFeature(prev => (prev + 1) % features.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [features.length]);

  // Handle demo form submission
  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!demoFormData.name.trim() || !demoFormData.email.trim() || !demoFormData.company.trim() || !demoFormData.company_size) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmittingDemo(true);

    try {
      await demoRequestsApi.create({
        name: demoFormData.name,
        email: demoFormData.email,
        company: demoFormData.company,
        company_size: demoFormData.company_size,
        phone: demoFormData.phone,
        message: demoFormData.message
      });

      toast.success('Demo request submitted successfully! We\'ll contact you within 24 hours.');
      
      // Reset form
      setDemoFormData({
        name: '',
        email: '',
        company: '',
        company_size: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting demo request:', error);
      toast.error('Failed to submit demo request. Please try again.');
    } finally {
      setIsSubmittingDemo(false);
    }
  };

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim() || !/\S+@\S+\.\S+/.test(newsletterEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);

    try {
      await newsletterApi.subscribe(newsletterEmail);
      toast.success('Successfully subscribed to our newsletter!');
      setNewsletterEmail('');
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      if (error.message === 'Email already subscribed') {
        toast.error('This email is already subscribed to our newsletter');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle input changes
  const handleDemoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setDemoFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Users, Calendar, BarChart3, MessageSquare, Video, Brain, Target, Shield, Zap, Clock
    };
    return iconMap[iconName] || Users;
  };

  // Industry stats (static for now, could be moved to database)
  const industryStats = [
    { number: '10,000+', label: 'Companies Trust Us', icon: Building2 },
    { number: '2M+', label: 'Candidates Hired', icon: Users },
    { number: '65%', label: 'Faster Hiring', icon: Zap },
    { number: '99.9%', label: 'Uptime SLA', icon: Shield },
    { number: '40%', label: 'Cost Reduction', icon: DollarSign },
    { number: '95%', label: 'Customer Satisfaction', icon: Heart }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading TalentTrack...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Header with Navigation */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        {/* Navigation */}
        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TalentTrack</h1>
                <p className="text-xs text-blue-100">HR Excellence Platform</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-blue-100 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-blue-100 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-blue-100 hover:text-white transition-colors">Reviews</a>
              <a href="#demo" className="text-blue-100 hover:text-white transition-colors">Demo</a>
              <button
                onClick={onGetStarted}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Rocket className="w-4 h-4" />
                <span>New: AI-Powered Candidate Matching</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Hiring Process
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                The most advanced HR talent tracking system that revolutionizes how you discover, evaluate, and hire exceptional talent. 
                Reduce time-to-hire by 65% with AI-powered insights and seamless collaboration tools.
              </p>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-2 text-blue-100">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>65% faster hiring</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>40% cost reduction</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>AI-powered matching</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Enterprise security</span>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl text-lg font-bold hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsVideoPlaying(true)}
                  className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo (2 min)</span>
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-blue-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Setup in 5 minutes</span>
                </div>
              </div>
            </div>
            
            {/* Interactive Demo Preview */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white/70 text-sm ml-4">TalentTrack Dashboard</span>
                </div>
                
                <div className="space-y-4">
                  {/* Animated Dashboard Elements */}
                  <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">247 Active Candidates</div>
                        <div className="text-blue-200 text-sm">+12% this week</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold">↗ 12%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">18 Interviews Today</div>
                        <div className="text-blue-200 text-sm">3 completed</div>
                      </div>
                    </div>
                    <div className="text-blue-400 font-bold">→ 83%</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">28 Days Avg. Hire Time</div>
                        <div className="text-blue-200 text-sm">-5 days improved</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold">↗ 15%</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg animate-pulse">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Industry Stats Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-600">Join thousands of companies that have transformed their hiring</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {industryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group hover:scale-105 transition-transform">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4 group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything you need to hire smarter
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to transform your recruitment process from start to finish. 
              Built for modern HR teams who demand efficiency and results.
            </p>
          </div>

          {features.length > 0 && (
            <>
              {/* Feature Tabs */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {features.map((feature, index) => {
                  const Icon = getIconComponent(feature.icon);
                  return (
                    <button
                      key={feature.id}
                      onClick={() => setActiveFeature(index)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                        activeFeature === index
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{feature.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Feature Display */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center space-x-3 mb-6">
                      {React.createElement(getIconComponent(features[activeFeature].icon), {
                        className: "w-8 h-8 text-blue-600"
                      })}
                      <h3 className="text-2xl font-bold text-gray-900">
                        {features[activeFeature].title}
                      </h3>
                    </div>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {features[activeFeature].description}
                    </p>
                    
                    <div className="space-y-4">
                      {features[activeFeature].benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-gray-700 font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={onGetStarted}
                      className="mt-8 inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <span>Try This Feature</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-8 lg:p-12 flex items-center justify-center">
                    {features[activeFeature].image_url && (
                      <img
                        src={features[activeFeature].image_url}
                        alt={features[activeFeature].title}
                        className="rounded-xl shadow-2xl max-w-full h-auto"
                      />
                    )}
                    <div className="absolute inset-0 bg-blue-600/10 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your team size and needs. All plans include our core features with no hidden fees.
            </p>
          </div>

          {pricingPlans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-xl border-2 ${
                    plan.is_popular ? 'border-blue-500 scale-105 shadow-2xl' : 'border-gray-200'
                  } hover:shadow-2xl transition-all duration-300`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedPlan(plan.name.toLowerCase());
                        onGetStarted();
                      }}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                        plan.is_popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Start Free Trial
                    </button>
                    
                    <ul className="mt-8 space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need a custom solution for your enterprise?</p>
            <button 
              onClick={() => {
                const demoSection = document.getElementById('demo');
                demoSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <span>Contact our sales team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by HR professionals worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about their transformation
            </p>
          </div>

          {testimonials.length > 0 && (
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center space-x-1 mb-6">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-xl text-gray-700 leading-relaxed mb-8">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                    
                    <div className="flex items-center space-x-4 mb-6">
                      <img
                        src={testimonials[currentTestimonial].avatar_url || 'https://i.pinimg.com/736x/82/47/0b/82470b4ed44c3edacfcd4201e2297050.jpg'}
                        alt={testimonials[currentTestimonial].author_name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-lg">
                          {testimonials[currentTestimonial].author_name}
                        </div>
                        <div className="text-gray-600">{testimonials[currentTestimonial].author_role}</div>
                        <div className="text-blue-600 font-medium">
                          {testimonials[currentTestimonial].company}
                        </div>
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(testimonials[currentTestimonial].metrics).map(([key, value]) => (
                        <div key={key} className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{value}</div>
                          <div className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8 text-center">
                      <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {testimonials[currentTestimonial].company}
                      </h3>
                      <p className="text-gray-600">Success Story</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial Navigation */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-600">
              Connect with your favorite tools and platforms
            </p>
          </div>
          
          {integrations.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {integrations.map((integration) => (
                <div key={integration.id} className="text-center group">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 transition-colors">
                    <img
                      src={integration.logo_url}
                      alt={integration.name}
                      className="w-8 h-8 rounded"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{integration.name}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Don't see your tool? We have 50+ integrations available.</p>
            <button 
              onClick={() => {
                window.open('https://docs.talenttrack.com/integrations', '_blank');
              }}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <span>View all integrations</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about TalentTrack
            </p>
          </div>

          {faqs.length > 0 && (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="bg-white rounded-lg shadow-md">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Demo Request Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  See TalentTrack in Action
                </h2>
                <p className="text-blue-100 text-lg mb-6">
                  Get a personalized demo tailored to your company's needs. 
                  See how TalentTrack can transform your hiring process.
                </p>
                <div className="space-y-3 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>30-minute personalized demo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Custom setup for your use case</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Q&A with our experts</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleDemoSubmit} className="bg-white rounded-xl p-6 space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={demoFormData.name}
                    onChange={handleDemoInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Work Email *"
                    value={demoFormData.email}
                    onChange={handleDemoInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name *"
                    value={demoFormData.company}
                    onChange={handleDemoInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <select
                    name="company_size"
                    value={demoFormData.company_size}
                    onChange={handleDemoInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Company Size *</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (Optional)"
                    value={demoFormData.phone}
                    onChange={handleDemoInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Tell us about your hiring challenges (Optional)"
                    value={demoFormData.message}
                    onChange={handleDemoInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingDemo}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmittingDemo ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Request Demo</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Updated with HR Insights
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the latest trends, tips, and best practices delivered to your inbox
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex space-x-4">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubscribing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to revolutionize your hiring process?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of HR professionals who have transformed their recruitment with TalentTrack. 
            Start your free trial today and experience the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors shadow-xl"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                const demoSection = document.getElementById('demo');
                demoSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 bg-transparent text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-colors border-2 border-white"
            >
              <Phone className="w-5 h-5" />
              <span>Talk to Sales</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-100">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TalentTrack</span>
              </div>
              <p className="text-gray-400 mb-4">
                The most advanced HR talent tracking system for modern teams.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.open('https://linkedin.com/company/talenttrack', '_blank')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.location.href = 'mailto:hello@talenttrack.com'}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.location.href = 'tel:+1-555-0123'}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><button onClick={() => window.open('https://docs.talenttrack.com/integrations', '_blank')} className="hover:text-white transition-colors">Integrations</button></li>
                <li><button onClick={() => window.open('https://api.talenttrack.com', '_blank')} className="hover:text-white transition-colors">API</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => window.open('https://talenttrack.com/about', '_blank')} className="hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => window.open('https://talenttrack.com/careers', '_blank')} className="hover:text-white transition-colors">Careers</button></li>
                <li><button onClick={() => window.open('https://blog.talenttrack.com', '_blank')} className="hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => window.open('https://talenttrack.com/press', '_blank')} className="hover:text-white transition-colors">Press</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => window.open('https://help.talenttrack.com', '_blank')} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => window.location.href = 'mailto:support@talenttrack.com'} className="hover:text-white transition-colors">Contact</button></li>
                <li><button onClick={() => window.open('https://talenttrack.com/privacy', '_blank')} className="hover:text-white transition-colors">Privacy</button></li>
                <li><button onClick={() => window.open('https://talenttrack.com/terms', '_blank')} className="hover:text-white transition-colors">Terms</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 TalentTrack. All rights reserved. Built with ❤️ for HR professionals worldwide.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">TalentTrack Demo</h3>
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Demo video would play here</p>
                <p className="text-sm text-gray-500 mt-2">
                  In a real implementation, this would embed a video player
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;