# 🛠️ Reading Chain Mobile - Tech Stack

Bu dokuman, mobil uygulama geliştirmede kullanılacak tüm teknolojileri ve kütüphaneleri detaylı olarak açıklar.

---

## 🎯 Core Technologies

### 1. React Native
**Version:** Latest (via Expo)
**Purpose:** Cross-platform mobile framework

**Avantajları:**
- Single codebase for iOS & Android
- JavaScript/TypeScript kullanımı
- Hot reload for fast development
- Large community & ecosystem
- Native performance

**Kaynaklar:**
- https://reactnative.dev/

---

### 2. Expo SDK 50+
**Version:** 50+ (Latest)
**Purpose:** React Native development platform

**Özellikler:**
- Over-the-air updates
- Easy access to native APIs
- Built-in components
- EAS Build & Submit
- Expo Go for quick testing

**Included Features:**
- Camera
- Location
- Notifications
- Secure Storage
- File System
- Auth Session

**Kaynaklar:**
- https://docs.expo.dev/

---

### 3. TypeScript
**Version:** ^5.0
**Purpose:** Type-safe JavaScript

**Avantajları:**
- Compile-time error checking
- Better IDE support
- Self-documenting code
- Refactoring güvenliği

**tsconfig.json:**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 🎨 Styling & UI

### 1. NativeWind
**Version:** ^4.0 (Tailwind CSS for React Native)
**Purpose:** Utility-first CSS framework

**Avantajları:**
- Familiar Tailwind syntax
- Dark mode support with `dark:` prefix
- Type-safe classNames
- Small bundle size
- Fast development

**Kullanım:**
```tsx
<View className="flex-1 bg-white dark:bg-gray-900">
  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
    Hello World
  </Text>
</View>
```

**Kaynaklar:**
- https://www.nativewind.dev/

---

### 2. Tailwind CSS
**Version:** ^3.3.2
**Purpose:** CSS framework (NativeWind dependency)

**Custom Config:**
```javascript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      secondary: '#f97316',
      success: '#10b981',
      danger: '#ef4444',
    }
  }
}
```

---

### 3. Lucide React Native
**Version:** Latest
**Purpose:** Beautiful & consistent icons

**Avantajları:**
- 1000+ icons
- Customizable (size, color, stroke)
- Lightweight
- Tree-shakeable

**Kullanım:**
```tsx
import { Home, BookOpen, Users } from 'lucide-react-native';

<Home size={24} color="#3b82f6" />
```

**Kaynaklar:**
- https://lucide.dev/

---

## 🧭 Navigation

### 1. Expo Router
**Version:** Latest
**Purpose:** File-based routing for React Native

**Avantajları:**
- Next.js-style routing
- Type-safe navigation
- Deep linking support
- Shared routes
- Layout routes

**Proje Yapısı:**
```
app/
├── _layout.tsx          # Root layout
├── (auth)/
│   ├── _layout.tsx     # Auth layout
│   ├── login.tsx
│   └── signup.tsx
├── (tabs)/
│   ├── _layout.tsx     # Tabs layout
│   ├── index.tsx       # Home
│   ├── books.tsx
│   ├── friends.tsx
│   └── stats.tsx
├── profile.tsx
├── badges.tsx
└── settings.tsx
```

**Navigation:**
```tsx
import { router } from 'expo-router';

// Navigate
router.push('/profile');
router.replace('/login');
router.back();

// With params
router.push({
  pathname: '/book/[id]',
  params: { id: '123' }
});
```

**Kaynaklar:**
- https://expo.github.io/router/docs/

---

### 2. React Navigation (Expo Router dependency)
**Version:** ^6.0
**Purpose:** Core navigation library

**Navigation Types:**
- Stack Navigation (default in Expo Router)
- Tab Navigation (Bottom tabs)
- Drawer Navigation (Side menu)

---

## 🌐 API & Networking

### 1. Axios
**Version:** Latest
**Purpose:** HTTP client for API calls

**Avantajları:**
- Promise-based
- Request/response interceptors
- Automatic JSON transformation
- Error handling
- Timeout support

**Setup:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Kaynaklar:**
- https://axios-http.com/

---

## 💾 Storage

### 1. Expo SecureStore
**Version:** Latest (Expo SDK)
**Purpose:** Encrypted key-value storage

**Use Cases:**
- Authentication tokens
- Sensitive user data
- API keys

**Kullanım:**
```typescript
import * as SecureStore from 'expo-secure-store';

// Save
await SecureStore.setItemAsync('token', 'jwt_token_here');

// Get
const token = await SecureStore.getItemAsync('token');

// Delete
await SecureStore.deleteItemAsync('token');
```

**Kaynaklar:**
- https://docs.expo.dev/versions/latest/sdk/securestore/

---

### 2. AsyncStorage (via @react-native-async-storage)
**Version:** Latest
**Purpose:** Non-encrypted key-value storage

**Use Cases:**
- Theme preference
- Settings
- Cache data
- Non-sensitive data

**Kullanım:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
await AsyncStorage.setItem('theme', 'dark');

// Get
const theme = await AsyncStorage.getItem('theme');

// Save object
await AsyncStorage.setItem('settings', JSON.stringify(settings));

// Get object
const settings = JSON.parse(await AsyncStorage.getItem('settings') || '{}');
```

---

## 📊 Charts & Data Visualization

### 1. React Native Chart Kit
**Version:** ^6.12.0
**Purpose:** Ready-to-use charts

**Chart Types:**
- Line Chart (reading progress over time)
- Bar Chart (daily/weekly stats)
- Pie Chart (genre breakdown - future)
- Progress Chart

**Kullanım:**
```tsx
import { LineChart } from 'react-native-chart-kit';

<LineChart
  data={{
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [20, 45, 28, 80, 99, 43, 50] }]
  }}
  width={350}
  height={220}
  chartConfig={{
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#3b82f6',
    backgroundGradientTo: '#2563eb',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  }}
/>
```

**Kaynaklar:**
- https://github.com/indiespirit/react-native-chart-kit

---

### 2. React Native SVG
**Version:** Latest
**Purpose:** SVG support (charts dependency)

**Use Cases:**
- Custom icons
- Charts rendering
- Vector graphics

---

### 3. React Native Calendars (for Heatmap)
**Version:** ^1.1302.0
**Purpose:** Calendar components

**Use Cases:**
- Reading heatmap (GitHub-style)
- Date picker
- Calendar view

**Kullanım:**
```tsx
import { Calendar } from 'react-native-calendars';

<Calendar
  markedDates={{
    '2024-01-15': { marked: true, dotColor: '#3b82f6' },
    '2024-01-16': { marked: true, dotColor: '#10b981' },
  }}
/>
```

---

## 🔔 Notifications

### Expo Notifications
**Version:** Latest (Expo SDK)
**Purpose:** Local & push notifications

**Features:**
- Schedule local notifications
- Handle notification responses
- Push notification support
- Badge count
- Sound & vibration

**Kullanım:**
```typescript
import * as Notifications from 'expo-notifications';

// Request permission
const { status } = await Notifications.requestPermissionsAsync();

// Schedule local notification
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Reading Reminder',
    body: 'Time to read! 📚',
  },
  trigger: {
    hour: 20,
    minute: 0,
    repeats: true,
  },
});
```

**Kaynaklar:**
- https://docs.expo.dev/versions/latest/sdk/notifications/

---

## 🎬 Animations

### 1. React Native Reanimated
**Version:** Latest
**Purpose:** High-performance animations

**Avantajları:**
- 60 FPS animations
- Runs on native thread
- Gesture support
- Spring animations

**Use Cases:**
- Tab transitions
- Card animations
- Streak fire animation
- Badge unlock animation

**Kullanım:**
```tsx
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(isPressed ? 0.95 : 1) }],
}));

<Animated.View style={animatedStyle}>
  {/* content */}
</Animated.View>
```

**Kaynaklar:**
- https://docs.swmansion.com/react-native-reanimated/

---

### 2. React Native Gesture Handler
**Version:** Latest
**Purpose:** Native gesture handling (Reanimated dependency)

---

## 🗓️ Date & Time

### date-fns
**Version:** ^3.0
**Purpose:** Date manipulation & formatting

**Avantajları:**
- Lightweight (compared to Moment.js)
- Tree-shakeable
- Immutable
- TypeScript support

**Kullanım:**
```typescript
import { format, formatDistance, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';

// Format
format(new Date(), 'dd MMMM yyyy', { locale: tr }); // "15 Ocak 2024"

// Relative time
formatDistance(subDays(new Date(), 3), new Date(), { 
  addSuffix: true,
  locale: tr 
}); // "3 gün önce"
```

**Kaynaklar:**
- https://date-fns.org/

---

## 🔐 State Management

### React Context API
**Purpose:** Global state management

**Contexts:**
1. **AuthContext**: User authentication & profile
2. **ThemeContext**: Dark/light mode

**Avantajları:**
- Built-in (no extra dependency)
- Simple for small-medium apps
- Type-safe with TypeScript

**Alternative (Future):**
- Zustand (lightweight state management)
- React Query (server state management)

---

## 🧪 Development Tools

### 1. Expo DevTools
**Purpose:** Debugging & development

**Features:**
- Network inspector
- React DevTools
- Element inspector
- Performance monitor

---

### 2. Flipper (Optional)
**Purpose:** Advanced debugging

**Features:**
- Network inspector
- Database inspector
- React DevTools
- Layout inspector

---

## 🏗️ Build & Deployment

### 1. EAS (Expo Application Services)
**Purpose:** Build & submit apps

**Services:**
- **EAS Build:** Cloud-based builds
- **EAS Submit:** Submit to stores
- **EAS Update:** Over-the-air updates

**Commands:**
```bash
# Build
eas build --platform ios
eas build --platform android

# Submit
eas submit --platform ios
eas submit --platform android

# Update
eas update --branch production
```

---

## 📦 Package Manager

### npm
**Version:** 9+
**Purpose:** Package management

**Alternatives:**
- yarn
- pnpm

---

## 🔧 Configuration Files

### package.json
```json
{
  "name": "reading-chain-mobile",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "expo-router": "~3.0.0",
    "react-native": "0.73.0",
    "typescript": "^5.0.0",
    "nativewind": "^4.0.0",
    "axios": "^1.6.0",
    "date-fns": "^3.0.0",
    "lucide-react-native": "^0.300.0",
    "react-native-chart-kit": "^6.12.0"
  }
}
```

---

## 📊 Bundle Size Optimization

### Strategies
1. **Tree-shaking:** Import only what you need
2. **Image optimization:** Use WebP, compress images
3. **Code splitting:** Lazy load screens
4. **Remove unused dependencies**
5. **Use Hermes engine** (default in Expo)

---

## 🎯 Performance

### Hermes Engine
- Faster app startup
- Reduced memory usage
- Smaller app size
- Enabled by default in Expo

### Optimization Tips
- Use FlatList for long lists
- Memoize components with React.memo
- Use useCallback & useMemo
- Avoid inline functions in renders
- Optimize images

---

## 📱 Platform-Specific

### iOS
- Swift (native modules)
- CocoaPods (dependency management)
- Xcode (IDE)

### Android
- Kotlin/Java (native modules)
- Gradle (build system)
- Android Studio (IDE)

---

## 🔮 Future Considerations

### Potential Additions
1. **React Query:** Server state & caching
2. **Zustand:** Lightweight state management
3. **i18n:** Multi-language support
4. **Sentry:** Error tracking
5. **Analytics:** Firebase Analytics / Mixpanel
6. **Deep linking:** Universal links
7. **Biometric auth:** FaceID / TouchID
8. **Offline mode:** SQLite / WatermelonDB

---

## 📚 Learning Resources

### Official Docs
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [NativeWind Docs](https://www.nativewind.dev/)

### Tutorials
- [Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)
- [React Native School](https://www.reactnativeschool.com/)
- [William Candillon's YouTube](https://www.youtube.com/channel/UC806fwFWpiLQV5y-qifzHnA)

### Communities
- [Expo Discord](https://discord.gg/expo)
- [Reactiflux Discord](https://www.reactiflux.com/)
- [r/reactnative](https://www.reddit.com/r/reactnative/)

---

## ✅ Tech Stack Summary

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React Native | Cross-platform mobile |
| **Platform** | Expo SDK 50+ | Development platform |
| **Language** | TypeScript | Type safety |
| **Styling** | NativeWind | Tailwind for RN |
| **Navigation** | Expo Router | File-based routing |
| **API** | Axios | HTTP client |
| **Storage** | SecureStore, AsyncStorage | Data persistence |
| **Charts** | React Native Chart Kit | Data visualization |
| **Notifications** | Expo Notifications | Push & local notifications |
| **Animations** | Reanimated | High-performance animations |
| **Icons** | Lucide React Native | Icon library |
| **Dates** | date-fns | Date manipulation |
| **State** | React Context | Global state |
| **Build** | EAS | Cloud builds |

---

**Son Güncelleme:** 2024-01-20
**Version:** 1.0

