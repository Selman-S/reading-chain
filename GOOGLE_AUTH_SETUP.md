# 🔐 Google OAuth Kurulum Rehberi

## Google OAuth Credentials Alma

### 1️⃣ Google Cloud Console'a Giriş

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Google hesabınızla giriş yapın

### 2️⃣ Yeni Proje Oluşturma

1. Üst menüden **"Select a project"** → **"New Project"** tıklayın
2. Proje adı: `Reading Chain` (veya istediğiniz isim)
3. **"Create"** butonuna tıklayın
4. Proje oluşturulurken bekleyin (30 saniye)
5. Oluşan projeyi seçin

### 3️⃣ OAuth Consent Screen Yapılandırması

1. Sol menüden **"APIs & Services"** → **"OAuth consent screen"**
2. **"External"** seçin → **"Create"**
3. Bilgileri doldurun:
   - **App name:** Reading Chain
   - **User support email:** E-posta adresiniz
   - **Developer contact information:** E-posta adresiniz
4. **"Save and Continue"**
5. **Scopes** sayfasında:
   - **"Add or Remove Scopes"** tıklayın
   - Şunları seçin:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - **"Update"** → **"Save and Continue"**
6. **Test users** sayfasında:
   - **"Add Users"** tıklayın
   - Test için kullanacağınız Gmail adresini ekleyin
   - **"Save and Continue"**
7. **Summary** sayfasında **"Back to Dashboard"**

### 4️⃣ OAuth Client ID Oluşturma

1. Sol menüden **"Credentials"** tıklayın
2. Üstten **"+ Create Credentials"** → **"OAuth client ID"**
3. **Application type:** Web application
4. **Name:** Reading Chain Web
5. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   ```
   Production için:
   ```
   https://yourdomain.com
   ```
6. **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   Production için:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
7. **"Create"** butonuna tıklayın

### 5️⃣ Credentials'ı Kaydetme

Açılan popup'ta:
- **Client ID** → Kopyalayın
- **Client Secret** → Kopyalayın

⚠️ **ÖNEMLİ:** Bu bilgileri güvenli bir yere kaydedin!

---

## .env.local Dosyasını Güncelleme

Proje kök dizininde `.env.local` dosyasını açın (yoksa oluşturun):

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/reading-chain

# NextAuth Secret (Aşağıdaki komutu terminalde çalıştırın)
# openssl rand -base64 32
AUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### AUTH_SECRET Oluşturma

**Windows (PowerShell):**
```powershell
-join (1..32 | ForEach-Object { [char](Get-Random -Minimum 65 -Maximum 90) })
```

**macOS/Linux:**
```bash
openssl rand -base64 32
```

**Veya Online:**
https://generate-secret.vercel.app/32

---

## Örnek .env.local

```env
MONGODB_URI=mongodb://localhost:27017/reading-chain
AUTH_SECRET=Xm3kP9sQ4vR2nT7jK5hL8dF1wE6yB0aZ
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=123456789012-abc123def456ghi789jkl012mno345pqr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ01
```

---

## Sunucuyu Yeniden Başlatma

```bash
# Dev sunucuyu durdurun (Ctrl+C)
# Tekrar başlatın
npm run dev
```

---

## Test Etme

1. http://localhost:3000 adresine gidin
2. Login sayfasına yönlendirileceksiniz
3. **"Google ile Giriş Yap"** butonuna tıklayın
4. Google hesabınızı seçin
5. İzinleri onaylayın
6. Ana sayfaya yönlendirileceksiniz

---

## Production Deployment (Vercel)

### 1. Vercel'de Environment Variables Ekleme

Vercel Dashboard → Project Settings → Environment Variables:

```
MONGODB_URI=your-mongodb-atlas-uri
AUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 2. Google Console'da Production URL Ekleme

1. Google Cloud Console → Credentials
2. OAuth client ID'nizi düzenleyin
3. **Authorized JavaScript origins:**
   ```
   https://your-domain.vercel.app
   ```
4. **Authorized redirect URIs:**
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```
5. **Save**

### 3. Vercel'de Redeploy

```bash
git push
# Vercel otomatik deploy eder
```

---

## Sorun Giderme

### "redirect_uri_mismatch" Hatası

**Çözüm:**
- Google Console'da Authorized redirect URIs'i kontrol edin
- Tam URL'yi ekleyin: `http://localhost:3000/api/auth/callback/google`
- Sonunda `/` olmamalı

### "Access blocked: This app's request is invalid"

**Çözüm:**
- OAuth consent screen'i yapılandırdığınızdan emin olun
- Test users listesine Gmail adresinizi ekleyin
- Consent screen'i "Testing" modunda bırakın (ilk aşamada)

### Session bulunamıyor

**Çözüm:**
- AUTH_SECRET doğru mu kontrol edin
- NEXTAUTH_URL doğru port'u mu işaret ediyor
- Browser cookies'leri temizleyin

### Google hesabı seçilmiyor

**Çözüm:**
- Test users listesinde olduğunuzdan emin olun
- Farklı bir Gmail hesabı deneyin
- Tarayıcı cache'ini temizleyin

---

## Güvenlik Notları

⚠️ **ASLA** `.env.local` dosyasını Git'e commit etmeyin!

✅ **Yapılması Gerekenler:**
- `.env.local` dosyası `.gitignore`'da olmalı
- Production'da güçlü `AUTH_SECRET` kullanın
- OAuth redirect URI'leri sadece güvenilir domain'ler
- Client Secret'ı gizli tutun

---

## Özet

1. ✅ Google Cloud Console'da proje oluştur
2. ✅ OAuth consent screen yapılandır
3. ✅ OAuth Client ID oluştur
4. ✅ Credentials'ı `.env.local`'e ekle
5. ✅ AUTH_SECRET oluştur
6. ✅ Sunucuyu yeniden başlat
7. ✅ Test et!

**Tebrikler! Google girişi hazır! 🎉**

---

## Ek Bilgiler

### OAuth Consent Screen Publishing

Uygulamanızı herkese açmak için:

1. OAuth consent screen → **"Publish App"**
2. Google verification süreci (1-2 hafta)
3. Onaylandıktan sonra herkes kullanabilir

Test aşamasında 100 kullanıcı limiti var.

### Diğer OAuth Providers

NextAuth.js şunları da destekler:
- GitHub
- Facebook
- Twitter
- Apple
- Discord
- ... ve daha fazlası

https://next-auth.js.org/providers/

---

**Yardıma ihtiyacınız olursa GitHub Issues'da sorun açabilirsiniz!**

