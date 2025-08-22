'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Clock, Users, FileText, Globe, Lock, Plus, X, Save } from 'lucide-react'
import { CreateEventData } from '@/types'

interface CustomField {
  id: string
  label: string
  type: 'text' | 'email' | 'number' | 'textarea'
  required: boolean
}

export default function CreateEventPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    isPublic: true,
    maxAttendees: undefined,
    customFields: undefined
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const addCustomField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false
    }
    setCustomFields([...customFields, newField])
  }

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(fields =>
      fields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      )
    )
  }

  const removeCustomField = (id: string) => {
    setCustomFields(fields => fields.filter(field => field.id !== id))
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Event title is required')
      return false
    }
    if (!formData.location.trim()) {
      setError('Event location is required')
      return false
    }
    if (!formData.startDate) {
      setError('Start date is required')
      return false
    }
    
    const startDate = new Date(formData.startDate)
    if (startDate <= new Date()) {
      setError('Start date must be in the future')
      return false
    }
    
    if (formData.endDate) {
      const endDate = new Date(formData.endDate)
      if (endDate <= startDate) {
        setError('End date must be after start date')
        return false
      }
    }

    if (formData.maxAttendees && formData.maxAttendees <= 0) {
      setError('Maximum attendees must be greater than 0')
      return false
    }

    // Validate custom fields
    for (const field of customFields) {
      if (!field.label.trim()) {
        setError('All custom fields must have a label')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')

  if (!validateForm()) return

  setIsLoading(true)

  try {
    // Get the token from localStorage
    const token = localStorage.getItem('token')
    
    if (!token) {
      setError('Please sign in to create events')
      setIsLoading(false)
      return
    }

    const eventData = {
      ...formData,
      customFields: customFields.length > 0 ? customFields : undefined
    }

    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Added this line
      },
      body: JSON.stringify(eventData),
    })

    const result = await response.json()

    if (response.ok) {
      router.push('/events')
    } else {
      setError(result.error || 'Failed to create event')
    }
  } catch (error) {
    setError('Network error occurred')
  } finally {
    setIsLoading(false)
  }
}

  // Generate datetime-local input value
  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const getMinDateTime = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return formatDateTimeLocal(tomorrow)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
          <p className="text-gray-600">Fill in the details below to create your event</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
            >
              {error}
            </motion.div>
          )}

          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Title */}
              <div className="lg:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your event title"
                />
              </div>

              {/* Event Description */}
              <div className="lg:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field resize-none"
                  placeholder="Describe your event, what attendees can expect, agenda, etc."
                />
              </div>

              {/* Location */}
              <div className="lg:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Event location (address, venue name, or 'Online')"
                />
              </div>
            </div>
          </motion.div>

          {/* Date and Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Date & Time
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={getMinDateTime()}
                  className="input-field"
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate}
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">Optional - leave blank for single-time events</p>
              </div>
            </div>
          </motion.div>

          {/* Event Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Event Settings
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Visibility
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPublic"
                      value="true"
                      checked={formData.isPublic === true}
                      onChange={(e) => setFormData({...formData, isPublic: e.target.value === 'true'})}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <Globe className="w-4 h-4 mr-1 text-green-600" />
                    <span>Public</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isPublic"
                      value="false"
                      checked={formData.isPublic === false}
                      onChange={(e) => setFormData({...formData, isPublic: e.target.value === 'true'})}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <Lock className="w-4 h-4 mr-1 text-red-600" />
                    <span>Private</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Public events can be viewed and joined by anyone with the link
                </p>
              </div>

              {/* Max Attendees */}
              <div>
                <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Attendees
                </label>
                <input
                  type="number"
                  id="maxAttendees"
                  name="maxAttendees"
                  min="1"
                  value={formData.maxAttendees || ''}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Leave blank for unlimited"
                />
                <p className="text-xs text-gray-500 mt-1">Optional - set a limit on registrations</p>
              </div>
            </div>
          </motion.div>

          {/* Custom Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                Custom RSVP Fields
              </h2>
              <motion.button
                type="button"
                onClick={addCustomField}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Field
              </motion.button>
            </div>

            {customFields.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No custom fields added yet. Click "Add Field" to create additional RSVP form fields.
              </p>
            ) : (
              <div className="space-y-4">
                {customFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="border border-gray-200 rounded-lg p-4 bg-white/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Field {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeCustomField(field.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field Label
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Dietary Restrictions"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) => updateCustomField(field.id, { type: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="number">Number</option>
                          <option value="textarea">Long Text</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateCustomField(field.id, { required: e.target.checked })}
                            className="mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Required</span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-end"
          >
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Creating Event...' : 'Create Event'}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}