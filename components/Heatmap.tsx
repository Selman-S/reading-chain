'use client';

import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';

interface HeatmapData {
  date: string;
  count: number;
  level: number;
}

interface HeatmapProps {
  data: HeatmapData[];
}

export default function Heatmap({ data }: HeatmapProps) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getColorForLevel = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-gray-100 dark:bg-gray-800';
      case 1:
        return 'bg-green-200 dark:bg-green-900';
      case 2:
        return 'bg-green-400 dark:bg-green-700';
      case 3:
        return 'bg-green-600 dark:bg-green-500';
      case 4:
        return 'bg-green-800 dark:bg-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const getDayData = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return data.find((d) => d.date === dateStr);
  };

  // Haftanın günlerine göre grupla
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  // İlk haftanın başlangıcını ayarla
  const firstDayOfWeek = monthStart.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(new Date(0)); // Boş günler için
  }

  days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === days.length - 1) {
      // Haftayı tamamla
      while (currentWeek.length < 7) {
        currentWeek.push(new Date(0));
      }
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {format(now, 'MMMM yyyy', { locale: tr })} - Okuma Haritası
      </h3>

      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
            <div
              key={day}
              className="text-xs text-center text-gray-500 dark:text-gray-400 font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => {
                if (day.getTime() === 0) {
                  return <div key={dayIndex} className="aspect-square" />;
                }

                const dayData = getDayData(day);
                const level = dayData?.level || 0;
                const isToday = isSameDay(day, now);

                return (
                  <div
                    key={dayIndex}
                    className={`aspect-square rounded-lg ${getColorForLevel(
                      level
                    )} flex items-center justify-center text-xs font-medium transition-transform hover:scale-110 cursor-pointer relative group ${
                      isToday ? 'ring-2 ring-blue-500' : ''
                    }`}
                    title={`${format(day, 'dd MMMM', { locale: tr })}: ${
                      dayData?.count || 0
                    } sayfa`}
                  >
                    <span className={level > 0 ? 'text-white' : 'text-gray-400 dark:text-gray-600'}>
                      {format(day, 'd')}
                    </span>
                    
                    {/* Tooltip */}
                    {dayData && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                          {dayData.count} sayfa
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span>Az</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-4 h-4 rounded ${getColorForLevel(level)}`}
            />
          ))}
        </div>
        <span>Çok</span>
      </div>
    </div>
  );
}

