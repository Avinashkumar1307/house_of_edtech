'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, Share2, Check, User, Mail, Phone, MessageCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { Event, RSVPData } from '@/types'
import { formatDateTime, getTimeUntilEvent } from '@/lib/utils'

interface PageProps {
  params: {
    id: string
  }
}

export default function PublicEventPage({ params }: PageProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [rsvpSuccess, setRsvpSuccess] = useState(false)
  const [error, setError] = useState('')
  const [rsvpError, setRsvpError] = useState('')
  
  const [rsvpData, setRsvpData] = useState<RSVPData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    fetchEvent()
  }, [params.id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      } else {
        setError('Event not found')
      }
    } catch (error) {
      setError('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleRsvpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRsvpData({
      ...rsvpData,
      [e.target.name]: e.target.value
    })
  }

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRsvpError('')
    
    if (!rsvpData.name || !rsvpData.email) {
      setRsvpError('Name and email are required')
      return
    }

    setRsvpLoading(true)

    try {
      const response = await fetch(`/api/events/${params.id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rsvpData),
      })

      const result = await response.json()

      if (response.ok) {
        setRsvpSuccess(true)
        setRsvpData({ name: '', email: '', phone: '', message: '' })
        // Refresh event data to update RSVP count
        fetchEvent()
      } else {
        setRsvpError(result.error || 'Failed to submit RSVP')
      }
    } catch (error) {
      setRsvpError('Network error occurred')
    } finally {
      setRsvpLoading(false)
    }
  }

  const shareEvent = async () => {
    const shareData = {
      title: event?.title,
      text: `Check out this event: ${event?.title}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // Fallback to copying to clipboard
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    // You could add a toast notification here
  }

  const getEventStatus = () => {
    if (!event) return 'unknown'
    
    const now = new Date()
    const eventDate = new Date(event.startDate)
    const endDate = event.endDate ? new Date(event.endDate) : eventDate
    
    if (now < eventDate) return 'upcoming'
    if (now > endDate) return 'past'
    return 'ongoing'
  }

  const canRsvp = () => {
    if (!event) return false
    if (getEventStatus() !== 'upcoming') return false
    if (event.maxAttendees && (event._count?.rsvps || 0) >= event.maxAttendees) return false
    return true
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  if (!event) return null

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  getEventStatus() === 'upcoming' ? 'bg-green-100 text-green-800' :
                  getEventStatus() === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getEventStatus() === 'upcoming' ? 'Upcoming Event' :
                   getEventStatus() === 'ongoing' ? 'Event in Progress' :
                   'Past Event'}
                </span>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareEvent}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </motion.button>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              {event.description && (
                <p className="text-lg text-gray-600 mb-6">
                  {event.description}
                </p>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Date & Time</h3>
                <p className="text-gray-600">{formatDateTime(event.startDate)}</p>
                {event.endDate && (
                  <p className="text-gray-600 text-sm">
                    Ends: {formatDateTime(event.endDate)}
                  </p>
                )}
                {getEventStatus() === 'upcoming' && (
                  <p className="text-blue-600 font-medium text-sm mt-1">
                    {getTimeUntilEvent(event.startDate)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Attendance</h3>
                <p className="text-gray-600">
                  {event._count?.rsvps || 0} people attending
                  {event.maxAttendees && (
                    <span className="text-gray-500">
                      {' '}/ {event.maxAttendees} max
                    </span>
                  )}
                </p>
                {event.maxAttendees && (event._count?.rsvps || 0) >= event.maxAttendees && (
                  <p className="text-red-600 text-sm font-medium">Event is full</p>
                )}
              </div>
            </div>
          </div>

          {/* Organizer Info */}
          {event.creator && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm text-gray-600">
                Organized by <span className="font-semibold text-gray-900">{event.creator.name || event.creator.email}</span>
              </p>
            </div>
          )}
        </motion.div>

        {/* RSVP Section */}
        <AnimatePresence>
          {canRsvp() && !rsvpSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-effect rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">RSVP to this Event</h2>
              
              <form onSubmit={handleRsvpSubmit} className="space-y-6">
                {rsvpError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm"
                  >
                    {rsvpError}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={rsvpData.name}
                        onChange={handleRsvpChange}
                        className="input-field pl-10"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={rsvpData.email}
                        onChange={handleRsvpChange}
                        className="input-field pl-10"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={rsvpData.phone}
                        onChange={handleRsvpChange}
                        className="input-field pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <MessageCircle className="h-4 w-4 text-gray-400" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={rsvpData.message}
                        onChange={handleRsvpChange}
                        className="input-field pl-10 resize-none"
                        placeholder="Any special requirements or comments?"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Fields */}
                {event.customFields && Array.isArray(event.customFields) && event.customFields.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                    {event.customFields.map((field: any, index: number) => (
                      <div key={field.id || index}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            name={`custom_${field.id || index}`}
                            required={field.required}
                            className="input-field resize-none"
                            rows={3}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        ) : (
                          <input
                            type={field.type || 'text'}
                            name={`custom_${field.id || index}`}
                            required={field.required}
                            className="input-field"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={rsvpLoading}
                  whileHover={{ scale: rsvpLoading ? 1 : 1.02 }}
                  whileTap={{ scale: rsvpLoading ? 1 : 0.98 }}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg py-4"
                >
                  {rsvpLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  ) : (
                    <Check className="w-5 h-5 mr-2" />
                  )}
                  {rsvpLoading ? 'Submitting RSVP...' : 'Confirm RSVP'}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RSVP Success Message */}
        <AnimatePresence>
          {rsvpSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="glass-effect rounded-2xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-green-600" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">RSVP Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for registering for {event.title}. You should receive a confirmation email shortly.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Check your email for event details and updates</li>
                  <li>• Add the event to your calendar</li>
                  <li>• Share this event with friends who might be interested</li>
                </ul>
              </div>
              
              <motion.button
                onClick={shareEvent}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary mt-4 flex items-center mx-auto"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Event
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Not Available for RSVP */}
        {!canRsvp() && !rsvpSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-500" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {getEventStatus() === 'past' ? 'Event Has Ended' :
               getEventStatus() === 'ongoing' ? 'Event In Progress' :
               event.maxAttendees && (event._count?.rsvps || 0) >= event.maxAttendees ? 'Event Is Full' :
               'RSVP Not Available'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {getEventStatus() === 'past' ? 
                'This event has already taken place. Check back for future events!' :
               getEventStatus() === 'ongoing' ?
                'This event is currently in progress.' :
               event.maxAttendees && (event._count?.rsvps || 0) >= event.maxAttendees ?
                'Unfortunately, this event has reached maximum capacity.' :
                'RSVP is not currently available for this event.'
              }
            </p>

            {/* Still allow sharing */}
            <motion.button
              onClick={shareEvent}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center mx-auto"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Event
            </motion.button>
          </motion.div>
        )}

        {/* Event Details Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 glass-effect rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Event Details</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Event Type:</span>
                  <span className="font-medium">{event.isPublic ? 'Public Event' : 'Private Event'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Views:</span>
                  <span className="font-medium">{event.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Current RSVPs:</span>
                  <span className="font-medium">{event._count?.rsvps || 0}</span>
                </div>
                {event.maxAttendees && (
                  <div className="flex items-center justify-between">
                    <span>Available Spots:</span>
                    <span className="font-medium">
                      {Math.max(0, event.maxAttendees - (event._count?.rsvps || 0))}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  onClick={shareEvent}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Event
                </motion.button>
                
                <a
                  href={`data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${event.endDate ? new Date(event.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] : new Date(new Date(event.startDate).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`}
                  download={`${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`}
                  className="w-full btn-secondary flex items-center justify-center no-underline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-gray-500"
        >
          <p className="flex items-center justify-center text-sm">
            Powered by 
            <span className="ml-1 font-semibold gradient-text">EventEase</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </p>
        </motion.div>
      </div>
    </div>
  )
}