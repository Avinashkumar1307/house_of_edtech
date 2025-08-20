export interface User {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'STAFF' | 'EVENT_OWNER'
  createdAt: string
}

export interface Event {
  id: string
  title: string
  description?: string
  location: string
  startDate: string
  endDate?: string
  isPublic: boolean
  maxAttendees?: number
  customFields?: any
  views: number
  createdAt: string
  updatedAt: string
  creatorId: string
  creator?: {
    id: string
    name?: string
    email: string
  }
  rsvps?: RSVP[]
  _count?: {
    rsvps: number
  }
}

export interface RSVP {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
  eventId: string
}

export interface CreateEventData {
  title: string
  description?: string
  location: string
  startDate: string
  endDate?: string
  isPublic: boolean
  maxAttendees?: number
  customFields?: any
}

export interface RSVPData {
  name: string
  email: string
  phone?: string
  message?: string
}