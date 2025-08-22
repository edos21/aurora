'use client'

import { Button } from '@/components/ui/button'
import { Bell, Search, RotateCw, User, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

export default function TopBar() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const handleSyncPrices = async () => {
    // TODO: Implement price sync
    console.log('Syncing prices...')
  }

  const handleLogout = () => {
    // Eliminar token de localStorage
    localStorage.removeItem('auth_token')

    // Eliminar cookie de autenticación
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'

    toast.success('Sesión cerrada exitosamente')

    // Redirigir al login
    setTimeout(() => {
      window.location.href = '/login'
    }, 500)
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#0D0F12] bg-[#15181E] px-6">
      {/* Search */}
      <div className="flex max-w-md flex-1 items-center">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#A9B4C4]" />
          <Input
            placeholder="Buscar activos, transacciones..."
            className="border-[#15181E] bg-[#0D0F12] pl-10 text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {/* Sync Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSyncPrices}
          className="border-[#15181E] bg-[#0D0F12] text-[#A9B4C4] transition-all duration-200 hover:border-[#4ADE80]/20 hover:bg-gradient-to-r hover:from-[#38BDF8]/10 hover:to-[#4ADE80]/10 hover:text-[#4ADE80]"
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Sincronizar
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative text-[#A9B4C4] transition-colors hover:bg-[#0D0F12]/50 hover:text-[#E4E8F0]"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#4ADE80]"></span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative h-8 w-8 rounded-full text-[#A9B4C4] transition-colors hover:bg-[#0D0F12]/50 hover:text-[#E4E8F0]"
            >
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-[#0D0F12] bg-[#15181E] shadow-2xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-start gap-2 border-b border-[#0D0F12] bg-[#0D0F12]/50 p-3">
              <div className="flex flex-col space-y-1 leading-none">
                {isLoading ? (
                  <p className="font-medium text-[#E4E8F0]">Cargando...</p>
                ) : isAuthenticated && user ? (
                  <>
                    <p className="font-medium text-[#E4E8F0]">
                      {user.username}
                    </p>
                    <p className="w-[200px] truncate text-sm text-[#A9B4C4]">
                      {user.email}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-[#E4E8F0]">Sin Conexión</p>
                    <p className="w-[200px] truncate text-sm text-[#F87171]">
                      Backend no disponible
                    </p>
                  </>
                )}
              </div>
            </div>
            <DropdownMenuSeparator className="bg-[#0D0F12]" />
            <DropdownMenuItem className="text-[#E4E8F0] transition-colors hover:bg-[#0D0F12]/50 hover:text-[#4ADE80]">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#E4E8F0] transition-colors hover:bg-[#0D0F12]/50 hover:text-[#4ADE80]">
              <Search className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#0D0F12]" />
            <DropdownMenuItem
              className="cursor-pointer font-medium text-[#F87171] transition-colors hover:bg-[#F87171]/10 hover:text-[#F87171]"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
