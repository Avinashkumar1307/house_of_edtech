# EventEase - Professional Event Management Platform

EventEase is a modern, full-stack event management application built with Next.js 15, TypeScript, Prisma, and PostgreSQL. It provides a seamless experience for creating, managing, and tracking events with beautiful animations and responsive design.

## ✨ Features

- **🔐 Secure Authentication** - Role-based access control (Admin, Staff, Event Owner)
- **📅 Event Management** - Create, edit, delete events with custom fields
- **🎯 Public Event Pages** - Beautiful, shareable event pages with RSVP functionality
- **📊 Analytics Dashboard** - Track views, RSVPs, and engagement metrics
- **📱 Responsive Design** - Optimized for all devices with modern glassmorphism UI
- **🎨 Smooth Animations** - Powered by Framer Motion for delightful interactions
- **📈 Real-time Updates** - Live event status and attendance tracking
- **📤 Data Export** - Export attendee data as CSV files
- **🔗 Event Sharing** - Social sharing and calendar integration

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Better Auth
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 🚀 Live Demo

[🌐 View Live Demo](https://house-of-edtech.vercel.app)

**Demo Credentials:**
- **Event Owner**: user@eventease.com / Avinash12@


## 📦 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Supabase)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Avinashkumar1307/house_of_edtech
cd house_of_edtech
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the following environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/eventease"

# Better Auth
BETTER_AUTH_SECRET="your-super-secret-key-here-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"


```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database with sample data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
eventease/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   ├── events/            # Event management pages
│   ├── event/[id]/        # Public event pages
│   ├── login/             # Authentication pages
│   ├── register/          
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🎨 Design System

EventEase uses a modern design system with:

- **Color Palette**: Blue to purple gradients with glass morphism effects
- **Typography**: Inter font family for clean, readable text
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant with proper contrast ratios

## 🔧 Key Components

### Authentication System
- Secure password hashing with bcryptjs
- JWT-based session management
- Role-based authorization middleware

### Event Management
- CRUD operations for events
- Custom form fields for RSVPs
- File upload and export functionality
- Real-time status tracking

### Public Event Interface
- Server-side rendered event pages
- RSVP form with validation
- Social sharing capabilities
- Calendar integration

## 📊 Database Schema

The application uses a relational database with the following main entities:

- **Users** - Authentication and role management
- **Events** - Event information and settings
- **RSVPs** - Event registrations and attendee data

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Prepare for Deployment**
   ```bash
   npm run build
   ```

2. **Set Up Database**
   - Create a PostgreSQL database (Supabase recommended)
   - Update `DATABASE_URL` in environment variables

3. **Deploy to Vercel**
   ```bash
   npx vercel
   ```

4. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure `BETTER_AUTH_URL` points to your production domain

5. **Run Database Migration**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

### Alternative Deployment Platforms

- **Netlify**: Full-stack deployment with Netlify Functions
- **Render**: Automatic deployments with integrated PostgreSQL
- **Railway**: Simple deployment with managed database

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👤 Developer

**Avinash**
- GitHub: [@Avinashkumar1307](https://github.com/Avinashkumar1307)
- Email: avi2y07111999@gmail.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://framer.com/motion/) - Animation library
- [Better Auth](https://better-auth.com/) - Authentication solution
- [Lucide](https://lucide.dev/) - Icon library

---

**Made with ❤️ using Next.js 15 and modern web technologies**