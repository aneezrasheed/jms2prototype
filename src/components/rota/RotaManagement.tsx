import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Search, 
  Filter,
  ChevronDown,
  X,
  Eye,
  UserPlus,
  ToggleLeft,
  ToggleRight,
  Check
} from 'lucide-react';
import { mockStaff, mockClients, mockPatches } from '../../data/mockData';

const RotaManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<'day-staff' | 'day-client' | 'week-staff' | 'week-client'>('day-staff');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [serviceLevelFilter, setServiceLevelFilter] = useState<string>('all');
  const [showDistrictFilter, setShowDistrictFilter] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isDefaultScreen, setIsDefaultScreen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [showCarerAssignment, setShowCarerAssignment] = useState(false);

  const staff = mockStaff;
  const clients = mockClients;
  const districts = ['Central', 'North', 'South', 'East', 'West', 'Northeast', 'Southeast', 'Northwest'];

  // Mock data for shifts and alerts
  const mockShifts = [
    { id: 1, staffId: 'staff-1', clientId: '1', time: 'am', scheduledStart: '08:00', scheduledEnd: '10:00', actualStart: '07:55', actualEnd: '10:05', status: 'completed' },
    { id: 2, staffId: 'staff-1', clientId: '2', time: 'am', scheduledStart: '10:30', scheduledEnd: '12:30', actualStart: '10:35', actualEnd: '12:25', status: 'completed' },
    { id: 3, staffId: 'staff-2', clientId: '3', time: 'pm', scheduledStart: '16:00', scheduledEnd: '18:00', actualStart: null, actualEnd: null, status: 'scheduled' },
  ];

  const mockAlerts = [
    { id: 1, type: 'unassigned-client', message: 'Margaret Thompson needs AM carer', priority: 'critical', clientId: '1', district: 'Central' },
    { id: 2, type: 'staff-shortage', message: 'North district understaffed', priority: 'high', district: 'North' },
    { id: 3, type: 'medication-reminder', message: 'Robert Davies - medication due', priority: 'medium', clientId: '2', district: 'North' },
    { id: 4, type: 'unassigned-shift', message: 'PM shift unassigned - Dorothy Williams', priority: 'critical', clientId: '3', district: 'South' },
  ];

  const handleDistrictChange = (district: string) => {
    setSelectedDistricts(prev => 
      prev.includes(district) 
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const getServiceLevelText = (level: string) => {
    switch (level) {
      case '1': return 'Level 1';
      case '2': return 'Level 2';
      case '3': return 'Level 3';
      case '4': return 'Level 4';
      default: return level;
    }
  };

  const getServiceLevelColor = (level: string) => {
    switch (level) {
      case '1': return 'bg-green-100 text-green-800';
      case '2': return 'bg-yellow-100 text-yellow-800';
      case '3': return 'bg-orange-100 text-orange-800';
      case '4': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimingColor = (scheduled: string, actual: string | null) => {
    if (!actual) return 'text-gray-500';
    const scheduledTime = new Date(`2024-01-01T${scheduled}`);
    const actualTime = new Date(`2024-01-01T${actual}`);
    const diff = (actualTime.getTime() - scheduledTime.getTime()) / (1000 * 60);
    
    if (diff <= 0) return 'text-green-600'; // Early or on time
    if (diff <= 5) return 'text-yellow-600'; // Slightly late
    return 'text-red-600'; // Significantly late
  };

  // Filter alerts based on selected districts
  const filteredAlerts = mockAlerts.filter(alert => {
    if (selectedDistricts.length === 0) return true;
    return selectedDistricts.includes(alert.district);
  }).sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  const handleAlertClick = (alert: any) => {
    setSelectedAlert(alert);
  };

  const resolveAlert = (alertId: number) => {
    console.log(`Resolving alert ${alertId}`);
    setSelectedAlert(null);
  };

  const handleShiftClick = (shift: any, type: 'client' | 'staff') => {
    if (type === 'client') {
      const client = clients.find(c => c.id === shift.clientId);
      setSelectedClient(client);
    } else {
      const staffMember = staff.find(s => s.id === shift.staffId);
      setSelectedStaff(staffMember);
    }
  };

  const handleUnassignedShiftClick = (client: any) => {
    setSelectedShift(client);
    setShowCarerAssignment(true);
  };

  const assignCarer = (carerId: string, clientId: string) => {
    console.log(`Assigning carer ${carerId} to client ${clientId}`);
    setShowCarerAssignment(false);
    setSelectedShift(null);
  };

  // Carer Assignment Modal
  const CarerAssignmentModal = ({ client, onClose }: { client: any; onClose: () => void }) => {
    const clientDistrict = client.patch;
    const sameDistrictCarers = staff.filter(s => s.patches.includes(clientDistrict) && s.status === 'active');
    const otherDistrictCarers = staff.filter(s => !s.patches.includes(clientDistrict) && s.status === 'active');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Assign Carer - {client.name}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
            {/* Same District Carers */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Available in {clientDistrict} District</h4>
              <div className="space-y-3">
                {sameDistrictCarers.map((carer) => (
                  <div key={carer.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{carer.name}</p>
                        <p className="text-sm text-gray-600">{carer.patches.join(', ')}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {carer.availability.am && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">AM</span>}
                          {carer.availability.pm && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">PM</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => assignCarer(carer.id, client.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Other District Carers */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Available in Other Districts</h4>
              <div className="space-y-3">
                {otherDistrictCarers.map((carer) => (
                  <div key={carer.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 opacity-75">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{carer.name}</p>
                        <p className="text-sm text-gray-600">{carer.patches.join(', ')}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {carer.availability.am && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">AM</span>}
                          {carer.availability.pm && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">PM</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => assignCarer(carer.id, client.id)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Assign (Cross-District)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDayStaffView = () => (
    <div className="space-y-6">
      {/* Unassigned Shifts Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-800">Unassigned Shifts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div 
            onClick={() => handleUnassignedShiftClick(clients[0])}
            className="p-3 bg-white border border-red-200 rounded-lg cursor-pointer hover:bg-red-50 transition-colors"
          >
            <p className="font-medium text-gray-900">{clients[0].name}</p>
            <p className="text-sm text-red-600">AM Shift - No Carer Assigned</p>
            <p className="text-xs text-gray-500">{clients[0].address}</p>
          </div>
        </div>
      </div>

      {/* Staff Cards - 3 columns layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {staff.map((staffMember) => (
          <div key={staffMember.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Staff Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{staffMember.name}</h3>
                    <p className="text-sm text-gray-600">{staffMember.patches.join(', ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStaff(staffMember)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AM Shifts */}
            <div className="p-4">
              <div className="text-center mb-3">
                <h4 className="font-medium text-gray-900 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full text-sm">
                  AM Shifts (07:00 - 14:00)
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((shiftNum) => {
                  const shift = mockShifts.find(s => s.staffId === staffMember.id && s.time === 'am');
                  const client = shift ? clients.find(c => c.id === shift.clientId) : null;
                  
                  return (
                    <div 
                      key={`am-${shiftNum}`} 
                      onClick={() => client && handleShiftClick(shift, 'client')}
                      className={`p-3 border rounded-lg text-xs cursor-pointer transition-all hover:shadow-md ${
                        client ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200' : 
                        'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {client ? (
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getServiceLevelColor(client.serviceLevel)}`}>
                            {getServiceLevelText(client.serviceLevel)}
                          </span>
                          <p className="text-gray-600">Stop {shiftNum}</p>
                          <div className="space-y-1">
                            <p className="text-gray-600">Scheduled: {shift?.scheduledStart} - {shift?.scheduledEnd}</p>
                            {shift?.actualStart && (
                              <p className={getTimingColor(shift.scheduledStart, shift.actualStart)}>
                                Actual: {shift.actualStart} - {shift.actualEnd}
                              </p>
                            )}
                          </div>
                          {shiftNum < 6 && <p className="text-gray-500">Travel: 15 min</p>}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <p>Unassigned</p>
                          <button className="text-blue-600 hover:text-blue-700 text-xs mt-1 font-medium">
                            + Assign
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PM Shifts */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-center mb-3">
                <h4 className="font-medium text-gray-900 bg-gradient-to-r from-purple-100 to-indigo-100 px-3 py-1 rounded-full text-sm">
                  PM Shifts (16:00 - 22:00)
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((shiftNum) => {
                  const shift = mockShifts.find(s => s.staffId === staffMember.id && s.time === 'pm');
                  const client = shift ? clients.find(c => c.id === shift.clientId) : null;
                  
                  return (
                    <div 
                      key={`pm-${shiftNum}`} 
                      onClick={() => client && handleShiftClick(shift, 'client')}
                      className={`p-3 border rounded-lg text-xs cursor-pointer transition-all hover:shadow-md ${
                        client ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200' : 
                        'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {client ? (
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getServiceLevelColor(client.serviceLevel)}`}>
                            {getServiceLevelText(client.serviceLevel)}
                          </span>
                          <p className="text-gray-600">Stop {shiftNum}</p>
                          <div className="space-y-1">
                            <p className="text-gray-600">Scheduled: {shift?.scheduledStart} - {shift?.scheduledEnd}</p>
                            {shift?.actualStart && (
                              <p className={getTimingColor(shift.scheduledStart, shift.actualStart)}>
                                Actual: {shift.actualStart} - {shift.actualEnd}
                              </p>
                            )}
                          </div>
                          {shiftNum < 6 && <p className="text-gray-500">Travel: 15 min</p>}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <p>Unassigned</p>
                          <button className="text-blue-600 hover:text-blue-700 text-xs mt-1 font-medium">
                            + Assign
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDayClientView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getServiceLevelColor(client.serviceLevel)}`}>
                    {getServiceLevelText(client.serviceLevel)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(client)}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{client.address}</span>
              </div>
              
              {/* AM Shift */}
              <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">AM Shift</h4>
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">Scheduled: 08:00 - 10:00</p>
                  <p className="text-green-600">Actual: 07:55 - 10:05</p>
                  <p className="font-medium text-gray-900">Carer: Jennifer Mills</p>
                </div>
              </div>

              {/* PM Shift */}
              <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">PM Shift</h4>
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">Scheduled: 16:00 - 18:00</p>
                  <p className="text-gray-500">Actual: Not started</p>
                  <p className="font-medium text-gray-900">Carer: Michael Chen</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWeekStaffView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((staffMember) => (
          <div key={staffMember.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{staffMember.name}</h3>
                  <p className="text-sm text-gray-600">{staffMember.patches.join(', ')}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaff(staffMember)}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center">
                  <p className="font-medium text-gray-700 mb-2">{day}</p>
                  <div className="space-y-1">
                    <div 
                      onClick={() => console.log(`${staffMember.name} - ${day} AM`)}
                      className="p-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded text-blue-800 cursor-pointer hover:from-blue-200 hover:to-blue-300 transition-all"
                    >
                      4/6
                    </div>
                    <div 
                      onClick={() => console.log(`${staffMember.name} - ${day} PM`)}
                      className="p-1 bg-gradient-to-r from-purple-100 to-purple-200 rounded text-purple-800 cursor-pointer hover:from-purple-200 hover:to-purple-300 transition-all"
                    >
                      3/6
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWeekClientView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getServiceLevelColor(client.serviceLevel)}`}>
                    {getServiceLevelText(client.serviceLevel)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(client)}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center">
                  <p className="font-medium text-gray-700 mb-2">{day}</p>
                  <div className="space-y-1">
                    {client.schedule.days.includes(day) && (
                      <>
                        {(client.schedule.type === 'am' || client.schedule.type === 'full-day') && (
                          <div 
                            onClick={() => console.log(`${client.name} - ${day} AM`)}
                            className="p-1 bg-gradient-to-r from-green-100 to-green-200 rounded text-green-800 cursor-pointer hover:from-green-200 hover:to-green-300 transition-all"
                          >
                            1/1
                          </div>
                        )}
                        {(client.schedule.type === 'pm' || client.schedule.type === 'full-day') && (
                          <div 
                            onClick={() => console.log(`${client.name} - ${day} PM`)}
                            className="p-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded text-blue-800 cursor-pointer hover:from-blue-200 hover:to-blue-300 transition-all"
                          >
                            1/1
                          </div>
                        )}
                      </>
                    )}
                    {!client.schedule.days.includes(day) && (
                      <div className="p-1 text-gray-400">×</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rota Management</h1>
          <p className="text-gray-600">Manage staff schedules and client assignments</p>
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
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => handleAlertClick(alert)}
              className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${getPriorityColor(alert.priority)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">{alert.message}</span>
                </div>
                <span className="text-xs font-medium">{alert.district}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentView('day-staff')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'day-staff'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Day - Staff
            </button>
            <button
              onClick={() => setCurrentView('day-client')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'day-client'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Day - Client
            </button>
            <button
              onClick={() => setCurrentView('week-staff')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'week-staff'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week - Staff
            </button>
            <button
              onClick={() => setCurrentView('week-client')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'week-client'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week - Client
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Service Level:</span>
              <select
                value={serviceLevelFilter}
                onChange={(e) => setServiceLevelFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
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
                  <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-3">
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
      </div>

      {/* Content */}
      {currentView === 'day-staff' && renderDayStaffView()}
      {currentView === 'day-client' && renderDayClientView()}
      {currentView === 'week-staff' && renderWeekStaffView()}
      {currentView === 'week-client' && renderWeekClientView()}

      {/* Alert Resolution Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Resolve Alert</h3>
              </div>
              <p className="text-gray-700 mb-4">{selectedAlert.message}</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => resolveAlert(selectedAlert.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Staff Details</h3>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">{selectedStaff.name}</h4>
                <p className="text-gray-600">{selectedStaff.contactInfo.phone}</p>
                <p className="text-gray-600">{selectedStaff.contactInfo.address}</p>
                <p className="text-gray-600">Live Location: Currently at {clients[0].address}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Client Details</h3>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">{selectedClient.name}</h4>
                <p className="text-gray-600">{selectedClient.address}</p>
                <p className="text-gray-600">Keybox: {selectedClient.keyboxCode}</p>
                <p className="text-gray-600">Service Level: {selectedClient.serviceLevel}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carer Assignment Modal */}
      {showCarerAssignment && selectedShift && (
        <CarerAssignmentModal 
          client={selectedShift} 
          onClose={() => setShowCarerAssignment(false)} 
        />
      )}
    </div>
  );
};

export default RotaManagement;