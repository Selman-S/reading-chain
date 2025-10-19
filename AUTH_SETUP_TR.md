# 🚀 Kullanıcı Girişi Kurulum - Hızlı Başlangıç

## Ne Değişti?

Artık Reading Chain'de **kullanıcı girişi** var! Her kullanıcı kendi verilerini görecek.

### Yeni Özellikler:
- ✅ Google ile giriş
- ✅ Kullanıcı bazlı veri izolasyonu
- ✅ Güvenli session yönetimi
- ✅ Her kullanıcı kendi kitap ve okuma kayıtlarını görür

---

## Hızlı Kurulum (5 Dakika)

### 1. Environment Variables Ekleyin

`.env.local` dosyanızı açın ve ekleyin:

```env
# Mevcut MongoDB ayarınız (değişmedi)
MONGODB_URI=mongodb://localhost:27017/reading-chain

# YENİ: NextAuth Ayarları
AUTH_SECRET=Bu-Kısmı-Değiştir-Random-String-32-Karakter
NEXTAUTH_URL=http://localhost:3000

# YENİ: Google OAuth (Şimdilik boş bırakın)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 2. AUTH_SECRET Oluşturun

**Windows PowerShell:**
```powershell
-join (1..32 | ForEach-Object { [char](Get-Random -Minimum 65 -Maximum 90) })
```

Çıkan string'i `AUTH_SECRET` yerine yapıştırın.

### 3. Google OAuth Credentials Alın

Detaylı adımlar için: **[GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md)** dosyasına bakın.

**Özet:**
1. [Google Cloud Console](https://console.cloud.google.com/) → Proje oluştur
2. OAuth consent screen → External → Ayarla
3. Credentials → OAuth client ID oluştur
4. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Client ID ve Secret'ı kopyala
6. `.env.local`'e yapıştır

### 4. Sunucuyu Yeniden Başlatın

```bash
# Mevcut sunucuyu durdurun (Ctrl+C)
npm run dev
```

### 5. Test Edin!

1. http://localhost:3000 → Login sayfası
2. "Google ile Giriş Yap"
3. Google hesabı seçin
4. Giriş yapın! 🎉

---

## Veritabanı Değişiklikleri

### Yeni Alanlar:

**Book Model:**
```typescript
{
  userId: string;  // Yeni! Kitabın sahibi
  title: string;
  author: string;
  // ... diğer alanlar
}
```

**Reading Model:**
```typescript
{
  userId: string;  // Yeni! Kaydın sahibi
  bookId: string;
  date: Date;
  // ... diğer alanlar
}
```

### Mevcut Veriler?

⚠️ **Eğer zaten veri eklediyseniz:**

Eski veriler kullanıcı ID'si olmadan eklendiği için görünmeyecek.

**Çözüm:**
```bash
# MongoDB'yi açın
mongosh

# Veritabanına bağlanın
use reading-chain

# Mevcut verileri bir test kullanıcısına atayın
db.books.updateMany({}, { $set: { userId: "test-user-123" } })
db.readings.updateMany({}, { $set: { userId: "test-user-123" } })
```

Veya temiz başlayın:
```bash
db.books.deleteMany({})
db.readings.deleteMany({})
```

---

## API Değişiklikleri

Tüm API endpoint'leri artık **authentication** gerektiriyor:

```typescript
// Eski
GET /api/books

// Yeni (otomatik user filtresi)
GET /api/books
// Sadece giriş yapan kullanıcının kitapları döner
```

### Korunan Endpoint'ler:
- ✅ `/api/books` - CRUD operations
- ✅ `/api/readings` - Okuma kayıtları
- ✅ `/api/stats` - İstatistikler

---

## UI Değişiklikleri

### Yeni Login Sayfası
- `/login` - Google ile giriş

### User Menu
- Sağ üst köşede profil resmi
- Çıkış yapma seçeneği

### Protected Routes
- Giriş yapmadan erişemezsiniz
- Otomatik login'e yönlendirir

---

## Production Deployment

### Vercel'de Environment Variables:

```env
MONGODB_URI=mongodb+srv://...  # Atlas URI
AUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Google Console'da Production URL:

```
Authorized redirect URIs:
https://your-app.vercel.app/api/auth/callback/google
```

---

## Sorun Giderme

### "Unauthorized" Hatası

**Çözüm:**
- `.env.local` dosyası doğru mu?
- Sunucu yeniden başlatıldı mı?
- Browser cookies temiz mi?

### Google Login Çalışmıyor

**Kontrol edin:**
1. `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET` doldu mu?
2. Google Console'da redirect URI doğru mu?
3. Test users listesinde misiniz?

### Mevcut Veriler Görünmüyor

**Çözüm:**
- MongoDB'de userId alanlarını doldurun
- Veya yeni veriler ekleyin

---

## Daha Fazla Bilgi

- 📖 [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) - Detaylı Google OAuth kurulumu
- 📖 [NextAuth.js Docs](https://next-auth.js.org/) - NextAuth dokümantasyonu

---

## Özet

✅ **Yapılması Gerekenler:**
1. `.env.local` dosyasına AUTH_SECRET ekle
2. Google OAuth credentials al
3. Sunucuyu yeniden başlat
4. Giriş yap ve test et!

⏱️ **Toplam Süre:** 5-10 dakika

🎉 **Tebrikler! Artık multi-user sisteminiz hazır!**

---

**Sorularınız için GitHub Issues veya dokümantasyona bakın.**

