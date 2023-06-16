import req from './request'

export interface IEvent {
  id: string
  title: string
  description?: string
  happenTime: string
  createdAt: string
}

export function login (code: string) {
  return req(`/login?code=${code}`)
}

export function findAllEvent () {
  return req(`/events`)
}

export function createEvent (data: IEvent) {
  return req(`/events`, { method: 'POST', data })
}

export function deleteEvent(id: string) {
  return req(`/events/${id}`, { method: 'DELETE', data: {} });
}