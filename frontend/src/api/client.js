import axios from 'axios'
import { mockFeedback, mockStats, mockSearchResult, mockCompetitors } from './mockData.js'

const http = axios.create({ baseURL: '/api', timeout: 8000 })

// Every call falls back to demo data if the backend route isn't wired up
// yet or isn't reachable, and flags the result as `demo` so the UI can
// show a small "demo data" indicator instead of failing silently.

export async function getDashboardStats() {
  try {
    const { data } = await http.get('/dashboard')
    return { ...data, demo: false }
  } catch {
    return { ...mockStats, demo: true }
  }
}

export async function getFeedback(params = {}) {
  try {
    const { data } = await http.get('/feedback', { params })
    return { items: data.items ?? data, demo: false }
  } catch {
    return { items: mockFeedback, demo: true }
  }
}

export async function createFeedback(payload) {
  const { data } = await http.post('/feedback', payload)
  return data
}

export async function searchFeedback(query) {
  try {
    const { data } = await http.post('/search', { query })
    return { ...data, demo: false }
  } catch {
    return { ...mockSearchResult(query), demo: true }
  }
}

export async function getCompetitors() {
  try {
    const { data } = await http.get('/competitor')
    return { items: data.items ?? data, demo: false }
  } catch {
    return { items: mockCompetitors, demo: true }
  }
}
