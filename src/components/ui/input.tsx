"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  disableAutofill?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disableAutofill = true, autoComplete, ...props }, ref) => {
    // Determinar o valor de autoComplete
    const autoCompleteValue = disableAutofill
      ? "new-password" // Mais eficaz que "off" para bloquear autofill
      : autoComplete || "on"

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        autoComplete={autoCompleteValue}
        autoCorrect={disableAutofill ? "off" : undefined}
        autoCapitalize={disableAutofill ? "off" : undefined}
        spellCheck={disableAutofill ? false : undefined}
        data-form-type={disableAutofill ? "other" : undefined}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
