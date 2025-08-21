// src/app/api/auth/[...all]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || 'your-fallback-secret'

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const endpoint = url.pathname.split('/').pop()
    
    switch (endpoint) {
      case 'sign-up':
        return await handleSignUp(request)
      case 'sign-in':
        return await handleSignIn(request)
      case 'get-session':
        return await handleGetSession(request)
      case 'sign-out':
        return await handleSignOut(request)
      default:
        return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const endpoint = url.pathname.split('/').pop()
  
  if (endpoint === 'get-session') {
    return await handleGetSession(request)
  }
  
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

async function handleSignUp(request: NextRequest) {
  const { name, email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return NextResponse.json(
      { error: 'User already exists' },
      { status: 400 }
    )
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'EVENT_OWNER'
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  })

  // Create token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  return NextResponse.json({
    message: 'User created successfully',
    token,
    user
  }, { status: 201 })
}

async function handleSignIn(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user || !await bcrypt.compare(password, user.password)) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 400 }
    )
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  return NextResponse.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
}

async function handleGetSession(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

async function handleSignOut(request: NextRequest) {
  // For JWT, sign out is handled client-side by removing the token
  return NextResponse.json({ message: 'Signed out successfully' })
}