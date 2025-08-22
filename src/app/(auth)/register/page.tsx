'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

const registerSchema = z
  .object({
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
    email: z.string().email('Por favor ingresa un email válido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(8, 'Confirma tu contraseña'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Manejar errores de validación de Pydantic (422)
        if (response.status === 422 && Array.isArray(errorData.detail)) {
          const validationErrors = errorData.detail
            .map((error: any) => {
              const field = error.loc?.[error.loc.length - 1] || 'campo'
              return `${field}: ${error.msg}`
            })
            .join(', ')
          throw new Error(`Errores de validación: ${validationErrors}`)
        }

        // Manejar otros errores
        throw new Error(
          typeof errorData.detail === 'string'
            ? errorData.detail
            : 'Error al crear la cuenta'
        )
      }

      setSuccess(true)
      toast.success('¡Cuenta creada exitosamente!')

      // Redirigir al login después del registro
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0D0F12] via-[#0D0F12] to-[#15181E] p-8">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl">
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-[#4ADE80]">
                  ¡Cuenta creada exitosamente!
                </h2>
                <p className="text-[#A9B4C4]">
                  Redirigiendo al inicio de sesión...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0D0F12] via-[#0D0F12] to-[#15181E] p-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="bg-gradient-to-r from-[#38BDF8] via-[#4ADE80] to-[#A78BFA] bg-clip-text text-4xl font-bold text-transparent">
            ✨ Lumina
          </h1>
          <p className="text-lg text-[#A9B4C4]">Dando luz a tus finanzas</p>
        </div>

        {/* Register Card */}
        <Card className="shadow-2xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-center text-2xl text-[#E4E8F0]">
              Crear Cuenta
            </CardTitle>
            <CardDescription className="text-center text-[#A9B4C4]">
              Únete a la plataforma de inversiones personales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 border-[#F87171]/20 bg-[#F87171]/10">
                <AlertDescription className="text-[#F87171]">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E4E8F0]">Usuario</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Elige un nombre de usuario"
                          {...field}
                          className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                        />
                      </FormControl>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E4E8F0]">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          {...field}
                          className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                        />
                      </FormControl>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E4E8F0]">
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mínimo 8 caracteres"
                          {...field}
                          className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                        />
                      </FormControl>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E4E8F0]">
                        Confirmar Contraseña
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Repite tu contraseña"
                          {...field}
                          className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                        />
                      </FormControl>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full transform bg-gradient-to-r from-[#38BDF8] to-[#4ADE80] font-semibold text-[#0D0F12] transition-all duration-200 hover:scale-[1.02] hover:from-[#0EA5E9] hover:to-[#22C55E]"
                >
                  {form.formState.isSubmitting
                    ? 'Creando cuenta...'
                    : 'Crear Cuenta'}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#A9B4C4]">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href="/login"
                  className="font-medium text-[#4ADE80] transition-colors hover:text-[#22C55E]"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-[#A9B4C4]">
            Aurora Frontend • Plataforma Lumina
          </p>
        </div>
      </div>
    </div>
  )
}
