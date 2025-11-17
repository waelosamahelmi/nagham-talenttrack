import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Candidate } from '../types';

const Pipeline = () => {
  const { candidates } = useSelector((state: RootState) => state.candidates);

  const stages = [
    { id: 'applied', name: 'Applied', color: 'bg-blue-500' },
    { id: 'screening', name: 'Screening', color: 'bg-yellow-500' },
    { id: 'interview', name: 'Interview', color: 'bg-purple-500' },
    { id: 'assessment', name: 'Assessment', color: 'bg-orange-500' },
    { id: 'offer', name: 'Offer', color: 'bg-green-500' },
    { id: 'hired', name: 'Hired', color: 'bg-green-600' },
    { id: 'not_responding', name: 'Not Responding', color: 'bg-orange-600' },
  ];

  const getCandidatesByStatus = (status: string) => {
    return candidates.filter(candidate => candidate.status === status);
  };

  const CandidateCard = ({ candidate }: { candidate: Candidate }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <img
          src={candidate.avatar || 'https://i.pinimg.com/736x/82/47/0b/82470b4ed44c3edacfcd4201e2297050.jpg'}
          alt={candidate.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{candidate.name}</h4>
          <p className="text-sm text-gray-600">{candidate.position}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {candidate.skills.slice(0, 2).map((skill) => (
          <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recruitment Pipeline</h1>
        <p className="text-gray-600 mt-1">Drag and drop candidates between stages to update their status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageCandidates = getCandidatesByStatus(stage.id);
          return (
            <div key={stage.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                  <h3 className="font-medium text-gray-900">{stage.name}</h3>
                </div>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                  {stageCandidates.length}
                </span>
              </div>
              
              <div className="space-y-2">
                {stageCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
                
                {stageCandidates.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No candidates</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;