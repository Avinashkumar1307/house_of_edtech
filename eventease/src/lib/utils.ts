import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getTimeUntilEvent(eventDate: Date | string) {
  const now = new Date()
  const event = new Date(eventDate)
  const diffTime = event.getTime() - now.getTime()
  
  if (diffTime <= 0) return 'Event has started'
  
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 7) return `In ${diffDays} days`
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`
  if (diffDays < 365) return `In ${Math.ceil(diffDays / 30)} months`
  return `In ${Math.ceil(diffDays / 365)} years`
}