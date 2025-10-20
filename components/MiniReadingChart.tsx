'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ReadingData {
  date: string;
  pages: number;
}

export default function MiniReadingChart() {
  const [data, setData] = useState<ReadingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadingData();
  }, []);

  const fetchReadingData = async () => {
    try {
      // Son 30 gün
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 29);

      const res = await fetch(
        `/api/readings?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const result = await res.json();

      if (result.success) {
        // Günlük toplam sayfa sayısını hesapla
        const dailyPages: Record<string, number> = {};
        
        result.data.forEach((reading: any) => {
          const dateStr = new Date(reading.date).toISOString().split('T')[0];
          if (!dailyPages[dateStr]) {
            dailyPages[dateStr] = 0;
          }
          dailyPages[dateStr] += reading.pagesRead;
        });

        // Son 30 günü doldur
        const chartData: ReadingData[] = [];
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          chartData.push({
            date: dateStr,
            pages: dailyPages[dateStr] || 0,
          });
        }

        setData(chartData);
      }
    } catch (error) {
      console.error('Reading data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const maxPages = Math.max(...data.map(d => d.pages), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        📈 Son 30 Gün
      </h3>

      <div className="flex items-end justify-between gap-1 h-32">
        {data.map((item, index) => {
          const height = maxPages > 0 ? (item.pages / maxPages) * 100 : 0;
          const isToday = index === data.length - 1;

          return (
            <motion.div
              key={item.date}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
              className={`
                flex-1 rounded-t-md transition-all cursor-pointer group relative
                ${height === 0
                  ? 'bg-gray-200 dark:bg-gray-700 min-h-[2px]'
                  : isToday
                  ? 'bg-gradient-to-t from-orange-500 to-red-500'
                  : 'bg-gradient-to-t from-blue-400 to-indigo-500'
                }
                hover:opacity-80
              `}
              title={`${new Date(item.date).toLocaleDateString('tr-TR')}: ${item.pages} sayfa`}
            >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                  <p className="font-semibold">{item.pages} sayfa</p>
                  <p className="text-gray-300">
                    {new Date(item.date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>30 gün önce</span>
        <span>Bugün</span>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data.reduce((sum, d) => sum + d.pages, 0)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Toplam Sayfa</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {Math.round(data.reduce((sum, d) => sum + d.pages, 0) / 30)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Günlük Ort.</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data.filter(d => d.pages > 0).length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Aktif Gün</p>
        </div>
      </div>
    </div>
  );
}

