import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  PieChart,
  ChevronDown,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { mockDashboardMetrics, mockPatches, mockClients, mockStaff } from '../../data/mockData';

const ReportsManagement: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<string>('month');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [showDistrictFilter, setShowDistrictFilter] = useState(false);
  const [isDefaultScreen, setIsDefaultScreen] = useState(false);

  const metrics = mockDashboardMetrics;
  const patches = mockPatches;
  const clients = mockClients;
  const staff = mockStaff;
  const districts = ['Central', 'North', 'South', 'East', 'West', 'Northeast', 'Southeast', 'Northwest'];

  const reportTypes = [
    { id: 'overview', name: 'Overview Report', icon: BarChart3 },
    { id: 'client', name: 'Client Reports', icon: Users },
    { id: 'staff', name: 'Staff Reports', icon: Users },
    { id: 'medication', name: 'Medication Reports', icon: AlertTriangle },
    { id: 'incidents', name: 'Incident Reports', icon: AlertTriangle },
    { id: 'performance', name: 'Performance Reports', icon: TrendingUp },
  ];

  const handleDistrictChange = (district: string) => {
    setSelectedDistricts(prev => 
      prev.includes(district) 
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const generateReport = () => {
    console.log(`Generating ${selectedReport} report for ${dateRange} period`);
  };

  const exportReport = (format: string) => {
    console.log(`Exporting report as ${format}`);
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-3xl font-bold text-blue-600">{metrics.activeClients}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-3xl font-bold text-green-600">{metrics.staffOnDuty}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Incidents</p>
              <p className="text-3xl font-bold text-red-600">{metrics.incidentReports}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Efficiency</p>
              <p className="text-3xl font-bold text-purple-600">94%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* District Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">District Performance</h3>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">District</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Clients</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Staff</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Ratio</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {patches.map((patch) => {
                  const ratio = (patch.clientCount / patch.staffCount).toFixed(1);
                  const efficiency = Math.floor(Math.random() * 20) + 80;
                  return (
                    <tr key={patch.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{patch.name}</td>
                      <td className="py-3 px-4 text-gray-900">{patch.clientCount}</td>
                      <td className="py-3 px-4 text-gray-900">{patch.staffCount}</td>
                      <td className="py-3 px-4 text-gray-900">{ratio}:1</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          efficiency >= 90 ? 'bg-green-100 text-green-800' :
                          efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {efficiency}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClientReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Level Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Low</span>
              <span className="text-sm font-medium text-gray-900">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Moderate</span>
              <span className="text-sm font-medium text-gray-900">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Severe</span>
              <span className="text-sm font-medium text-gray-900">20%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Demographics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">65-75</span>
              <span className="text-sm font-medium text-gray-900">30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">76-85</span>
              <span className="text-sm font-medium text-gray-900">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">85+</span>
              <span className="text-sm font-medium text-gray-900">25%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Duration</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{"< 3 months"}</span>
              <span className="text-sm font-medium text-gray-900">25%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">3-6 months</span>
              <span className="text-sm font-medium text-gray-900">40%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">6+ months</span>
              <span className="text-sm font-medium text-gray-900">35%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStaffReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Utilization</h3>
          <div className="space-y-4">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.patches.join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{member.metrics.totalHours}h</p>
                  <p className="text-sm text-gray-600">{member.metrics.shiftsCompleted} shifts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Hours/Week</span>
              <span className="text-sm font-medium text-gray-900">32.5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Attendance Rate</span>
              <span className="text-sm font-medium text-gray-900">96%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Client Satisfaction</span>
              <span className="text-sm font-medium text-gray-900">4.8/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentReport = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'client':
        return renderClientReport();
      case 'staff':
        return renderStaffReport();
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Report Coming Soon</h3>
              <p className="mt-1 text-sm text-gray-500">
                This report type is currently being developed.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and view comprehensive care reports</p>
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
            onClick={() => exportReport('pdf')}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Report Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Report Configuration</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reportTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Districts</label>
              <div className="relative">
                <button
                  onClick={() => setShowDistrictFilter(!showDistrictFilter)}
                  className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <span className="text-sm">
                    {selectedDistricts.length === 0 ? 'All Districts' : `${selectedDistricts.length} selected`}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showDistrictFilter && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-3">
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

            <div className="flex items-end">
              <button
                onClick={generateReport}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {renderCurrentReport()}
    </div>
  );
};

export default ReportsManagement;