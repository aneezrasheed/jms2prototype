import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  MapPin,
  Phone,
  Car,
  Clock,
  Award,
  Languages,
  ChevronDown,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { mockStaff } from '../../data/mockData';
import { Staff } from '../../types';

const StaffManagement: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [patchFilter, setPatchFilter] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [showDistrictFilter, setShowDistrictFilter] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isDefaultScreen, setIsDefaultScreen] = useState(false);

  const staff = mockStaff;
  const districts = ['Central', 'North', 'South', 'East', 'West', 'Northeast', 'Southeast', 'Northwest'];

  const handleDistrictChange = (district: string) => {
    setSelectedDistricts(prev => 
      prev.includes(district) 
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.idNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesPatch = patchFilter === 'all' || member.patches.includes(patchFilter);
    const matchesDistrict = selectedDistricts.length === 0 || 
      selectedDistricts.some(d => member.patches.includes(d));
    return matchesSearch && matchesStatus && matchesPatch && matchesDistrict;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'training':
        return 'bg-blue-100 text-blue-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransportIcon = (transport: string) => {
    switch (transport) {
      case 'car':
        return <Car className="w-4 h-4" />;
      case 'bicycle':
        return <Car className="w-4 h-4" />; // Using car icon as placeholder
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  const handleViewStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setActiveTab(0);
  };

  const handleEditStaff = (staff: Staff) => {
    setEditingStaff(staff);
    setActiveTab(0);
  };

  const uniquePatches = [...new Set(staff.flatMap(s => s.patches))];

  const metrics = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    onLeave: staff.filter(s => s.status === 'leave').length,
    training: staff.filter(s => s.status === 'training').length,
  };

  // Staff Details Modal Component
  const StaffDetailsModal = ({ staff, onClose }: { staff: Staff; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Staff Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200">
          {['Personal Information', 'Contact Information', 'Work Information', 'Performance Metrics'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === index
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{staff.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ID Number</p>
                  <p className="font-medium text-gray-900">{staff.idNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-medium text-gray-900">{staff.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transport</p>
                  <p className="font-medium text-gray-900">{staff.transport}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{staff.contactInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{staff.contactInfo.email}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{staff.contactInfo.address}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Work Information</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Patches</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {staff.patches.map((patch, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {patch}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Languages</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {staff.languages.map((language, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {staff.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{staff.metrics.totalHours}</p>
                  <p className="text-sm text-gray-600">Total Hours</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{staff.metrics.mileage}</p>
                  <p className="text-sm text-gray-600">Mileage</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{staff.metrics.shiftsCompleted}</p>
                  <p className="text-sm text-gray-600">Shifts Completed</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Staff Edit Modal Component
  const StaffEditModal = ({ staff, onClose }: { staff: Staff; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Edit Staff - {staff.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200">
          {['Personal Details', 'Contact Details', 'Work Settings', 'Availability'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === index
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Personal Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    defaultValue={staff.name}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                  <input
                    type="text"
                    defaultValue={staff.idNumber}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    defaultValue={staff.gender}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transport</label>
                  <select
                    defaultValue={staff.transport}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="car">Car</option>
                    <option value="public">Public Transport</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="walking">Walking</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Contact Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    defaultValue={staff.contactInfo.phone}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={staff.contactInfo.email}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    defaultValue={staff.contactInfo.address}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Work Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    defaultValue={staff.status}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="leave">On Leave</option>
                    <option value="training">Training</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    defaultValue={staff.role || 'carer'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="carer">Carer</option>
                    <option value="planner-admin">Planner/Admin</option>
                    <option value="assessor">Assessor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Patches</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {districts.map(district => (
                    <label key={district} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={staff.patches.includes(district)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{district}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Availability Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={staff.availability.am}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Available for AM shifts</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={staff.availability.pm}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Available for PM shifts</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={staff.availability.fullDay}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Available for full day shifts</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle save logic here
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage care staff and their assignments</p>
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
            onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'add-staff' })}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{metrics.active}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.onLeave}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Training</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.training}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-blue-600" />
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
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="leave">On Leave</option>
              <option value="training">Training</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <select
              value={patchFilter}
              onChange={(e) => setPatchFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Patches</option>
              {uniquePatches.map(patch => (
                <option key={patch} value={patch}>{patch}</option>
              ))}
            </select>
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

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staffMember) => (
          <div key={staffMember.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{staffMember.name}</h3>
                  <p className="text-sm text-gray-600">ID: {staffMember.idNumber}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(staffMember.status)}`}>
                {staffMember.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{staffMember.contactInfo.phone}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {getTransportIcon(staffMember.transport)}
                <span className="capitalize">{staffMember.transport}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{staffMember.patches.join(', ')}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Languages className="w-4 h-4" />
                <span>{staffMember.languages.join(', ')}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-1">
                {staffMember.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {skill}
                  </span>
                ))}
                {staffMember.skills.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{staffMember.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {staffMember.availability.am && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">AM</span>
                )}
                {staffMember.availability.pm && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">PM</span>
                )}
                {staffMember.availability.fullDay && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Full Day</span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600">Hours: <span className="font-medium text-gray-900">{staffMember.metrics.totalHours}</span></p>
                  <p className="text-gray-600">Shifts: <span className="font-medium text-gray-900">{staffMember.metrics.shiftsCompleted}</span></p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewStaff(staffMember)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditStaff(staffMember)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {selectedStaff && (
        <StaffDetailsModal staff={selectedStaff} onClose={() => setSelectedStaff(null)} />
      )}

      {editingStaff && (
        <StaffEditModal staff={editingStaff} onClose={() => setEditingStaff(null)} />
      )}
    </div>
  );
};

export default StaffManagement;