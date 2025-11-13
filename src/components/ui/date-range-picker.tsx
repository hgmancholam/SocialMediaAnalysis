/**
 * DateRangePicker Component
 *
 * Date range picker with presets
 * Features:
 * - Radix UI Popover
 * - react-day-picker
 * - Presets (7d, 30d, 90d, Custom)
 * - date-fns formatting (español)
 * - Smooth animations
 */

'use client';

import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}

const presets = [
  { label: 'Últimos 7 días', days: 7 },
  { label: 'Últimos 30 días', days: 30 },
  { label: 'Últimos 90 días', days: 90 },
];

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    value || {
      from: subDays(new Date(), 30),
      to: new Date(),
    }
  );

  const handlePresetClick = (days: number) => {
    const range = {
      from: subDays(new Date(), days),
      to: new Date(),
    };
    setSelectedRange(range);
    onChange(range);
  };

  const formatDateRange = () => {
    if (!selectedRange?.from) {
      return 'Seleccionar rango';
    }

    if (selectedRange.from && !selectedRange.to) {
      return format(selectedRange.from, 'd MMM yyyy', { locale: es });
    }

    if (selectedRange.from && selectedRange.to) {
      return `${format(selectedRange.from, 'd MMM', { locale: es })} - ${format(
        selectedRange.to,
        'd MMM yyyy',
        { locale: es }
      )}`;
    }

    return 'Seleccionar rango';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal bg-[#1E2533] border-white/10 hover:bg-[#252D3F] hover:border-[#3B82F6]/50',
            !selectedRange && 'text-gray-400',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#1E2533] border-white/10" align="start">
        <div className="p-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">Presets rápidos</p>
            <div className="grid gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.days}
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePresetClick(preset.days)}
                  className="justify-start text-gray-300 hover:text-white hover:bg-white/5"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="my-3 bg-white/10" />

          <div className="text-center py-4">
            <p className="text-sm text-gray-400">
              Selector de calendario personalizado próximamente
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
