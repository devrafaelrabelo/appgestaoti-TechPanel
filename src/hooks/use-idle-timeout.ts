"use client"

import { useEffect, useState, useRef, useCallback } from "react"

type IdleTimeoutOptions = {
  timeout: number // tempo em milissegundos
  onIdle?: () => void
  onActive?: () => void
  events?: string[]
  debounce?: number
}

export function useIdleTimeout({
  timeout,
  onIdle,
  onActive,
  events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"],
  debounce = 500,
}: IdleTimeoutOptions) {
  const [isIdle, setIsIdle] = useState(false)
  const idleTimer = useRef<NodeJS.Timeout | null>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = useCallback(() => {
    if (isIdle) {
      setIsIdle(false)
      onActive?.()
    }

    if (idleTimer.current) {
      clearTimeout(idleTimer.current)
    }

    idleTimer.current = setTimeout(() => {
      setIsIdle(true)
      onIdle?.()
    }, timeout)
  }, [isIdle, onActive, onIdle, timeout])

  const handleActivity = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      resetTimer()
    }, debounce)
  }, [debounce, resetTimer])

  useEffect(() => {
    // Inicializa o timer
    resetTimer()

    // Adiciona event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    // Cleanup
    return () => {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current)
      }
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [events, handleActivity, resetTimer])

  // Função para resetar manualmente o timer
  const manualResetTimer = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  return { isIdle, resetTimer: manualResetTimer }
}
