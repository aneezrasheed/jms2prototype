import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Pill, 
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Client } from '../../types';

const AddClientForm: React.FC = () => {
  const { dispatch } = useApp();
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    age: '',
    gender: 'female' as 'male' | 'female' | 'other',
    postcode: '',
    houseNumber: '',
    address: '',
    otherResidents: '',
    keyboxCode: '',
    phone: '',
    email: '',
    emergencyContact: '',
    nokName: '',
    nokRelationship: '',
    nokPhone: '',
    startDate: '',
    endDate: '',
    gpName: '',
    gpPractice: '',
    gpPhone: '',
    
    // Care Details
    serviceLevel: '1' as '1' | '2' | '3' | '4',
    careNeeds: [] as string[],
    additionalTasks: [] as string[],
    medicalConditions: [] as string[],
    preferredLanguage: 'English',
    preferredCarer: '',
    preferredGender: 'no-preference' as 'male' | 'female' | 'no-preference',
    
    // Schedule
    scheduleType: 'early-care-weekday' as 'early-care-weekday' | 'pm-care-weekday' | 'full-day-weekday' | 'early-weekend' | 'late-weekend' | 'all-day-weekend' | 'custom',
    scheduleDays: [] as string[],
    patch: '',
    amServiceLevel: '1' as '1' | '2' | '3' | '4',
    pmServiceLevel: '1' as '1' | '2' | '3' | '4',
    amCareNeeds: [] as string[],
    pmCareNeeds: [] as string[],
    customSchedule: {
      monday: { am: false, pm: false },
      tuesday: { am: false, pm: false },
      wednesday: { am: false, pm: false },
      thursday: { am: false, pm: false },
      friday: { am: false, pm: false },
      saturday: { am: false, pm: false },
      sunday: { am: false, pm: false },
    },
    
    // EMAR
    medications: [] as any[],
    allergies: [] as string[],
  });

  const tabs = ['Client Info', 'Care Details', 'EMAR', 'Review'];

  const careNeedsByLevel = {
    '1': ['Food Preparation', 'Light Cleaning', 'Shopping', 'Companionship'],
    '2': ['Food Preparation', 'Light Cleaning', 'Shopping', 'Companionship', 'Personal Care', 'Medication Management'],
    '3': ['Food Preparation', 'Light Cleaning', 'Shopping', 'Companionship', 'Personal Care', 'Medication Management', 'Mobility Support', 'Meal Preparation', 'Housekeeping'],
    '4': ['Food Preparation', 'Light Cleaning', 'Shopping', 'Companionship', 'Personal Care', 'Medication Management', 'Mobility Support', 'Meal Preparation', 'Housekeeping', 'Manual Handling (2 Person)', 'Complex Mobility Support']
  };

  const additionalTaskOptions = [
    'Wound Care', 'Feeding Assistance', 'Continence Care', 'Mental Health Support', 
    'End of Life Care', 'Catheter Care', 'Physiotherapy Support', 'Diabetic Care'
  ];

  const medicalConditionOptions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Dementia', 'Arthritis', 
    'COPD', 'Stroke', 'Depression', 'Anxiety', 'Mobility Issues'
  ];

  const commonAllergies = [
    'Penicillin', 'Aspirin', 'Latex', 'Nuts', 'Shellfish', 'Dairy', 'Eggs', 'Soy'
  ];

  const schedulePresets = {
    'early-care-weekday': { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], am: true, pm: false },
    'pm-care-weekday': { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], am: false, pm: true },
    'full-day-weekday': { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], am: true, pm: true },
    'early-weekend': { days: ['Saturday', 'Sunday'], am: true, pm: false },
    'late-weekend': { days: ['Saturday', 'Sunday'], am: false, pm: true },
    'all-day-weekend': { days: ['Saturday', 'Sunday'], am: true, pm: true },
  };

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

  const handleServiceLevelChange = (level: '1' | '2' | '3' | '4') => {
    setFormData(prev => ({
      ...prev,
      serviceLevel: level,
      careNeeds: careNeedsByLevel[level]
    }));
  };

  const handleSchedulePresetChange = (preset: string) => {
    if (preset === 'custom') {
      setFormData(prev => ({ ...prev, scheduleType: 'custom' }));
      return;
    }

    const presetConfig = schedulePresets[preset as keyof typeof schedulePresets];
    const newCustomSchedule = { ...formData.customSchedule };
    
    // Reset all days
    Object.keys(newCustomSchedule).forEach(day => {
      newCustomSchedule[day as keyof typeof newCustomSchedule] = { am: false, pm: false };
    });

    // Apply preset
    presetConfig.days.forEach(day => {
      const dayKey = day.toLowerCase() as keyof typeof newCustomSchedule;
      newCustomSchedule[dayKey] = {
        am: presetConfig.am,
        pm: presetConfig.pm
      };
    });

    setFormData(prev => ({
      ...prev,
      scheduleType: preset as any,
      customSchedule: newCustomSchedule,
      scheduleDays: presetConfig.days
    }));
  };

  const handleCustomScheduleChange = (day: string, period: 'am' | 'pm', value: boolean) => {
    setFormData(prev => ({
      ...prev,
      customSchedule: {
        ...prev.customSchedule,
        [day]: {
          ...prev.customSchedule[day as keyof typeof prev.customSchedule],
          [period]: value
        }
      }
    }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, {
        id: `med-${Date.now()}`,
        name: '',
        dosage: '',
        frequency: '',
        time: '',
        instructions: '',
        route: 'oral',
        specificTime: false,
        amPm: 'am',
        daysOfWeek: []
      }]
    }));
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleMedicationChange = (index: number, field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleMedicationDayToggle = (index: number, day: string) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? {
          ...med,
          daysOfWeek: med.daysOfWeek.includes(day)
            ? med.daysOfWeek.filter((d: string) => d !== day)
            : [...med.daysOfWeek, day]
        } : med
      )
    }));
  };

  const handleSubmit = () => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      address: `${formData.postcode} - ${formData.houseNumber} ${formData.address}`,
      keyboxCode: formData.keyboxCode,
      contactInfo: {
        phone: formData.phone,
        email: formData.email,
        emergencyContact: formData.emergencyContact,
      },
      nextOfKin: {
        name: formData.nokName,
        relationship: formData.nokRelationship,
        phone: formData.nokPhone,
      },
      serviceLevel: formData.serviceLevel as any,
      careNeeds: formData.careNeeds,
      medications: formData.medications,
      gpDetails: {
        name: formData.gpName,
        practice: formData.gpPractice,
        phone: formData.gpPhone,
      },
      schedule: {
        type: formData.scheduleType.includes('full') || (formData.scheduleType === 'custom' && 
          Object.values(formData.customSchedule).some(day => day.am && day.pm)) ? 'full-day' : 
          formData.scheduleType.includes('early') || formData.scheduleType.includes('am') ? 'am' : 'pm',
        days: formData.scheduleDays,
        startDate: formData.startDate,
        endDate: formData.endDate,
      },
      patch: formData.patch,
      status: 'pending',
      admissionDate: formData.startDate,
      otherResidents: formData.otherResidents,
      allergies: formData.allergies,
      additionalTasks: formData.additionalTasks,
      preferredLanguage: formData.preferredLanguage,
      preferredCarer: formData.preferredCarer,
      preferredGender: formData.preferredGender,
    };

    dispatch({ type: 'ADD_CLIENT', payload: newClient });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'clients' });
  };

  const renderClientInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter age"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Keybox Code</label>
          <input
            type="text"
            value={formData.keyboxCode}
            onChange={(e) => handleInputChange('keyboxCode', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter keybox code"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Oak Street"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Other Residents at Property</label>
        <textarea
          value={formData.otherResidents}
          onChange={(e) => handleInputChange('otherResidents', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
          placeholder="List other residents (spouse, family members, etc.)"
        />
      </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
          <input
            type="tel"
            value={formData.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Emergency contact number"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Next of Kin</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.nokName}
              onChange={(e) => handleInputChange('nokName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Next of kin name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
            <input
              type="text"
              value={formData.nokRelationship}
              onChange={(e) => handleInputChange('nokRelationship', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Relationship"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.nokPhone}
              onChange={(e) => handleInputChange('nokPhone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Next of kin phone"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">GP Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GP Name</label>
            <input
              type="text"
              value={formData.gpName}
              onChange={(e) => handleInputChange('gpName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dr. Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Practice</label>
            <input
              type="text"
              value={formData.gpPractice}
              onChange={(e) => handleInputChange('gpPractice', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Practice name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.gpPhone}
              onChange={(e) => handleInputChange('gpPhone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="GP phone number"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Care Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCareDetails = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Service Level</label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['1', '2', '3', '4'] as const).map((level) => (
            <div
              key={level}
              onClick={() => handleServiceLevelChange(level)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.serviceLevel === level
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <h3 className="font-medium text-gray-900">Level {level}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {level === '1' && 'Basic support'}
                  {level === '2' && 'Regular care'}
                  {level === '3' && 'Intensive care'}
                  {level === '4' && 'Manual handling (2 carers)'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Care Needs (Included with Service Level)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {careNeedsByLevel[formData.serviceLevel].map((need) => (
            <div key={need} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
              <Check className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">{need}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Additional Tasks</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {additionalTaskOptions.map((task) => (
            <label key={task} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.additionalTasks.includes(task)}
                onChange={() => handleArrayToggle('additionalTasks', task)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{task}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Medical Conditions</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {medicalConditionOptions.map((condition) => (
            <label key={condition} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.medicalConditions.includes(condition)}
                onChange={() => handleArrayToggle('medicalConditions', condition)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language of Staff</label>
          <select
            value={formData.preferredLanguage}
            onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="English">English</option>
            <option value="Urdu">Urdu</option>
            <option value="Arabic">Arabic</option>
            <option value="Polish">Polish</option>
            <option value="Mandarin">Mandarin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Carer</label>
          <input
            type="text"
            value={formData.preferredCarer}
            onChange={(e) => handleInputChange('preferredCarer', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter preferred carer name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Gender of Staff</label>
          <select
            value={formData.preferredGender}
            onChange={(e) => handleInputChange('preferredGender', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="no-preference">No Preference</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Care Schedule</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">Schedule Presets</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries({
              'early-care-weekday': 'Early Care (Mon-Fri)',
              'pm-care-weekday': 'PM Care (Mon-Fri)',
              'full-day-weekday': 'Full Day (Mon-Fri)',
              'early-weekend': 'Early Weekend',
              'late-weekend': 'Late Weekend',
              'all-day-weekend': 'All Day Weekend',
              'custom': 'Custom Schedule'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="schedulePreset"
                  value={key}
                  checked={formData.scheduleType === key}
                  onChange={(e) => handleSchedulePresetChange(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {formData.scheduleType === 'custom' && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Custom Schedule</h4>
            <div className="space-y-3">
              {Object.entries(formData.customSchedule).map(([day, schedule]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium text-gray-700 capitalize">{day}</div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={schedule.am}
                      onChange={(e) => handleCustomScheduleChange(day, 'am', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">AM</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={schedule.pm}
                      onChange={(e) => handleCustomScheduleChange(day, 'pm', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">PM</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEMAR = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Medications</h3>
          <button
            type="button"
            onClick={addMedication}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.medications.map((medication, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Medication {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                  <input
                    type="text"
                    value={medication.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Metformin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={medication.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 500mg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={medication.frequency}
                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Twice daily"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                  <select
                    value={medication.route}
                    onChange={(e) => handleMedicationChange(index, 'route', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="oral">Oral</option>
                    <option value="topical">Topical</option>
                    <option value="injection">Injection</option>
                    <option value="inhaled">Inhaled</option>
                    <option value="eye-drops">Eye Drops</option>
                    <option value="ear-drops">Ear Drops</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={medication.specificTime}
                    onChange={(e) => handleMedicationChange(index, 'specificTime', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Specific time required</span>
                </label>
              </div>

              {medication.specificTime ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specific Time(s)</label>
                  <input
                    type="text"
                    value={medication.time}
                    onChange={(e) => handleMedicationChange(index, 'time', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 08:00, 20:00"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">AM/PM Schedule</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`ampm-${index}`}
                        value="am"
                        checked={medication.amPm === 'am'}
                        onChange={(e) => handleMedicationChange(index, 'amPm', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">AM</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`ampm-${index}`}
                        value="pm"
                        checked={medication.amPm === 'pm'}
                        onChange={(e) => handleMedicationChange(index, 'amPm', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">PM</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`ampm-${index}`}
                        value="both"
                        checked={medication.amPm === 'both'}
                        onChange={(e) => handleMedicationChange(index, 'amPm', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Both</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={medication.daysOfWeek.includes(day)}
                        onChange={() => handleMedicationDayToggle(index, day)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={medication.instructions}
                  onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="e.g., Take with food, Monitor blood sugar levels"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Known Allergies</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {commonAllergies.map((allergy) => (
            <label key={allergy} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allergies.includes(allergy)}
                onChange={() => handleArrayToggle('allergies', allergy)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">{allergy}</span>
            </label>
          ))}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Other Allergies</label>
          <input
            type="text"
            placeholder="Enter any other allergies separated by commas"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onBlur={(e) => {
              if (e.target.value) {
                const newAllergies = e.target.value.split(',').map(a => a.trim()).filter(a => a);
                setFormData(prev => ({
                  ...prev,
                  allergies: [...new Set([...prev.allergies, ...newAllergies])]
                }));
                e.target.value = '';
              }
            }}
          />
        </div>
        
        {formData.allergies.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Selected Allergies:</p>
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((allergy, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {allergy}
                  <button
                    type="button"
                    onClick={() => handleArrayToggle('allergies', allergy)}
                    className="ml-1 text-red-600 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Name:</span>
            <span className="ml-2 text-gray-900">{formData.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Age:</span>
            <span className="ml-2 text-gray-900">{formData.age}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Gender:</span>
            <span className="ml-2 text-gray-900 capitalize">{formData.gender}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Service Level:</span>
            <span className="ml-2 text-gray-900">Level {formData.serviceLevel}</span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Address:</span>
            <span className="ml-2 text-gray-900">{formData.postcode} - {formData.houseNumber} {formData.address}</span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Care Needs:</span>
            <span className="ml-2 text-gray-900">{formData.careNeeds.join(', ')}</span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Medications:</span>
            <span className="ml-2 text-gray-900">{formData.medications.length} medications listed</span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Allergies:</span>
            <span className="ml-2 text-gray-900">{formData.allergies.length > 0 ? formData.allergies.join(', ') : 'None listed'}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <Check className="w-5 h-5 text-blue-600 mr-2" />
          <p className="text-blue-800">
            Please review all information carefully before submitting. Once submitted, the client will be added to the system with a "Pending" status.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
          <p className="text-gray-600">Complete the form to add a new client to the system</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'clients' })}
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
          {currentTab === 0 && renderClientInfo()}
          {currentTab === 1 && renderCareDetails()}
          {currentTab === 2 && renderEMAR()}
          {currentTab === 3 && renderReview()}
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
              <span>Submit Client</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddClientForm;