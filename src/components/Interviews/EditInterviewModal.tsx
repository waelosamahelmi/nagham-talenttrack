import React, { useState, useEffect } from 'react';
import { X, Video, Phone, MapPin, Save, Link } from 'lucide-react';
import { Interview } from '../../types';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { api } from '../../services/api';

interface EditInterviewModalProps {
  interview: Interview | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void | Promise<void>;
}

const EditInterviewModal = ({ interview, isOpen, onClose, onUpdated }: EditInterviewModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
    type: 'video' as 'phone' | 'video' | 'in_person',
    location: '',
    meeting_link: '',
    notes: '',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (interview) {
      const scheduledDate = parseISO(interview.scheduled_date);
      setFormData({
        title: interview.title,
        date: format(scheduledDate, 'yyyy-MM-dd'),
        time: format(scheduledDate, 'HH:mm'),
        duration: interview.duration_minutes,
        type: interview.type,
        location: interview.location || '',
        meeting_link: interview.meeting_link || '',
        notes: interview.notes || '',
        status: interview.status
      });
    }
  }, [interview]);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'rescheduled', label: 'Rescheduled', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  const generateMeetingLink = () => {
    if (formData.type === 'video') {
      const meetingId = Math.random().toString(36).substring(2, 15);
      setFormData(prev => ({
        ...prev,
        meeting_link: `https://meet.google.com/${meetingId}`
      }));
      toast.success('New meeting link generated!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Interview title is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the interview
      console.log('Updated interview:', { ...interview, ...formData });
      
      toast.success('Interview updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update interview. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !interview) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Interview</h2>
            <p className="text-sm text-gray-600 mt-1">
              {interview.candidates?.name || 'Unknown Candidate'} • {interview.users?.name || 'Unknown Interviewer'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Interview Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interview Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Interview Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.type === 'video' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="video"
                  checked={formData.type === 'video'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Video className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Video Call</span>
              </label>

              <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.type === 'phone' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="phone"
                  checked={formData.type === 'phone'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Phone className="w-5 h-5 text-green-600" />
                <span className="font-medium">Phone Call</span>
              </label>

              <label className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.type === 'in_person' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="in_person"
                  checked={formData.type === 'in_person'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <MapPin className="w-5 h-5 text-purple-600" />
                <span className="font-medium">In Person</span>
              </label>
            </div>
          </div>

          {/* Location or Meeting Link */}
          {formData.type === 'in_person' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Conference Room A, 5th Floor"
              />
            </div>
          )}

          {formData.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  name="meeting_link"
                  value={formData.meeting_link}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://meet.google.com/abc-defg-hij"
                />
                <button
                  type="button"
                  onClick={generateMeetingLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
                >
                  <Link className="w-4 h-4" />
                  <span>Generate</span>
                </button>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any specific instructions or notes..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Interview</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInterviewModal;