"use client"

import { useState, useEffect } from "react"

export function useSessionStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      // Obter do sessionStorage
      const item = sessionStorage.getItem(key)
      // Analisar JSON armazenado ou retornar initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Erro ao obter item do sessionStorage (${key}):`, error)
      return initialValue
    }
  })

  // Retornar uma versão encapsulada da função setter do useState
  // que persiste o novo valor no sessionStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que o valor seja uma função para que tenhamos a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Salvar estado
      setStoredValue(valueToStore)

      // Salvar no sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Erro ao definir item no sessionStorage (${key}):`, error)
    }
  }

  // Sincronizar com sessionStorage quando a chave muda
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      const item = sessionStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Erro ao sincronizar com sessionStorage (${key}):`, error)
    }
  }, [key])

  return [storedValue, setValue] as const
}
