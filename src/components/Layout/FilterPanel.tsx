import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { setFilters, clearFilters, toggleFilterPanel } from '../../store/filtersSlice';
import { GlassButton, GlassInput } from '../UI/Glass/GlassComponents';

const FilterPanel = () => {
  const dispatch = useDispatch();
  const { filters, isFilterOpen } = useSelector((state: RootState) => state.filters);

  const skillOptions = ['React', 'TypeScript', 'Python', 'Node.js', 'SQL', 'GraphQL', 'Figma', 'Adobe XD'];
  const locationOptions = ['Dubai, UAE', 'Riyadh, Saudi Arabia', 'Abu Dhabi, UAE', 'Kuwait City, Kuwait'];
  const statusOptions = ['applied', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected', 'not_responding'];
  const sourceOptions = ['LinkedIn', 'Company Website', 'Indeed', 'Referral', 'Other'];

  return (
    <AnimatePresence>
      {isFilterOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="w-80 h-full"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-white/30 dark:border-gray-700/50 overflow-y-auto rounded-r-2xl shadow-2xl">
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Candidates</h2>
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => dispatch(toggleFilterPanel())}
                    className="p-2"
                  >
                    <X className="w-5 h-5" />
                  </GlassButton>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Skills</label>
                  <div className="space-y-2">
                    {skillOptions.map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.skills?.includes(skill) || false}
                          onChange={(e) => {
                            const currentSkills = filters.skills || [];
                            const newSkills = e.target.checked
                              ? [...currentSkills, skill]
                              : currentSkills.filter(s => s !== skill);
                            dispatch(setFilters({ skills: newSkills }));
                          }}
                          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2 bg-white dark:bg-gray-700"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Experience (years)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <GlassInput
                      type="number"
                      placeholder="Min"
                      value={filters.experience?.min || ''}
                      onChange={(e) => dispatch(setFilters({ 
                        experience: { 
                          min: parseInt(e.target.value) || 0, 
                          max: filters.experience?.max || 100 
                        } 
                      }))}
                    />
                    <GlassInput
                      type="number"
                      placeholder="Max"
                      value={filters.experience?.max || ''}
                      onChange={(e) => dispatch(setFilters({ 
                        experience: { 
                          min: filters.experience?.min || 0,
                          max: parseInt(e.target.value) || 100 
                        } 
                      }))}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Location</label>
                  <div className="space-y-2">
                    {locationOptions.map((location) => (
                      <label key={location} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.location?.includes(location) || false}
                          onChange={(e) => {
                            const currentLocations = filters.location || [];
                            const newLocations = e.target.checked
                              ? [...currentLocations, location]
                              : currentLocations.filter(l => l !== location);
                            dispatch(setFilters({ location: newLocations }));
                          }}
                          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2 bg-white dark:bg-gray-700"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Status</label>
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status?.includes(status) || false}
                          onChange={(e) => {
                            const currentStatuses = filters.status || [];
                            const newStatuses = e.target.checked
                              ? [...currentStatuses, status]
                              : currentStatuses.filter(s => s !== status);
                            dispatch(setFilters({ status: newStatuses }));
                          }}
                          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2 bg-white dark:bg-gray-700"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Source</label>
                  <div className="space-y-2">
                    {sourceOptions.map((source) => (
                      <label key={source} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.source?.includes(source) || false}
                          onChange={(e) => {
                            const currentSources = filters.source || [];
                            const newSources = e.target.checked
                              ? [...currentSources, source]
                              : currentSources.filter(s => s !== source);
                            dispatch(setFilters({ source: newSources }));
                          }}
                          className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2 bg-white dark:bg-gray-700"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/30 dark:bg-gray-700/20">
                <div className="flex space-x-3">
                  <GlassButton
                    variant="secondary"
                    onClick={() => dispatch(clearFilters())}
                    className="flex-1"
                  >
                    Clear All
                  </GlassButton>
                  <GlassButton
                    variant="primary"
                    onClick={() => dispatch(toggleFilterPanel())}
                    className="flex-1"
                  >
                    Apply Filters
                  </GlassButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;