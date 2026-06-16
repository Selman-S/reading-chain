# 🚀 Vercel Deployment Rehberi

## Environment Variables Ekleme

### 1. Vercel Dashboard'a Gidin

1. [Vercel Dashboard](https://vercel.com/dashboard)
2. Projenizi seçin
3. **Settings** → **Environment Variables**

### 2. Gerekli Variables'ı Ekleyin

Her bir variable için **"Add"** butonuna tıklayın:

#### MONGODB_URI
```
Name: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/reading-chain
Environment: Production, Preview, Development (hepsini seç)
```

⚠️ **MongoDB Atlas kullanmalısınız!**
- Yerel MongoDB Vercel'de çalışmaz
- Ücretsiz M0 cluster yeterli
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

#### AUTH_SECRET
```
Name: AUTH_SECRET
Value: random-32-character-string
Environment: Production, Preview, Development
```

**Oluşturmak için:**
```bash
openssl rand -base64 32
```

#### NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://your-app-name.vercel.app
Environment: Production

Name: NEXTAUTH_URL  
Value: http://localhost:3000
Environment: Development
```

⚠️ **Production URL'yi projeniz deploy olduktan sonra ekleyin!**

### 3. Save ve Redeploy

1. Tüm variables'ı ekledikten sonra **"Save"**
2. **Deployments** sekmesine gidin
3. Son deployment'ın yanındaki **"..."** → **"Redeploy"**

---

## MongoDB Atlas Setup

### 1. MongoDB Atlas'ta Cluster Oluşturun

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **"Build a Database"** → **FREE (M0)**
3. Cloud Provider: **AWS**
4. Region: **us-east-1** (Vercel'e yakın)
5. **Create Cluster**

### 2. Database User Oluşturun

1. **Database Access** → **Add New Database User**
2. **Authentication Method:** Password
3. Username: `readingchain`
4. Password: Güçlü bir şifre (kaydedin!)
5. **Database User Privileges:** Read and write to any database
6. **Add User**

### 3. Network Access Ayarlayın

1. **Network Access** → **Add IP Address**
2. **"Allow Access from Anywhere"** (0.0.0.0/0)
3. **Confirm**

⚠️ Production'da daha güvenli olması için Vercel IP'lerini ekleyebilirsiniz.

### 4. Connection String Alın

1. **Database** → **Connect**
2. **"Connect your application"**
3. Driver: **Node.js**
4. Connection string'i kopyalayın:
   ```
   mongodb+srv://readingchain:<password>@cluster0.xxxxx.mongodb.net/reading-chain?retryWrites=true&w=majority
   ```
5. `<password>` yerine gerçek şifrenizi yazın
6. Database adını `reading-chain` olarak ekleyin

---

## Deployment Checklist

### Vercel'de:
- [ ] MONGODB_URI eklendi
- [ ] AUTH_SECRET eklendi
- [ ] NEXTAUTH_URL eklendi (production URL ile)

### MongoDB Atlas'ta:
- [ ] FREE M0 cluster oluşturuldu
- [ ] Database user oluşturuldu
- [ ] Network access 0.0.0.0/0 eklendi
- [ ] Connection string alındı

### Son Kontrol:
- [ ] Tüm environment variables kaydedildi
- [ ] Redeploy yapıldı
- [ ] Deployment başarılı (yeşil ✓)
- [ ] Siteyi ziyaret ettim ve giriş yaptım

---

## Sorun Giderme

### Build Error: "Invalid/Missing environment variable"

**Çözüm:**
1. Vercel Dashboard → Settings → Environment Variables
2. Eksik variable'ı ekleyin
3. **Save**
4. Deployments → **Redeploy**

### Giriş yapılamıyor / "Unauthorized"

**Çözüm:**
1. `AUTH_SECRET` Vercel'de tanımlı mı kontrol edin
2. `NEXTAUTH_URL` production URL ile eşleşiyor mu?
3. Kullanıcı adı ile giriş yapın (e-posta değil)
4. Redeploy yapın

### MongoDB Connection Error

**Çözüm:**
1. MongoDB Atlas → Network Access
2. 0.0.0.0/0 ekli mi kontrol edin
3. Database User şifresi doğru mu?
4. Connection string'de şifre encode edilmiş mi?
   - Özel karakterler varsa: `@` → `%40`, `#` → `%23`

### "Module not found: mongodb" (Edge Runtime Warnings)

**Bu normaldir!** Uyarılar middleware'den geliyor ama çalışır.

MongoDB Edge Runtime'da çalışamaz ama biz sadece auth kontrolü yapıyoruz.

---

## Hızlı Test

Deploy sonrası test edin:

1. ✅ Ana sayfa yükleniyor mu?
2. ✅ Login sayfası açılıyor mu?
3. ✅ Kayıt olup giriş yapabiliyor musunuz?
4. ✅ Giriş sonrası ana sayfaya yönleniyor mu?
5. ✅ Kitap ekleyebiliyor musunuz?
6. ✅ Okuma kaydı ekleyebiliyor musunuz?

---

## Environment Variables Özeti

```env
# MongoDB (Atlas)
MONGODB_URI=mongodb+srv://readingchain:PASSWORD@cluster0.xxxxx.mongodb.net/reading-chain

# NextAuth
AUTH_SECRET=your-32-char-random-string
NEXTAUTH_URL=https://your-app.vercel.app
```

---

## Güvenlik Notları

✅ **Yapılması Gerekenler:**
- AUTH_SECRET güçlü ve rastgele olmalı
- MongoDB şifresi güçlü olmalı
- Production'da HTTPS kullanılmalı (Vercel otomatik)

❌ **Yapılmaması Gerekenler:**
- Environment variables'ı Git'e commit etmeyin
- .env.local dosyasını paylaşmayın
- Weak passwords kullanmayın

---

## Performans İpuçları

1. **MongoDB Region:** Vercel'inize yakın region seçin
2. **Connection Pooling:** MongoDB adapter otomatik yönetir
3. **Edge Functions:** Middleware otomatik edge'de çalışır
4. **Caching:** Next.js otomatik optimize eder

---

## Destek

Sorun yaşıyorsanız:
1. Build logs'u kontrol edin
2. Runtime logs'u kontrol edin (Vercel Dashboard)
3. GitHub Issues'da arama yapın
4. Yeni issue açın

---

**Başarılı deployment'lar! 🎉**

