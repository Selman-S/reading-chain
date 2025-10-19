# Reading Chain - Okuma Takip Uygulaması

## 📋 Proje Özeti

Günlük kitap okuma alışkanlığını takip etmek için geliştirilmiş mobil-öncelikli web uygulaması. Kullanıcılar kitaplarını ekleyebilir, günlük okuduğu sayfaları kaydedebilir ve "streak" (kesintisiz okuma zinciri) sistemi ile motive olabilir.

---

## 🎯 Temel Özellikler

### 1. Kullanıcı Yönetimi

- ✅ **Kullanıcı Kaydı (Signup)**: Username, email, password ile kayıt
- ✅ **Giriş (Login)**: Credentials-based authentication (NextAuth.js v5)
- ✅ **Şifre Güvenliği**: bcryptjs ile hash'leme
- ✅ **Session Yönetimi**: JWT-based sessions
- ✅ **Multi-User**: Her kullanıcı kendi verilerine erişir

### 2. Kitap Yönetimi

- ✅ Kitap ekleme (başlık, yazar, toplam sayfa)
- ✅ Kitap düzenleme
- ✅ Kitap silme
- ✅ Kitap durumu (active, completed, paused)
- ✅ İlerleme yüzdesi gösterimi
- ✅ Başlangıç ve bitiş tarihleri
- ✅ Notlar ekleme

### 3. Okuma Takibi

- ✅ Günlük sayfa girişi
- ✅ Hangi kitaptan kaç sayfa okunduğu kaydı
- ✅ Tarih bazlı kayıt
- ✅ Notlar ekleme

### 4. Streak (Zincir) Sistemi

- ✅ Günlük streak takibi
- ✅ En uzun streak kaydı
- ✅ Son okuma tarihi
- ✅ Streak görselleştirme (🔥 emoji ile)
- ✅ Motivasyon mesajları

### 5. İstatistikler ve Grafikler

- ✅ **Ana Dashboard**:

  - Mevcut streak
  - Toplam okunan sayfa
  - Günlük ortalama
  - Aktif kitap sayısı
- ✅ **Detaylı İstatistikler**:

  - Toplam kitap sayısı
  - Tamamlanan kitaplar
  - Aktif kitaplar
  - Toplam okunan sayfa
  - Günlük ortalama
  - Okuma sayısı
  - Streak bilgileri
- ✅ **Grafikler**:

  - Günlük okuma grafiği (Chart.js)
  - Line chart ve bar chart
  - Son 30 gün verisi
- ✅ **Heatmap**:

  - Aylık okuma aktivitesi ısı haritası
  - GitHub tarzı visualization
  - Farklı yoğunluk seviyeleri

### 6. Kullanıcı Arayüzü

- ✅ **Mobil-First Design**: Responsive tasarım
- ✅ **Dark/Light Mode**: Tema değiştirme
- ✅ **Modern UI**: Tailwind CSS v4
- ✅ **Animasyonlar**: Framer Motion
- ✅ **İkonlar**: Lucide React
- ✅ **Bottom Navigation**: Mobil navigasyon menüsü
- ✅ **User Menu**: Kullanıcı bilgileri ve çıkış

### 7. PWA (Progressive Web App)

- ✅ Manifest dosyası
- ✅ Service Worker
- ✅ Offline destek altyapısı
- ✅ App icons (192x192, 512x512)
- ✅ Install prompt

### 8. Ayarlar

- ✅ Dark mode toggle
- ✅ Bildirim ayarları
- ✅ Günlük okuma hedefi
- ✅ Veri dışa aktarma (Export)
- ✅ Veri temizleme

---

## 🛠 Teknoloji Stack

### Frontend

- **Framework**: Next.js 15.5.6 (App Router)
- **React**: 19
- **TypeScript**: Type-safe development
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Chart.js + react-chartjs-2
- **Date Handling**: date-fns

### Backend

- **API**: Next.js API Routes
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: NextAuth.js v5 (Auth.js)
  - Credentials provider
  - JWT sessions
  - bcryptjs password hashing

### Deployment

- **Platform**: Vercel
- **Environment**: Production ve Preview environments
- **Edge Runtime**: Middleware için Edge Runtime kullanımı

---

## 📁 Proje Yapısı

```
reading-chain/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth handler
│   │   │   └── signup/route.ts         # Signup endpoint
│   │   ├── books/
│   │   │   ├── route.ts                # GET, POST
│   │   │   └── [id]/route.ts           # GET, PUT, DELETE
│   │   ├── readings/route.ts           # Okuma kayıtları
│   │   └── stats/route.ts              # İstatistikler
│   ├── books/page.tsx                  # Kitaplar sayfası
│   ├── login/page.tsx                  # Login sayfası
│   ├── signup/page.tsx                 # Signup sayfası
│   ├── stats/page.tsx                  # İstatistikler sayfası
│   ├── settings/page.tsx               # Ayarlar sayfası
│   ├── page.tsx                        # Ana sayfa (Dashboard)
│   ├── layout.tsx                      # Root layout
│   ├── globals.css                     # Global styles
│   ├── providers.tsx                   # NextAuth SessionProvider
│   └── register-sw.tsx                 # Service Worker kaydı
├── components/
│   ├── Navigation.tsx                  # Bottom navigation + UserMenu
│   ├── UserMenu.tsx                    # User dropdown menu
│   ├── StreakDisplay.tsx               # Streak gösterimi
│   ├── QuickReadingEntry.tsx           # Hızlı sayfa girişi
│   ├── Heatmap.tsx                     # Okuma heatmap'i
│   └── ReadingChart.tsx                # Okuma grafikleri
├── models/
│   ├── User.ts                         # User schema
│   ├── Book.ts                         # Book schema
│   └── Reading.ts                      # Reading schema
├── lib/
│   ├── mongodb.ts                      # Mongoose connection
│   └── mongodb-client.ts               # MongoDB client (NextAuth)
├── public/
│   ├── manifest.json                   # PWA manifest
│   ├── sw.js                           # Service worker
│   ├── favicon.ico                     # Favicon
│   ├── icon-192x192.png               # PWA icon
│   └── icon-512x512.png               # PWA icon
├── auth.ts                             # NextAuth configuration
├── middleware.ts                       # Route protection
├── next.config.ts                      # Next.js configuration
├── tailwind.config.ts                  # Tailwind configuration
├── tsconfig.json                       # TypeScript configuration
└── package.json                        # Dependencies
```

---

## 🔐 Authentication Akışı

1. **Signup**:

   - Kullanıcı `/signup` sayfasından kayıt olur
   - Şifre bcryptjs ile hash'lenir
   - MongoDB'ye kaydedilir
   - Login sayfasına yönlendirilir
2. **Login**:

   - Kullanıcı `/login` sayfasından giriş yapar
   - NextAuth credentials provider kullanılır
   - JWT session oluşturulur
   - Cookie set edilir (`authjs.session-token`)
   - Ana sayfaya yönlendirilir (500ms delay ile)
3. **Session Management**:

   - `useSession()` hook ile client-side
   - `auth()` function ile server-side
   - Middleware ile route protection
4. **Logout**:

   - `signOut()` function
   - Session temizlenir
   - Login sayfasına yönlendirilir

---

## 📊 Database Schemas

### User Model

```typescript
{
  username: string (unique, 3-30 char)
  email: string (unique)
  password: string (hashed)
  createdAt: Date
  updatedAt: Date
}
```

### Book Model

```typescript
{
  userId: string (indexed)
  title: string
  author: string
  totalPages: number
  currentPage: number
  status: 'active' | 'completed' | 'paused'
  startDate: Date
  completedDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

### Reading Model

```typescript
{
  userId: string (indexed)
  bookId: ObjectId (ref: Book)
  date: Date
  pagesRead: number
  fromPage: number
  toPage: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

---

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/signup` - Kullanıcı kaydı
- `POST /api/auth/callback/credentials` - Login
- `GET /api/auth/session` - Session bilgisi

### Books

- `GET /api/books?status=active` - Kitapları listele
- `POST /api/books` - Yeni kitap ekle
- `GET /api/books/[id]` - Kitap detayı
- `PUT /api/books/[id]` - Kitap güncelle
- `DELETE /api/books/[id]` - Kitap sil

### Readings

- `GET /api/readings` - Okuma kayıtları
- `POST /api/readings` - Yeni okuma kaydı

### Stats

- `GET /api/stats?period=all` - İstatistikler
  - Periods: all, week, month, year

---

## 🎨 UI Components

### Ana Sayfa (Dashboard)

- Karşılama mesajı
- Streak display (büyük)
- Quick stats (3 kart):
  - Toplam sayfa
  - Günlük ortalama
  - Aktif kitap
- Quick reading entry formu
- Motivasyon mesajları

### Kitaplar Sayfası

- Tab'ler: Active / Completed
- Kitap kartları:
  - Başlık, yazar
  - Progress bar
  - Sayfa bilgisi
  - Düzenle, Sil butonları
- Floating action button (kitap ekle)
- Modal form (ekle/düzenle)

### İstatistikler Sayfası

- Özet kartlar (6 adet)
- Okuma grafiği (line/bar toggle)
- Aylık heatmap
- Farklı dönem filtreleri (tüm zamanlar, hafta, ay, yıl)

### Ayarlar Sayfası

- Dark mode toggle
- Bildirim ayarları
- Günlük hedef
- Veri yönetimi
- Çıkış yap

---

## 🚀 Deployment

### Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# NextAuth
AUTH_SECRET=<random-secret>
NEXTAUTH_URL=https://your-domain.vercel.app

# (Eski - artık kullanılmıyor)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
```

### Vercel Configuration

- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 18.x veya üstü

---

## 🐛 Bilinen Sorunlar ve Çözümler

### 1. Login Sonrası Redirect

**Sorun**: Login başarılı ama redirect çalışmıyor
**Çözüm**:

- Cookie set olması için 500ms bekleme eklendi
- `router.push()` + fallback `window.location.replace()`

### 2. Middleware Cookie İsmi

**Sorun**: Middleware session'ı bulamıyor
**Çözüm**:

- NextAuth v5'in cookie ismi `authjs.session-token` (eski: `next-auth.session-token`)
- Middleware güncellendi

### 3. Next.js 15 useSearchParams

**Sorun**: Build hatası - missing suspense boundary
**Çözüm**:

- Login sayfası Suspense boundary ile sarmalandı
- Component componentlere ayrıldı

### 4. API Route params

**Sorun**: Next.js 15'te `params` Promise döndürüyor
**Çözüm**:

- `params` await edildi
- Type tanımı güncellendi

### 5. Page Refresh Sorunları

**Sorun**: Sayfa yenilendiğinde çöküyor
**Çözüm**:

- useEffect dependency array'leri düzeltildi
- Session kontrolü tüm sayfalara eklendi
- Loading states iyileştirildi

### 6. Service Worker Cache Sorunu

**Sorun**: Login sonrası sayfa yenilediğinde ERR_FAILED hatası
**Çözüm**:

- Service Worker stratejisi Cache-First'ten **Network-First'e** değiştirildi
- API ve auth istekleri cache bypass edildi
- Sadece statik dosyalar (images, icons) cache'leniyor
- Cache version v2 ile eski cache'ler otomatik temizleniyor

---

## 📝 Geliştirme Notları

### Çalıştırma

```bash
npm install
npm run dev  # http://localhost:3000
```

### Build

```bash
npm run build
npm start  # Production mode
```

### Environment Setup

1. `.env.local` oluştur
2. MongoDB URI ekle
3. AUTH_SECRET generate et: `openssl rand -base64 32`
4. NEXTAUTH_URL ekle (dev: http://localhost:3000)

**Örnek `.env.local` dosyası:**
```env
# MongoDB Connection
MONGODB_URI=your_mongodb_uri_here

# NextAuth Configuration
AUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

---

## 📚 Dokümantasyon Dosyaları

Proje kök dizininde mevcut dokümantasyon:

- `README.md` - Genel proje bilgisi
- `FEATURES.md` - Detaylı özellikler listesi
- `SETUP.md` - Kurulum ve çalıştırma
- `AUTH_SETUP_TR.md` - Authentication kurulumu (TR)
- `GOOGLE_AUTH_SETUP.md` - Google OAuth kurulumu (artık kullanılmıyor)
- `VERCEL_DEPLOYMENT.md` - Vercel deployment rehberi
- `ICONS_GUIDE.md` - PWA icon değiştirme
- `BAŞLANGIÇ.txt` - Türkçe proje özeti

---

## 🎯 Gelecek Özellikler (Potansiyel)

- [ ] Kitap önerileri
- [ ] Okuma arkadaşları / sosyal özellikler
- [ ] Okuma hedefleri ve rozetler
- [ ] Kitap notları ve alıntılar
- [ ] Kitap arama API entegrasyonu
- [ ] Okuma istatistikleri export (PDF/CSV)
- [ ] Email bildirimleri
- [ ] Mobile app (React Native)

---

## 📄 Lisans

MIT License

## 👤 Geliştirici

Selman S.

## 📅 Tarih

Ekim 2025

---

**Not**: Bu proje Next.js 15, React 19 ve NextAuth v5 gibi en güncel teknolojilerle geliştirilmiştir.
