"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useCEPLookup } from "@/hooks/use-cep-lookup"
import { formatCEP, isValidCEPFormat, cleanCEP } from "@/utils/cep-validator"
import type { AddressData } from "@/utils/cep-validator"

interface CEPInputProps {
  value: string
  onChange: (value: string) => void
  onAddressFound?: (address: AddressData) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showManualLookup?: boolean
}

export function CEPInput({
  value,
  onChange,
  onAddressFound,
  placeholder = "00000-000",
  disabled = false,
  className = "",
  showManualLookup = true,
}: CEPInputProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [validationStatus, setValidationStatus] = useState<"idle" | "valid" | "invalid">("idle")

  const { loading, error, lookupCEP, clearError } = useCEPLookup()

  // Sincronizar com valor externo
  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  // Validar CEP quando mudar
  useEffect(() => {
    if (!displayValue) {
      setValidationStatus("idle")
      return
    }

    const cleanedCEP = cleanCEP(displayValue)

    if (cleanedCEP.length === 8) {
      if (isValidCEPFormat(cleanedCEP)) {
        setValidationStatus("valid")
        // Auto-lookup quando CEP estiver completo e válido
        handleCEPLookup(cleanedCEP)
      } else {
        setValidationStatus("invalid")
      }
    } else {
      setValidationStatus("idle")
    }
  }, [displayValue])

  const handleInputChange = (inputValue: string) => {
    // Aplicar formatação
    const formatted = formatCEP(inputValue)
    setDisplayValue(formatted)
    onChange(formatted)

    // Limpar erro anterior
    if (error) {
      clearError()
    }
  }

  const handleCEPLookup = async (cep?: string) => {
    const cepToLookup = cep || cleanCEP(displayValue)

    if (!isValidCEPFormat(cepToLookup)) {
      return
    }

    try {
      const addressData = await lookupCEP(cepToLookup)
      if (addressData && onAddressFound) {
        onAddressFound(addressData)
      }
    } catch (err) {
      // Erro já é tratado pelo hook
      console.error("Erro ao buscar CEP:", err)
    }
  }

  const getInputClassName = () => {
    let className = "pr-20"

    if (validationStatus === "valid") {
      className += " border-green-500 focus:border-green-500"
    } else if (validationStatus === "invalid" || error) {
      className += " border-red-500 focus:border-red-500"
    }

    return className
  }

  const renderStatusIcon = () => {
    if (loading) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }

    if (error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }

    if (validationStatus === "valid") {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }

    return <MapPin className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <Input
          type="text"
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || loading}
          maxLength={9} // 00000-000
          className={getInputClassName()}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {renderStatusIcon()}

          {showManualLookup && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleCEPLookup()}
              disabled={!isValidCEPFormat(cleanCEP(displayValue)) || disabled}
              className="h-6 w-6 p-0"
            >
              <Search className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Badge variant="destructive" className="text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </Badge>
      )}

      {validationStatus === "invalid" && !error && (
        <Badge variant="destructive" className="text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          CEP inválido
        </Badge>
      )}

      {loading && (
        <Badge variant="secondary" className="text-xs">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Consultando CEP...
        </Badge>
      )}
    </div>
  )
}
