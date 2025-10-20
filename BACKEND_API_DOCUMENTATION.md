# 📡 Reading Chain - Backend API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:3000` (Development) | `https://your-domain.vercel.app` (Production)  
**Authentication:** NextAuth Session (Web) | JWT Token (Mobile - TODO)

Bu dokümantasyon, mevcut backend API'nizin **gerçek kod analizi** sonucunda oluşturulmuştur.

---

## 🔐 Authentication

### Mevcut Sistem: NextAuth (Session-based)
Web uygulaması için NextAuth session cookies kullanır. **Mobil uygulama için JWT sistemi eklemeniz gerekir.**

---

### POST /api/auth/signup
Yeni kullanıcı kaydı oluşturur.

**Authentication:** None (Public endpoint)

**Request Body:**
```json
{
  "username": "selman",
  "email": "selman@example.com",
  "password": "123456"
}
```

**Validation Rules:**
- `username`: required, 3-30 karakter
- `email`: required, valid email format
- `password`: required, minimum 6 karakter

**Response (Success - 201):**
```json
{
  "message": "Kayıt başarılı! Giriş yapabilirsiniz.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "selman",
    "email": "selman@example.com"
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "Bu kullanıcı adı zaten kullanılıyor"
}
// veya
{
  "error": "Bu e-posta adresi zaten kayıtlı"
}
// veya
{
  "error": "Tüm alanlar gereklidir"
}
// veya
{
  "error": "Kullanıcı adı 3-30 karakter arasında olmalıdır"
}
// veya
{
  "error": "Şifre en az 6 karakter olmalıdır"
}
```

**Implementation Details:**
- Password bcrypt ile hash'lenir (10 rounds)
- Email ve username unique check yapılır
- Varsayılan avatar: 😊
- Otomatik olarak `profilePublic: true` ve `showStatsToFriends: true`

---

## 👤 Profile Endpoints

### GET /api/profile
Mevcut kullanıcının kendi profilini getirir.

**Authentication:** Required (Session)

**Request:**
```http
GET /api/profile
Cookie: next-auth.session-token=...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "selman",
    "email": "selman@example.com",
    "avatar": "🐶",
    "bio": "Kitap okumayı seven bir geliştirici",
    "totalPagesRead": 2500,
    "totalBooksCompleted": 8,
    "currentStreak": 15,
    "longestStreak": 42,
    "profilePublic": true,
    "showStatsToFriends": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Response (401 - Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

### PUT /api/profile
Kullanıcı profilini günceller.

**Authentication:** Required (Session)

**Request Body:**
```json
{
  "avatar": "🦊",
  "bio": "Yeni bio metni",
  "profilePublic": false,
  "showStatsToFriends": true
}
```

**Note:** Tüm alanlar opsiyonel. Sadece gönderilenler güncellenir.

**Response (200):**
```json
{
  "success": true,
  "data": {
    // Updated user object (password hariç)
  }
}
```

**Avatar Options (16 hayvan emoji):**
```
🐶 🐱 🐼 🦊 🐨 🐰 🐹 🦁 🐯 🐻 🐸 🦉 🐧 🐥 🦄 🐺
```

---

## 📚 Books Endpoints

### GET /api/books
Kullanıcının tüm kitaplarını getirir.

**Authentication:** Required (Session)

**Query Parameters:**
- `status` (optional): `active` | `completed` | `paused`

**Request:**
```http
GET /api/books
GET /api/books?status=active
GET /api/books?status=completed
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6789012345",
      "userId": "507f1f77bcf86cd799439011",
      "title": "1984",
      "author": "George Orwell",
      "totalPages": 328,
      "currentPage": 150,
      "status": "active",
      "startDate": "2024-01-01T00:00:00.000Z",
      "completedDate": null,
      "notes": "Harika bir kitap",
      "createdAt": "2024-01-01T10:30:00.000Z",
      "updatedAt": "2024-01-15T20:45:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6789012346",
      "userId": "507f1f77bcf86cd799439011",
      "title": "Suç ve Ceza",
      "author": "Dostoyevski",
      "totalPages": 671,
      "currentPage": 671,
      "status": "completed",
      "startDate": "2023-12-01T00:00:00.000Z",
      "completedDate": "2023-12-28T00:00:00.000Z",
      "notes": null,
      "createdAt": "2023-12-01T10:30:00.000Z",
      "updatedAt": "2023-12-28T22:15:00.000Z"
    }
  ]
}
```

**Sorting:** `updatedAt` DESC (en son güncellenenler önce)

---

### POST /api/books
Yeni kitap ekler.

**Authentication:** Required (Session)

**Request Body:**
```json
{
  "title": "Sefiller",
  "author": "Victor Hugo",
  "totalPages": 1232,
  "status": "active",
  "notes": "Klasik bir eser"
}
```

**Required Fields:**
- `title`: string
- `author`: string
- `totalPages`: number (min: 1)

**Optional Fields:**
- `status`: `active` (default) | `completed` | `paused`
- `currentPage`: number (default: 0)
- `notes`: string
- `startDate`: ISO date (default: now)

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012347",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Sefiller",
    "author": "Victor Hugo",
    "totalPages": 1232,
    "currentPage": 0,
    "status": "active",
    "startDate": "2024-01-15T00:00:00.000Z",
    "notes": "Klasik bir eser",
    "createdAt": "2024-01-15T21:00:00.000Z",
    "updatedAt": "2024-01-15T21:00:00.000Z"
  }
}
```

---

### GET /api/books/:id
Tek bir kitabın detaylarını getirir.

**Authentication:** Required (Session)

**Request:**
```http
GET /api/books/65a1b2c3d4e5f6789012345
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345",
    "userId": "507f1f77bcf86cd799439011",
    "title": "1984",
    "author": "George Orwell",
    "totalPages": 328,
    "currentPage": 150,
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "completedDate": null,
    "notes": "Harika bir kitap",
    "createdAt": "2024-01-01T10:30:00.000Z",
    "updatedAt": "2024-01-15T20:45:00.000Z"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Kitap bulunamadı"
}
```

**Note:** Sadece kullanıcının kendi kitabını getirir (userId check)

---

### PUT /api/books/:id
Kitap bilgilerini günceller.

**Authentication:** Required (Session)

**Request Body:**
```json
{
  "title": "1984 (Yeni Çeviri)",
  "author": "George Orwell",
  "totalPages": 350,
  "currentPage": 200,
  "status": "active",
  "notes": "Güncelleme notları"
}
```

**Note:** Tüm alanlar opsiyonel. Sadece gönderilenler güncellenir.

**Response (200):**
```json
{
  "success": true,
  "data": {
    // Updated book object
  }
}
```

---

### DELETE /api/books/:id
Kitabı siler.

**Authentication:** Required (Session)

**Request:**
```http
DELETE /api/books/65a1b2c3d4e5f6789012345
```

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Kitap bulunamadı"
}
```

**Note:** Sadece kullanıcının kendi kitabını silebilir (userId check)

---

## 📖 Readings Endpoints

### GET /api/readings
Okuma kayıtlarını getirir.

**Authentication:** Required (Session)

**Query Parameters:**
- `bookId` (optional): Specific book'un okuma kayıtları
- `startDate` (optional): ISO date format
- `endDate` (optional): ISO date format

**Request:**
```http
GET /api/readings
GET /api/readings?bookId=65a1b2c3d4e5f6789012345
GET /api/readings?startDate=2024-01-01&endDate=2024-01-31
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65b2c3d4e5f67890123456a",
      "userId": "507f1f77bcf86cd799439011",
      "bookId": {
        "_id": "65a1b2c3d4e5f6789012345",
        "title": "1984",
        "author": "George Orwell"
      },
      "date": "2024-01-15T00:00:00.000Z",
      "pagesRead": 25,
      "fromPage": 125,
      "toPage": 150,
      "notes": "Harika bir bölümdü",
      "createdAt": "2024-01-15T20:30:00.000Z",
      "updatedAt": "2024-01-15T20:30:00.000Z"
    }
  ]
}
```

**Sorting:** `date` DESC (en yeniler önce)
**Population:** `bookId` (title ve author populate edilir)

---

### POST /api/readings
Yeni okuma kaydı ekler ve stats günceller.

**Authentication:** Required (Session)

**Request Body:**
```json
{
  "bookId": "65a1b2c3d4e5f6789012345",
  "pagesRead": 25,
  "date": "2024-01-15",
  "notes": "Güzel bir okumayı"
}
```

**Required Fields:**
- `bookId`: string (MongoDB ObjectId)
- `pagesRead`: number (min: 1)

**Optional Fields:**
- `date`: ISO date (default: now)
- `notes`: string

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65b2c3d4e5f67890123456b",
    "userId": "507f1f77bcf86cd799439011",
    "bookId": "65a1b2c3d4e5f6789012345",
    "date": "2024-01-15T00:00:00.000Z",
    "pagesRead": 25,
    "fromPage": 125,
    "toPage": 150,
    "notes": "Güzel bir okumayı",
    "createdAt": "2024-01-15T20:35:00.000Z",
    "updatedAt": "2024-01-15T20:35:00.000Z"
  },
  "book": {
    "_id": "65a1b2c3d4e5f6789012345",
    "currentPage": 150,
    "status": "active"
  },
  "newBadges": [
    {
      "badgeId": "pages_100",
      "name": "Yeni Başlangıç",
      "icon": "📖",
      "description": "Toplam 100 sayfa okuma",
      "rarity": "common"
    }
  ]
}
```

**Automatic Updates:**
1. **Book.currentPage** güncellenir
2. **Book.status** → `completed` (eğer totalPages'e ulaşıldıysa)
3. **User stats** güncellenir (`totalPagesRead`, `currentStreak`, etc.)
4. **Badge kontrolü** yapılır ve yeni kazanılan rozetler döner

**Page Calculation:**
- `fromPage`: Kitabın mevcut `currentPage` değeri
- `toPage`: `min(fromPage + pagesRead, totalPages)`
- `actualPagesRead`: `toPage - fromPage`

---

## 📊 Stats Endpoints

### GET /api/stats
Kullanıcının detaylı istatistiklerini getirir.

**Authentication:** Required (Session)

**Query Parameters:**
- `period` (optional): `week` | `month` | `year` | `all` (default: all)

**Request:**
```http
GET /api/stats
GET /api/stats?period=month
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalBooks": 15,
    "completedBooks": 8,
    "activeBooks": 7,
    "totalPagesRead": 2500,
    "averagePerDay": 25,
    "readingCount": 125,
    "streak": {
      "current": 15,
      "longest": 42,
      "lastReadDate": "2024-01-15"
    },
    "dailyData": [
      { "date": "2024-01-01", "pages": 30 },
      { "date": "2024-01-02", "pages": 45 },
      { "date": "2024-01-03", "pages": 20 }
    ],
    "heatmapData": [
      { "date": "2024-01-01", "count": 30, "level": 2 },
      { "date": "2024-01-02", "count": 45, "level": 2 },
      { "date": "2024-01-03", "count": 20, "level": 1 }
    ]
  }
}
```

**Stats Calculations:**
- **totalBooks**: User'a ait tüm kitaplar
- **completedBooks**: `status: 'completed'` olan kitaplar
- **activeBooks**: `status: 'active'` olan kitaplar
- **totalPagesRead**: Period içindeki toplam okunan sayfa
- **averagePerDay**: `totalPagesRead / uniqueDays`
- **readingCount**: Period içindeki reading kayıt sayısı

**Streak Logic:**
- Bugün veya dün okuma varsa `current` devam eder
- Ardışık günler streak'i artırır
- 1 gün atlanırsa streak sıfırlanır
- `longest`: Tüm zamanların en uzun streak'i

**Heatmap Levels:**
- Level 0: 0 sayfa
- Level 1: 1-20 sayfa
- Level 2: 21-50 sayfa
- Level 3: 51-100 sayfa
- Level 4: 100+ sayfa

---

## 👥 Friends Endpoints

### GET /api/friends
Arkadaş listesi ve bekleyen istekleri getirir.

**Authentication:** Required (Session)

**Query Parameters:**
- `type` (optional): `friends` (default) | `pending` | `sent`

**Request:**
```http
GET /api/friends                  # Kabul edilmiş arkadaşlar
GET /api/friends?type=pending     # Gelen istekler (bana gönderilmiş)
GET /api/friends?type=sent        # Gönderilen istekler (benim gönderdiğim)
```

**Response - Friends (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "username": "ahmet",
      "avatar": "🐱",
      "totalPagesRead": 1200,
      "totalBooksCompleted": 5,
      "currentStreak": 7,
      "createdAt": "2023-11-15T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Response - Pending (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65c3d4e5f678901234567890",
      "user": {
        "_id": "507f1f77bcf86cd799439013",
        "username": "mehmet",
        "avatar": "🐼",
        "createdAt": "2024-01-10T00:00:00.000Z"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Friend Status Types:**
- `PENDING`: Bekleyen istek
- `ACCEPTED`: Kabul edildi
- `REJECTED`: Reddedildi

---

### POST /api/friends
Arkadaşlık isteği gönderir.

**Authentication:** Required (Session)

**Request Body:**
```json
{
  "friendId": "507f1f77bcf86cd799439013"
}
```

**Validation:**
- Kendine istek gönderilemez
- Kullanıcı var olmalı
- Zaten arkadaş olunmamalı
- Bekleyen istek olmamalı

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65c3d4e5f678901234567891",
    "userId": "507f1f77bcf86cd799439011",
    "friendId": "507f1f77bcf86cd799439013",
    "status": "PENDING",
    "createdAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Arkadaşlık isteği gönderildi"
}
```

**Response (400 - Already Friends):**
```json
{
  "success": false,
  "error": "Zaten arkadaşsınız"
}
```

---

### PUT /api/friends/:id
Arkadaşlık isteğini kabul eder veya reddeder.

**Authentication:** Required (Session)

**Request Body:**
```json
{
  "action": "accept"  // or "reject"
}
```

**Response (200 - Accept):**
```json
{
  "success": true,
  "data": {
    "_id": "65c3d4e5f678901234567891",
    "status": "ACCEPTED"
  },
  "message": "Arkadaşlık isteği kabul edildi",
  "newBadges": [
    {
      "badgeId": "first_friend",
      "name": "İlk Arkadaş",
      "icon": "🤝"
    }
  ]
}
```

**Authorization:**
- Sadece istek **alıcısı** (friendId) kabul/red edebilir
- İstek status'u `PENDING` olmalı

**Automatic Badge Check:**
- Her iki taraf için de badge kontrolü yapılır
- "İlk Arkadaş" ve "Sosyal Kelebek" rozetleri unlock olabilir

---

### DELETE /api/friends/:id
Arkadaşlıktan çıkar veya isteği iptal eder.

**Authentication:** Required (Session)

**Request:**
```http
DELETE /api/friends/65c3d4e5f678901234567891
```

**Response (200):**
```json
{
  "success": true,
  "message": "Arkadaşlık silindi"
}
```

**Authorization:**
- Sadece **taraflardan biri** (userId veya friendId) silebilir

---

### GET /api/friends/activity
Arkadaşların son okuma aktivitelerini getirir.

**Authentication:** Required (Session)

**Query Parameters:**
- `limit` (optional): number (default: 20)

**Request:**
```http
GET /api/friends/activity
GET /api/friends/activity?limit=50
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65b2c3d4e5f67890123456c",
      "user": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "ahmet",
        "avatar": "🐱"
      },
      "book": {
        "_id": "65a1b2c3d4e5f6789012348",
        "title": "Hobbit",
        "author": "J.R.R. Tolkien"
      },
      "pagesRead": 35,
      "date": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-15T19:30:00.000Z"
    }
  ],
  "count": 1
}
```

**Filter:**
- Sadece kabul edilmiş arkadaşların aktiviteleri
- Son 7 günün kayıtları
- `date` ve `createdAt` DESC sıralama

---

## 🏆 Badges Endpoints

### GET /api/badges
Kullanıcının rozet durumlarını getirir.

**Authentication:** Required (Session)

**Query Parameters:**
- `all` (optional): `true` (tüm rozetler + progress) | `false` (default, sadece kazanılanlar)

**Request:**
```http
GET /api/badges              # Sadece kazanılan rozetler
GET /api/badges?all=true     # Tüm rozetler + progress
```

**Response - Only Unlocked (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65d4e5f6789012345678901a",
      "userId": "507f1f77bcf86cd799439011",
      "badgeId": "streak_7",
      "unlockedAt": "2024-01-10T20:00:00.000Z",
      "id": "streak_7",
      "name": "Haftalık Kahraman",
      "description": "7 gün üst üste okuma",
      "icon": "⚡",
      "category": "streak",
      "requirement": 7,
      "rarity": "common",
      "unlockMessage": "Muhteşem! Bir hafta boyunca kesintisiz okudun!"
    }
  ],
  "count": 1
}
```

**Response - All Badges (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "streak_7",
      "name": "Haftalık Kahraman",
      "description": "7 gün üst üste okuma",
      "icon": "⚡",
      "category": "streak",
      "requirement": 7,
      "rarity": "common",
      "unlockMessage": "Muhteşem! Bir hafta boyunca kesintisiz okudun!",
      "unlocked": true,
      "unlockedAt": "2024-01-10T20:00:00.000Z",
      "progress": 7
    },
    {
      "id": "streak_30",
      "name": "Aylık Efsane",
      "description": "30 gün üst üste okuma",
      "icon": "🌟",
      "category": "streak",
      "requirement": 30,
      "rarity": "rare",
      "unlockMessage": "İnanılmaz! 30 günlük okuma serisi!",
      "unlocked": false,
      "unlockedAt": null,
      "progress": 15
    }
  ],
  "stats": {
    "total": 30,
    "unlocked": 5,
    "percentage": 17
  }
}
```

**Badge Categories:**
- `streak`: Okuma serisi rozetleri
- `pages`: Toplam sayfa rozetleri
- `books`: Tamamlanan kitap rozetleri
- `speed`: Günlük hız rozetleri
- `consistency`: Düzenlilik rozetleri
- `special`: Özel rozetler

**Rarity Levels:**
- `common`: Gri
- `rare`: Mavi
- `epic`: Mor
- `legendary`: Altın

**Total Badges:** 30+ rozet tanımlı (`lib/badges.ts`)

---

## 🥇 Leaderboard Endpoint

### GET /api/leaderboard
Sıralama tablosunu getirir.

**Authentication:** Required (Session)

**Query Parameters:**
- `period` (optional): `daily` | `weekly` (default) | `monthly`
- `scope` (optional): `friends` (default) | `global`

**Request:**
```http
GET /api/leaderboard                           # Haftalık arkadaşlar
GET /api/leaderboard?period=monthly           # Aylık arkadaşlar
GET /api/leaderboard?scope=global             # Haftalık global
GET /api/leaderboard?period=daily&scope=global # Günlük global
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "username": "ahmet",
      "avatar": "🐱",
      "currentStreak": 15,
      "totalPagesRead": 5000,
      "periodPages": 250,
      "isCurrentUser": false,
      "rank": 1
    },
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "selman",
      "avatar": "🐶",
      "currentStreak": 10,
      "totalPagesRead": 2500,
      "periodPages": 175,
      "isCurrentUser": true,
      "rank": 2
    }
  ],
  "currentUser": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "selman",
    "avatar": "🐶",
    "currentStreak": 10,
    "totalPagesRead": 2500,
    "periodPages": 175,
    "isCurrentUser": true,
    "rank": 2
  },
  "period": "weekly",
  "scope": "friends",
  "count": 2
}
```

**Sorting:** `periodPages` DESC (period içinde en çok okuyan önce)

**Period Calculations:**
- `daily`: Bugün (00:00'dan itibaren)
- `weekly`: Son 7 gün
- `monthly`: Son 30 gün

**Scope:**
- `friends`: Kullanıcının arkadaşları + kendisi
- `global`: Tüm kullanıcılar (limit 100)

---

## 🔍 User Search & Profile

### GET /api/users/search
Kullanıcı adına göre arama yapar.

**Authentication:** Required (Session)

**Query Parameters:**
- `q`: search query (min 2 karakter)

**Request:**
```http
GET /api/users/search?q=ahm
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "username": "ahmet",
      "avatar": "🐱",
      "totalPagesRead": 1200,
      "currentStreak": 7,
      "createdAt": "2023-11-15T00:00:00.000Z",
      "friendshipStatus": "friends",
      "friendshipId": "65c3d4e5f678901234567891"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "username": "ahmetcan",
      "avatar": "🦊",
      "totalPagesRead": 800,
      "currentStreak": 3,
      "createdAt": "2024-01-05T00:00:00.000Z",
      "friendshipStatus": "pending_sent",
      "friendshipId": "65c3d4e5f678901234567892"
    },
    {
      "_id": "507f1f77bcf86cd799439015",
      "username": "ahmetyilmaz",
      "avatar": "🐼",
      "totalPagesRead": 500,
      "currentStreak": 0,
      "createdAt": "2024-01-10T00:00:00.000Z",
      "friendshipStatus": "none",
      "friendshipId": null
    }
  ],
  "count": 3
}
```

**Friendship Status Values:**
- `none`: Arkadaş değil
- `friends`: Arkadaş (ACCEPTED)
- `pending_sent`: İstek gönderildi (ben gönderdim)
- `pending_received`: İstek alındı (bana gönderildi)

**Search:**
- Case-insensitive regex search
- Kendini exclude eder
- Max 20 sonuç

---

### GET /api/users/:username
Başka kullanıcının public profilini getirir.

**Authentication:** Required (Session - ama public profiles için optional olabilir)

**Request:**
```http
GET /api/users/ahmet
```

**Response (200 - Public Profile):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "username": "ahmet",
    "avatar": "🐱",
    "bio": "Kitap severim",
    "profilePublic": true,
    "totalPagesRead": 1200,
    "totalBooksCompleted": 5,
    "currentStreak": 7,
    "longestStreak": 20,
    "createdAt": "2023-11-15T00:00:00.000Z"
  },
  "isOwner": false,
  "isFriend": false
}
```

**Response (403 - Private Profile):**
```json
{
  "success": false,
  "error": "This profile is private"
}
```

**Privacy Rules:**
- `profilePublic: false` → Sadece owner görebilir
- `showStatsToFriends: false` → Stats herkese açık
- `showStatsToFriends: true` → Stats sadece arkadaşlar + owner

**Data Exclusions:**
- `password`: Her zaman exclude
- `email`: Başkalarına gösterilmez
- Stats: Privacy ayarlarına göre

---

## 🔒 Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation errors, missing fields |
| 401 | Unauthorized | No session/token, authentication failed |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unhandled server errors |

---

## 📝 Data Models

### User Model
```typescript
{
  _id: string;
  username: string;        // 3-30 chars, unique
  email: string;           // unique, lowercase
  password: string;        // bcrypt hashed
  avatar: string;          // Emoji (default: 😊)
  bio?: string;            // max 200 chars
  totalPagesRead: number;  // Cached stat
  totalBooksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  profilePublic: boolean;  // default: true
  showStatsToFriends: boolean; // default: true
  createdAt: Date;
  updatedAt: Date;
}
```

### Book Model
```typescript
{
  _id: string;
  userId: string;
  title: string;
  author: string;
  totalPages: number;       // min: 1
  currentPage: number;      // default: 0
  status: 'active' | 'completed' | 'paused';
  startDate: Date;          // default: now
  completedDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Reading Model
```typescript
{
  _id: string;
  userId: string;
  bookId: string;          // ref: Book
  date: Date;
  pagesRead: number;
  fromPage: number;
  toPage: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Friend Model
```typescript
{
  _id: string;
  userId: string;          // İstek gönderen
  friendId: string;        // İstek alan
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}
```

### UserBadge Model
```typescript
{
  _id: string;
  userId: string;
  badgeId: string;         // Badge definition ID
  unlockedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 Mobile Implementation Notes

### 1. Authentication için JWT Eklenmeli
Mevcut sistem NextAuth session cookies kullanır. Mobile için:

```typescript
// app/api/auth/mobile-login/route.ts (yeni endpoint)
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  // Username/password validate
  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  );
  
  return NextResponse.json({
    success: true,
    token,
    user: { ... }
  });
}
```

### 2. Middleware ile JWT Doğrulama
```typescript
// lib/auth-middleware.ts
export async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  return decoded;
}
```

### 3. CORS Ayarları
```typescript
// next.config.ts
headers: [
  { key: 'Access-Control-Allow-Origin', value: '*' },
  { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
  { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
]
```

### 4. Axios Setup (Mobile)
```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📚 Additional Resources

### Related Files
- **Badge Definitions:** `lib/badges.ts` (30+ rozet tanımı)
- **Badge Checker:** `lib/badgeChecker.ts` (unlock logic)
- **Stats Updater:** `lib/statsUpdater.ts` (user stats calculator)
- **Models:** `models/*.ts` (Mongoose schemas)

### Environment Variables
```bash
# .env.local
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Mobile için gerekli
JWT_SECRET=your-jwt-secret
```

---

**Son Güncelleme:** 2024-01-20  
**Analiz Edilen Kod:** `app/api/*` routes  
**API Version:** 1.0.0

Bu dokümantasyon, mevcut backend kodunuzun **gerçek analizi** sonucunda oluşturulmuştur. Tüm endpoint'ler, request/response formatları ve business logic'ler çalışan kodunuzdan alınmıştır.

