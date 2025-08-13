"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"

type FormState<T> = {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isSubmitted: boolean
}

type FormOptions<T> = {
  initialValues: T
  onSubmit: (values: T) => Promise<void> | void
  validate?: (values: T) => Partial<Record<keyof T, string>>
}

export function useForm<T extends Record<string, any>>({ initialValues, onSubmit, validate }: FormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isSubmitted: false,
  })

  // Memoize form state to prevent unnecessary re-renders
  const formState = useMemo(() => {
    return {
      values: state.values,
      errors: state.errors,
      touched: state.touched,
      isSubmitting: state.isSubmitting,
      isSubmitted: state.isSubmitted,
    }
  }, [state.values, state.errors, state.touched, state.isSubmitting, state.isSubmitted])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value

    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: newValue,
      },
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }))
  }, [])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setState((prev) => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }))
  }, [])

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
    }))
  }, [])

  const validateForm = useCallback(
    (values: T) => {
      if (!validate) return {}
      return validate(values)
    },
    [validate],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate form if validate function is provided
      const errors = validateForm(state.values)
      const hasErrors = Object.keys(errors).length > 0

      // Create touched state for all fields
      const allTouched = Object.keys(state.values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>,
      )

      setState((prev) => ({
        ...prev,
        errors,
        touched: allTouched,
      }))

      if (!hasErrors) {
        setState((prev) => ({ ...prev, isSubmitting: true }))

        try {
          await onSubmit(state.values)
          setState((prev) => ({ ...prev, isSubmitted: true, isSubmitting: false }))
        } catch (error) {
          console.error("Form submission error:", error)
          setState((prev) => ({ ...prev, isSubmitting: false }))
        }
      }
    },
    [state.values, validateForm, onSubmit],
  )

  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isSubmitted: false,
    })
  }, [initialValues])

  return {
    ...formState,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    resetForm,
  }
}
