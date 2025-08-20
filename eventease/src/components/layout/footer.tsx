'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Github, Linkedin, Mail, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="glass-effect mt-20 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500"
              >
                <Calendar className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold gradient-text">EventEase</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Professional event management and planning tool for seamless event organization and attendee management. Create, manage, and track your events with ease.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com/your-username"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:your-email@example.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-600 hover:text-purple-800 transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/events"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                My Events
              </Link>
              <Link
                href="/events/create"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Create Event
              </Link>
              <Link
                href="/explore"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Explore Events
              </Link>
              <Link
                href="/help"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Help Center
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Contact Us
              </Link>
              <Link
                href="/privacy"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/faq"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 text-gray-600 mb-4 md:mb-0">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </motion.div>
            <span>by <strong className="gradient-text">Your Name</strong></span>
          </div>
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} EventEase. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}