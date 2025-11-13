'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, LayoutGrid, Map, Share2, User } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutGrid },
  { label: 'Mapa', path: '/mapa', icon: Map },
  { label: 'Visualizaciones', path: '/visualizaciones', icon: Share2 },
];

export function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1A1F2E]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1A1F2E]/60"
    >
      <div className="flex h-16 items-center px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center">
            {/* Triangular Logo */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 4L4 28H28L16 4Z"
                fill="#3B82F6"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">{siteConfig.name}</span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="ml-10 hidden items-center space-x-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Tooltip key={item.path} content={item.label}>
                <Link href={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'gap-2 text-gray-400 transition-colors hover:text-white',
                      isActive &&
                        'bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 hover:text-[#3B82F6]'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              </Tooltip>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Tooltip content="Notificaciones">
            <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
              {/* Notification Badge */}
              <Badge
                variant="error"
                size="sm"
                className="absolute -right-1 -top-1 h-5 min-w-[20px] px-1"
              >
                3
              </Badge>
            </Button>
          </Tooltip>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-gray-400 hover:text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6]">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden flex-col items-start text-left lg:flex">
                  <span className="text-sm font-medium text-white">Juan Pérez</span>
                  <span className="text-xs text-gray-400">Administrador</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1E2533] border-white/10">
              <DropdownMenuLabel className="text-gray-300">Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-gray-300 focus:bg-white/10 focus:text-white">
                <User className="mr-2 h-4 w-4" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-white/10 focus:text-white">
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400">
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-white/10 px-4 py-2 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link key={item.path} href={item.path} className="flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'gap-2 text-gray-400 transition-colors hover:text-white',
                  isActive && 'bg-[#3B82F6]/10 text-[#3B82F6]'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </motion.header>
  );
}
