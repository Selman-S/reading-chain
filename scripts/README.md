# Test Data Seed Script

Bu script, Reading Chain uygulamanızı test etmek için örnek kullanıcılar, kitaplar ve okuma kayıtları oluşturur.

## 🚀 Kullanım

```bash
npm run seed
```

## 📋 Oluşturulan Test Hesapları

Script çalıştırıldığında aşağıdaki 3 test kullanıcısı oluşturulur:

| Kullanıcı | Email | Şifre | Avatar |
|-----------|-------|-------|--------|
| selman | selman@test.com | 123456 | 🐶 |
| ahmet | ahmet@test.com | 123456 | 🐱 |
| ayse | ayse@test.com | 123456 | 🦊 |

## ✨ Oluşturulan Veriler

### Kullanıcılar
- **3 test kullanıcısı** farklı avatar ve bio ile
- Her kullanıcı birbirleriyle **arkadaş** (kabul edilmiş)
- 7 günlük **aktif streak**
- Farklı sayfa okuma istatistikleri

### Kitaplar
Her kullanıcıya 3 kitap eklenir:

**Selman:**
- 1984 (George Orwell) - Aktif
- Suç ve Ceza (Dostoyevski) - Tamamlanmış
- Simyacı (Paulo Coelho) - Tamamlanmış

**Ahmet:**
- Sefiller (Victor Hugo) - Aktif
- Anna Karenina (Lev Tolstoy) - Tamamlanmış
- Beyaz Diş (Jack London) - Tamamlanmış

**Ayşe:**
- Dune (Frank Herbert) - Aktif
- Yüzüklerin Efendisi (J.R.R. Tolkien) - Tamamlanmış
- Harry Potter ve Felsefe Taşı (J.K. Rowling) - Tamamlanmış

### Okuma Kayıtları
- **Geçmiş tarihli okuma kayıtları** (1-3 ay önce başlayarak)
- **Son 7 günde sürekli okuma** (streak için)
- Gerçekçi okuma miktarları (10-50 sayfa/gün)
- Tamamlanmış kitaplar için tam okuma geçmişi
- Aktif kitaplar için kısmi okuma geçmişi

### İstatistikler
- Toplam okunan sayfa sayısı
- Tamamlanan kitap sayısı
- Mevcut ve en uzun streak
- Günlük okuma grafikleri için veri

## 🔄 Mevcut Verileri Temizleme

Script her çalıştırıldığında:
1. **Önce mevcut test kullanıcılarını ve verilerini temizler**
2. Sonra yeni test verilerini oluşturur

Bu sayede script'i istediğiniz kadar çalıştırabilirsiniz.

## 🧪 Test Senaryoları

### Giriş Yapma
```
Email: selman@test.com
Şifre: 123456
```

### Arkadaş Sistemi
- Tüm kullanıcılar zaten birbirleriyle arkadaş
- Arkadaş aktivite feed'inde okuma kayıtlarını görebilirsiniz
- Leaderboard'da arkadaşlarınızı görebilirsiniz

### İstatistikler
- Her kullanıcının farklı okuma geçmişi var
- Heatmap ve grafikler için gerçekçi veri
- Streak sistemi aktif ve test edilebilir

### Rozetler (Badges)
- Okuma kayıtları sayesinde bazı rozetler unlock olmuş olabilir
- Yeni okuma ekleyerek yeni rozetler kazanabilirsiniz

## 📝 Not

Test verilerini silmek isterseniz, script'i tekrar çalıştırmanız yeterlidir. Önce temizlik yapacak, sonra yeni veriler oluşturacaktır.

## 🛠️ Gereksinimler

- Node.js
- MongoDB bağlantısı (`.env.local` dosyasında `MONGODB_URI`)
- Gerekli paketler (`npm install` ile yüklenir)

## 🤝 Katkı

Test senaryolarını geliştirmek veya yeni test verileri eklemek için `scripts/seed-test-data.ts` dosyasını düzenleyebilirsiniz.

