'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ArrowUpDown,
  Coins,
  BarChart3,
  Settings,
  Activity,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Vista general de tu portfolio',
  },
  {
    name: 'Transacciones',
    href: '/transactions',
    icon: ArrowUpDown,
    description: 'Registro de operaciones',
  },
  {
    name: 'Activos',
    href: '/assets',
    icon: Coins,
    description: 'Gestión de instrumentos',
  },
  {
    name: 'Análisis',
    href: '/analysis',
    icon: BarChart3,
    description: 'Métricas y rebalanceo',
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
    description: 'Ajustes y APIs',
  },
]

const quickActions = [
  {
    name: 'Nueva Transacción',
    href: '/transactions/new',
    icon: Plus,
    variant: 'default' as const,
  },
  {
    name: 'Sistema',
    href: '/health',
    icon: Activity,
    variant: 'outline' as const,
  },
]

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'flex h-full w-64 flex-col border-r border-[#15181E] bg-[#15181E]',
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-[#0D0F12] px-6">
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-2xl">✨</span>
          <span className="bg-gradient-to-r from-[#38BDF8] via-[#4ADE80] to-[#A78BFA] bg-clip-text text-xl font-bold text-transparent">
            Lumina
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        <div className="space-y-1">
          {navigation.map(item => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'border border-[#4ADE80]/20 bg-gradient-to-r from-[#38BDF8]/10 to-[#4ADE80]/10 text-[#4ADE80]'
                    : 'text-[#A9B4C4] hover:scale-[1.02] hover:bg-[#0D0F12]/50 hover:text-[#E4E8F0]'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-4 w-4 flex-shrink-0 transition-colors',
                    isActive
                      ? 'text-[#4ADE80]'
                      : 'text-[#A9B4C4] group-hover:text-[#E4E8F0]'
                  )}
                />
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#4ADE80]" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-[#0D0F12]" />

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="px-3 text-xs font-semibold tracking-wider text-[#A9B4C4] uppercase">
            Acciones Rápidas
          </p>
          <div className="space-y-1">
            {quickActions.map(action => (
              <Button
                key={action.name}
                variant={action.variant}
                size="sm"
                className={cn(
                  'w-full justify-start transition-all duration-200 hover:scale-[1.02]',
                  action.variant === 'default'
                    ? 'bg-gradient-to-r from-[#38BDF8] to-[#4ADE80] font-semibold text-[#0D0F12] hover:from-[#0EA5E9] hover:to-[#22C55E]'
                    : 'border-[#15181E] bg-[#0D0F12] text-[#A9B4C4] hover:border-[#4ADE80]/20 hover:bg-[#15181E] hover:text-[#E4E8F0]'
                )}
                asChild
              >
                <Link href={action.href}>
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#0D0F12] p-4">
        <div className="text-xs text-[#A9B4C4]">
          <p className="font-medium text-[#E4E8F0]">Sprint 1 - MVP</p>
          <p className="mt-1">Aurora Frontend v0.1.0</p>
        </div>
      </div>
    </div>
  )
}
