'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Users, Share2, BarChart3, Clock, Shield, Star, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Easy Event Creation',
    description: 'Create professional events in minutes with our intuitive interface and customizable fields.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Attendee Management',
    description: 'Track RSVPs, manage participant information, and export attendee data seamlessly.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Share2,
    title: 'Public Event Pages',
    description: 'Share beautiful, responsive event pages with automatic RSVP collection.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Get insights on event performance, attendance rates, and engagement metrics.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Stay updated with live notifications and real-time event status changes.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with role-based access control and data protection.',
    color: 'from-gray-600 to-gray-800'
  }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Event Coordinator',
    company: 'TechCorp Inc.',
    content: 'EventEase has transformed how we organize company events. The interface is intuitive and the attendee management features are outstanding.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    company: 'StartupXYZ',
    content: 'The analytics dashboard provides incredible insights. We can now track engagement and optimize our events for better attendance.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Community Manager',
    company: 'NonProfit Org',
    content: 'Perfect for managing community events. The public event pages look professional and the RSVP system works flawlessly.',
    rating: 5
  }
]

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Event Planning Made{' '}
                <span className="gradient-text">Simple</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Create, manage, and track professional events with ease. From corporate conferences to community gatherings, EventEase has everything you need.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Start Creating Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
              <Link href="/explore">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Explore Events
                </motion.button>
              </Link>
            </motion.div>

            {/* Hero Image/Demo */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="glass-effect rounded-2xl p-8 shadow-2xl">
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-6 h-6" />
                      <span className="font-semibold">EventEase Dashboard</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-white/80">Active Events</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">1.2k</div>
                      <div className="text-white/80">Total RSVPs</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-white/80">Attendance Rate</div>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Tech Conference 2024</span>
                      <span className="text-sm bg-green-400 text-green-900 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <div className="text-white/80 text-sm">Dec 15, 2024 • San Francisco, CA</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for <span className="gradient-text">Successful Events</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your event management process from start to finish.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect rounded-2xl p-6 card-hover"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Loved by <span className="gradient-text">Event Organizers</span>
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about EventEase
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect rounded-2xl p-6 card-hover"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Create Amazing Events?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of event organizers who trust EventEase for their professional event management needs.
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}