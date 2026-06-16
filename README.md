# 📚 Reading Chain - Okuma Takip Uygulaması

Günlük okuma alışkanlığınızı takip edin, zincirinizi kırmayın! 🔥

## ✨ Özellikler

### 🎯 Temel Özellikler
- **Kitap Yönetimi**: Kitap ekleme, düzenleme, silme
- **Günlük Okuma Takibi**: Hızlı sayfa girişi
- **Streak Sistemi**: Günlük okuma zincirinizi takip edin
- **İstatistikler**: Detaylı grafikler ve ısı haritası
- **Mobil-Öncelikli Tasarım**: Tüm cihazlarda mükemmel çalışır

### 🚀 Gelişmiş Özellikler
- **🔐 Kullanıcı Girişi**: Kullanıcı adı/şifre ile kayıt ve giriş
- **👤 Multi-User**: Her kullanıcı kendi verilerini görür
- **🤝 Arkadaş Sistemi**: Arkadaş ekleme, aktivite akışı, sıralama
- **👤 Profil**: Avatar, bio ve gizlilik ayarları
- **🔔 Bildirimler**: Günlük hatırlatıcılar
- **🌙 Karanlık Mod**: Gözlerinizi koruyun
- **📱 PWA Desteği**: Uygulama gibi kurulabilir
- **📊 İlerleme Takibi**: Kitap tamamlanma oranları
- **🏆 Başarımlar**: Okuma hedefleriniz için rozetler
- **💾 Veri Dışa Aktarma**: JSON formatında yedekleme

## 🛠 Teknoloji Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS v4
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Database**: MongoDB + Mongoose
- **Charts**: Chart.js + react-chartjs-2
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Utils**: date-fns

## 📦 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. MongoDB Kurulumu

MongoDB'yi yükleyin:
- **Yerel**: [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- **Cloud**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Ücretsiz)

### 3. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası oluşturun:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/reading-chain
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reading-chain

# NextAuth (Gerekli!)
AUTH_SECRET=your-secret-here  # openssl rand -base64 32 ile oluşturun
NEXTAUTH_URL=http://localhost:3000
```

**🔐 Kimlik Doğrulama Kurulumu:** **[AUTH_SETUP_TR.md](./AUTH_SETUP_TR.md)**

### 4. Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

### 5. Test Verilerini Yükleyin (Opsiyonel)

Uygulamayı test etmek için örnek kullanıcılar ve veriler oluşturmak isterseniz:

```bash
npm run seed
```

Bu komut 3 test kullanıcısı oluşturacak (giriş **kullanıcı adı** ile yapılır):
- **selman** — selman@test.com — Şifre: `123456`
- **ahmet** — ahmet@test.com — Şifre: `123456`
- **ayse** — ayse@test.com — Şifre: `123456`

Her kullanıcı için:
- ✅ 3 kitap (bazıları tamamlanmış, bazıları aktif)
- ✅ Geçmiş tarihli okuma kayıtları
- ✅ 7 günlük aktif streak
- ✅ Birbirleriyle arkadaşlık

Detaylı bilgi için: **[scripts/README.md](./scripts/README.md)**

## 🚀 Deployment

### Vercel (Önerilen)

1. [Vercel](https://vercel.com)'de hesap oluşturun
2. Repository'yi bağlayın
3. Ortam değişkenlerini ekleyin
4. Deploy edin!

### Diğer Platformlar

- **Netlify**: Next.js desteği var
- **Railway**: MongoDB + Next.js için ideal
- **DigitalOcean App Platform**: Tam kontrol

## 📱 PWA Olarak Kurulum

### Mobil Cihazlarda:

**iOS (Safari):**
1. Paylaş butonuna basın
2. "Ana Ekrana Ekle"yi seçin

**Android (Chrome):**
1. Menü butonuna basın
2. "Ana ekrana ekle"yi seçin

### Masaüstünde:

**Chrome:**
1. Adres çubuğundaki yükle ikonuna tıklayın
2. "Yükle"ye basın

## 🎯 Kullanım

### İlk Kullanım

1. **Hesap Oluşturun**: `/signup` sayfasından kayıt olun veya `npm run seed` ile test hesabı kullanın
2. **Giriş Yapın**: `/login` sayfasından kullanıcı adı ve şifrenizle giriş yapın
3. **Kitap Ekleyin**: "Kitaplarım" sayfasından yeni kitap ekleyin
4. **Sayfa Girin**: Ana sayfadan günlük okuduğunuz sayfayı girin
5. **Streaki Başlatın**: Her gün okuyarak zincirinizi uzatın!

### İpuçları

- 📱 Bildirimleri açarak günlük hatırlatıcı alın
- 🎯 Günlük sayfa hedefi belirleyin
- 📊 İstatistikleri takip edin ve motivasyonunuzu yüksek tutun
- 🔥 Zincirinizi kırmayın!

## 🎨 Özelleştirme

### Tema Renkleri

`app/globals.css` dosyasında CSS değişkenlerini değiştirin:

```css
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  /* ... */
}
```

### Günlük Hedef

Ayarlar sayfasından günlük okuma hedefinizi özelleştirin (5-100 sayfa).

## 🔧 API Endpoints

> Tüm endpoint'ler (signup hariç) giriş gerektirir.

### Kimlik Doğrulama
- `POST /api/auth/signup` - Kullanıcı kaydı
- `POST /api/auth/callback/credentials` - Giriş (NextAuth)
- `GET /api/auth/session` - Oturum bilgisi

### Kitaplar
- `GET /api/books` - Tüm kitapları getir
- `POST /api/books` - Yeni kitap ekle
- `GET /api/books/:id` - Tek kitap getir
- `PUT /api/books/:id` - Kitap güncelle
- `DELETE /api/books/:id` - Kitap sil

### Okuma Kayıtları
- `GET /api/readings` - Okuma kayıtlarını getir
- `POST /api/readings` - Yeni okuma kaydı ekle

### İstatistikler
- `GET /api/stats?period=all|week|month|year` - İstatistikleri getir

### Sosyal & Profil
- `GET /api/profile` - Profil bilgisi
- `PUT /api/profile` - Profil güncelle
- `GET /api/friends` - Arkadaş listesi
- `POST /api/friends` - Arkadaşlık isteği gönder
- `GET /api/friends/activity` - Arkadaş aktiviteleri
- `GET /api/leaderboard` - Sıralama tablosu
- `GET /api/badges` - Rozetler
- `GET /api/users/search?q=` - Kullanıcı ara

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası

```
Error: Could not connect to MongoDB
```

**Çözüm:**
- MongoDB'nin çalıştığından emin olun
- `.env.local` dosyasındaki `MONGODB_URI` değerini kontrol edin

### Build Hatası

```bash
npm run build
```

Komutunu çalıştırarak hataları kontrol edin.

## 📄 Lisans

MIT License - İstediğiniz gibi kullanabilirsiniz!

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz!

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📞 İletişim

Sorularınız için:
- GitHub Issues
- Pull Requests

## 🎉 Teşekkürler

Bu projeyi kullandığınız için teşekkürler! Okumanın keyfini çıkarın! 📚✨

---

**Yapımcı**: Reading Chain Team
**Versiyon**: 1.0.0
**Güncelleme**: Haziran 2026
