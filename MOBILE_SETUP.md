# 🚀 Reading Chain Mobile - Setup Guide

Bu dokuman, React Native + Expo + NativeWind ile mobil uygulama kurulumunu adım adım açıklar.

---

## 📋 Prerequisites

### Gerekli Yazılımlar

#### 1. Node.js & npm
```bash
# Check versions
node --version  # v18+ önerilir
npm --version   # v9+ önerilir
```

**İndirme:** https://nodejs.org/

---

#### 2. Git
```bash
git --version
```

**İndirme:** https://git-scm.com/

---

#### 3. Expo CLI
```bash
npm install -g expo-cli
# veya
npm install -g @expo/cli
```

---

#### 4. Expo Go App (Test için)
**iOS:** App Store'dan "Expo Go" indir
**Android:** Google Play'den "Expo Go" indir

---

#### 5. Android Studio (Android geliştirme için)
**İndirme:** https://developer.android.com/studio

**Kurulum sonrası:**
- Android SDK yükle
- Android Emulator kur
- Environment variables ayarla (ANDROID_HOME)

---

#### 6. Xcode (iOS geliştirme için - sadece macOS)
**İndirme:** Mac App Store'dan "Xcode"

**Kurulum sonrası:**
- Command Line Tools yükle
- iOS Simulator kur
- CocoaPods yükle: `sudo gem install cocoapods`

---

## 🎯 Proje Oluşturma

### Step 1: Yeni Expo Projesi
```bash
# reading-chain klasörü ile aynı seviyede
npx create-expo-app reading-chain-mobile --template blank-typescript

cd reading-chain-mobile
```

---

### Step 2: Dependencies Kurulumu

#### 2.1 Temel Kütüphaneler
```bash
# Expo dependencies
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# Navigation
npx expo install @react-navigation/native

# Storage & Auth
npx expo install expo-secure-store

# API
npm install axios

# Date handling
npm install date-fns

# Icons
npm install lucide-react-native

# Charts
npm install react-native-chart-kit react-native-svg

# Notifications
npx expo install expo-notifications

# Animations
npx expo install react-native-reanimated
```

---

#### 2.2 NativeWind (Tailwind CSS for React Native)
```bash
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
```

**tailwind.config.js** oluştur:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#f97316',
        success: '#10b981',
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
}
```

**babel.config.js** güncelle:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }]
    ],
    plugins: [
      "nativewind/babel",
      "react-native-reanimated/plugin",
    ],
  };
};
```

**metro.config.js** oluştur:
```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

**global.css** oluştur (root'ta):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📁 Proje Yapısı

```
reading-chain-mobile/
├── app/                      # Expo Router screens
│   ├── (auth)/              # Auth group
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx        # Home
│   │   ├── books.tsx
│   │   ├── friends.tsx
│   │   └── stats.tsx
│   ├── _layout.tsx          # Root layout
│   ├── profile.tsx
│   ├── badges.tsx
│   └── settings.tsx
├── components/              # Reusable components
│   ├── Avatar.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── StreakDisplay.tsx
│   ├── ReadingChart.tsx
│   └── BadgeCard.tsx
├── contexts/               # State management
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── services/              # API services
│   └── api.ts            # Axios instance
├── hooks/                # Custom hooks
│   ├── useAuth.ts
│   └── useTheme.ts
├── types/                # TypeScript types
│   └── index.ts
├── constants/           # Constants
│   └── Colors.ts
├── utils/              # Utility functions
│   └── helpers.ts
├── assets/            # Images, fonts
├── global.css        # Tailwind CSS
├── app.json         # Expo config
├── tsconfig.json   # TypeScript config
├── tailwind.config.js
├── babel.config.js
└── package.json
```

---

## ⚙️ Configuration

### app.json
```json
{
  "expo": {
    "name": "Reading Chain",
    "slug": "reading-chain-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3b82f6"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.readingchain.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3b82f6"
      },
      "package": "com.readingchain.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#3b82f6"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

---

### .env (Environment Variables)
```bash
# Create .env file in root
API_BASE_URL=http://localhost:3000

# Production
# API_BASE_URL=https://your-domain.vercel.app
```

**.gitignore'a ekle:**
```
.env
.env.local
```

**Load env variables:**
```bash
npm install react-native-dotenv
```

**babel.config.js'e ekle:**
```javascript
plugins: [
  ["module:react-native-dotenv", {
    "moduleName": "@env",
    "path": ".env",
  }]
]
```

**types/env.d.ts oluştur:**
```typescript
declare module '@env' {
  export const API_BASE_URL: string;
}
```

---

## 🎨 Theme Setup

### contexts/ThemeContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('auto');
  
  const isDark = theme === 'auto' 
    ? systemTheme === 'dark' 
    : theme === 'dark';

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem('theme');
    if (saved) setThemeState(saved as Theme);
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

---

## 🔐 Auth Setup

### contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '@/services/api';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const savedToken = await SecureStore.getItemAsync('token');
      if (savedToken) {
        setToken(savedToken);
        // Fetch user profile
        const response = await api.get('/api/profile');
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Load token error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await api.post('/api/auth/login', { username, password });
    const { token, user } = response.data;
    
    await SecureStore.setItemAsync('token', token);
    setToken(token);
    setUser(user);
  };

  const signup = async (data: any) => {
    await api.post('/api/auth/signup', data);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

### services/api.ts
```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';

const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout
      await SecureStore.deleteItemAsync('token');
      // Navigate to login (using navigation ref)
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🏃 Running the App

### Development
```bash
# Start Expo dev server
npx expo start

# Run on iOS simulator (macOS only)
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run on web
npx expo start --web
```

### Scan QR Code
- iOS: Camera app ile QR code'u tara → Expo Go açılır
- Android: Expo Go app'te "Scan QR Code" → QR code'u tara

---

## 📱 Testing

### Expo Go (Quick Testing)
1. Phone'da Expo Go app'i aç
2. QR code'u tara
3. App yüklenir ve çalışır

### Development Build (Native Modules için)
```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

---

## 🚀 Building & Deployment

### EAS Build Setup
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure
```

### eas.json
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### Build Commands
```bash
# Development build
eas build --profile development --platform all

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## 🐛 Troubleshooting

### Cache Issues
```bash
# Clear cache
npx expo start -c

# Reset Metro bundler
rm -rf node_modules
npm install
npx expo start -c
```

### Android Emulator Not Starting
```bash
# Check Android SDK
echo $ANDROID_HOME

# List available emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_5_API_33
```

### iOS Simulator Not Starting
```bash
# List simulators
xcrun simctl list devices

# Open simulator
open -a Simulator
```

### Module Not Found Errors
```bash
# Clear watchman
watchman watch-del-all

# Clear Metro cache
rm -rf $TMPDIR/metro-*

# Reinstall
rm -rf node_modules
npm install
```

---

## 📚 Resources

### Documentation
- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://expo.github.io/router/docs/)
- [NativeWind](https://www.nativewind.dev/)
- [React Native](https://reactnative.dev/)

### Tutorials
- [Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### Community
- [Expo Discord](https://discord.gg/expo)
- [React Native Community](https://reactnative.dev/community/overview)

---

## ✅ Checklist

**Development Setup:**
- [ ] Node.js kurulu
- [ ] Expo CLI kurulu
- [ ] Expo Go app indirildi
- [ ] Android Studio / Xcode kurulu (optional)
- [ ] Proje oluşturuldu
- [ ] Dependencies yüklendi
- [ ] NativeWind yapılandırıldı
- [ ] Environment variables ayarlandı
- [ ] Auth context oluşturuldu
- [ ] API service kuruldu
- [ ] App çalışıyor (npx expo start)

**Backend Setup:**
- [ ] Backend API çalışıyor (http://localhost:3000)
- [ ] MongoDB bağlantısı aktif
- [ ] API endpoints test edildi
- [ ] CORS ayarları yapıldı (mobile için)

**Ready to Code:**
- [ ] Proje yapısı hazır
- [ ] Component'ler oluşturulabilir
- [ ] API calls çalışıyor
- [ ] Navigation kurulu
- [ ] Dark mode hazır

---

**Son Güncelleme:** 2024-01-20
**Version:** 1.0

