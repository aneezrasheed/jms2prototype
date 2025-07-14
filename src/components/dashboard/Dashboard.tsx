import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Calendar,
  TrendingUp,
  Activity,
  Settings,
  Filter,
  Plus,
  ToggleLeft,
  ToggleRight,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { mockDashboardMetrics, mockActivityLog, mockPatches } from '../../data/mockData';

const Dashboard: React.FC = () => {
  const { dispatch } = useApp();
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<string>('today');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isDefaultScreen, setIsDefaultScreen] = useState(false);
  const [showDistrictFilter, setShowDistrictFilter] = useState(false);

  const metrics = mockDashboardMetrics;
  const activityLog = mockActivityLog;
  const patches = mockPatches;
  const districts = ['Central', 'North', 'South', 'East', 'West', 'Northeast', 'Southeast', 'Northwest'];

  const handleQuickAction = (action: string) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: action });
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistricts(prev => 
      prev.includes(district) 
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Sheffield Care Coordination Platform</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Default Screen</span>
            <button
              onClick={() => setIsDefaultScreen(!isDefaultScreen)}
              className="text-blue-600 hover:text-blue-700"
            >
              {isDefaultScreen ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Last updated:</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date().toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Districts:</span>
            <div className="relative">
              <button
                onClick={() => setShowDistrictFilter(!showDistrictFilter)}
                className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <span className="text-sm">
                  {selectedDistricts.length === 0 ? 'All Districts' : `${selectedDistricts.length} selected`}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showDistrictFilter && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-3">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDistricts.length === 0}
                        onChange={() => setSelectedDistricts([])}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Show All</span>
                    </label>
                    {districts.map(district => (
                      <label key={district} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDistricts.includes(district)}
                          onChange={() => handleDistrictChange(district)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{district}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Range:</span>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleQuickAction('add-client')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Client</span>
            </button>
            <button
              onClick={() => handleQuickAction('rota')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>View Rota</span>
            </button>
            <button
              onClick={() => handleQuickAction('emar')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>EMAR Charts</span>
            </button>
            <button
              onClick={() => handleQuickAction('settings')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.activeClients}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Staff on Duty</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.staffOnDuty}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Clients</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.pendingClients}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.activeAlerts}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Incident Reports</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.incidentReports}</p>
            </div>
            <FileText className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Assessments</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.pendingAssessments}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clients Ending Soon</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.clientsEndingSoon}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Staff on Leave</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.staffOnLeave}</p>
            </div>
            <UserCheck className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {activityLog.map((entry) => (
              <div key={entry.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    entry.priority === 'critical' ? 'bg-red-500' :
                    entry.priority === 'high' ? 'bg-orange-500' :
                    entry.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{entry.message}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(entry.priority)}`}>
                      {entry.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">{formatTimestamp(entry.timestamp)}</p>
                    {!entry.resolved && (
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Resolve
                      </button>
                    )}
                  </div>
                  {entry.lastContactNote && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      Last Contact: {entry.lastContactNote}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;