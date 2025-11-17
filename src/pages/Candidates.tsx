import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CandidateCard from '../components/Candidates/CandidateCard';
import CandidateDetailsModal from '../components/Candidates/CandidateDetailsModal';
import { Database } from '../lib/database.types';

type Candidate = Database['public']['Tables']['candidates']['Row'] & {
  applications?: any[];
};

const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const data = await api.candidates.getAll();
        setCandidates(data);
      } catch (error) {
        console.error('Error loading candidates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, []);

  // Filter candidates based on search query and filters
  const filteredCandidates = candidates.filter(candidate => {
    // Search filter
    if (searchQuery && !candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !candidate.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedCandidate(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        <p className="text-gray-600 mt-1">
          {filteredCandidates.length} candidates found
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onSelect={handleCandidateSelect}
          />
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No candidates found</div>
          <p className="text-gray-500 mt-2">Try adjusting your search criteria or filters</p>
        </div>
      )}
      </div>

      <CandidateDetailsModal
        candidate={selectedCandidate}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
      />
    </>
  );
};

export default Candidates;