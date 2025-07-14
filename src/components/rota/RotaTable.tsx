import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import '../../styles/rota.css';

interface Staff {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  availability: string;
}

interface Shift {
  id: string;
  staffId?: string;
  staffName?: string;
  startTime: string;
  endTime: string;
  status?: 'late' | 'early' | 'ontime';
}

interface Client {
  id: string;
  name: string;
  age: number;
  level: string;
  address: string;
  amShifts: (Shift | null)[];
  pmShifts: (Shift | null)[];
}

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (staffId: string) => void;
  availableStaff: Staff[];
  shiftTime: string;
  clientName: string;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  availableStaff,
  shiftTime,
  clientName
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

  if (!isOpen) return null;

  const handleAssign = () => {
    if (selectedStaffId) {
      onAssign(selectedStaffId);
      setSelectedStaffId('');
      onClose();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Assign Staff to Shift</h3>
          <p className="modal-subtitle">
            {clientName} - {shiftTime}
          </p>
        </div>
        
        <div className="modal-body">
          <div className="staff-list">
            {availableStaff.map((staff) => (
              <div
                key={staff.id}
                className={`staff-item ${selectedStaffId === staff.id ? 'selected' : ''}`}
                onClick={() => setSelectedStaffId(staff.id)}
              >
                <div className="staff-avatar">
                  {staff.avatar ? (
                    <img src={staff.avatar} alt={staff.name} />
                  ) : (
                    getInitials(staff.name)
                  )}
                </div>
                <div className="staff-info">
                  <p className="staff-name">{staff.name}</p>
                  <p className="staff-role">{staff.role}</p>
                  <p className="staff-availability">{staff.availability}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleAssign}
            disabled={!selectedStaffId}
          >
            Assign Staff
          </button>
        </div>
      </div>
    </div>
  );
};

const ShiftCard: React.FC<{
  shift: Shift | null;
  onAssign: () => void;
}> = ({ shift, onAssign }) => {
  if (!shift) {
    return (
      <div className="shift-card shift-card-unassigned" onClick={onAssign}>
        <div className="unassigned-card">
          <p className="unassigned-text">Unassigned</p>
          <button className="add-shift-btn">
            <Plus size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shift-card shift-card-assigned">
      <p className="shift-staff-name">{shift.staffName}</p>
      <p className="shift-time">{shift.startTime} - {shift.endTime}</p>
      {shift.status && (
        <span className={`shift-status shift-status-${shift.status}`}>
          {shift.status === 'late' ? 'Late' : shift.status === 'early' ? 'Early' : 'On Time'}
        </span>
      )}
    </div>
  );
};

const RotaTable: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<{
    clientId: string;
    shiftIndex: number;
    period: 'am' | 'pm';
    time: string;
    clientName: string;
  } | null>(null);

  // Mock data
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      age: 78,
      level: 'Level 1',
      address: 'Sheffield S1 2AB',
      amShifts: [
        { id: 'am1-1', staffId: '1', staffName: 'Emily Johnson', startTime: '8:00 AM', endTime: '9 AM', status: 'late' },
        { id: 'am1-2', staffId: '2', staffName: 'John Carter', startTime: '9:00 AM', endTime: '9:30 AM' },
        { id: 'am1-3', staffId: '3', staffName: 'Steve M', startTime: '10:00 AM', endTime: '11 AM' },
        { id: 'am2-1', staffId: '4', staffName: 'Emma Brooks', startTime: '11:00 AM', endTime: '12 AM' },
        { id: 'am2-2', staffId: '5', staffName: 'Javier Ortega', startTime: '11:00 AM', endTime: '12 AM' },
        { id: 'am2-3', staffId: '6', staffName: 'William Foster', startTime: '11:00 AM', endTime: '12 AM' }
      ],
      pmShifts: [
        null,
        { id: 'pm1-2', staffId: '2', staffName: 'John Carter', startTime: '3 PM', endTime: '3:30 AM' },
        { id: 'pm1-3', staffId: '3', staffName: 'Steve M', startTime: '4 PM', endTime: '4:30 PM' },
        { id: 'pm2-1', staffId: '4', staffName: 'Emma Brooks', startTime: '6:30 PM', endTime: '7 PM' },
        { id: 'pm2-2', staffId: '5', staffName: 'Javier Ortega', startTime: '8 PM', endTime: '10 PM' },
        null
      ]
    },
    {
      id: '2',
      name: 'Margaret Thompson',
      age: 82,
      level: 'Level 2',
      address: 'Sheffield S2 3CD',
      amShifts: [
        { id: 'am1-1', staffId: '1', staffName: 'Emily Johnson', startTime: '8:00 AM', endTime: '9 AM' },
        null,
        { id: 'am1-3', staffId: '3', staffName: 'Steve M', startTime: '10:00 AM', endTime: '11 AM' },
        { id: 'am2-1', staffId: '4', staffName: 'Emma Brooks', startTime: '11:00 AM', endTime: '12 AM' },
        null,
        { id: 'am2-3', staffId: '6', staffName: 'William Foster', startTime: '11:00 AM', endTime: '12 AM' }
      ],
      pmShifts: [
        { id: 'pm1-1', staffId: '1', staffName: 'Emily Johnson', startTime: '2 PM', endTime: '3 PM' },
        { id: 'pm1-2', staffId: '2', staffName: 'John Carter', startTime: '3 PM', endTime: '3:30 PM' },
        null,
        null,
        { id: 'pm2-2', staffId: '5', staffName: 'Javier Ortega', startTime: '8 PM', endTime: '10 PM' },
        { id: 'pm2-3', staffId: '6', staffName: 'William Foster', startTime: '9 PM', endTime: '11 PM' }
      ]
    },
    {
      id: '3',
      name: 'Robert Davies',
      age: 75,
      level: 'Level 3',
      address: 'Sheffield S3 4EF',
      amShifts: [
        null,
        { id: 'am1-2', staffId: '2', staffName: 'John Carter', startTime: '9:00 AM', endTime: '9:30 AM' },
        null,
        null,
        { id: 'am2-2', staffId: '5', staffName: 'Javier Ortega', startTime: '11:00 AM', endTime: '12 AM' },
        { id: 'am2-3', staffId: '6', staffName: 'William Foster', startTime: '11:00 AM', endTime: '12 AM' }
      ],
      pmShifts: [
        { id: 'pm1-1', staffId: '1', staffName: 'Emily Johnson', startTime: '2 PM', endTime: '3 PM' },
        null,
        { id: 'pm1-3', staffId: '3', staffName: 'Steve M', startTime: '4 PM', endTime: '4:30 PM' },
        { id: 'pm2-1', staffId: '4', staffName: 'Emma Brooks', startTime: '6:30 PM', endTime: '7 PM' },
        null,
        null
      ]
    }
  ]);

  const availableStaff: Staff[] = [
    { id: '1', name: 'Emily Johnson', role: 'Senior Carer', availability: 'Available AM/PM' },
    { id: '2', name: 'John Carter', role: 'Carer', availability: 'Available AM only' },
    { id: '3', name: 'Steve Mitchell', role: 'Carer', availability: 'Available PM only' },
    { id: '4', name: 'Emma Brooks', role: 'Senior Carer', availability: 'Available AM/PM' },
    { id: '5', name: 'Javier Ortega', role: 'Carer', availability: 'Available AM/PM' },
    { id: '6', name: 'William Foster', role: 'Carer', availability: 'Available PM only' },
    { id: '7', name: 'Sarah Ahmed', role: 'Senior Carer', availability: 'Available AM/PM' },
    { id: '8', name: 'Michael Chen', role: 'Carer', availability: 'Available AM only' }
  ];

  const handleAssignShift = (clientId: string, shiftIndex: number, period: 'am' | 'pm') => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const timeSlots = {
      am: ['8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM'],
      pm: ['2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM']
    };

    setSelectedAssignment({
      clientId,
      shiftIndex,
      period,
      time: timeSlots[period][shiftIndex],
      clientName: client.name
    });
    setModalOpen(true);
  };

  const handleStaffAssignment = (staffId: string) => {
    if (!selectedAssignment) return;

    const staff = availableStaff.find(s => s.id === staffId);
    if (!staff) return;

    setClients(prevClients => 
      prevClients.map(client => {
        if (client.id === selectedAssignment.clientId) {
          const newShift: Shift = {
            id: `${selectedAssignment.period}${selectedAssignment.shiftIndex}-${Date.now()}`,
            staffId: staffId,
            staffName: staff.name,
            startTime: selectedAssignment.time.split(' - ')[0],
            endTime: selectedAssignment.time.split(' - ')[1]
          };

          if (selectedAssignment.period === 'am') {
            const newAmShifts = [...client.amShifts];
            newAmShifts[selectedAssignment.shiftIndex] = newShift;
            return { ...client, amShifts: newAmShifts };
          } else {
            const newPmShifts = [...client.pmShifts];
            newPmShifts[selectedAssignment.shiftIndex] = newShift;
            return { ...client, pmShifts: newPmShifts };
          }
        }
        return client;
      })
    );

    setSelectedAssignment(null);
  };

  const renderShiftStack = (shifts: (Shift | null)[], clientId: string, period: 'am' | 'pm', stackIndex: number) => {
    const startIndex = stackIndex * 3;
    const stackShifts = shifts.slice(startIndex, startIndex + 3);

    return (
      <div className="shift-stack">
        {stackShifts.map((shift, index) => (
          <ShiftCard
            key={`${period}-${startIndex + index}`}
            shift={shift}
            onAssign={() => handleAssignShift(clientId, startIndex + index, period)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="rota-container">
      <div className="rota-header">
        <h2 className="rota-title">Staff Rota</h2>
        <p className="rota-date">Wednesday, January 24, 2024</p>
      </div>

      <div className="rota-scroll-container">
        <table className="rota-table">
          <thead className="rota-table-header">
            <tr>
              <th>Staff</th>
              <th>AM</th>
              <th>PM</th>
            </tr>
          </thead>
          <tbody className="rota-table-body">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="client-info">
                  <p className="client-name">{client.name}</p>
                  <p className="client-details">Age {client.age}</p>
                  <p className="client-details">{client.address}</p>
                  <span className="client-level">{client.level}</span>
                </td>
                <td className="shift-section">
                  <div className="shift-stacks">
                    {renderShiftStack(client.amShifts, client.id, 'am', 0)}
                    {renderShiftStack(client.amShifts, client.id, 'am', 1)}
                  </div>
                </td>
                <td className="shift-section">
                  <div className="shift-stacks">
                    {renderShiftStack(client.pmShifts, client.id, 'pm', 0)}
                    {renderShiftStack(client.pmShifts, client.id, 'pm', 1)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AssignmentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedAssignment(null);
        }}
        onAssign={handleStaffAssignment}
        availableStaff={availableStaff}
        shiftTime={selectedAssignment?.time || ''}
        clientName={selectedAssignment?.clientName || ''}
      />
    </div>
  );
};

export default RotaTable;