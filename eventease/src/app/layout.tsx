import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { SimpleToaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EventEase - Event Planning Made Simple',
  description: 'Professional event management and planning tool for seamless event organization and attendee management.',
  keywords: 'event management, event planning, RSVP, event organization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50`}>
        <div className="relative min-h-screen flex flex-col">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </div>
        <SimpleToaster />
      </body>
    </html>
  )
}