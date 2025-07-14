import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Car,
  Languages,
  Award,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Calendar,
  Clock
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Staff } from '../../types';

const AddStaffForm: React.FC = () => {
  const { dispatch } = useApp();
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    staffRefNumber: `SC${String(Date.now()).slice(-6)}`,
    gender: 'female' as 'male' | 'female' | 'other',
    phone: '',
    email: '',
    houseNumber: '',
    postcode: '',
    district: '',
    address: '',
    carReg: '',
    spokenLanguages: ['English'],
    otherLanguages: [] as string[],
    status: 'active' as 'active' | 'leave' | 'training' | 'sick' | 'inactive',
    role: 'carer' as 'carer' | 'planner-admin' | 'assessor',
    joinDate: '',
    leftDate: '',
    
    // Work Details
    transport: 'car' as 'car' | 'public' | 'bicycle' | 'walking',
    workSchedule: {
      monday: { am: false, pm: false, amStart: '07:00', amEnd: '14:00', pmStart: '16:00', pmEnd: '22:00' },
      tuesday: { am: false, pm: false, amStart: '07:00', amEnd: '14:00', pmStart: '16:00', pmEnd: '22:00' },
      wednesday: { am: false, pm: false, amStart: '07:00', amEnd: '14:00', pmStart: '16:00', pmEnd: '22:00' },
      thursday: { am: false, pm: false, amStart: '07:00', amEnd: '14:00', pmStart: '16:00', pmEnd: '22:00' },
      friday: { am: false, pm: false, amStart: '07:00', amEnd: '14:00', pmStart: '16:00', pmEnd: '22:00' },
      saturday: { am: false, pm: false, amStart: '07:00', amEnd: '14:00', pmStart: '16:00', pmEnd: '22:00' },
      sunday: { am: false, pm: false, amStart: '07:00', amEnd: '14:00', pmStart: '16:00', pmEnd: '22:00' }
    },
    schedulePreset: 'weekday-am' as 'weekday-am' | 'weekday-pm' | 'weekday-full' | 'weekend-am' | 'weekend-pm' | 'weekend-full' | 'custom',
    skills: [] as { name: string; certificationDate: string }[],
    preferredDistrict: '',
  });

  const tabs = ['Personal Details', 'Work Details'];

  const availableLanguages = ['Urdu', 'Arabic', 'Polish', 'Mandarin', 'Spanish', 'French', 'Hindi', 'Bengali'];
  const availableSkills = [
    'Medication Management', 'Personal Care', 'Mobility Support', 'Dementia Care',
    'Manual Handling', 'Wound Care', 'Feeding Assistance', 'Continence Care',
    'Mental Health Support', 'End of Life Care', 'First Aid', 'Catheter Care'
  ];
  const districts = ['Central', 'North', 'South', 'East', 'West', 'Northeast', 'Southeast', 'Northwest'];

  const schedulePresets = {
    'weekday-am': { days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], am: true, pm: false },
    'weekday-pm': { days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], am: false, pm: true },
    'weekday-full': { days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], am: true, pm: true },
    'weekend-am': { days: ['saturday', 'sunday'], am: true, pm: false },
    'weekend-pm': { days: ['saturday', 'sunday'], am: false, pm: true },
    'weekend-full': { days: ['saturday', 'sunday'], am: true, pm: true },
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const handleWorkScheduleChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        [day]: {
          ...prev.workSchedule[day as keyof typeof prev.workSchedule],
          [field]: value
        }
      }
    }));
  };

  const handleSchedulePresetChange = (preset: string) => {
    if (preset === 'custom') {
      setFormData(prev => ({ ...prev, schedulePreset: 'custom' }));
      return;
    }

    const presetConfig = schedulePresets[preset as keyof typeof schedulePresets];
    const newSchedule = { ...formData.workSchedule };
    
    // Reset all days
    daysOfWeek.forEach(day => {
      newSchedule[day as keyof typeof newSchedule] = {
        ...newSchedule[day as keyof typeof newSchedule],
        am: false,
        pm: false
      };
    });

    // Apply preset
    presetConfig.days.forEach(day => {
      newSchedule[day as keyof typeof newSchedule] = {
        ...newSchedule[day as keyof typeof newSchedule],
        am: presetConfig.am,
        pm: presetConfig.pm
      };
    });

    setFormData(prev => ({
      ...prev,
      schedulePreset: preset as any,
      workSchedule: newSchedule
    }));
  };

  const handleSkillChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', certificationDate: '' }]
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const cloneScheduleToAllDays = (sourceDay: string) => {
    const sourceSchedule = formData.workSchedule[sourceDay as keyof typeof formData.workSchedule];
    const newSchedule = { ...formData.workSchedule };
    
    daysOfWeek.forEach(day => {
      newSchedule[day as keyof typeof newSchedule] = { ...sourceSchedule };
    });
    
    setFormData(prev => ({ ...prev, workSchedule: newSchedule }));
  };

  const handleSubmit = () => {
    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`,
      staffRefNumber: formData.staffRefNumber,
      gender: formData.gender,
      contactInfo: {
        phone: formData.phone,
        email: formData.email,
        address: `${formData.postcode} - ${formData.houseNumber} ${formData.address}`,
      },
      transport: formData.transport,
      patches: [formData.preferredDistrict].filter(Boolean),
      languages: [...formData.spokenLanguages, ...formData.otherLanguages],
      skills: formData.skills.map(s => s.name),
      idNumber: formData.staffRefNumber,
      status: formData.status,
      role: formData.role,
      availability: {
        am: Object.values(formData.workSchedule).some(day => day.am),
        pm: Object.values(formData.workSchedule).some(day => day.pm),
        fullDay: Object.values(formData.workSchedule).some(day => day.am && day.pm),
      },
      metrics: {
        totalHours: 0,
        mileage: 0,
        shiftsCompleted: 0,
      },
      workSchedule: formData.workSchedule,
      carReg: formData.carReg,
      postcode: formData.postcode,
      joinDate: formData.joinDate,
      leftDate: formData.leftDate,
      preferredDistrict: formData.preferredDistrict,
    };

    dispatch({ type: 'ADD_STAFF', payload: newStaff });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'staff' });
  };

  const renderPersonalDetails = () => (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Reference Number</label>
            <input
              type="text"
              value={formData.staffRefNumber}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="carer">Carer</option>
              <option value="planner-admin">Planner/Admin</option>
              <option value="assessor">Assessor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="leave">On Leave</option>
              <option value="training">Training</option>
              <option value="sick">Sick</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) => handleInputChange('postcode', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="S1 2AB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">House Number</label>
            <input
              type="text"
              value={formData.houseNumber}
              onChange={(e) => handleInputChange('houseNumber', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
            <select
              value={formData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select district</option>
              {districts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Oak Street"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Car Registration</label>
            <input
              type="text"
              value={formData.carReg}
              onChange={(e) => handleInputChange('carReg', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter car registration"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
            <input
              type="date"
              value={formData.joinDate}
              onChange={(e) => handleInputChange('joinDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Left Date (if applicable)</label>
            <input
              type="date"
              value={formData.leftDate}
              onChange={(e) => handleInputChange('leftDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">Additional Languages (English is default)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableLanguages.map((language) => (
              <label key={language} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.otherLanguages.includes(language)}
                  onChange={() => handleArrayToggle('otherLanguages', language)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{language}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkDetails = () => (
    <div className="space-y-8">
      {/* Work Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Work Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transport Mode</label>
            <select
              value={formData.transport}
              onChange={(e) => handleInputChange('transport', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="car">Car</option>
              <option value="public">Public Transport</option>
              <option value="bicycle">Bicycle</option>
              <option value="walking">Walking</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred District</label>
            <select
              value={formData.preferredDistrict}
              onChange={(e) => handleInputChange('preferredDistrict', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select preferred district</option>
              {districts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Work Schedule */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Work Schedule</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">Schedule Presets</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries({
              'weekday-am': 'Weekday AM (Mon-Fri)',
              'weekday-pm': 'Weekday PM (Mon-Fri)',
              'weekday-full': 'Weekday Full (Mon-Fri)',
              'weekend-am': 'Weekend AM',
              'weekend-pm': 'Weekend PM',
              'weekend-full': 'Weekend Full',
              'custom': 'Custom Schedule'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="schedulePreset"
                  value={key}
                  checked={formData.schedulePreset === key}
                  onChange={(e) => handleSchedulePresetChange(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 capitalize">{day}</h4>
                <button
                  type="button"
                  onClick={() => cloneScheduleToAllDays(day)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clone to all days
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.workSchedule[day as keyof typeof formData.workSchedule].am}
                      onChange={(e) => handleWorkScheduleChange(day, 'am', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">AM (7am-2pm)</span>
                  </label>
                  {formData.workSchedule[day as keyof typeof formData.workSchedule].am && (
                    <>
                      <input
                        type="time"
                        value={formData.workSchedule[day as keyof typeof formData.workSchedule].amStart}
                        onChange={(e) => handleWorkScheduleChange(day, 'amStart', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <input
                        type="time"
                        value={formData.workSchedule[day as keyof typeof formData.workSchedule].amEnd}
                        onChange={(e) => handleWorkScheduleChange(day, 'amEnd', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.workSchedule[day as keyof typeof formData.workSchedule].pm}
                      onChange={(e) => handleWorkScheduleChange(day, 'pm', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">PM (4pm-10pm)</span>
                  </label>
                  {formData.workSchedule[day as keyof typeof formData.workSchedule].pm && (
                    <>
                      <input
                        type="time"
                        value={formData.workSchedule[day as keyof typeof formData.workSchedule].pmStart}
                        onChange={(e) => handleWorkScheduleChange(day, 'pmStart', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <input
                        type="time"
                        value={formData.workSchedule[day as keyof typeof formData.workSchedule].pmEnd}
                        onChange={(e) => handleWorkScheduleChange(day, 'pmEnd', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills and Certifications */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Skills and Certifications</h3>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">Add skills and their certification dates</p>
          <button
            type="button"
            onClick={addSkill}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Add Skill
          </button>
        </div>
        <div className="space-y-3">
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-3">
              <select
                value={skill.name}
                onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select skill</option>
                {availableSkills.map((skillName) => (
                  <option key={skillName} value={skillName}>{skillName}</option>
                ))}
              </select>
              <input
                type="date"
                value={skill.certificationDate}
                onChange={(e) => handleSkillChange(index, 'certificationDate', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Certification date"
              />
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Staff Member</h1>
          <p className="text-gray-600">Complete the form to add a new staff member to the system</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'staff' })}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(index)}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                currentTab === index
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {currentTab === 0 && renderPersonalDetails()}
          {currentTab === 1 && renderWorkDetails()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentTab(Math.max(0, currentTab - 1))}
            disabled={currentTab === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentTab === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentTab < tabs.length - 1 ? (
            <button
              onClick={() => setCurrentTab(Math.min(tabs.length - 1, currentTab + 1))}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStaffForm;