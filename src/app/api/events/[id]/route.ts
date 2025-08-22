
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

interface Params {
  id: string;
}

// GET /api/events/[id] - Get single event
export async function GET(
  request: NextRequest,
{ params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        rsvps: session?.user ? true : false,
        _count: { select: { rsvps: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!event.isPublic && (!session || session.user.id !== event.creatorId)) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!session || session.user.id !== event.creatorId) {
      await prisma.event.update({
        where: { id },
        data: { views: { increment: 1 } },
      })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(request: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params;
    const body = await request.json()

    // Check if user owns the event or is admin/staff
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // if (existingEvent.creatorId !== session.user.id && 
    //     session.user.role !== 'ADMIN' && 
    //     session.user.role !== 'STAFF') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(request: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params;

    // Check if user owns the event or is admin
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // if (existingEvent.creatorId !== session.user.id && 
    //     session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    await prisma.event.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}