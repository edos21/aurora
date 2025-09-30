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
import { useAuth } from '@/hooks/useAuth'
import PublicRoute from '@/components/auth/PublicRoute'

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setError(null)

    try {
      const success = await login(values)

      if (!success) {
        setError('Credenciales inválidas')
        toast.error('Error en el inicio de sesión')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <PublicRoute>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0D0F12] via-[#0D0F12] to-[#15181E] p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="bg-gradient-to-r from-[#38BDF8] via-[#4ADE80] to-[#A78BFA] bg-clip-text text-4xl font-bold text-transparent">
              ✨ Lumina
            </h1>
            <p className="text-lg text-[#A9B4C4]">Dando luz a tus finanzas</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-2xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-center text-2xl text-[#E4E8F0]">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-center text-[#A9B4C4]">
                Accede a tu dashboard de inversiones
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
                        <FormLabel className="text-[#E4E8F0]">
                          Usuario
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa tu usuario"
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
                            placeholder="Ingresa tu contraseña"
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
                    disabled={isLoading || form.formState.isSubmitting}
                    className="w-full transform bg-gradient-to-r from-[#38BDF8] to-[#4ADE80] font-semibold text-[#0D0F12] transition-all duration-200 hover:scale-[1.02] hover:from-[#0EA5E9] hover:to-[#22C55E]"
                  >
                    {isLoading || form.formState.isSubmitting
                      ? 'Iniciando sesión...'
                      : 'Iniciar Sesión'}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-[#A9B4C4]">
                  ¿No tienes una cuenta?{' '}
                  <Link
                    href="/register"
                    className="font-medium text-[#4ADE80] transition-colors hover:text-[#22C55E]"
                  >
                    Regístrate aquí
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
    </PublicRoute>
  )
}
