# 📡 Reading Chain Mobile - API Documentation

Bu dokuman, Reading Chain backend API'sinin tüm endpoint'lerini detaylı olarak açıklar.

---

## 🌐 Base Configuration

### Base URL
```typescript
// Development
const API_BASE_URL = 'http://localhost:3000';

// Production
const API_BASE_URL = 'https://your-domain.vercel.app';
```

### Headers
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {JWT_TOKEN}' // Authenticated requests için
}
```

### Authentication
- Login sonrası JWT token alınır
- Token `expo-secure-store` ile saklanır
- Her authenticated request'te header'a eklenir

---

## 🔐 Auth Endpoints

### POST /api/auth/signup
Yeni kullanıcı kaydı oluşturur.

**Request Body:**
```json
{
  "name": "Selman Kahya",
  "email": "selman@example.com",
  "username": "selman",
  "password": "123456"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Kullanıcı başarıyla oluşturuldu"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "Bu kullanıcı adı zaten kullanılıyor"
}
```

**Validation:**
- name: required
- email: required, valid email format
- username: required, unique, alphanumeric
- password: required, min 6 characters

---

### POST /api/auth/login
Kullanıcı girişi yapar (NextAuth credentials provider).

**Note:** NextAuth kullanıldığı için direkt `/api/auth/callback/credentials` endpoint'ini kullanabilirsiniz veya custom bir login endpoint oluşturabilirsiniz.

**Alternative Custom Login:**
```typescript
// Custom JWT login endpoint oluşturmanız gerekebilir
POST /api/auth/login

Request:
{
  "username": "selman",
  "password": "123456"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "selman",
    "name": "Selman Kahya",
    "email": "selman@example.com",
    "avatar": "🐶"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Kullanıcı adı veya şifre hatalı"
}
```

---

## 👤 User Endpoints

### GET /api/profile
Mevcut kullanıcının profilini getirir.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "username": "selman",
    "email": "selman@example.com",
    "name": "Selman Kahya",
    "avatar": "🐶",
    "bio": "Kitap okumayı seven bir geliştirici",
    "totalPagesRead": 2500,
    "totalBooksCompleted": 8,
    "currentStreak": 15,
    "longestStreak": 42,
    "profilePublic": true,
    "showStatsToFriends": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PUT /api/profile
Kullanıcı profilini günceller (avatar, bio).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "avatar": "🦊",
  "bio": "Yeni bio metni"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    // Updated user object
  }
}
```

---

### GET /api/users/search?q={query}
Kullanıcı adına göre arama yapar (arkadaş eklemek için).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `q`: Search query (username)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "username": "ahmet",
      "name": "Ahmet Yılmaz",
      "avatar": "🐱",
      "totalPagesRead": 1200
    }
  ]
}
```

---

### GET /api/users/:username
Belirli bir kullanıcının public profilini getirir.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "username": "ahmet",
    "name": "Ahmet Yılmaz",
    "avatar": "🐱",
    "bio": "Bio text",
    "totalPagesRead": 1200,
    "totalBooksCompleted": 5,
    "currentStreak": 7
  }
}
```

---

## 📚 Books Endpoints

### GET /api/books
Kullanıcının tüm kitaplarını getirir.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "book_id",
      "userId": "user_id",
      "title": "1984",
      "author": "George Orwell",
      "totalPages": 328,
      "currentPage": 150,
      "status": "reading",
      "genre": "Distopya",
      "startDate": "2024-01-01",
      "completedDate": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Status Values:**
- `reading`: Şu anda okuyor
- `completed`: Tamamlandı
- `planned`: Okumayı planlıyor

---

### POST /api/books
Yeni kitap ekler.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Suç ve Ceza",
  "author": "Dostoyevski",
  "totalPages": 671,
  "genre": "Klasik",
  "status": "reading"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    // Created book object
  }
}
```

---

### GET /api/books/:id
Belirli bir kitabın detaylarını getirir.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "book_id",
    "title": "1984",
    "author": "George Orwell",
    "totalPages": 328,
    "currentPage": 150,
    "status": "reading",
    "readingHistory": [
      {
        "date": "2024-01-15",
        "pages": 25
      }
    ]
  }
}
```

---

### PUT /api/books/:id
Kitap bilgilerini günceller.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "totalPages": 400,
  "status": "completed"
}
```

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

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Kitap başarıyla silindi"
}
```

---

## 📖 Reading Endpoints

### GET /api/readings
Kullanıcının okuma kayıtlarını getirir.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "reading_id",
      "userId": "user_id",
      "bookId": "book_id",
      "book": {
        "title": "1984",
        "author": "George Orwell"
      },
      "date": "2024-01-15",
      "pagesRead": 25,
      "notes": "Harika bir bölümdü",
      "createdAt": "2024-01-15T20:30:00.000Z"
    }
  ]
}
```

---

### POST /api/readings
Yeni okuma kaydı ekler.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "bookId": "book_id",
  "date": "2024-01-15",
  "pagesRead": 25,
  "notes": "Optional note"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    // Created reading object
  },
  "badgesUnlocked": [
    {
      "badgeId": "pages_100",
      "name": "Yeni Başlangıç",
      "icon": "📖"
    }
  ]
}
```

**Note:** Response'da yeni kazanılan rozetler de döner.

---

### PUT /api/readings/:id
Okuma kaydını günceller.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "pagesRead": 30,
  "notes": "Updated note"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    // Updated reading object
  }
}
```

---

### DELETE /api/readings/:id
Okuma kaydını siler.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Okuma kaydı silindi"
}
```

---

## 👥 Friends Endpoints

### GET /api/friends
Kullanıcının arkadaş listesini getirir.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "friend_id",
      "friendId": "user_id",
      "friend": {
        "username": "ahmet",
        "name": "Ahmet Yılmaz",
        "avatar": "🐱",
        "currentStreak": 5
      },
      "status": "accepted",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Status Values:**
- `pending`: Bekleyen istek
- `accepted`: Kabul edildi
- `rejected`: Reddedildi

---

### POST /api/friends
Arkadaşlık isteği gönderir.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "friendId": "user_id"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    // Friend request object
  }
}
```

---

### DELETE /api/friends/:id
Arkadaşlığı sonlandırır.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Arkadaşlık kaldırıldı"
}
```

---

### GET /api/friends/activity
Arkadaşların son aktivitelerini getirir.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "userId": "user_id",
      "username": "ahmet",
      "avatar": "🐱",
      "type": "reading",
      "message": "25 sayfa okudu",
      "bookTitle": "1984",
      "timestamp": "2024-01-15T20:30:00.000Z"
    }
  ]
}
```

---

## 📊 Stats Endpoints

### GET /api/stats
Kullanıcının istatistiklerini getirir.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "streak": {
      "current": 15,
      "longest": 42,
      "lastReadDate": "2024-01-15"
    },
    "totalPagesRead": 2500,
    "totalBooksCompleted": 8,
    "readingCount": 125,
    "averagePerDay": 25,
    "activeBooks": 3,
    "dailyBreakdown": [
      {
        "date": "2024-01-15",
        "pages": 25
      }
    ],
    "weeklyStats": {
      "thisWeek": 175,
      "lastWeek": 150
    },
    "monthlyStats": {
      "thisMonth": 750,
      "lastMonth": 680
    }
  }
}
```

---

### GET /api/leaderboard
Sıralama tablosunu getirir.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params (Optional):**
- `period`: `week`, `month`, `all` (default: all)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "userId": "user_id",
      "username": "selman",
      "avatar": "🐶",
      "totalPages": 2500,
      "isCurrentUser": true
    },
    {
      "rank": 2,
      "userId": "user_id_2",
      "username": "ahmet",
      "avatar": "🐱",
      "totalPages": 2300,
      "isCurrentUser": false
    }
  ]
}
```

---

## 🏆 Badges Endpoints

### GET /api/badges
Kullanıcının rozet durumlarını getirir.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "badgeId": "streak_7",
      "name": "Haftalık Kahraman",
      "description": "7 gün üst üste okuma",
      "icon": "⚡",
      "category": "streak",
      "requirement": 7,
      "rarity": "common",
      "unlockMessage": "Muhteşem! Bir hafta boyunca kesintisiz okudun!",
      "unlockedAt": "2024-01-15T00:00:00.000Z",
      "progress": 7,
      "isUnlocked": true
    },
    {
      "badgeId": "streak_30",
      "name": "Aylık Efsane",
      "description": "30 gün üst üste okuma",
      "icon": "🌟",
      "category": "streak",
      "requirement": 30,
      "rarity": "rare",
      "unlockMessage": "İnanılmaz! 30 günlük okuma serisi!",
      "unlockedAt": null,
      "progress": 15,
      "isUnlocked": false
    }
  ]
}
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

**200 OK:** Başarılı GET, PUT, DELETE
**201 Created:** Başarılı POST
**400 Bad Request:** Validation hatası
**401 Unauthorized:** Token yok veya geçersiz
**403 Forbidden:** Yetki yok
**404 Not Found:** Kaynak bulunamadı
**500 Internal Server Error:** Sunucu hatası

---

## 🔄 API Service Implementation (Axios)

### services/api.ts
```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000' 
  : 'https://your-domain.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      await SecureStore.deleteItemAsync('token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Example Usage
```typescript
// Login
const loginUser = async (username: string, password: string) => {
  const response = await api.post('/api/auth/login', {
    username,
    password,
  });
  return response.data;
};

// Get books
const getBooks = async () => {
  const response = await api.get('/api/books');
  return response.data;
};

// Add reading
const addReading = async (bookId: string, pagesRead: number, date: string) => {
  const response = await api.post('/api/readings', {
    bookId,
    pagesRead,
    date,
  });
  return response.data;
};
```

---

## 🧪 Testing Endpoints

### Postman / Thunder Client
1. Import endpoints
2. Set environment variable: `BASE_URL`
3. Login to get token
4. Save token in environment
5. Test all endpoints

### cURL Examples
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"selman","password":"123456"}'

# Get profile (with token)
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add book
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"1984","author":"George Orwell","totalPages":328}'
```

---

**Son Güncelleme:** 2024-01-20
**Version:** 1.0

