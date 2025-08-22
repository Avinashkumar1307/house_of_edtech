"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Search,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { Event } from "@/types";
import { formatDateTime, getTimeUntilEvent } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId));
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const exportAttendees = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/export`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `event-attendees-${eventId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to export attendees:", error);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;

    const now = new Date();
    const eventDate = new Date(event.startDate);

    if (filterStatus === "upcoming") return matchesSearch && eventDate > now;
    if (filterStatus === "past") return matchesSearch && eventDate <= now;

    return matchesSearch;
  });

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : eventDate;

    if (now < eventDate) return "upcoming";
    if (now > endDate) return "past";
    return "ongoing";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "past":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
            <p className="text-gray-600">
              Manage and track all your events in one place
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 sm:mt-0"
          >
            <Link href="/events/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    events.filter((e) => getEventStatus(e) === "upcoming")
                      .length
                  }
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total RSVPs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.reduce(
                    (sum, event) => sum + (event._count?.rsvps || 0),
                    0
                  )}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.reduce((sum, event) => sum + event.views, 0)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past Events</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Events Grid/List */}
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-6">
              {events.length === 0
                ? "You haven't created any events yet. Start by creating your first event!"
                : "No events match your current search or filter criteria."}
            </p>
            {events.length === 0 && (
              <Link href="/events/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </motion.button>
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            <AnimatePresence>
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-effect rounded-xl p-6 card-hover ${
                    viewMode === "list"
                      ? "flex items-center justify-between"
                      : ""
                  }`}
                >
                  <div className={viewMode === "list" ? "flex-1" : ""}>
                    {/* Event Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          getEventStatus(event)
                        )}`}
                      >
                        {getEventStatus(event)}
                      </span>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setSelectedEvent(
                              selectedEvent === event.id ? null : event.id
                            )
                          }
                          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>

                        <AnimatePresence>
                          {selectedEvent === event.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 mt-2 w-48 glass-effect rounded-lg shadow-lg py-1 z-10"
                            >
                              <Link
                                href={`/events/${event.id}/edit`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Event
                              </Link>
                              <Link
                                href={`/event/${event.id}`}
                                target="_blank"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Public Page
                              </Link>
                              <button
                                onClick={() => exportAttendees(event.id)}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Export Attendees
                              </button>
                              <button
                                onClick={() => deleteEvent(event.id)}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Event
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDateTime(event.startDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event._count?.rsvps || 0} RSVPs</span>
                        <span className="mx-2">•</span>
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{event.views} views</span>
                      </div>
                    </div>

                    {/* Time Until Event */}
                    {getEventStatus(event) === "upcoming" && (
                      <div className="text-sm font-medium text-blue-600 mb-4">
                        {getTimeUntilEvent(event.startDate)}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons for List View */}
                  {viewMode === "list" && (
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/events/${event.id}/edit`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </Link>
                      <Link href={`/event/${event.id}`} target="_blank">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
