import React from 'react';
import { MapPin, Clock, Star, ExternalLink } from 'lucide-react';
import { Database } from '../../lib/database.types';
import { format, parseISO } from 'date-fns';

type Candidate = Database['public']['Tables']['candidates']['Row'] & {
  applications?: any[];
};

interface CandidateCardProps {
  candidate: Candidate;
  onSelect: (candidate: Candidate) => void;
}

const CandidateCard = ({ candidate, onSelect }: CandidateCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'not_qualified': return 'bg-red-100 text-red-800';
      case 'on_hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={candidate.avatar_url || 'https://i.pinimg.com/736x/82/47/0b/82470b4ed44c3edacfcd4201e2297050.jpg'}
            alt={candidate.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
            <p className="text-sm text-gray-600">{candidate.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{candidate.rating}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
            {candidate.status}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Array.isArray(candidate.skills) && candidate.skills.slice(0, 3).map((skill: string) => (
          <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
            {skill}
          </span>
        ))}
        {Array.isArray(candidate.skills) && candidate.skills.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
            +{candidate.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{candidate.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{candidate.experience_years} years</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {candidate.salary_expectation ? `$${candidate.salary_expectation.toLocaleString()}` : 'Not specified'}
          </p>
          <p className="text-xs text-gray-500">Expected</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Created {format(parseISO(candidate.created_at), 'MMM d, yyyy')}</p>
            <p className="text-xs text-gray-500">Source: {candidate.source}</p>
          </div>
          <button
            onClick={() => onSelect(candidate)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <span className="text-sm">View Details</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;