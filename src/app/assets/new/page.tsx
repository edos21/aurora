'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

import { apiClient, API_ENDPOINTS } from '@/lib/api'
import type { AssetCreate, AssetType, AssetClassification } from '@/types'

// Schemas de validación usando los tipos existentes
const assetSchema = z.object({
  ticker: z
    .string()
    .min(1, 'El ticker es requerido')
    .max(20, 'El ticker no puede tener más de 20 caracteres')
    .regex(
      /^[A-Z0-9.-]+$/,
      'El ticker solo puede contener letras mayúsculas, números, puntos y guiones'
    ),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre no puede tener más de 255 caracteres'),
  asset_type: z.enum(['ETF', 'STOCK', 'CRYPTO', 'BOND', 'CASH', 'OTHER']),
  classification: z.enum([
    'renta_fija',
    'renta_variable',
    'crypto',
    'alternative',
    'cash',
  ]),
  currency: z
    .string()
    .length(3, 'La moneda debe tener exactamente 3 caracteres')
    .regex(
      /^[A-Z]{3}$/,
      'La moneda debe estar en formato ISO 4217 (ej: USD, EUR)'
    ),
  notes: z.string().optional(),
})

type AssetFormData = z.infer<typeof assetSchema>

const assetTypeOptions = [
  { value: 'ETF', label: 'ETF - Exchange Traded Fund' },
  { value: 'STOCK', label: 'Stock - Acción' },
  { value: 'CRYPTO', label: 'Crypto - Criptomoneda' },
  { value: 'BOND', label: 'Bond - Bono' },
  { value: 'CASH', label: 'Cash - Efectivo' },
  { value: 'OTHER', label: 'Other - Otro' },
] as const

const classificationOptions = [
  { value: 'renta_fija', label: 'Renta Fija' },
  { value: 'renta_variable', label: 'Renta Variable' },
  { value: 'crypto', label: 'Criptomonedas' },
  { value: 'alternative', label: 'Inversiones Alternativas' },
  { value: 'cash', label: 'Efectivo' },
] as const

const commonCurrencies = [
  { value: 'USD', label: 'USD - Dólar Estadounidense' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'ARS', label: 'ARS - Peso Argentino' },
  { value: 'BRL', label: 'BRL - Real Brasileño' },
  { value: 'GBP', label: 'GBP - Libra Esterlina' },
  { value: 'JPY', label: 'JPY - Yen Japonés' },
]

export default function NewAssetPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      ticker: '',
      name: '',
      asset_type: undefined,
      classification: undefined,
      currency: 'USD',
      notes: '',
    },
  })

  const onSubmit = async (values: AssetFormData) => {
    setError(null)
    setIsSubmitting(true)

    try {
      const assetData: AssetCreate = {
        ticker: values.ticker.toUpperCase(),
        name: values.name,
        asset_type: values.asset_type as AssetType,
        classification: values.classification as AssetClassification,
        currency: values.currency.toUpperCase(),
        notes: values.notes || undefined,
      }

      await apiClient.post(API_ENDPOINTS.ASSETS, assetData)

      toast.success('¡Activo creado exitosamente!')

      // Redirigir a la lista de activos
      router.push('/assets')
    } catch (err: any) {
      const errorMessage =
        err.data?.detail || err.message || 'Error al crear el activo'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0F12] p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/assets">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#E4E8F0]">
              Asset Personalizado
            </h1>
            <p className="text-[#A9B4C4]">
              Crea un activo personalizado que no esté disponible en APIs
              externas
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#E4E8F0]">
              <Plus className="h-5 w-5 text-[#4ADE80]" />
              Asset Personalizado
            </CardTitle>
            <CardDescription className="text-[#A9B4C4]">
              Define un activo que no esté disponible en fuentes externas como
              CoinGecko o yfinance
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
                {/* Ticker */}
                <FormField
                  control={form.control}
                  name="ticker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E4E8F0]">
                        Ticker / Símbolo *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ej: AAPL, BTC-USD, MELI"
                          {...field}
                          onChange={e =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                        />
                      </FormControl>
                      <FormDescription className="text-[#A9B4C4]">
                        Símbolo único del activo (se convertirá automáticamente
                        a mayúsculas)
                      </FormDescription>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E4E8F0]">
                        Nombre Completo *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ej: Apple Inc., Bitcoin USD, MercadoLibre Inc."
                          {...field}
                          className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                        />
                      </FormControl>
                      <FormDescription className="text-[#A9B4C4]">
                        Nombre descriptivo del activo
                      </FormDescription>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                {/* Asset Type */}
                <FormField
                  control={form.control}
                  name="asset_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E4E8F0]">
                        Tipo de Activo *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20">
                            <SelectValue placeholder="Selecciona el tipo de activo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {assetTypeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-[#A9B4C4]">
                        Categoría del instrumento financiero
                      </FormDescription>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                {/* Classification */}
                <FormField
                  control={form.control}
                  name="classification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E4E8F0]">
                        Clasificación de Inversión *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20">
                            <SelectValue placeholder="Selecciona la clasificación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classificationOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-[#A9B4C4]">
                        Clasificación para análisis de allocation
                      </FormDescription>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                {/* Currency */}
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E4E8F0]">Moneda *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20">
                            <SelectValue placeholder="Selecciona la moneda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {commonCurrencies.map(currency => (
                            <SelectItem
                              key={currency.value}
                              value={currency.value}
                            >
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-[#A9B4C4]">
                        Moneda en la que cotiza el activo (ISO 4217)
                      </FormDescription>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E4E8F0]">
                        Notas (Opcional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ej: Comprado en broker XYZ, recomendado por..."
                          {...field}
                          className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                        />
                      </FormControl>
                      <FormDescription className="text-[#A9B4C4]">
                        Notas personales sobre este activo
                      </FormDescription>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-[#38BDF8] to-[#4ADE80] font-semibold text-[#0D0F12] transition-all duration-200 hover:scale-[1.02] hover:from-[#0EA5E9] hover:to-[#22C55E]"
                  >
                    {isSubmitting ? 'Creando...' : 'Crear Activo'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/assets')}
                    disabled={isSubmitting}
                    className="border-[#15181E] text-[#A9B4C4] hover:text-[#E4E8F0]"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
