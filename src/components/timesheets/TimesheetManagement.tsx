import React, { useState } from 'react';
import { 
  Clock, 
  Download, 
  Eye, 
  Filter,
  Users,
  FileText,
  Calendar,
  Search,
  ChevronDown,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { mockStaff, mockTimesheetData } from '../../data/mockData';

const TimesheetManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const [filterType, setFilterType] = useState<'all' | 'patch' | 'individual'>('all');
  const [selectedPatch, setSelectedPatch] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDistrictFilter, setShowDistrictFilter] = useState(false);
  const [isDefaultScreen, setIsDefaultScreen] = useState(false);

  const staff = mockStaff;
  const timesheetData = mockTimesheetData;
  const districts = ['Central', 'North', 'South', 'East', 'West', 'Northeast', 'Southeast', 'Northwest'];

  const handleDistrictChange = (district: string) => {
    setSelectedDistricts(prev => 
      prev.includes(district) 
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const filteredTimesheetData = timesheetData.filter(entry => {
    const staffMember = staff.find(s => s.id === entry.staffId);
    const matchesSearch = staffMember?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistricts.length === 0 || 
      (staffMember && selectedDistricts.some(d => staffMember.patches.includes(d)));
    return matchesSearch && matchesDistrict;
  });

  const totalMetrics = {
    totalHours: filteredTimesheetData.reduce((sum, entry) => sum + entry.totalHours, 0),
    totalMileage: filteredTimesheetData.reduce((sum, entry) => sum + entry.totalMileage, 0),
    totalStaff: filteredTimesheetData.length,
    averageHours: filteredTimesheetData.length > 0 ? 
      filteredTimesheetData.reduce((sum, entry) => sum + entry.totalHours, 0) / filteredTimesheetData.length : 0,
  };

  const exportTimesheet = (format: string, staffId?: string) => {
    console.log(`Exporting timesheet as ${format}${staffId ? ` for staff ${staffId}` : ''}`);
  };

  const viewTimesheet = (staffId: string) => {
    console.log(`Viewing detailed timesheet for staff ${staffId}`);
  };

  const renderSummaryView = () => (
    <div className="space-y-6">
      {/* Staff Timesheet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTimesheetData.map((entry) => {
          const staffMember = staff.find(s => s.id === entry.staffId);
          return (
            <div key={entry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{staffMember?.name}</h3>
                    <p className="text-sm text-gray-600">{staffMember?.patches.join(', ')}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  staffMember?.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {staffMember?.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Hours</span>
                  <span className="font-medium text-gray-900">{entry.totalHours}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Mileage</span>
                  <span className="font-medium text-gray-900">{entry.totalMileage} miles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Shifts Completed</span>
                  <span className="font-medium text-gray-900">{entry.shiftsCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overtime Hours</span>
                  <span className="font-medium text-gray-900">{entry.overtimeHours}h</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="text-gray-600">Week: {entry.weekEnding}</p>
                    <p className="text-gray-600">Rate: £{entry.hourlyRate}/hr</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => viewTimesheet(entry.staffId)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => exportTimesheet('pdf', entry.staffId)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Export PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Totals */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Totals</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{totalMetrics.totalHours}</p>
              <p className="text-sm text-gray-600">Total Hours</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{totalMetrics.totalMileage}</p>
              <p className="text-sm text-gray-600">Total Mileage</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{totalMetrics.totalStaff}</p>
              <p className="text-sm text-gray-600">Active Staff</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{totalMetrics.averageHours.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Avg Hours/Staff</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailedView = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Detailed Timesheet View</h3>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Staff Member</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Monday</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Tuesday</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Wednesday</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Thursday</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Friday</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Weekend</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimesheetData.map((entry) => {
                const staffMember = staff.find(s => s.id === entry.staffId);
                return (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{staffMember?.name}</p>
                          <p className="text-sm text-gray-500">{staffMember?.idNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {entry.dailyHours.monday}h
                      <br />
                      <span className="text-xs text-gray-500">{entry.dailyMileage.monday}mi</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {entry.dailyHours.tuesday}h
                      <br />
                      <span className="text-xs text-gray-500">{entry.dailyMileage.tuesday}mi</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {entry.dailyHours.wednesday}h
                      <br />
                      <span className="text-xs text-gray-500">{entry.dailyMileage.wednesday}mi</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {entry.dailyHours.thursday}h
                      <br />
                      <span className="text-xs text-gray-500">{entry.dailyMileage.thursday}mi</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {entry.dailyHours.friday}h
                      <br />
                      <span className="text-xs text-gray-500">{entry.dailyMileage.friday}mi</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {entry.dailyHours.weekend}h
                      <br />
                      <span className="text-xs text-gray-500">{entry.dailyMileage.weekend}mi</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{entry.totalHours}h</p>
                        <p className="text-gray-500">{entry.totalMileage}mi</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewTimesheet(entry.staffId)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => exportTimesheet('pdf', entry.staffId)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Export"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
          <p className="text-gray-600">Manage staff working hours and mileage</p>
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
          <button
            onClick={() => exportTimesheet('excel')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-blue-600">{totalMetrics.totalHours}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Mileage</p>
              <p className="text-2xl font-bold text-green-600">{totalMetrics.totalMileage}</p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-purple-600">{totalMetrics.totalStaff}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Hours</p>
              <p className="text-2xl font-bold text-orange-600">{totalMetrics.averageHours.toFixed(1)}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <button
              onClick={() => setViewMode('summary')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'summary'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'detailed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Detailed
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Select Districts</span>
                    <button
                      onClick={() => setShowDistrictFilter(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
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
        </div>
      </div>

      {/* Content */}
      {viewMode === 'summary' ? renderSummaryView() : renderDetailedView()}
    </div>
  );
};

export default TimesheetManagement;