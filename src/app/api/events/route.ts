import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || 'your-fallback-secret'

// Helper function to get user from JWT token
async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return user
  } catch (error) {
    return null
  }
}

// GET /api/events - Get all events for authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: {
        creatorId: user.id
      },
      include: {
        _count: {
          select: {
            rsvps: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      location,
      startDate,
      endDate,
      isPublic = true,
      maxAttendees,
      customFields
    } = body

    // Validation
    if (!title || !location || !startDate) {
      return NextResponse.json(
        { error: 'Title, location, and start date are required' },
        { status: 400 }
      )
    }

    // Check if start date is in the future
    if (new Date(startDate) <= new Date()) {
      return NextResponse.json(
        { error: 'Start date must be in the future' },
        { status: 400 }
      )
    }

    // Check if end date is after start date
    if (endDate && new Date(endDate) <= new Date(startDate)) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isPublic,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        customFields,
        creatorId: user.id
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}