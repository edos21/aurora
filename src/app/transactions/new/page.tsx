'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ArrowLeft, Plus, Calculator } from 'lucide-react'
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

import { useAssets } from '@/hooks/useAssets'
import { useCreateTransaction } from '@/hooks/useTransactions'
import type { TransactionCreate, TransactionType } from '@/types'

// Schema de validación
const transactionSchema = z.object({
  asset_id: z.string().min(1, 'Selecciona un activo'),
  date: z.string().min(1, 'La fecha es requerida'),
  type: z.enum(['BUY', 'SELL']),
  quantity: z
    .number({ message: 'La cantidad debe ser un número válido' })
    .positive('La cantidad debe ser mayor a 0')
    .min(0.00000001, 'La cantidad mínima es 0.00000001'),
  price_per_unit: z
    .number({ message: 'El precio debe ser un número válido' })
    .positive('El precio debe ser mayor a 0')
    .min(0.00000001, 'El precio mínimo es 0.00000001'),
  total_amount: z
    .number({ message: 'El total debe ser un número válido' })
    .positive('El total debe ser mayor a 0')
    .min(0.01, 'El total mínimo es 0.01'),
  currency: z
    .string()
    .length(3, 'La moneda debe tener exactamente 3 caracteres')
    .regex(
      /^[A-Z]{3}$/,
      'La moneda debe estar en formato ISO 4217 (ej: USD, EUR)'
    ),
  commission: z
    .number({ message: 'La comisión debe ser un número válido' })
    .min(0, 'La comisión no puede ser negativa')
    .default(0),
  notes: z.string().optional(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

const transactionTypeOptions = [
  { value: 'BUY', label: 'Compra', color: 'text-[#4ADE80]' },
  { value: 'SELL', label: 'Venta', color: 'text-[#F87171]' },
] as const

const commonCurrencies = [
  { value: 'USD', label: 'USD - Dólar Estadounidense' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'ARS', label: 'ARS - Peso Argentino' },
  { value: 'BRL', label: 'BRL - Real Brasileño' },
  { value: 'GBP', label: 'GBP - Libra Esterlina' },
  { value: 'JPY', label: 'JPY - Yen Japonés' },
]

const getTodayDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

export default function NewTransactionPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const { data: assets = [], isLoading: assetsLoading } = useAssets({
    limit: 1000,
  })

  const createTransaction = useCreateTransaction()

  const form = useForm<TransactionFormData>({
    defaultValues: {
      asset_id: '',
      date: getTodayDate(),
      type: 'BUY' as const,
      quantity: 0,
      price_per_unit: 0,
      total_amount: 0,
      currency: 'USD',
      commission: 0,
      notes: '',
    },
    mode: 'onChange',
  })

  const quantity = form.watch('quantity')
  const pricePerUnit = form.watch('price_per_unit')
  const commission = form.watch('commission')

  useEffect(() => {
    const qty = Number(quantity)
    const price = Number(pricePerUnit)
    const comm = Number(commission) || 0

    if (!isNaN(qty) && !isNaN(price) && qty > 0 && price > 0) {
      const calculatedTotal = qty * price + comm
      form.setValue('total_amount', Number(calculatedTotal.toFixed(2)))
    }
  }, [quantity, pricePerUnit, commission, form])

  const onSubmit = async (values: TransactionFormData) => {
    setError(null)

    try {
      // Validate with Zod schema
      const validatedData = transactionSchema.parse({
        ...values,
        quantity: Number(values.quantity),
        price_per_unit: Number(values.price_per_unit),
        total_amount: Number(values.total_amount),
        commission: Number(values.commission) || 0,
      })

      const transactionData: TransactionCreate = {
        asset_id: validatedData.asset_id,
        date: validatedData.date,
        type: validatedData.type as TransactionType,
        quantity: validatedData.quantity,
        price_per_unit: validatedData.price_per_unit,
        total_amount: validatedData.total_amount,
        currency: validatedData.currency.toUpperCase(),
        commission: validatedData.commission,
        notes: validatedData.notes || undefined,
      }

      await createTransaction.mutateAsync(transactionData)

      toast.success('¡Transacción registrada exitosamente!')
      router.push('/transactions')
    } catch (err: any) {
      // Handle Zod validation errors
      if (err.name === 'ZodError') {
        const firstError = err.errors?.[0]
        const errorMessage = firstError
          ? `${firstError.path.join('.')}: ${firstError.message}`
          : 'Error de validación'
        setError(errorMessage)
        toast.error(errorMessage)
      } else {
        const errorMessage =
          err.data?.detail || err.message || 'Error al registrar la transacción'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0F12] p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/transactions">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#E4E8F0]">
              Nueva Transacción
            </h1>
            <p className="text-[#A9B4C4]">
              Registra una compra o venta de activos
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#E4E8F0]">
              <Plus className="h-5 w-5 text-[#4ADE80]" />
              Detalles de la Transacción
            </CardTitle>
            <CardDescription className="text-[#A9B4C4]">
              Completa la información de tu operación
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
                {/* Asset Selection */}
                <FormField
                  control={form.control}
                  name="asset_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#E4E8F0]">Activo *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={assetsLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20">
                            <SelectValue
                              placeholder={
                                assetsLoading
                                  ? 'Cargando activos...'
                                  : 'Selecciona un activo'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {assets.map(asset => (
                            <SelectItem key={asset.id} value={asset.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {asset.ticker}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  {asset.name}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-[#A9B4C4]">
                        Selecciona el activo que deseas operar
                      </FormDescription>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                {/* Date and Type Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#E4E8F0]">
                          Fecha *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            max={getTodayDate()}
                            className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                          />
                        </FormControl>
                        <FormDescription className="text-[#A9B4C4]">
                          Fecha de la operación
                        </FormDescription>
                        <FormMessage className="text-[#F87171]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#E4E8F0]">
                          Tipo de Operación *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20">
                              <SelectValue placeholder="Compra o Venta" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {transactionTypeOptions.map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <span className={option.color}>
                                  {option.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-[#A9B4C4]">
                          Compra o venta del activo
                        </FormDescription>
                        <FormMessage className="text-[#F87171]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Quantity and Price Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#E4E8F0]">
                          Cantidad *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.00000001"
                            min="0.00000001"
                            placeholder="0.00000000"
                            {...field}
                            className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                          />
                        </FormControl>
                        <FormDescription className="text-[#A9B4C4]">
                          Unidades del activo operadas
                        </FormDescription>
                        <FormMessage className="text-[#F87171]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_per_unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#E4E8F0]">
                          Precio por Unidad *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.00000001"
                            min="0.00000001"
                            placeholder="0.00000000"
                            {...field}
                            className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                          />
                        </FormControl>
                        <FormDescription className="text-[#A9B4C4]">
                          Precio unitario en la moneda de operación
                        </FormDescription>
                        <FormMessage className="text-[#F87171]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Currency and Commission Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#E4E8F0]">
                          Moneda *
                        </FormLabel>
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
                          Moneda de la operación
                        </FormDescription>
                        <FormMessage className="text-[#F87171]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="commission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#E4E8F0]">
                          Comisión
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                          />
                        </FormControl>
                        <FormDescription className="text-[#A9B4C4]">
                          Comisión o fees (opcional)
                        </FormDescription>
                        <FormMessage className="text-[#F87171]" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Total Amount (Auto-calculated) */}
                <FormField
                  control={form.control}
                  name="total_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-[#E4E8F0]">
                        <Calculator className="h-4 w-4" />
                        Total de la Operación *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          {...field}
                          className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                        />
                      </FormControl>
                      <FormDescription className="text-[#A9B4C4]">
                        Se calcula automáticamente: (cantidad × precio) +
                        comisión
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
                          placeholder="ej: Comprado en broker XYZ, stop loss en..."
                          {...field}
                          className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                        />
                      </FormControl>
                      <FormDescription className="text-[#A9B4C4]">
                        Notas personales sobre esta transacción
                      </FormDescription>
                      <FormMessage className="text-[#F87171]" />
                    </FormItem>
                  )}
                />

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={createTransaction.isPending || assetsLoading}
                    className="flex-1 bg-gradient-to-r from-[#38BDF8] to-[#4ADE80] font-semibold text-[#0D0F12] transition-all duration-200 hover:scale-[1.02] hover:from-[#0EA5E9] hover:to-[#22C55E]"
                  >
                    {createTransaction.isPending
                      ? 'Registrando...'
                      : 'Registrar Transacción'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/transactions')}
                    disabled={createTransaction.isPending}
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
