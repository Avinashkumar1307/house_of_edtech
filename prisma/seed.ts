import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@eventease.com' },
    update: {},
    create: {
      email: 'admin@eventease.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const eventOwner = await prisma.user.upsert({
    where: { email: 'owner@eventease.com' },
    update: {},
    create: {
      email: 'owner@eventease.com',
      name: 'Event Owner',
      password: hashedPassword,
      role: 'EVENT_OWNER',
    },
  })

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@eventease.com' },
    update: {},
    create: {
      email: 'staff@eventease.com',
      name: 'Staff Member',
      password: hashedPassword,
      role: 'STAFF',
    },
  })

  console.log('👤 Created users')

  // Create sample events
  const events = [
    {
      title: 'Tech Conference 2024',
      description: 'Join us for the biggest tech conference of the year! Featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.',
      location: 'San Francisco Convention Center, CA',
      startDate: new Date('2024-12-15T09:00:00Z'),
      endDate: new Date('2024-12-15T18:00:00Z'),
      maxAttendees: 500,
      customFields: [
        {
          id: '1',
          label: 'Dietary Restrictions',
          type: 'textarea',
          required: false
        },
        {
          id: '2',
          label: 'T-shirt Size',
          type: 'text',
          required: true
        }
      ],
      creatorId: eventOwner.id
    },
    {
      title: 'Startup Networking Mixer',
      description: 'Connect with fellow entrepreneurs, investors, and industry professionals in a relaxed networking environment.',
      location: 'WeWork Downtown, New York, NY',
      startDate: new Date('2024-12-20T18:00:00Z'),
      endDate: new Date('2024-12-20T21:00:00Z'),
      maxAttendees: 100,
      creatorId: eventOwner.id
    },
    {
      title: 'Annual Company Retreat',
      description: 'Our annual company retreat featuring team building activities, strategic planning sessions, and celebration of achievements.',
      location: 'Lake Tahoe Resort, CA',
      startDate: new Date('2025-01-10T10:00:00Z'),
      endDate: new Date('2025-01-12T16:00:00Z'),
      maxAttendees: 150,
      isPublic: false,
      creatorId: adminUser.id
    },
    {
      title: 'Web Development Workshop',
      description: 'Learn modern web development techniques including React, Next.js, and TypeScript. Suitable for beginners and intermediate developers.',
      location: 'Online Event',
      startDate: new Date('2024-12-25T14:00:00Z'),
      endDate: new Date('2024-12-25T17:00:00Z'),
      maxAttendees: 50,
      customFields: [
        {
          id: '1',
          label: 'Programming Experience Level',
          type: 'text',
          required: true
        },
        {
          id: '2',
          label: 'What do you hope to learn?',
          type: 'textarea',
          required: false
        }
      ],
      creatorId: staffUser.id
    },
    {
      title: 'Holiday Party 2024',
      description: 'Join us for our annual holiday celebration! Food, drinks, music, and great company. Dress code: festive attire.',
      location: 'Grand Ballroom, Downtown Hotel',
      startDate: new Date('2024-12-30T19:00:00Z'),
      endDate: new Date('2024-12-30T23:00:00Z'),
      maxAttendees: 200,
      creatorId: adminUser.id
    }
  ]

  for (const eventData of events) {
    await prisma.event.create({
      data: {
        ...eventData,
        views: Math.floor(Math.random() * 1000) + 50, // Random view count
      }
    })
  }

  console.log('🎉 Created sample events')

  // Create sample RSVPs
  const sampleRSVPs = [
    { name: 'John Doe', email: 'john@example.com', phone: '+1-555-0123' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-0124' },
    { name: 'Mike Johnson', email: 'mike@example.com', phone: '+1-555-0125' },
    { name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+1-555-0126' },
    { name: 'David Brown', email: 'david@example.com', phone: '+1-555-0127' },
    { name: 'Lisa Davis', email: 'lisa@example.com', phone: '+1-555-0128' },
    { name: 'Tom Miller', email: 'tom@example.com', phone: '+1-555-0129' },
    { name: 'Emily Taylor', email: 'emily@example.com', phone: '+1-555-0130' },
    { name: 'Chris Anderson', email: 'chris@example.com', phone: '+1-555-0131' },
    { name: 'Amanda White', email: 'amanda@example.com', phone: '+1-555-0132' },
  ]

  // Get created events
  const createdEvents = await prisma.event.findMany()

  for (const event of createdEvents) {
    // Add random number of RSVPs (2-8 per event)
    const numRsvps = Math.floor(Math.random() * 7) + 2
    const selectedRSVPs = sampleRSVPs
      .sort(() => 0.5 - Math.random())
      .slice(0, numRsvps)

    for (const rsvpData of selectedRSVPs) {
      try {
        await prisma.rSVP.create({
          data: {
            ...rsvpData,
            message: Math.random() > 0.5 ? 'Looking forward to this event!' : undefined,
            eventId: event.id,
            status: 'CONFIRMED',
          }
        })
      } catch (error) {
        // Skip if RSVP already exists (due to unique constraint)
        console.log(`Skipped duplicate RSVP for ${rsvpData.email} at ${event.title}`)
      }
    }
  }

  console.log('📝 Created sample RSVPs')

  // Display sample credentials
  console.log('\n🔐 Sample Login Credentials:')
  console.log('Admin: admin@eventease.com / password123')
  console.log('Event Owner: owner@eventease.com / password123')
  console.log('Staff: staff@eventease.com / password123')
  console.log('\n✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })