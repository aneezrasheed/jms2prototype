import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Camera, 
  Search, 
  User,
  X,
  Upload,
  Check
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const AddIncidentForm: React.FC = () => {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    incidentType: '',
    description: '',
    relatedPerson: '',
    personType: 'client' as 'client' | 'staff',
    location: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    evidence: null as File | null,
    immediateActions: '',
    witnesses: '',
  });

  const incidentTypes = [
    'Client Fall',
    'Medication Error',
    'Property Damage',
    'Aggressive Behavior',
    'Equipment Failure',
    'Safeguarding Concern',
    'Health Emergency',
    'Security Breach',
    'Staff Injury',
    'Vehicle Incident',
    'Other'
  ];

  const mockPeople = [
    { id: '1', name: 'Margaret Thompson', type: 'client', location: 'S1 2AB - 123 Oak Street' },
    { id: '2', name: 'Robert Davies', type: 'client', location: 'S2 3CD - 456 Elm Road' },
    { id: '3', name: 'Dorothy Williams', type: 'client', location: 'S3 4EF - 789 Pine Avenue' },
    { id: '4', name: 'Jennifer Mills', type: 'staff', location: 'Central Sheffield' },
    { id: '5', name: 'Michael Chen', type: 'staff', location: 'North Sheffield' },
    { id: '6', name: 'Sarah Ahmed', type: 'staff', location: 'West Sheffield' },
  ];

  const [searchResults, setSearchResults] = useState<typeof mockPeople>([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonSearch = (searchTerm: string) => {
    if (searchTerm.length > 0) {
      const results = mockPeople.filter(person => 
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        person.type === formData.personType
      );
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const selectPerson = (person: typeof mockPeople[0]) => {
    setFormData(prev => ({
      ...prev,
      relatedPerson: person.name,
      location: person.location
    }));
    setShowSearch(false);
    setSearchResults([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, evidence: file }));
    }
  };

  const handleSubmit = () => {
    const newIncident = {
      id: `inc-${Date.now()}`,
      title: formData.incidentType,
      description: formData.description,
      clientName: formData.personType === 'client' ? formData.relatedPerson : 'N/A',
      staffName: formData.personType === 'staff' ? formData.relatedPerson : 'Current User',
      location: formData.location,
      severity: formData.severity,
      status: 'open',
      reportedBy: 'Current User',
      dateReported: new Date().toISOString(),
      immediateActions: formData.immediateActions,
      witnesses: formData.witnesses,
      evidence: formData.evidence?.name || null,
    };

    console.log('New incident created:', newIncident);
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'incidents' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Incident</h1>
          <p className="text-gray-600">Complete the form to report a new incident</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'incidents' })}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Incident Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type</label>
            <select
              value={formData.incidentType}
              onChange={(e) => handleInputChange('incidentType', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select incident type</option>
              {incidentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Provide a detailed description of the incident..."
            />
          </div>

          {/* Person Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Related to</label>
            <div className="flex items-center space-x-4 mb-3">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="personType"
                  value="client"
                  checked={formData.personType === 'client'}
                  onChange={(e) => handleInputChange('personType', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Client</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="personType"
                  value="staff"
                  checked={formData.personType === 'staff'}
                  onChange={(e) => handleInputChange('personType', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Staff Member</span>
              </label>
            </div>

            {/* Person Search */}
            <div className="relative">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.relatedPerson}
                  onChange={(e) => {
                    handleInputChange('relatedPerson', e.target.value);
                    handlePersonSearch(e.target.value);
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Search for ${formData.personType}...`}
                />
              </div>

              {/* Search Results */}
              {showSearch && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.map(person => (
                    <div
                      key={person.id}
                      onClick={() => selectPerson(person)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{person.name}</p>
                          <p className="text-sm text-gray-600">{person.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter incident location"
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={formData.severity}
              onChange={(e) => handleInputChange('severity', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Evidence (Photo)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="evidence-upload"
              />
              <label htmlFor="evidence-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  {formData.evidence ? (
                    <>
                      <Check className="w-8 h-8 text-green-600" />
                      <p className="text-sm text-green-600">File uploaded: {formData.evidence.name}</p>
                    </>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload photo evidence</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Immediate Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Immediate Actions Taken</label>
            <textarea
              value={formData.immediateActions}
              onChange={(e) => handleInputChange('immediateActions', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe any immediate actions taken..."
            />
          </div>

          {/* Witnesses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Witnesses</label>
            <textarea
              value={formData.witnesses}
              onChange={(e) => handleInputChange('witnesses', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="List any witnesses to the incident..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Submit Incident Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddIncidentForm;