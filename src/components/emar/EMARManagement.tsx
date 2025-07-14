import React, { useState } from 'react';
import { 
  Pill, 
  Clock, 
  Check, 
  X, 
  AlertTriangle, 
  User,
  Calendar,
  Search,
  Filter,
  FileText,
  History,
  ToggleLeft,
  ToggleRight,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { mockClients, mockEMARHistory } from '../../data/mockData';
import { Client, Medication } from '../../types';

const EMARManagement: React.FC = () => {
  const { state } = useApp();
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'daily' | 'history'>('daily');
  const [historyDateFilter, setHistoryDateFilter] = useState<string>('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isDefaultScreen, setIsDefaultScreen] = useState(false);
  const [showDistrictFilter, setShowDistrictFilter] = useState(false);

  const clients = mockClients;
  const client = clients.find(c => c.id === selectedClient);
  const emarHistory = mockEMARHistory;
  const districts = ['Central', 'North', 'South', 'East', 'West', 'Northeast', 'Southeast', 'Northwest'];

  const handleDistrictChange = (district: string) => {
    setSelectedDistricts(prev => 
      prev.includes(district) 
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(client.patch);
    return matchesSearch && matchesDistrict;
  });

  const [medicationStates, setMedicationStates] = useState<{[key: string]: {
    status: 'pending' | 'administered' | 'skipped' | 'refused';
    reason?: string;
    time?: string;
    notes?: string;
  }}>({});

  const [medicationNotes, setMedicationNotes] = useState<{[key: string]: string}>({});

  const refusalReasons = [
    'Client refused medication',
    'Client was asleep',
    'Client was not present',
    'Medication not available',
    'Client felt unwell',
    'Doctor advised to stop',
    'Other'
  ];

  const handleMedicationAction = (medicationId: string, action: 'administered' | 'skipped' | 'refused', reason?: string, notes?: string) => {
    setMedicationStates(prev => ({
      ...prev,
      [medicationId]: {
        status: action,
        reason,
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        notes
      }
    }));
  };

  const getMedicationStatus = (medicationId: string) => {
    return medicationStates[medicationId] || { status: 'pending' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'administered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'refused':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const parseTime = (timeStr: string) => {
    return timeStr.split(', ').map(t => t.trim());
  };

  const isTimeOverdue = (scheduledTime: string) => {
    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const scheduled = new Date();
    scheduled.setHours(hours, minutes, 0, 0);
    
    return now > scheduled;
  };

  const generateDailySummary = () => {
    if (!client) return { administered: 0, pending: 0, missed: 0 };
    
    let administered = 0, pending = 0, missed = 0;
    
    client.medications.forEach(medication => {
      const status = getMedicationStatus(medication.id);
      const times = parseTime(medication.time);
      
      times.forEach(time => {
        if (status.status === 'administered') {
          administered++;
        } else if (isTimeOverdue(time)) {
          missed++;
        } else {
          pending++;
        }
      });
    });
    
    return { administered, pending, missed };
  };

  const summary = generateDailySummary();

  const renderDailyView = () => (
    <>
      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administered</p>
              <p className="text-2xl font-bold text-green-600">{summary.administered}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Missed</p>
              <p className="text-2xl font-bold text-red-600">{summary.missed}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Client Allergies */}
      {client?.allergies && client.allergies.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Known Allergies</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {client.allergies.map((allergy, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Medication Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Medication Chart</h3>
        </div>
        <div className="p-4">
          <div className="space-y-6">
            {client?.medications.map((medication) => {
              const times = parseTime(medication.time);
              return (
                <div key={medication.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Pill className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{medication.name}</h4>
                        <p className="text-sm text-gray-600">{medication.dosage}</p>
                        <p className="text-sm text-gray-600">{medication.frequency}</p>
                        <p className="text-sm text-gray-500 mt-1">{medication.instructions}</p>
                        {medication.route && (
                          <p className="text-sm text-gray-500">Route: {medication.route}</p>
                        )}
                      </div>
                    </div>
                    {medication.lowStock && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    )}
                  </div>

                  {/* Notes Section */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={medicationNotes[medication.id] || ''}
                      onChange={(e) => setMedicationNotes(prev => ({ ...prev, [medication.id]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Add notes about this medication..."
                    />
                  </div>

                  <div className="space-y-3">
                    {times.map((time, index) => {
                      const medicationTimeId = `${medication.id}-${index}`;
                      const status = getMedicationStatus(medicationTimeId);
                      const isOverdue = isTimeOverdue(time) && status.status === 'pending';
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                {time}
                              </span>
                              {isOverdue && (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status.status)}`}>
                              {status.status}
                            </span>
                            {status.time && (
                              <span className="text-xs text-gray-500">
                                at {status.time}
                              </span>
                            )}
                          </div>
                          
                          {status.status === 'pending' && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleMedicationAction(medicationTimeId, 'administered', undefined, medicationNotes[medication.id])}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                <Check className="w-3 h-3" />
                                <span>Administered</span>
                              </button>
                              <button
                                onClick={() => handleMedicationAction(medicationTimeId, 'skipped', 'Carer decision', medicationNotes[medication.id])}
                                className="flex items-center space-x-1 px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                              >
                                <Clock className="w-3 h-3" />
                                <span>Skipped</span>
                              </button>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleMedicationAction(medicationTimeId, 'refused', e.target.value, medicationNotes[medication.id]);
                                  }
                                }}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                <option value="">Refused</option>
                                {refusalReasons.map(reason => (
                                  <option key={reason} value={reason}>{reason}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {status.status !== 'pending' && status.reason && (
                            <span className="text-xs text-gray-500">
                              Reason: {status.reason}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  const renderHistoryView = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Medication History</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={historyDateFilter}
              onChange={(e) => setHistoryDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {emarHistory.map((entry) => (
            <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Pill className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{entry.medicationName}</h4>
                    <p className="text-sm text-gray-600">{entry.dosage} at {entry.scheduledTime}</p>
                    <p className="text-sm text-gray-500">Administered by: {entry.carerName}</p>
                    {entry.notes && (
                      <p className="text-sm text-gray-600 mt-1">Notes: {entry.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                    {entry.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(entry.timestamp).toLocaleDateString('en-GB')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              {entry.reason && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                  Reason: {entry.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">EMAR Management</h1>
          <p className="text-gray-600">Electronic Medication Administration Record</p>
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
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Client Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Client</option>
              {filteredClients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
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
          
          {viewMode === 'daily' && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {selectedClient && client && (
        <>
          {/* Client Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.age} years • {client.address}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {viewMode === 'daily' ? 'Date' : 'History View'}
                </p>
                <p className="font-medium text-gray-900">
                  {viewMode === 'daily' 
                    ? new Date(selectedDate).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : `Showing medication history`
                  }
                </p>
              </div>
            </div>
          </div>

          {viewMode === 'daily' ? renderDailyView() : renderHistoryView()}
        </>
      )}

      {!selectedClient && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Pill className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No client selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select a client to view their medication chart
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EMARManagement;