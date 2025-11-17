import { useState } from 'react';
import { Search, Filter, Plus, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import AddCandidateModal from '../Candidates/AddCandidateModal';
import { GlassCard, GlassInput, GlassButton } from '../UI/Glass/GlassComponents';
import toast from 'react-hot-toast';

interface HeaderProps {
  onCandidateAdded?: () => void;
}

const Header = ({ onCandidateAdded }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);

  const handleExport = () => {
    // Simulate export functionality
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          const csvContent = 'Name,Email,Status,Experience,Location\n';
          
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `candidates_export_${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          resolve('Export completed');
        }, 2000);
      }),
      {
        loading: 'Preparing export...',
        success: 'Candidates exported successfully!',
        error: 'Export failed. Please try again.'
      }
    );
  };

  return (
    <>
      <motion.header 
        className="relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard 
          variant="subtle" 
          className="rounded-none border-0 border-b border-white/20 dark:border-white/10 px-6 py-4"
          animated={false}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 z-10" />
                <GlassInput
                  type="text"
                  placeholder="Search candidates, positions, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4"
                />
              </div>

              {/* Filter Button */}
              <GlassButton
                variant="secondary"
                onClick={() => toast('Filters feature coming soon!')}
                className="flex items-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </GlassButton>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <GlassButton
                variant="secondary" 
                onClick={handleExport}
                className="flex items-center space-x-2"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Export</span>
              </GlassButton>
              
              <GlassButton 
                variant="primary"
                onClick={() => setIsAddCandidateOpen(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Candidate</span>
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </motion.header>
      
      <AddCandidateModal 
        isOpen={isAddCandidateOpen} 
        onClose={() => setIsAddCandidateOpen(false)} 
        onCandidateAdded={onCandidateAdded}
      />
    </>
  );
};

export default Header;