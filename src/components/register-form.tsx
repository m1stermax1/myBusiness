"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    }
  }

  const passwordValidation = validatePassword(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      setLoading(false)
      return
    }

    if (!passwordValidation.isValid) {
      setError("La contraseña no cumple con los requisitos de seguridad.")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        if (error.message.includes("already registered")) {
          setError("Este email ya está registrado. Intenta iniciar sesión.")
        } else {
          setError(error.message)
        }
        return
      }

      if (data.user) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (err) {
      setError("Error inesperado. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <h3 className="text-lg font-medium text-green-700">¡Registro exitoso!</h3>
        <p className="text-sm text-gray-600">Redirigiendo al dashboard...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Tu nombre completo"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {password && (
          <div className="text-xs space-y-1">
            <div
              className={`flex items-center gap-1 ${passwordValidation.minLength ? "text-green-600" : "text-red-600"}`}
            >
              <div className={`w-2 h-2 rounded-full ${passwordValidation.minLength ? "bg-green-600" : "bg-red-600"}`} />
              Mínimo 8 caracteres
            </div>
            <div
              className={`flex items-center gap-1 ${passwordValidation.hasUpperCase ? "text-green-600" : "text-red-600"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${passwordValidation.hasUpperCase ? "bg-green-600" : "bg-red-600"}`}
              />
              Una letra mayúscula
            </div>
            <div
              className={`flex items-center gap-1 ${passwordValidation.hasLowerCase ? "text-green-600" : "text-red-600"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${passwordValidation.hasLowerCase ? "bg-green-600" : "bg-red-600"}`}
              />
              Una letra minúscula
            </div>
            <div
              className={`flex items-center gap-1 ${passwordValidation.hasNumbers ? "text-green-600" : "text-red-600"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${passwordValidation.hasNumbers ? "bg-green-600" : "bg-red-600"}`}
              />
              Un número
            </div>
            <div
              className={`flex items-center gap-1 ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-red-600"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${passwordValidation.hasSpecialChar ? "bg-green-600" : "bg-red-600"}`}
              />
              Un carácter especial
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading || !passwordValidation.isValid}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          "Crear Cuenta"
        )}
      </Button>
    </form>
  )
}
