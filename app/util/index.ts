import { useState } from 'react'

export async function loadImage(str: string) {
  const img = new Image()
  img.src = str
  await img.decode()
  return img
}

export function str(obj: unknown) {
  return JSON.stringify(obj)
}

// Hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue] as const
}

export function send(socket: WebSocket, message: unknown) {
  socket.send(str({ action: 'sendmessage', data: str(message) }))
}
