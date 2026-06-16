# ⚠️ Arşiv — Google OAuth Kurulum Rehberi

> **Bu rehber artık geçerli değildir.** Reading Chain, Google OAuth yerine **kullanıcı adı/şifre** (Credentials) kimlik doğrulaması kullanmaktadır.
>
> Güncel kurulum için: **[AUTH_SETUP_TR.md](./AUTH_SETUP_TR.md)**

---

## Mevcut Kimlik Doğrulama

| Özellik | Durum |
|---------|-------|
| Google OAuth | ❌ Kullanılmıyor |
| Kullanıcı adı + şifre | ✅ Aktif |
| Kayıt (`/signup`) | ✅ Aktif |
| NextAuth.js v5 (JWT) | ✅ Aktif |

### Gerekli Ortam Değişkenleri

```env
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

`GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET` **gerekmez**.

---

## İleride Google OAuth Eklemek İsterseniz

NextAuth.js Google provider'ı destekler. `auth.ts` dosyasına provider eklenebilir:

```typescript
import Google from "next-auth/providers/google";

providers: [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  Credentials({ /* mevcut */ }),
]
```

Bu değişiklik şu an projede uygulanmamıştır. Eski Google OAuth kurulum adımları bu dosyadan kaldırılmıştır.

---

**Güncel dokümantasyon:** [AUTH_SETUP_TR.md](./AUTH_SETUP_TR.md) | [README.md](./README.md)
