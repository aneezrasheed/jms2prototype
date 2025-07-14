import React from 'react';
import { useApp } from '../contexts/AppContext';
import Dashboard from './dashboard/Dashboard';
import RotaManagement from './rota/RotaManagement';
import ClientManagement from './clients/ClientManagement';
import AddClientForm from './clients/AddClientForm';
import StaffManagement from './staff/StaffManagement';
import AddStaffForm from './staff/AddStaffForm';
import EMARManagement from './emar/EMARManagement';
import PatchesManagement from './patches/PatchesManagement';
import ReportsManagement from './reports/ReportsManagement';
import TimesheetManagement from './timesheets/TimesheetManagement';
import IncidentManagement from './incidents/IncidentManagement';
import AddIncidentForm from './incidents/AddIncidentForm';

const ViewRenderer: React.FC = () => {
  const { state } = useApp();

  const renderView = () => {
    switch (state.currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'rota':
        return <RotaManagement />;
      case 'clients':
        return <ClientManagement />;
      case 'add-client':
        return <AddClientForm />;
      case 'staff':
        return <StaffManagement />;
      case 'add-staff':
        return <AddStaffForm />;
      case 'emar':
        return <EMARManagement />;
      case 'patches':
        return <PatchesManagement />;
      case 'timesheet':
        return <TimesheetManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'incidents':
        return <IncidentManagement />;
      case 'add-incident':
        return <AddIncidentForm />;
      case 'settings':
        return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600">Coming soon...</p></div>;
      default:
        return <Dashboard />;
    }
  };

  return renderView();
};

export default ViewRenderer;