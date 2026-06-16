# 🚀 Reading Chain - Kurulum Rehberi

## MongoDB Kurulumu

### Seçenek 1: Yerel MongoDB (Önerilen - Geliştirme İçin)

#### Windows:
1. [MongoDB Community Edition](https://www.mongodb.com/try/download/community) indirin
2. Kurulumu başlatın ve varsayılan ayarlarla ilerleyin
3. MongoDB Compass'ı da yükleyin (opsiyonel ama önerilen)
4. Kurulum sonrası MongoDB otomatik olarak başlar

#### macOS:
```bash
# Homebrew ile
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
# MongoDB 7.0 kurulumu
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### MongoDB Çalışıyor mu Kontrol Edin:
```bash
# Mongo shell'i açın
mongosh

# Veya
mongo
```

Bağlantı başarılı olursa MongoDB çalışıyor demektir!

### Seçenek 2: MongoDB Atlas (Ücretsiz Cloud)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)'a kaydolun
2. Ücretsiz M0 cluster oluşturun
3. Database Access'te yeni kullanıcı oluşturun
4. Network Access'te IP'nizi ekleyin (0.0.0.0/0 herkese açık)
5. Connect > Connect your application'dan bağlantı string'ini kopyalayın

## Uygulama Kurulumu

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası oluşturun (proje kök dizininde):

**Yerel MongoDB için:**
```env
MONGODB_URI=mongodb://localhost:27017/reading-chain
```

**MongoDB Atlas için:**
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/reading-chain?retryWrites=true&w=majority
```

**NextAuth (Gerekli!):**
```env
AUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

`AUTH_SECRET` oluşturmak için: `openssl rand -base64 32`

⚠️ **ÖNEMLİ**: 
- `USERNAME` ve `PASSWORD` değerlerini kendi bilgilerinizle değiştirin
- `cluster0.xxxxx.mongodb.net` kısmını kendi cluster adresinizle değiştirin

### 3. Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

### 4. Test Verisi Yükleyin (Opsiyonel)

```bash
npm run seed
```

3 test kullanıcısı, kitaplar ve okuma kayıtları oluşturulur. Giriş: kullanıcı adı `selman`, şifre `123456`

Detaylar: **[scripts/README.md](./scripts/README.md)**

## İlk Kullanım

1. **Hesap Oluşturun veya Giriş Yapın**:
   - `/signup` ile yeni hesap oluşturun
   - veya `npm run seed` sonrası `/login` → `selman` / `123456`

2. **Kitap Ekleyin**:
   - "Kitaplarım" sekmesine gidin
   - "+" butonuna tıklayın
   - Kitap bilgilerini girin (isim, yazar, toplam sayfa)

3. **İlk Okuma Kaydınızı Ekleyin**:
   - Ana sayfaya dönün
   - Okuduğunuz sayfa sayısını girin
   - "Kaydet 🔥" butonuna tıklayın

4. **Bildirimleri Açın** (Opsiyonel):
   - Ayarlar sayfasına gidin
   - "Günlük Hatırlatıcı" seçeneğini açın
   - Bildirim izni verin
   - Hatırlatma saatini ayarlayın

## PWA Kurulumu (Mobil/Masaüstü)

### Mobil (iOS - Safari):
1. Safari'de uygulamayı açın
2. Paylaş butonuna (📤) basın
3. "Ana Ekrana Ekle"yi seçin
4. İsmi onaylayın ve "Ekle"ye basın

### Mobil (Android - Chrome):
1. Chrome'da uygulamayı açın
2. Sağ üst köşedeki menüye (⋮) tıklayın
3. "Ana ekrana ekle"yi seçin
4. İsmi onaylayın ve "Ekle"ye basın

### Masaüstü (Chrome/Edge):
1. Adres çubuğunun sağındaki yükle ikonuna tıklayın
2. "Yükle"ye basın

## Sorun Giderme

### MongoDB Bağlantı Hatası

**Hata:**
```
MongooseError: Could not connect to any servers in your MongoDB Atlas cluster
```

**Çözümler:**
1. `.env.local` dosyasının doğru konumda olduğundan emin olun (proje kök dizini)
2. MongoDB'nin çalıştığını kontrol edin:
   ```bash
   # Windows (PowerShell)
   Get-Service MongoDB
   
   # macOS/Linux
   sudo systemctl status mongod
   ```
3. MongoDB Atlas kullanıyorsanız:
   - Network Access'te IP'nizin ekli olduğundan emin olun
   - Kullanıcı adı ve şifrenin doğru olduğundan emin olun
   - Özel karakterler varsa URL encode edin

### Port 3000 Kullanımda Hatası

```bash
# Farklı port kullanın
npm run dev -- -p 3001
```

### Build Hatası

```bash
# Önce temizlik yapın
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Bildirimler Çalışmıyor

1. Tarayıcınızın bildirimleri desteklediğinden emin olun
2. Tarayıcı ayarlarından site için bildirimlerin açık olduğunu kontrol edin
3. HTTPS kullanıyor olun (localhost'ta çalışır)

## Önerilen Geliştirme Araçları

- **MongoDB Compass**: MongoDB için GUI
- **Postman**: API testleri için
- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - MongoDB for VS Code
  - Prettier - Code formatter

## Production Deployment

### Vercel'e Deploy

1. GitHub'da repository oluşturun
2. Kodu push edin
3. [Vercel](https://vercel.com)'de "Import Project"
4. Repository'yi seçin
5. Environment Variables'a ekleyin:
   - `MONGODB_URI`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL` (production URL)
6. Deploy!

### MongoDB Atlas Production Ayarları

1. Dedicated cluster kullanın (M10+)
2. IP whitelist'i güvenli tutun
3. Güçlü şifreler kullanın
4. Regular backup'lar alın

## Güvenlik Önerileri

⚠️ **ASLA** `.env.local` dosyasını Git'e commit etmeyin!

✅ **Yapılması Gerekenler**:
- Güçlü MongoDB şifreleri kullanın
- Production'da HTTPS kullanın
- Environment variables'ı güvenli tutun
- Regular backup'lar alın

## Destek

Sorun yaşıyorsanız:
1. Bu dokümantasyonu tekrar okuyun
2. GitHub Issues'da arama yapın
3. Yeni issue açın (detaylı açıklama ile)

---

**İyi Okumalar! 📚✨**

