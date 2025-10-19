'use client';

import { useState, useEffect } from 'react';
import { Plus, BookOpen, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Book {
  _id: string;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
}

interface QuickReadingEntryProps {
  onSuccess: () => void;
}

export default function QuickReadingEntry({ onSuccess }: QuickReadingEntryProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [pagesRead, setPagesRead] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books?status=active');
      const data = await res.json();
      if (data.success) {
        setBooks(data.data);
        if (data.data.length > 0) {
          setSelectedBook(data.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Kitaplar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBook || !pagesRead || parseInt(pagesRead) <= 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: selectedBook,
          pagesRead: parseInt(pagesRead),
          date: new Date(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowSuccess(true);
        setPagesRead('');
        
        setTimeout(() => {
          setShowSuccess(false);
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error('Kayıt eklenemedi:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
        <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Henüz kitap yok
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Okuma kaydı eklemek için önce bir kitap eklemelisiniz
        </p>
        <a
          href="/books"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Kitap Ekle
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-green-500 flex items-center justify-center z-10 rounded-2xl"
          >
            <div className="text-center text-white">
              <Check className="w-16 h-16 mx-auto mb-2" />
              <p className="text-xl font-bold">Harika! 🎉</p>
              <p>Zinciriniz devam ediyor!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Bugün Kaç Sayfa Okudun?
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kitap Seç
          </label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            required
          >
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} ({book.currentPage}/{book.totalPages})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Okunan Sayfa Sayısı
          </label>
          <input
            type="number"
            value={pagesRead}
            onChange={(e) => setPagesRead(e.target.value)}
            min="1"
            placeholder="Örn: 25"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet 🔥'}
        </button>
      </form>
    </div>
  );
}

