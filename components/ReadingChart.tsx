'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DailyData {
  date: string;
  pages: number;
}

interface ReadingChartProps {
  data: DailyData[];
  type?: 'line' | 'bar';
}

export default function ReadingChart({ data, type = 'line' }: ReadingChartProps) {
  // Son 30 günü göster
  const last30Days = data.slice(-30);

  const chartData = {
    labels: last30Days.map((d) => {
      try {
        return format(new Date(d.date), 'dd MMM', { locale: tr });
      } catch {
        return d.date;
      }
    }),
    datasets: [
      {
        label: 'Okunan Sayfa',
        data: last30Days.map((d) => d.pages),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: type === 'line' 
          ? 'rgba(59, 130, 246, 0.1)'
          : 'rgba(59, 130, 246, 0.8)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.y} sayfa`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function (value: any) {
            return value + ' s';
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Son 30 Gün - Okuma Trendi
      </h3>
      <div className="h-64">
        {type === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}

