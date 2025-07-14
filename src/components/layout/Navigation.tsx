import React from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  UserCheck, 
  Pill, 
  Clock, 
  Map, 
  Settings,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Navigation: React.FC = () => {
  const { state, dispatch } = useApp();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'rota', label: 'Rota Management', icon: Calendar },
    { id: 'clients', label: 'Client Management', icon: Users },
    { id: 'staff', label: 'Staff Management', icon: UserCheck },
    { id: 'emar', label: 'EMAR', icon: Pill },
    { id: 'timesheet', label: 'Timesheets', icon: Clock },
    { id: 'patches', label: 'Patches', icon: Map },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-gray-900 text-white w-64 min-h-screen">
      <div className="p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: item.id })}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;