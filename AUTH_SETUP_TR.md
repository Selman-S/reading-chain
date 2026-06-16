# 🔐 Kullanıcı Girişi Kurulum - Hızlı Başlangıç

## Ne Değişti?

Reading Chain **kullanıcı adı ve şifre** ile giriş kullanır. Her kullanıcı kendi verilerini görür.

### Özellikler:
- ✅ Kayıt ol (`/signup`) — kullanıcı adı, e-posta, şifre
- ✅ Giriş yap (`/login`) — kullanıcı adı ve şifre
- ✅ Şifreler bcryptjs ile hash'lenir
- ✅ NextAuth.js v5 ile JWT session yönetimi
- ✅ Kullanıcı bazlı veri izolasyonu

> **Not:** Google OAuth artık kullanılmıyor. Eski rehber: [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) (arşiv)

---

## Hızlı Kurulum (3 Dakika)

### 1. Environment Variables

`.env.local` dosyası oluşturun:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/reading-chain
# MONGODB_URI=mongodb+srv://KULLANICI:ŞİFRE@cluster0.xxxxx.mongodb.net/reading-chain

# NextAuth (Gerekli!)
AUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 2. AUTH_SECRET Oluşturun

**Windows (PowerShell):**
```powershell
-join (1..32 | ForEach-Object { [char](Get-Random -Minimum 65 -Maximum 90) })
```

**macOS/Linux:**
```bash
openssl rand -base64 32
```

### 3. Sunucuyu Başlatın

```bash
npm install
npm run dev
```

### 4. Test Edin

**Yöntem A — Kayıt ol:**
1. http://localhost:3000/signup
2. Kullanıcı adı, e-posta ve şifre girin (şifre min. 6 karakter)
3. Giriş sayfasına yönlendirilirsiniz

**Yöntem B — Test verisi kullan:**
```bash
npm run seed
```
Ardından http://localhost:3000/login adresinden giriş yapın:
- Kullanıcı adı: `selman`
- Şifre: `123456`

---

## Authentication Akışı

### Kayıt (Signup)
1. Kullanıcı `/signup` sayfasından formu doldurur
2. `POST /api/auth/signup` — şifre hash'lenir, MongoDB'ye kaydedilir
3. `/login?registered=true` sayfasına yönlendirilir

### Giriş (Login)
1. Kullanıcı adı ve şifre `/login` sayfasından girilir
2. NextAuth Credentials provider doğrulama yapar
3. JWT session oluşturulur, ana sayfaya yönlendirilir

### Çıkış (Logout)
- Sağ üst kullanıcı menüsünden "Çıkış Yap"
- Session temizlenir, `/login` sayfasına yönlendirilir

---

## Veritabanı Değişiklikleri

Tüm veriler `userId` ile kullanıcıya bağlıdır:

**Book & Reading modelleri:**
```typescript
{
  userId: string;  // Kitabın/kaydın sahibi
  // ... diğer alanlar
}
```

### Mevcut Veriler Görünmüyorsa

Eski veriler `userId` olmadan eklenmiş olabilir. Temiz başlamak için:
```bash
npm run seed
```

---

## Korunan API Endpoint'leri

Giriş yapmadan erişilemez (401 Unauthorized):

- `/api/books` — Kitap CRUD
- `/api/readings` — Okuma kayıtları
- `/api/stats` — İstatistikler
- `/api/profile` — Profil
- `/api/friends` — Arkadaşlık
- `/api/badges` — Rozetler
- `/api/leaderboard` — Sıralama

---

## Production Deployment (Vercel)

```env
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-app.vercel.app
```

Detaylı adımlar: **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)**

---

## Sorun Giderme

### "Unauthorized" Hatası
- `.env.local` dosyası doğru mu?
- `AUTH_SECRET` tanımlı mı?
- Sunucu yeniden başlatıldı mı?

### "Kullanıcı adı veya şifre hatalı"
- Giriş **e-posta ile değil**, **kullanıcı adı** ile yapılır
- `npm run seed` ile test hesabı oluşturmayı deneyin

### Login sonrası redirect çalışmıyor
- Tarayıcı çerezlerini temizleyin
- `NEXTAUTH_URL` doğru portu gösteriyor mu kontrol edin

---

## Özet

1. `.env.local` → `MONGODB_URI`, `AUTH_SECRET`, `NEXTAUTH_URL`
2. `npm run dev`
3. `/signup` ile kayıt ol veya `npm run seed` ile test verisi yükle
4. `/login` ile giriş yap

⏱️ **Toplam süre:** ~3 dakika

---

**Daha fazla bilgi:** [PROJE_OZELLIKLERI.md](./PROJE_OZELLIKLERI.md) | [scripts/README.md](./scripts/README.md)
