import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Download, 
  Edit, 
  MessageSquare,
  Video,
  Clock,
  User,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';
import { Database } from '../../lib/database.types';
import { updateCandidateStatus } from '../../store/candidatesSlice';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

type Candidate = Database['public']['Tables']['candidates']['Row'] & {
  applications?: any[];
  interviews?: any[];
  notes?: any[];
  documents?: any[];
};

interface CandidateDetailsModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

const CandidateDetailsModal = ({ candidate, isOpen, onClose }: CandidateDetailsModalProps) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'interviews' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!isOpen || !candidate) return null;

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

  const handleStatusChange = (newStatus: string) => {
    dispatch(updateCandidateStatus({ id: candidate.id, status: newStatus }));
    toast.success(`Candidate status updated to ${newStatus}`);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setIsAddingNote(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const note = {
        id: `note_${Date.now()}`,
        author: 'Sarah Johnson',
        author_id: '1',
        content: newNote,
        created_at: new Date().toISOString(),
        mentions: [],
        is_private: false
      };
      
      // In a real app, this would update the candidate's notes
      console.log('Adding note:', note);
      toast.success('Note added successfully');
      setNewNote('');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'interviews', name: 'Interviews', icon: Video },
    { id: 'notes', name: 'Notes', icon: MessageSquare }
  ];

  const statusOptions = [
    'new', 'reviewing', 'qualified', 'not_qualified', 'on_hold'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <img
              src={candidate.avatar_url || 'https://i.pinimg.com/736x/82/47/0b/82470b4ed44c3edacfcd4201e2297050.jpg'}
              alt={candidate.name}
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
              <p className="text-lg text-gray-600">{candidate.applications?.[0]?.positions?.title || 'No position'}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                  {candidate.status}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{candidate.rating}/5</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={candidate.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status} value={status} className="capitalize">
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
            
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Edit className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{candidate.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{candidate.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{candidate.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Professional Details</h3>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium text-gray-900">{candidate.experience_years || 0} years</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Created Date</p>
                      <p className="font-medium text-gray-900">
                        {candidate.created_at ? format(parseISO(candidate.created_at), 'MMM d, yyyy') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Salary Expectation</p>
                    <p className="font-medium text-gray-900">
                      {candidate.salary_expectation ? `$${candidate.salary_expectation.toLocaleString()} AED` : 'Not specified'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Source</p>
                    <p className="font-medium text-gray-900">{candidate.source}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(candidate.skills) && candidate.skills.length > 0 ? (
                    candidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => {
                      // In a real app, this would open the schedule interview modal with pre-selected candidate
                      toast.success('Schedule Interview feature - would open with this candidate pre-selected');
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Video className="w-4 h-4" />
                    <span>Schedule Interview</span>
                  </button>
                  <button 
                    onClick={() => {
                      window.location.href = `mailto:${candidate.email}`;
                    }}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (candidate.resume_url) {
                        window.open(candidate.resume_url, '_blank');
                      } else {
                        toast.error('No resume available for download');
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>
              
              {candidate.documents && candidate.documents.length > 0 ? (
                <div className="space-y-3">
                  {candidate.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {doc.type} • {(doc.size / 1024).toFixed(1)} KB • 
                            Uploaded {format(parseISO(doc.uploaded_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No documents uploaded yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'interviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Interview History</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  <span>Schedule Interview</span>
                </button>
              </div>
              
              {candidate.interviews && candidate.interviews.length > 0 ? (
                <div className="space-y-3">
                  {candidate.interviews.map((interview: any) => (
                    <div key={interview.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{interview.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                          interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {interview.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Interviewer: {interview.users?.name || 'Unknown'}</p>
                        <p>Date: {interview.scheduled_date ? format(parseISO(interview.scheduled_date), 'MMM d, yyyy HH:mm') : 'N/A'}</p>
                        <p>Duration: {interview.duration_minutes || 60} minutes</p>
                        <p>Type: {interview.type}</p>
                      </div>
                      {interview.interview_feedback && interview.interview_feedback.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-900">
                            Overall Rating: {interview.interview_feedback[0].overall_rating}/5
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{interview.interview_feedback[0].comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No interviews scheduled yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notes & Comments</h3>
              </div>
              
              {/* Add Note */}
              <div className="border border-gray-200 rounded-lg p-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this candidate..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isAddingNote}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isAddingNote ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>Add Note</span>
                  </button>
                </div>
              </div>
              
              {/* Notes List */}
              {candidate.notes && candidate.notes.length > 0 ? (
                <div className="space-y-3">
                  {candidate.notes.map((note) => (
                    <div key={note.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{note.author}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(parseISO(note.created_at), 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No notes added yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsModal;