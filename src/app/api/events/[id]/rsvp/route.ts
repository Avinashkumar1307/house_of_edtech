import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
 
    id: string;
  
}

// POST /api/events/[id]/rsvp - Submit RSVP
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id: eventId } = await params;
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if event exists and is public
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            rsvps: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.isPublic) {
      return NextResponse.json(
        { error: "Event is not public" },
        { status: 403 }
      );
    }

    // Check if event has already ended
    if (new Date() > event.startDate) {
      return NextResponse.json(
        { error: "Cannot RSVP to past events" },
        { status: 400 }
      );
    }

    // Check max attendees limit
    if (event.maxAttendees && event._count.rsvps >= event.maxAttendees) {
      return NextResponse.json(
        { error: "Event is at maximum capacity" },
        { status: 400 }
      );
    }

    // Check if user already RSVPed
    const existingRsvp = await prisma.rSVP.findUnique({
      where: {
        eventId_email: {
          eventId,
          email,
        },
      },
    });

    if (existingRsvp) {
      return NextResponse.json(
        { error: "You have already RSVPed to this event" },
        { status: 400 }
      );
    }

    // Create RSVP
    const rsvp = await prisma.rSVP.create({
      data: {
        name,
        email,
        phone,
        message,
        eventId,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(
      {
        message: "RSVP submitted successfully",
        rsvp: {
          id: rsvp.id,
          name: rsvp.name,
          email: rsvp.email,
          status: rsvp.status,
          createdAt: rsvp.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
