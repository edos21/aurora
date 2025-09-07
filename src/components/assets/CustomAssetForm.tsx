'use client'

import { useState } from 'react'
import { Save, X, Plus, Info } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'

const assetSchema = z.object({
  ticker: z
    .string()
    .min(1, 'Ticker es requerido')
    .max(20, 'Máximo 20 caracteres'),
  name: z
    .string()
    .min(1, 'Nombre es requerido')
    .max(255, 'Máximo 255 caracteres'),
  asset_type: z.enum(['CRYPTO', 'STOCK', 'ETF', 'BOND', 'COMMODITY', 'OTHER']),
  classification: z.enum([
    'GROWTH',
    'VALUE',
    'DIVIDEND',
    'DEFENSIVE',
    'CYCLICAL',
    'OTHER',
  ]),
  currency: z
    .string()
    .min(3, 'Moneda debe tener 3 caracteres')
    .max(3, 'Moneda debe tener 3 caracteres'),
  notes: z.string().optional(),
})

type AssetFormData = z.infer<typeof assetSchema>

interface CustomAssetFormProps {
  onSave: (asset: AssetFormData) => void
  onCancel: () => void
  initialData?: Partial<AssetFormData>
}

export function CustomAssetForm({
  onSave,
  onCancel,
  initialData,
}: CustomAssetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      ticker: initialData?.ticker || '',
      name: initialData?.name || '',
      asset_type: initialData?.asset_type || 'CRYPTO',
      classification: initialData?.classification || 'GROWTH',
      currency: initialData?.currency || 'USD',
      notes: initialData?.notes || '',
    },
  })

  const watchedAssetType = watch('asset_type')

  const onSubmit = async (data: AssetFormData) => {
    setIsSubmitting(true)
    try {
      await onSave(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const assetTypeOptions = [
    {
      value: 'CRYPTO',
      label: 'Criptomoneda',
      description: 'Bitcoin, Ethereum, etc.',
    },
    { value: 'STOCK', label: 'Acción', description: 'Acciones de empresas' },
    { value: 'ETF', label: 'ETF', description: 'Fondos cotizados' },
    {
      value: 'BOND',
      label: 'Bono',
      description: 'Bonos gubernamentales/corporativos',
    },
    {
      value: 'COMMODITY',
      label: 'Commodity',
      description: 'Oro, plata, petróleo',
    },
    { value: 'OTHER', label: 'Otro', description: 'Otros tipos de activos' },
  ]

  const classificationOptions = [
    {
      value: 'GROWTH',
      label: 'Crecimiento',
      description: 'Activos con potencial de crecimiento',
    },
    { value: 'VALUE', label: 'Valor', description: 'Activos infravalorados' },
    {
      value: 'DIVIDEND',
      label: 'Dividendo',
      description: 'Activos que pagan dividendos',
    },
    {
      value: 'DEFENSIVE',
      label: 'Defensivo',
      description: 'Activos estables en crisis',
    },
    {
      value: 'CYCLICAL',
      label: 'Cíclico',
      description: 'Activos que siguen ciclos económicos',
    },
    { value: 'OTHER', label: 'Otro', description: 'Otras clasificaciones' },
  ]

  const currencyOptions = [
    { value: 'USD', label: 'USD - Dólar Estadounidense' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - Libra Esterlina' },
    { value: 'JPY', label: 'JPY - Yen Japonés' },
    { value: 'CAD', label: 'CAD - Dólar Canadiense' },
    { value: 'AUD', label: 'AUD - Dólar Australiano' },
    { value: 'CHF', label: 'CHF - Franco Suizo' },
    { value: 'CNY', label: 'CNY - Yuan Chino' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Crear Asset Personalizado</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ticker">Ticker / Símbolo *</Label>
              <Input
                id="ticker"
                placeholder="Ej: BTC, AAPL, GOLD"
                {...register('ticker')}
                className={errors.ticker ? 'border-red-500' : ''}
              />
              {errors.ticker && (
                <p className="text-sm text-red-500">{errors.ticker.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                placeholder="Ej: Bitcoin, Apple Inc., SPDR Gold Trust"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          {/* Asset Type and Classification */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="asset_type">Tipo de Asset *</Label>
              <Select
                value={watchedAssetType}
                onValueChange={value => setValue('asset_type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-muted-foreground text-sm">
                          {option.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classification">Clasificación *</Label>
              <Select
                value={watch('classification')}
                onValueChange={value =>
                  setValue('classification', value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar clasificación" />
                </SelectTrigger>
                <SelectContent>
                  {classificationOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-muted-foreground text-sm">
                          {option.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="currency">Moneda *</Label>
            <Select
              value={watch('currency')}
              onValueChange={value => setValue('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar moneda" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Información adicional sobre el asset..."
              rows={3}
              {...register('notes')}
            />
          </div>

          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Los assets personalizados no tendrán precios automáticos de APIs
              externas. Deberás actualizar los precios manualmente o vincularlos
              a una fuente externa más tarde.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                'Guardando...'
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Asset
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
