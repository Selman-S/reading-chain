# 🎨 Reading Chain Mobile - UI Components Guide

Bu dokuman, mobil uygulamada kullanılacak tüm UI component'lerini detaylı olarak açıklar.

---

## 🧩 Component Kategorileri

1. **Basic Components** - Button, Input, Card
2. **Avatar & User** - Avatar, UserCard
3. **Reading Components** - StreakDisplay, ReadingChart, QuickEntry
4. **Book Components** - BookCard, BookList
5. **Badge Components** - BadgeCard, BadgeGrid
6. **Stats Components** - StatCard, Heatmap
7. **Navigation Components** - Bottom Tabs, Header
8. **Feedback Components** - Loading, Empty States, Errors

---

## 1️⃣ Basic Components

### Button Component
**Location:** `components/Button.tsx`

**Props:**
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}
```

**Kullanım:**
```tsx
import Button from '@/components/Button';

<Button 
  title="Kaydet"
  onPress={handleSave}
  variant="primary"
  size="md"
/>

<Button 
  title="Sil"
  onPress={handleDelete}
  variant="danger"
  icon={<Trash2 size={20} />}
/>
```

**Variants:**
- `primary`: Blue background, white text
- `secondary`: Gray background
- `danger`: Red background
- `ghost`: Transparent, border only

**Dark Mode:**
```tsx
className={`
  ${variant === 'primary' && 'bg-blue-600 dark:bg-blue-500'}
  ${variant === 'danger' && 'bg-red-600 dark:bg-red-500'}
`}
```

---

### Input Component
**Location:** `components/Input.tsx`

**Props:**
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  multiline?: boolean;
  maxLength?: number;
  error?: string;
  icon?: React.ReactNode;
}
```

**Kullanım:**
```tsx
import Input from '@/components/Input';

<Input
  label="Email"
  placeholder="email@example.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={emailError}
/>

<Input
  label="Şifre"
  placeholder="••••••••"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
/>
```

**Dark Mode:**
```tsx
className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
```

---

### Card Component
**Location:** `components/Card.tsx`

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}
```

**Kullanım:**
```tsx
import Card from '@/components/Card';

<Card variant="elevated" padding="md">
  <Text>Card content</Text>
</Card>

<Card onPress={() => router.push('/book/123')}>
  <Text>Clickable card</Text>
</Card>
```

**Dark Mode:**
```tsx
className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
```

---

## 2️⃣ Avatar & User Components

### Avatar Component
**Location:** `components/Avatar.tsx`

**Props:**
```typescript
interface AvatarProps {
  avatar: string; // Emoji
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
}
```

**Kullanım:**
```tsx
import Avatar from '@/components/Avatar';

<Avatar avatar="🐶" size="lg" />
<Avatar avatar="🐱" size="sm" onPress={handlePress} />
```

**Sizes:**
- `xs`: 32px (w-8 h-8, text-xl)
- `sm`: 40px (w-10 h-10, text-2xl)
- `md`: 48px (w-12 h-12, text-3xl)
- `lg`: 64px (w-16 h-16, text-4xl)
- `xl`: 80px (w-20 h-20, text-5xl)

**Implementation:**
```tsx
export default function Avatar({ avatar, size = 'md', onPress }: AvatarProps) {
  const sizes = {
    xs: 'w-8 h-8 text-xl',
    sm: 'w-10 h-10 text-2xl',
    md: 'w-12 h-12 text-3xl',
    lg: 'w-16 h-16 text-4xl',
    xl: 'w-20 h-20 text-5xl',
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-800 items-center justify-center`}
    >
      <Text className={sizes[size]}>{avatar}</Text>
    </Component>
  );
}
```

---

### AvatarSelector Component
**Location:** `components/AvatarSelector.tsx`

**Props:**
```typescript
interface AvatarSelectorProps {
  currentAvatar: string;
  onSelect: (avatar: string) => void;
}
```

**Kullanım:**
```tsx
import AvatarSelector from '@/components/AvatarSelector';

<AvatarSelector
  currentAvatar={avatar}
  onSelect={setAvatar}
/>
```

**Animals:**
```typescript
const AVATARS = [
  '🐶', '🐱', '🐼', '🦊', '🐨', '🐰', '🐹', '🦁',
  '🐯', '🐻', '🐸', '🦉', '🐧', '🐥', '🦄', '🐺'
];
```

---

## 3️⃣ Reading Components

### StreakDisplay Component
**Location:** `components/StreakDisplay.tsx`

**Props:**
```typescript
interface StreakDisplayProps {
  current: number;
  longest: number;
  size?: 'sm' | 'md' | 'lg';
}
```

**Kullanım:**
```tsx
import StreakDisplay from '@/components/StreakDisplay';

<StreakDisplay
  current={15}
  longest={42}
  size="lg"
/>
```

**Implementation:**
```tsx
export default function StreakDisplay({ current, longest, size = 'md' }: StreakDisplayProps) {
  return (
    <View className="items-center">
      {/* Animated fire icon */}
      <Animated.View>
        <Text className="text-6xl">🔥</Text>
      </Animated.View>
      
      <Text className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
        {current}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400">
        Günlük Seri
      </Text>
      
      <Text className="text-sm text-gray-500 dark:text-gray-500 mt-4">
        En Uzun: {longest} gün
      </Text>
    </View>
  );
}
```

---

### QuickReadingEntry Component
**Location:** `components/QuickReadingEntry.tsx`

**Props:**
```typescript
interface QuickReadingEntryProps {
  onSuccess: () => void;
}
```

**Kullanım:**
```tsx
import QuickReadingEntry from '@/components/QuickReadingEntry';

<QuickReadingEntry onSuccess={refreshStats} />
```

**Fields:**
- Book picker (dropdown)
- Pages read (numeric input)
- Date picker (default: today)
- Submit button

---

### ReadingChart Component
**Location:** `components/ReadingChart.tsx`

**Props:**
```typescript
interface ReadingChartProps {
  data: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  period?: 'week' | 'month' | 'year';
}
```

**Kullanım:**
```tsx
import ReadingChart from '@/components/ReadingChart';

<ReadingChart
  data={{
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [20, 45, 28, 80, 99, 43, 50] }]
  }}
  period="week"
/>
```

**Implementation:**
```tsx
import { LineChart } from 'react-native-chart-kit';

export default function ReadingChart({ data, period }: ReadingChartProps) {
  return (
    <LineChart
      data={data}
      width={350}
      height={220}
      chartConfig={{
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#3b82f6',
        backgroundGradientTo: '#2563eb',
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      }}
      style={{
        borderRadius: 16,
      }}
    />
  );
}
```

---

## 4️⃣ Book Components

### BookCard Component
**Location:** `components/BookCard.tsx`

**Props:**
```typescript
interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    totalPages: number;
    currentPage: number;
    status: 'reading' | 'completed' | 'planned';
  };
  onPress: () => void;
}
```

**Kullanım:**
```tsx
import BookCard from '@/components/BookCard';

<BookCard
  book={book}
  onPress={() => router.push(`/book/${book._id}`)}
/>
```

**Design:**
```tsx
export default function BookCard({ book, onPress }: BookCardProps) {
  const progress = (book.currentPage / book.totalPages) * 100;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md mb-3"
    >
      <View className="flex-row items-start">
        {/* Book icon */}
        <View className="w-12 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg items-center justify-center mr-3">
          <BookOpen size={24} color="#3b82f6" />
        </View>
        
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {book.title}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            {book.author}
          </Text>
          
          {/* Progress */}
          <View className="mt-2">
            <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <View 
                className="h-full bg-blue-600"
                style={{ width: `${progress}%` }}
              />
            </View>
            <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {book.currentPage} / {book.totalPages} sayfa
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
```

---

## 5️⃣ Badge Components

### BadgeCard Component
**Location:** `components/BadgeCard.tsx`

**Props:**
```typescript
interface BadgeCardProps {
  badge: {
    badgeId: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    isUnlocked: boolean;
    progress?: number;
    requirement?: number;
  };
  onPress?: () => void;
}
```

**Kullanım:**
```tsx
import BadgeCard from '@/components/BadgeCard';

<BadgeCard
  badge={badge}
  onPress={() => showBadgeDetail(badge)}
/>
```

**Design:**
```tsx
export default function BadgeCard({ badge, onPress }: BadgeCardProps) {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-2xl p-4 ${badge.isUnlocked ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-900'}`}
    >
      <View className={`w-16 h-16 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} items-center justify-center mx-auto mb-2`}>
        <Text className={`text-3xl ${!badge.isUnlocked && 'opacity-30'}`}>
          {badge.icon}
        </Text>
      </View>
      
      <Text className={`text-center font-bold ${badge.isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
        {badge.name}
      </Text>
      
      <Text className="text-xs text-center text-gray-500 dark:text-gray-500 mt-1">
        {badge.description}
      </Text>
      
      {/* Progress bar for locked badges */}
      {!badge.isUnlocked && badge.progress !== undefined && (
        <View className="mt-2">
          <View className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <View 
              className="h-full bg-blue-600"
              style={{ width: `${(badge.progress / badge.requirement!) * 100}%` }}
            />
          </View>
          <Text className="text-xs text-center text-gray-500 mt-1">
            {badge.progress} / {badge.requirement}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
```

---

## 6️⃣ Stats Components

### StatCard Component
**Location:** `components/StatCard.tsx`

**Props:**
```typescript
interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}
```

**Kullanım:**
```tsx
import StatCard from '@/components/StatCard';
import { BookOpen } from 'lucide-react-native';

<StatCard
  icon={<BookOpen size={20} color="#3b82f6" />}
  value={2500}
  label="Toplam Sayfa"
  color="blue"
/>
```

**Design:**
```tsx
export default function StatCard({ icon, value, label, color }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900',
    green: 'bg-green-100 dark:bg-green-900',
    orange: 'bg-orange-100 dark:bg-orange-900',
    purple: 'bg-purple-100 dark:bg-purple-900',
  };
  
  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
      <View className={`w-10 h-10 rounded-full ${colors[color]} items-center justify-center mb-2`}>
        {icon}
      </View>
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </Text>
      <Text className="text-xs text-gray-600 dark:text-gray-400">
        {label}
      </Text>
    </View>
  );
}
```

---

### Heatmap Component
**Location:** `components/Heatmap.tsx`

**Props:**
```typescript
interface HeatmapProps {
  data: {
    date: string; // YYYY-MM-DD
    pages: number;
  }[];
}
```

**Kullanım:**
```tsx
import Heatmap from '@/components/Heatmap';

<Heatmap
  data={[
    { date: '2024-01-15', pages: 25 },
    { date: '2024-01-16', pages: 50 },
  ]}
/>
```

**Implementation:**
```tsx
import { Calendar } from 'react-native-calendars';

export default function Heatmap({ data }: HeatmapProps) {
  // Convert data to marked dates format
  const markedDates = data.reduce((acc, item) => {
    const intensity = Math.min(item.pages / 50, 1); // 0-1
    acc[item.date] = {
      marked: true,
      dotColor: `rgba(59, 130, 246, ${intensity})`,
    };
    return acc;
  }, {} as any);
  
  return (
    <Calendar
      markedDates={markedDates}
      theme={{
        calendarBackground: 'transparent',
        textDayFontSize: 12,
        // dark mode support
      }}
    />
  );
}
```

---

## 7️⃣ Navigation Components

### Bottom Tabs
**Location:** `app/(tabs)/_layout.tsx`

**Implementation:**
```tsx
import { Tabs } from 'expo-router';
import { Home, BookOpen, Users, BarChart3 } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'Kitaplar',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Arkadaşlar',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'İstatistikler',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

---

## 8️⃣ Feedback Components

### Loading Component
**Location:** `components/Loading.tsx`

**Props:**
```typescript
interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
}
```

**Kullanım:**
```tsx
import Loading from '@/components/Loading';

<Loading size="large" text="Yükleniyor..." />
```

**Implementation:**
```tsx
import { ActivityIndicator } from 'react-native';

export default function Loading({ size = 'large', text }: LoadingProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color="#3b82f6" />
      {text && (
        <Text className="text-gray-600 dark:text-gray-400 mt-4">
          {text}
        </Text>
      )}
    </View>
  );
}
```

---

### EmptyState Component
**Location:** `components/EmptyState.tsx`

**Props:**
```typescript
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

**Kullanım:**
```tsx
import EmptyState from '@/components/EmptyState';
import { BookOpen } from 'lucide-react-native';

<EmptyState
  icon={<BookOpen size={48} color="#9ca3af" />}
  title="Henüz kitap yok"
  description="İlk kitabınızı ekleyerek başlayın"
  actionLabel="Kitap Ekle"
  onAction={() => router.push('/add-book')}
/>
```

---

### ErrorMessage Component
**Location:** `components/ErrorMessage.tsx`

**Props:**
```typescript
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}
```

**Kullanım:**
```tsx
import ErrorMessage from '@/components/ErrorMessage';

<ErrorMessage
  message="Veriler yüklenemedi"
  onRetry={refetch}
/>
```

---

## 🎯 Component Checklist

**Basic:**
- [ ] Button (variants, sizes, loading)
- [ ] Input (text, password, numeric)
- [ ] Card (clickable, variants)

**Avatar:**
- [ ] Avatar (sizes, pressable)
- [ ] AvatarSelector (grid, selection)

**Reading:**
- [ ] StreakDisplay (animated fire)
- [ ] QuickReadingEntry (form)
- [ ] ReadingChart (line chart)

**Books:**
- [ ] BookCard (progress bar)
- [ ] BookList (FlatList)

**Badges:**
- [ ] BadgeCard (rarity colors)
- [ ] BadgeGrid (category filter)

**Stats:**
- [ ] StatCard (icon, value, label)
- [ ] Heatmap (calendar view)

**Navigation:**
- [ ] Bottom Tabs (4 tabs)
- [ ] Header (back button, title)

**Feedback:**
- [ ] Loading (spinner, text)
- [ ] EmptyState (icon, CTA)
- [ ] ErrorMessage (retry)

---

**Son Güncelleme:** 2024-01-20
**Version:** 1.0

