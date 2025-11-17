import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Search,
  FileText,
  MessageSquare,
  Bell,
  LogOut,
  ChevronUp,
  Edit3,
  Moon,
  Sun,
  Monitor,
  Brain,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../components/UI/Theme/ThemeProvider';
import { signOut } from '../../lib/supabase';
import { GlassCard } from '../UI/Glass/GlassComponents';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { profile } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Candidates', href: '/candidates', icon: Users },
    { name: 'Pipeline', href: '/pipeline', icon: FileText },
    { name: 'Interviews', href: '/interviews', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Predictive Analytics', href: '/predictive-analytics', icon: Brain },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    setShowProfileMenu(false);
    signOut().then(() => {
      toast.success('Logged out successfully');
    });
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    // In a real app, this would mark notifications as read
    toast.success('Notifications feature - would show recent notifications');
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleEditProfile = () => {
    setShowProfileMenu(false);
    // Navigate to profile settings
    window.location.href = '/settings';
    toast.success('Redirecting to profile settings...');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
      default: return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setShowThemeMenu(false);
    toast.success(`Theme changed to ${newTheme}`);
  };

  return (
    <div className="w-64 h-screen flex flex-col relative">
      {/* Glass background */}
            <GlassCard 
        variant="strong" 
        className="h-full rounded-none border-0 border-r border-white/20 dark:border-white/10"
        animated={false}
      >
        {/* Logo and Company */}
        <div className="p-6 border-b border-white/10 dark:border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">TalentTrack</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">HR Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-glass'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/10 dark:border-white/5 relative">
          <div className="flex items-center justify-between p-3 hover:bg-white/10 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <img
                src={profile?.avatar_url || 'https://i.pinimg.com/736x/82/47/0b/82470b4ed44c3edacfcd4201e2297050.jpg'}
                alt={profile?.name || 'User'}
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {profile?.name || 'User'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {profile?.role?.replace('_', ' ') || 'Role'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="relative p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <ThemeIcon className="w-4 h-4 text-gray-400" />
              </button>
              
              <button 
                onClick={handleNotificationClick}
                className="relative p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4 text-gray-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
              </button>
              
              <button 
                onClick={handleProfileClick}
                className="p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Theme Menu */}
          {showThemeMenu && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-4 right-4 mb-2"
            >
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-xl shadow-xl p-2">
                <div className="space-y-1">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleThemeChange(value as any)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        theme === value 
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-sm' 
                          : 'hover:bg-gray-100/80 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Profile Menu */}
          {showProfileMenu && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-4 right-4 mb-2"
            >
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-xl shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/30">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{profile?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{profile?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleEditProfile}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Edit Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50/80 dark:hover:bg-red-900/30 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400 font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default Sidebar;