# 📱 Reading Chain Mobile - Features Documentation

Bu dokuman, Reading Chain mobil uygulamasının tüm özelliklerini detaylı olarak açıklar.

---

## 🔐 1. Authentication

### 1.1 Login
**Açıklama:** Kullanıcıların username ve password ile giriş yapması.

**UI Bileşenleri:**
- Text input (username)
- Password input (şifre gizli)
- Login button
- "Kayıt Ol" linki
- Logo ve başlık

**API Endpoints:**
- `POST /api/auth/login` (Custom credentials provider)

**State Management:**
- AuthContext (user, token)
- SecureStore (token storage)

**Priority:** ⭐ Must-have

**Notlar:**
- Form validation
- Loading state göster
- Error messages
- "Remember me" gerekli değil (token auto-save)

---

### 1.2 Signup
**Açıklama:** Yeni kullanıcı kaydı oluşturma.

**UI Bileşenleri:**
- Name input
- Email input
- Username input
- Password input
- Confirm password input
- Signup button
- "Giriş Yap" linki

**API Endpoints:**
- `POST /api/auth/signup`

**State Management:**
- Form state (local)

**Priority:** ⭐ Must-have

**Validation:**
- Email format check
- Password min 6 karakter
- Password match check
- Username unique check

---

### 1.3 Logout
**Açıklama:** Kullanıcının oturumu kapatması ve token silme.

**UI Bileşenleri:**
- Settings menüsünde "Çıkış Yap" butonu
- Confirmation dialog

**API Endpoints:**
- Yok (local token silme)

**State Management:**
- AuthContext.logout()
- SecureStore.deleteItemAsync('token')

**Priority:** ⭐ Must-have

---

## 👤 2. User Profile

### 2.1 Profile View
**Açıklama:** Kullanıcının kendi profilini görüntüleme ve düzenleme.

**UI Bileşenleri:**
- Avatar display (emoji)
- Username
- Email
- Bio text
- Stats cards (total pages, books, streak)
- Mini reading chart
- Badges preview
- Edit button

**API Endpoints:**
- `GET /api/profile`

**State Management:**
- Profile state (local)
- AuthContext (user data)

**Priority:** ⭐ Must-have

---

### 2.2 Profile Edit
**Açıklama:** Avatar ve bio düzenleme.

**UI Bileşenleri:**
- Avatar selector (emoji grid, 16 hayvan)
- Bio textarea (max 200 karakter)
- Save/Cancel buttons

**API Endpoints:**
- `PUT /api/profile`

**State Management:**
- Edit form state (local)

**Priority:** ⭐ Must-have

**Avatar Options:**
- 🐶 🐱 🐼 🦊 🐨 🐰 🐹 🦁 🐯 🐻 🐸 🦉 🐧 🐥 🦄 🐺

---

## 📚 3. Books Management

### 3.1 Books List
**Açıklama:** Kullanıcının kitap koleksiyonunu görüntüleme.

**UI Bileşenleri:**
- Book cards (title, author, progress)
- Filter tabs (Reading, Completed, Planned)
- Add book FAB (Floating Action Button)
- Empty state
- Pull-to-refresh

**API Endpoints:**
- `GET /api/books`

**State Management:**
- Books state (local + cache)

**Priority:** ⭐ Must-have

**Card Info:**
- Kitap başlığı
- Yazar
- Okunan sayfa / Toplam sayfa
- Progress bar
- Durum (reading/completed/planned)

---

### 3.2 Add Book
**Açıklama:** Yeni kitap ekleme.

**UI Bileşenleri:**
- Title input
- Author input
- Total pages input (numeric)
- Genre input (optional)
- Status picker (reading/planned)
- Add button
- Cancel button

**API Endpoints:**
- `POST /api/books`

**State Management:**
- Form state (local)

**Priority:** ⭐ Must-have

**Validation:**
- Title required
- Author required
- Total pages > 0

---

### 3.3 Edit Book
**Açıklama:** Mevcut kitap bilgilerini düzenleme.

**UI Bileşenleri:**
- Pre-filled form
- Update button
- Delete button

**API Endpoints:**
- `PUT /api/books/:id`
- `DELETE /api/books/:id`

**State Management:**
- Edit form state (local)

**Priority:** ⭐ Must-have

---

### 3.4 Book Detail
**Açıklama:** Kitap detayları ve okuma geçmişi.

**UI Bileşenleri:**
- Kitap bilgileri
- Toplam okunan sayfa
- Okuma kayıtları listesi
- Reading progress chart
- Edit/Delete buttons

**API Endpoints:**
- `GET /api/books/:id`

**State Management:**
- Book detail state

**Priority:** ⭐⭐ Nice-to-have

---

## 📖 4. Reading Tracking

### 4.1 Quick Reading Entry
**Açıklama:** Hızlı okuma kaydı ekleme (ana sayfadan).

**UI Bileşenleri:**
- Book picker (dropdown)
- Pages read input (numeric)
- Date picker (default: today)
- Submit button

**API Endpoints:**
- `POST /api/readings`

**State Management:**
- Form state (local)
- Refresh home stats after submit

**Priority:** ⭐ Must-have

**Flow:**
1. Kitap seç
2. Kaç sayfa okuduğunu gir
3. Tarihi seç (gerekirse)
4. Kaydet
5. Success message + stats update

---

### 4.2 Reading History
**Açıklama:** Geçmiş okuma kayıtlarını görüntüleme.

**UI Bileşenleri:**
- Reading cards (date, book, pages)
- Filter by date range
- Edit/Delete options
- Group by date

**API Endpoints:**
- `GET /api/readings`

**State Management:**
- Readings state

**Priority:** ⭐ Must-have

---

### 4.3 Edit Reading Entry
**Açıklama:** Okuma kaydını düzenleme veya silme.

**UI Bileşenleri:**
- Edit modal
- Delete confirmation

**API Endpoints:**
- `PUT /api/readings/:id`
- `DELETE /api/readings/:id`

**State Management:**
- Edit state

**Priority:** ⭐ Must-have

---

## 🔥 5. Streak System

### 5.1 Streak Display
**Açıklama:** Güncel okuma serisini görüntüleme.

**UI Bileşenleri:**
- Flame icon (animated)
- Current streak number
- Longest streak
- Motivational messages

**API Endpoints:**
- `GET /api/stats` (streak verisi içinde)

**State Management:**
- Stats state

**Priority:** ⭐ Must-have

**Logic:**
- Her gün okuma yapılırsa streak +1
- Bir gün atlanırsa streak 0'a döner
- Longest streak kaydedilir

---

## 👥 6. Friends System

### 6.1 Friends List
**Açıklama:** Arkadaş listesi görüntüleme.

**UI Bileşenleri:**
- Friend cards (avatar, username, stats)
- Search button
- Friend requests badge
- Empty state

**API Endpoints:**
- `GET /api/friends`

**State Management:**
- Friends state

**Priority:** ⭐ Must-have

---

### 6.2 Friend Search
**Açıklama:** Kullanıcı adına göre arkadaş arama.

**UI Bileşenleri:**
- Search input
- Search results list
- Add friend button
- Loading state

**API Endpoints:**
- `GET /api/users/search?q={username}`

**State Management:**
- Search results state

**Priority:** ⭐ Must-have

---

### 6.3 Add/Remove Friend
**Açıklama:** Arkadaş ekleme ve çıkarma.

**UI Bileşenleri:**
- Add friend button
- Remove friend button (confirmation)

**API Endpoints:**
- `POST /api/friends` (add)
- `DELETE /api/friends/:id` (remove)

**State Management:**
- Friends list refresh

**Priority:** ⭐ Must-have

---

### 6.4 Friend Activity Feed
**Açıklama:** Arkadaşların son okuma aktivitelerini görme.

**UI Bileşenleri:**
- Activity cards
- User avatar
- Activity text ("X kitabını okudu")
- Time ago

**API Endpoints:**
- `GET /api/friends/activity`

**State Management:**
- Activity feed state

**Priority:** ⭐⭐ Nice-to-have

---

### 6.5 User Profile View (Other Users)
**Açıklama:** Başka kullanıcıların profilini görüntüleme.

**UI Bileşenleri:**
- Avatar
- Username
- Bio
- Public stats (if enabled)
- Add/Remove friend button

**API Endpoints:**
- `GET /api/users/:username`

**State Management:**
- User profile state

**Priority:** ⭐⭐ Nice-to-have

---

## 🏆 7. Badges / Achievements

### 7.1 Badges Screen
**Açıklama:** Kazanılan ve kazanılabilecek rozetleri görüntüleme.

**UI Bileşenleri:**
- Filter tabs (All, Unlocked, Locked)
- Category filter (Streak, Pages, Books, Special)
- Badge cards (icon, name, description)
- Progress indicators
- Rarity colors

**API Endpoints:**
- `GET /api/badges`

**State Management:**
- Badges state

**Priority:** ⭐ Must-have

**Categories:**
- 🔥 Streak
- 📄 Pages
- 📚 Books
- ⚡ Speed
- 📅 Consistency
- ⭐ Special

**Rarity Levels:**
- Common (gray)
- Rare (blue)
- Epic (purple)
- Legendary (gold)

---

### 7.2 Badge Detail
**Açıklama:** Rozet detaylarını ve kazanma koşullarını görme.

**UI Bileşenleri:**
- Large icon
- Name
- Description
- Unlock condition
- Progress bar (locked badges için)
- Unlock date (unlocked badges için)

**API Endpoints:**
- Badge data from badges list

**State Management:**
- Modal state

**Priority:** ⭐⭐ Nice-to-have

---

### 7.3 Badge Notifications
**Açıklama:** Yeni rozet kazanıldığında bildirim gösterme.

**UI Bileşenleri:**
- Toast notification
- Badge icon
- Unlock message
- "Görüntüle" button

**API Endpoints:**
- Real-time check after reading entry

**State Management:**
- Notification queue

**Priority:** ⭐⭐ Nice-to-have

---

## 📊 8. Statistics & Charts

### 8.1 Stats Screen Overview
**Açıklama:** Genel okuma istatistikleri.

**UI Bileşenleri:**
- Stat cards (total pages, books, streak, avg/day)
- Time period filter (week, month, year, all-time)
- Charts section

**API Endpoints:**
- `GET /api/stats`

**State Management:**
- Stats state

**Priority:** ⭐ Must-have

---

### 8.2 Reading Heatmap
**Açıklama:** Yıl boyunca hangi günler okunduğunu gösteren ısı haritası.

**UI Bileşenleri:**
- Calendar grid (GitHub-style)
- Color intensity (light to dark based on pages)
- Tooltip (date + pages)

**API Endpoints:**
- `GET /api/stats` (daily breakdown)

**State Management:**
- Heatmap data processing

**Priority:** ⭐ Must-have

---

### 8.3 Reading Chart
**Açıklama:** Zaman içinde okuma grafiği (line/bar chart).

**UI Bileşenleri:**
- Line chart (daily pages)
- Time period selector (7d, 30d, 90d, 1y)
- Y-axis: pages, X-axis: dates

**API Endpoints:**
- `GET /api/stats`

**State Management:**
- Chart data

**Priority:** ⭐ Must-have

---

### 8.4 Category Breakdown
**Açıklama:** En çok okunan kitap türleri (varsa).

**UI Bileşenleri:**
- Pie chart veya bar chart
- Genre list with percentages

**API Endpoints:**
- `GET /api/stats` (genre breakdown)

**State Management:**
- Categories data

**Priority:** ⭐⭐⭐ Future

---

## 🥇 9. Leaderboard

### 9.1 Leaderboard Screen
**Açıklama:** Kullanıcıları okunan sayfa sayısına göre sıralama.

**UI Bileşenleri:**
- Rank cards (#1, #2, #3 özel)
- User avatar + username
- Pages read
- Current user highlight
- Time period filter (week, month, all-time)
- Pull-to-refresh

**API Endpoints:**
- `GET /api/leaderboard`

**State Management:**
- Leaderboard state

**Priority:** ⭐ Must-have

**Display:**
- Top 3: Büyük kartlar (podium style)
- 4-100: Normal list
- Current user'ı always highlight

---

## ⚙️ 10. Settings

### 10.1 Settings Screen
**Açıklama:** Uygulama ayarları ve tercihler.

**UI Bileşenleri:**
- Dark mode toggle
- Notification toggle
- Notification time picker
- Daily goal slider (pages)
- Account section (logout)
- App info (version)

**API Endpoints:**
- Settings stored locally (AsyncStorage)

**State Management:**
- Settings state
- ThemeContext (dark mode)

**Priority:** ⭐ Must-have

---

### 10.2 Dark Mode
**Açıklama:** Karanlık tema desteği.

**UI Bileşenleri:**
- Toggle switch
- Tüm ekranlarda dark theme colors

**API Endpoints:**
- Yok (local storage)

**State Management:**
- ThemeContext

**Priority:** ⭐ Must-have

**Implementation:**
- Use NativeWind's dark: prefix
- Store preference in AsyncStorage

---

### 10.3 Notifications
**Açıklama:** Günlük okuma hatırlatıcıları.

**UI Bileşenleri:**
- Enable/disable toggle
- Time picker (default: 20:00)
- Permission request

**API Endpoints:**
- Yok (local notifications)

**State Management:**
- Notification settings

**Priority:** ⭐⭐ Nice-to-have

**Implementation:**
- expo-notifications
- Schedule local notifications
- Permission handling

---

### 10.4 Daily Goal
**Açıklama:** Günlük sayfa hedefi belirleme.

**UI Bileşenleri:**
- Slider (5-100 pages)
- Current value display
- Save button

**API Endpoints:**
- Local storage

**State Management:**
- Goal state

**Priority:** ⭐⭐ Nice-to-have

---

## 🎨 11. UI/UX Features

### 11.1 Loading States
- Skeleton screens
- Spinner indicators
- Pull-to-refresh
- Optimistic updates

### 11.2 Empty States
- No books yet
- No friends yet
- No readings yet
- Friendly illustrations + CTA buttons

### 11.3 Animations
- Tab transitions
- Card animations
- Streak fire animation
- Badge unlock animation
- Smooth scrolling

### 11.4 Error Handling
- Network errors
- API errors
- Form validation errors
- Retry mechanisms
- User-friendly messages

---

## 📱 12. App-specific Features

### 12.1 Splash Screen
- Reading Chain logo
- Loading animation

### 12.2 Onboarding (Optional)
- Welcome screens (3-4 slides)
- Feature highlights
- Skip option

### 12.3 Push Notifications
- Daily reading reminder
- Badge unlocked
- Friend added you
- You're on leaderboard top 10

### 12.4 Offline Support (Future)
- Cache recent data
- Queue API calls
- Sync when online

---

## 🎯 Feature Priority Matrix

### Must-Have (MVP) ⭐
- Authentication (login, signup, logout)
- Books CRUD
- Reading tracking
- Streak display
- Friends list
- Badges display
- Stats screen
- Leaderboard
- Settings (dark mode)

### Nice-to-Have ⭐⭐
- Profile edit
- Friend activity feed
- Badge notifications
- Notifications (daily reminder)
- Book detail screen
- Reading chart
- Daily goal

### Future ⭐⭐⭐
- Onboarding
- Category breakdown
- Offline support
- Social features (comments, likes)
- Reading challenges
- Book recommendations

---

**Son Güncelleme:** 2024-01-20
**Version:** 1.0

