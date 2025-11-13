'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Map, Share2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutGrid },
  { id: 'map', label: 'Mapa', path: '/mapa', icon: Map },
  { id: 'visualizations', label: 'Visualizaciones', path: '/visualizaciones', icon: Share2 },
  { id: 'network', label: 'Red', path: '/red', icon: Share2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isSidebarCollapsed ? 64 : 240,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex h-full flex-col border-r border-white/10 bg-[#1A1F2E]"
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        <AnimatePresence mode="wait">
          {!isSidebarCollapsed ? (
            <motion.div
              key="expanded-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <div className="flex h-8 w-8 items-center justify-center">
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
              <span className="text-lg font-bold text-white">{siteConfig.name}</span>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-8 w-8 items-center justify-center"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          const button = (
            <Link key={item.id} href={item.path} className="block w-full">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 text-gray-400 transition-colors hover:bg-white/5 hover:text-white',
                  isActive &&
                    'bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 hover:text-[#3B82F6]',
                  isSidebarCollapsed && 'justify-center'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!isSidebarCollapsed && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          );

          if (isSidebarCollapsed) {
            return (
              <Tooltip key={item.id} content={item.label} side="right">
                {button}
              </Tooltip>
            );
          }

          return button;
        })}
      </nav>

      {/* Collapse Button */}
      <div className="border-t border-white/10 p-2">
        <Tooltip
          content={isSidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          side="right"
        >
          <Button
            variant="ghost"
            onClick={toggleSidebar}
            className={cn(
              'w-full justify-start gap-3 text-gray-400 transition-colors hover:bg-white/5 hover:text-white',
              isSidebarCollapsed && 'justify-center'
            )}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <>
                <PanelLeftClose className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">Colapsar</span>
              </>
            )}
          </Button>
        </Tooltip>
      </div>
    </motion.aside>
  );
}
