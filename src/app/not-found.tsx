'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Calendar, ArrowLeft, MapPin, Clock } from 'lucide-react';

const NotFoundPage = () => {
  // Mock data for suggested events (similar to your main page style)
  const suggestedEvents = [
    {
      title: "Tech Conference 2024",
      date: "Dec 15, 2024",
      location: "San Francisco, CA",
      attendees: 250,
      status: "Active"
    },
    {
      title: "Marketing Summit",
      date: "Jan 20, 2025",
      location: "New York, NY",
      attendees: 180,
      status: "Open"
    },
    {
      title: "Design Workshop",
      date: "Feb 5, 2025",
      location: "Austin, TX",
      attendees: 75,
      status: "Active"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          {/* 404 Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="glass-effect rounded-3xl p-8 inline-block mb-8">
              <motion.h1 
                className="text-8xl sm:text-9xl font-bold gradient-text mb-4"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(99, 102, 241, 0.5)",
                    "0 0 30px rgba(168, 85, 247, 0.5)",
                    "0 0 20px rgba(99, 102, 241, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                404
              </motion.h1>
              <motion.div 
                className="flex justify-center space-x-2 mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Calendar className="w-8 h-8 text-blue-500" />
                <Search className="w-8 h-8 text-purple-500" />
                <MapPin className="w-8 h-8 text-indigo-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Oops! Event Not Found
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              It looks like this page decided to skip the event. Don't worry, we have plenty of other amazing events waiting for you!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4 flex items-center justify-center"
              onClick={() => window.location.href = '/'}
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </motion.button>
          </motion.div>

          {/* Suggested Events */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Maybe you're looking for these <span className="gradient-text">upcoming events</span>?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestedEvents.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  className="glass-effect rounded-2xl p-6 card-hover cursor-pointer"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      event.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {event.status}
                    </span>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {event.attendees} attendees
                      </span>
                      <motion.button 
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        View Event →
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Fun Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 glass-effect rounded-2xl p-8 max-w-3xl mx-auto"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              While you're here, check out what's happening on EventEase
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold gradient-text mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  2,450
                </motion.div>
                <div className="text-sm text-gray-600">Active Events</div>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold gradient-text mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  45k+
                </motion.div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold gradient-text mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  120k
                </motion.div>
                <div className="text-sm text-gray-600">Total RSVPs</div>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-3xl font-bold gradient-text mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                >
                  97%
                </motion.div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn-primary:hover {
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          transform: translateY(-2px);
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #4f46e5;
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
          background: rgba(102, 126, 234, 0.1);
          border-color: rgba(102, 126, 234, 0.4);
          transform: translateY(-2px);
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;