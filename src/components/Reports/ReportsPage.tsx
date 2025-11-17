import React, { useState, useEffect } from 'react';
import { Calendar, Download, TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface ReportData {
  totalCandidates: number;
  interviewsScheduled: number;
  hiringsThisMonth: number;
  averageTimeToHire: number;
  costPerHire: number;
  sourceEffectiveness: { source: string; candidates: number; hired: number }[];
  monthlyTrends: { month: string; candidates: number; hired: number }[];
}

const ReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateReport();
  }, [dateRange]);

  const generateReport = async () => {
    setLoading(true);
    // Simulate API call - replace with actual API
    setTimeout(() => {
      const mockData: ReportData = {
        totalCandidates: 247,
        interviewsScheduled: 32,
        hiringsThisMonth: 8,
        averageTimeToHire: 18,
        costPerHire: 3200,
        sourceEffectiveness: [
          { source: 'LinkedIn', candidates: 89, hired: 5 },
          { source: 'Indeed', candidates: 67, hired: 2 },
          { source: 'Company Website', candidates: 45, hired: 1 },
          { source: 'Referrals', candidates: 46, hired: 0 }
        ],
        monthlyTrends: [
          { month: 'Jan', candidates: 45, hired: 3 },
          { month: 'Feb', candidates: 52, hired: 4 },
          { month: 'Mar', candidates: 48, hired: 2 },
          { month: 'Apr', candidates: 67, hired: 5 },
          { month: 'May', candidates: 89, hired: 8 }
        ]
      };
      setReportData(mockData);
      setLoading(false);
    }, 1000);
  };

  const exportReport = () => {
    // Generate CSV or PDF export
    const csvContent = `Date Range,${dateRange.start} to ${dateRange.end}\n` +
      `Total Candidates,${reportData?.totalCandidates}\n` +
      `Interviews Scheduled,${reportData?.interviewsScheduled}\n` +
      `Hirings This Month,${reportData?.hiringsThisMonth}\n` +
      `Average Time to Hire,${reportData?.averageTimeToHire} days\n` +
      `Cost Per Hire,$${reportData?.costPerHire}\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hr-report-${dateRange.start}-${dateRange.end}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">HR Reports & Analytics</h1>
        <div className="flex space-x-3">
          <button
            onClick={exportReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.totalCandidates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.interviewsScheduled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hirings This Month</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.hiringsThisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Time to Hire</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.averageTimeToHire} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cost Per Hire</p>
              <p className="text-2xl font-bold text-gray-900">${reportData?.costPerHire?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Effectiveness */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Effectiveness</h3>
          <div className="space-y-4">
            {reportData?.sourceEffectiveness.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{source.source}</p>
                  <p className="text-sm text-gray-600">{source.candidates} candidates • {source.hired} hired</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {source.candidates > 0 ? ((source.hired / source.candidates) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="space-y-4">
            {reportData?.monthlyTrends.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{month.month}</p>
                  <p className="text-sm text-gray-600">{month.candidates} applications</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{month.hired} hired</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(month.hired / month.candidates) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Pipeline Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">247</p>
            <p className="text-sm text-gray-600">Applications</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">89</p>
            <p className="text-sm text-gray-600">Screening</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">32</p>
            <p className="text-sm text-gray-600">Interviews</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">8</p>
            <p className="text-sm text-gray-600">Hired</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
