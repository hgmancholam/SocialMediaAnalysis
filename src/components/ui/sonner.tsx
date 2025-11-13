'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[#1E2533] group-[.toaster]:text-white group-[.toaster]:border-[#3B82F6]/20 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-gray-400',
          actionButton: 'group-[.toast]:bg-[#3B82F6] group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-gray-700 group-[.toast]:text-gray-300',
          success: 'group-[.toast]:border-green-500/20',
          error: 'group-[.toast]:border-red-500/20',
          warning: 'group-[.toast]:border-amber-500/20',
          info: 'group-[.toast]:border-blue-500/20',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
