# 🚀 Hızlı Başlangıç - Reading Chain

## ⚡ 3 Adımda Başlayın

### 1️⃣ MongoDB'yi Hazırlayın

**Seçenek A: Yerel MongoDB (5 dakika)**
```bash
# Windows: MongoDB'yi indirin ve kurun
# https://www.mongodb.com/try/download/community

# macOS:
brew install mongodb-community
brew services start mongodb-community

# Linux:
sudo apt-get install mongodb
sudo systemctl start mongod
```

**Seçenek B: MongoDB Atlas (Ücretsiz Cloud - 2 dakika)**
1. [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → Kaydol
2. FREE Cluster oluştur (M0)
3. Kullanıcı oluştur (Database Access)
4. IP ekle: `0.0.0.0/0` (Network Access)
5. "Connect" → Connection string'i kopyala

### 2️⃣ Ortam Değişkenlerini Ayarlayın

Proje kök dizininde `.env.local` dosyası oluşturun:

```env
# Yerel MongoDB için:
MONGODB_URI=mongodb://localhost:27017/reading-chain

# VEYA MongoDB Atlas için:
# MONGODB_URI=mongodb+srv://KULLANICI:ŞİFRE@cluster0.xxxxx.mongodb.net/reading-chain

# NextAuth (Gerekli!)
AUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

`AUTH_SECRET` oluşturmak için: `openssl rand -base64 32`

### 3️⃣ Uygulamayı Başlatın

```bash
npm install
npm run dev
```

🎉 Tarayıcıda açın: **http://localhost:3000**

### 4️⃣ Test Verisi Yükle (Opsiyonel)

```bash
npm run seed
```

Giriş bilgileri: kullanıcı adı `selman`, şifre `123456`

---

## 📱 İlk Kullanım (2 dakika)

1. **Giriş Yap**
   - `/signup` ile kayıt ol veya seed ile test hesabı kullan
   - `/login` → kullanıcı adı + şifre (e-posta değil!)

2. **Kitap Ekle**
   - Alt menüden "Kitaplarım"a git
   - "+" butonuna tıkla
   - Kitap bilgilerini gir

3. **İlk Okuma Kaydı**
   - Ana sayfaya dön
   - Okuduğun sayfa sayısını gir
   - "Kaydet 🔥" butonuna bas

4. **Zincirine Başla!**
   - Her gün okuma kaydı ekle
   - Streakini korumaya devam et!

---

## 🎯 Önemli Bilgiler

### Uygulama Yapısı
```
reading-chain/
├── app/                # Sayfalar ve API
│   ├── api/           # Backend API
│   ├── books/         # Kitaplar sayfası
│   ├── stats/         # İstatistikler
│   └── settings/      # Ayarlar
├── components/        # UI bileşenleri
├── lib/              # MongoDB bağlantısı
├── models/           # Veritabanı modelleri
└── public/           # Statik dosyalar
```

### API Endpoints
- `POST /api/books` - Kitap ekle
- `POST /api/readings` - Okuma kaydı ekle
- `GET /api/stats` - İstatistikleri getir

### Veri Yapısı

**Kitap:**
```json
{
  "title": "1984",
  "author": "George Orwell",
  "totalPages": 328,
  "currentPage": 150,
  "status": "active"
}
```

**Okuma Kaydı:**
```json
{
  "bookId": "...",
  "date": "2024-10-19",
  "pagesRead": 25,
  "fromPage": 150,
  "toPage": 175
}
```

---

## 🛠 Komutlar

```bash
npm run dev        # Geliştirme sunucusu
npm run build      # Production build
npm run start      # Production sunucu
npm run lint       # Kod kontrolü
npm run seed       # Test verisi yükle
```

---

## 🔥 Özellikler

✅ Kullanıcı kaydı ve giriş (NextAuth Credentials)
✅ Kitap yönetimi (ekle/düzenle/sil)
✅ Günlük okuma takibi
✅ Streak (zincir) sistemi
✅ Detaylı istatistikler
✅ Grafikler ve ısı haritası
✅ Rozetler ve başarımlar
✅ Bildirim sistemi
✅ Karanlık mod
✅ PWA desteği (mobil uygulama gibi)
✅ Responsive tasarım

---

## 📱 Mobil Kurulum

### iOS (Safari):
1. Paylaş (📤) → "Ana Ekrana Ekle"

### Android (Chrome):
1. Menü (⋮) → "Ana ekrana ekle"

---

## 🐛 Sorun mu var?

### MongoDB bağlanamıyor?
```bash
# MongoDB çalışıyor mu kontrol et
mongosh

# Veya
mongo
```

### Port 3000 kullanımda?
```bash
npm run dev -- -p 3001
```

### Build hatası?
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Dokümantasyon

- 📖 **README.md** - Genel bilgi ve kurulum
- 🚀 **QUICKSTART.md** - Hızlı başlangıç (bu dosya)
- 🛠 **SETUP.md** - Detaylı kurulum rehberi
- 🔐 **AUTH_SETUP_TR.md** - Kimlik doğrulama kurulumu
- ✨ **FEATURES.md** - Tüm özellikler listesi
- 🎨 **ICONS_GUIDE.md** - İkon değiştirme rehberi
- 🌱 **scripts/README.md** - Test verisi seed rehberi

---

## 💡 İpuçları

1. **Bildirimler**: Ayarlardan günlük hatırlatıcı açın
2. **Hedef**: Günlük sayfa hedefinizi belirleyin
3. **Yedek**: Düzenli olarak verileri dışa aktarın
4. **Tema**: Karanlık mod gözlerinizi korur
5. **PWA**: Mobil cihazınıza yükleyin

---

## 🎉 Başarılar!

Okuma yolculuğunuza başlamaya hazırsınız! 📚✨

**Her gün okuyun, zincirinizi kırmayın! 🔥**

---

## 📞 Yardım

Sorun yaşıyorsanız:
- SETUP.md'yi okuyun
- GitHub Issues'da arama yapın
- Yeni issue açın

İyi okumalar! 📖

