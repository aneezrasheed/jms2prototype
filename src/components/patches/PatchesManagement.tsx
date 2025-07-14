import React, { useState } from 'react';
import { MapPin, Users, UserCheck, Search, Filter, Eye, Calendar } from 'lucide-react';
import { mockPatches } from '../../data/mockData';

const PatchesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const patches = mockPatches.map(patch => ({
    ...patch,
    pendingClients: Math.floor(Math.random() * 10) + 1 // Mock pending clients
  }));

  const filteredPatches = patches.filter(patch => {
    const matchesSearch = patch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patch.planner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(patch.district);
    return matchesSearch && matchesDistrict;
  });

  const uniqueDistricts = [...new Set(patches.map(p => p.district))];

  const handleDistrictChange = (district: string) => {
    setSelectedDistricts(prev => 
      prev.includes(district) 
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const totalMetrics = {
    totalClients: patches.reduce((sum, patch) => sum + patch.clientCount, 0),
    totalStaff: patches.reduce((sum, patch) => sum + patch.staffCount, 0),
    totalAvailable: patches.reduce((sum, patch) => sum + patch.availableStaff, 0),
    totalPending: patches.reduce((sum, patch) => sum + patch.pendingClients, 0),
    averageRatio: patches.reduce((sum, patch) => sum + (patch.clientCount / patch.staffCount), 0) / patches.length,
  };

  const getRatioColor = (ratio: number) => {
    if (ratio < 3) return 'text-green-600';
    if (ratio < 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage >= 70) return 'bg-green-100 text-green-800';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patches Management</h1>
          <p className="text-gray-600">Manage geographical patches and district assignments</p>
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
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{totalMetrics.totalClients}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{totalMetrics.totalStaff}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Staff</p>
              <p className="text-2xl font-bold text-green-600">{totalMetrics.totalAvailable}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Clients</p>
              <p className="text-2xl font-bold text-yellow-600">{totalMetrics.totalPending}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Ratio</p>
              <p className="text-2xl font-bold text-gray-900">{totalMetrics.averageRatio.toFixed(1)}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Districts:</span>
            <div className="flex flex-wrap gap-2">
              {uniqueDistricts.map(district => (
                <label key={district} className="flex items-center space-x-1 cursor-pointer">
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
        </div>
      </div>

      {/* Patches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatches.map((patch) => {
          const ratio = patch.clientCount / patch.staffCount;
          const availabilityPercentage = (patch.availableStaff / patch.staffCount) * 100;
          
          return (
            <div key={patch.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patch.name}</h3>
                    <p className="text-sm text-gray-600">{patch.district}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Planner</span>
                  <span className="text-sm font-medium text-gray-900">{patch.planner}</span>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{patch.clientCount}</p>
                    <p className="text-xs text-gray-600">Clients</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{patch.staffCount}</p>
                    <p className="text-xs text-gray-600">Staff</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{patch.availableStaff}</p>
                    <p className="text-xs text-gray-600">Available</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-yellow-600">{patch.pendingClients}</p>
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Client/Staff Ratio</span>
                    <span className={`text-sm font-medium ${getRatioColor(ratio)}`}>
                      {ratio.toFixed(1)}:1
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Staff Availability</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(patch.availableStaff, patch.staffCount)}`}>
                      {availabilityPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Workload: {ratio < 3 ? 'Low' : ratio < 5 ? 'Medium' : 'High'}</span>
                    <span>Coverage: {availabilityPercentage >= 70 ? 'Good' : availabilityPercentage >= 50 ? 'Fair' : 'Poor'}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatchesManagement;