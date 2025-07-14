import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Client, Staff, EMAREntry, Visit, Patch, DashboardMetrics, ActivityLogEntry } from '../types';

interface AppState {
  clients: Client[];
  staff: Staff[];
  emarEntries: EMAREntry[];
  visits: Visit[];
  patches: Patch[];
  dashboardMetrics: DashboardMetrics;
  activityLog: ActivityLogEntry[];
  currentView: string;
  selectedPatch: string | null;
  selectedClient: Client | null;
  selectedStaff: Staff | null;
}

type AppAction = 
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'SET_STAFF'; payload: Staff[] }
  | { type: 'SET_CURRENT_VIEW'; payload: string }
  | { type: 'SET_SELECTED_PATCH'; payload: string | null }
  | { type: 'SET_SELECTED_CLIENT'; payload: Client | null }
  | { type: 'SET_SELECTED_STAFF'; payload: Staff | null }
  | { type: 'UPDATE_EMAR_ENTRY'; payload: EMAREntry }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'ADD_STAFF'; payload: Staff }
  | { type: 'UPDATE_STAFF'; payload: Staff };

const initialState: AppState = {
  clients: [],
  staff: [],
  emarEntries: [],
  visits: [],
  patches: [],
  dashboardMetrics: {
    activeClients: 0,
    staffOnDuty: 0,
    pendingClients: 0,
    activeAlerts: 0,
    incidentReports: 0,
    pendingAssessments: 0,
    clientsEndingSoon: 0,
    staffOnLeave: 0,
  },
  activityLog: [],
  currentView: 'dashboard',
  selectedPatch: null,
  selectedClient: null,
  selectedStaff: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'SET_STAFF':
      return { ...state, staff: action.payload };
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_SELECTED_PATCH':
      return { ...state, selectedPatch: action.payload };
    case 'SET_SELECTED_CLIENT':
      return { ...state, selectedClient: action.payload };
    case 'SET_SELECTED_STAFF':
      return { ...state, selectedStaff: action.payload };
    case 'UPDATE_EMAR_ENTRY':
      return {
        ...state,
        emarEntries: state.emarEntries.map(entry =>
          entry.id === action.payload.id ? action.payload : entry
        ),
      };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        ),
      };
    case 'ADD_STAFF':
      return { ...state, staff: [...state.staff, action.payload] };
    case 'UPDATE_STAFF':
      return {
        ...state,
        staff: state.staff.map(staff =>
          staff.id === action.payload.id ? action.payload : staff
        ),
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};