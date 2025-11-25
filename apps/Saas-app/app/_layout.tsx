console.log("LOADED LAYOUT v999");
import React, { useEffect, useMemo } from 'react';
import { Link, Slot, usePathname, useSegments } from 'expo-router';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useSidebar } from './hooks/useSidebar';
import { useScrollDirection } from './hooks/useScrollDirection';
import { colors } from './styles/colors';
import { theme } from './styles/theme';
import Button from './components/ui/Button';
import Text from './components/ui/Text';
import Divider from './components/ui/Divider';
import Spacer from './components/ui/Spacer';

const sidebarItems = [
  { label: 'דף הבית', href: '/(home)/home' },
  { label: 'לקוחות', href: '/(clients)' },
  { label: 'תוכניות אימון', href: '/(plans)' },
  { label: 'אנליטיקה', href: '/(analytics)' },
  { label: "צ'אט מאמן", href: '/(chat)' },
  { label: 'הגדרות', href: '/' },
];

export default function RootLayout() {
  const { collapsed, setCollapsed, toggleSidebar } = useSidebar();
  const { direction, onScroll } = useScrollDirection();
  const segments = useSegments();
  const showTopbar = segments.length > 0;

  useEffect(() => {
    if (direction === 'down') {
      setCollapsed(true);
    }
    if (direction === 'up') {
      setCollapsed(false);
    }
  }, [direction, setCollapsed]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="dark" />

        <SafeAreaView style={styles.root}>
          <View style={styles.container}>
            <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

            <View style={styles.main}>
              {showTopbar && <Topbar onToggle={toggleSidebar} />}
              <ScrollView
                scrollEventThrottle={16}
                onScroll={onScroll}
                contentContainerStyle={styles.scrollContent}
                style={styles.scrollView}
              >
                <MainLayout>
                  <Slot />
                </MainLayout>
              </ScrollView>
            </View>

          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return <View style={styles.layout}>{children}</View>;
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const width = collapsed ? 72 : 260;

  return (
    <View style={[styles.sidebar, { width }]}>
      <View style={styles.sidebarHeader}>
        <Text variant="title" weight="bold">לוח המאמן</Text>
        <Spacer size={theme.spacing.xs} />
        <Text variant="caption" color={colors.neutral600}>ניהול הביצועים היומי</Text>
      </View>

      <Divider />

      <View style={styles.navItems}>
        {sidebarItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={{ pathname: item.href as any }}
              asChild
            >
              <Pressable
                style={[
                  styles.navItem,
                  active ? styles.navItemActive : null
                ]}
              >
                <Text weight={active ? 'bold' : 'medium'} color={colors.neutral800}>
                  {collapsed ? item.label.slice(0, 2) : item.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>

      <Divider />

      <View style={styles.sidebarFooter}>
        <Button variant="ghost" onPress={onToggle} label={collapsed ? 'הרחב' : 'צמצם'} />
      </View>
    </View>
  );
}

function Topbar({ onToggle }: { onToggle: () => void }) {
  const pathname = usePathname();

  const title = useMemo(() => {
    if (!pathname) return 'דף הבית';
    if (pathname.startsWith('/(home)')) return 'דף הבית';
    if (pathname.startsWith('/(clients)')) return 'לקוחות';
    if (pathname.startsWith('/(plans)')) return 'תוכניות אימון';
    if (pathname.startsWith('/(analytics)')) return 'אנליטיקה';
    if (pathname.startsWith('/(chat)')) return 'אט מאמן';
    return 'מסך הבית';
  }, [pathname]);

  return (
    <View style={styles.topbar}>
      <Text variant="title" weight="bold">{title}</Text>
      <Button label="תפריט" onPress={onToggle} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.neutral50,
  },
  container: {
    flex: 1,
    flexDirection: 'row-reverse',
    backgroundColor: colors.neutral50,
  },
  sidebar: {
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'space-between',
  },
  sidebarHeader: {
    gap: theme.spacing.xs,
  },
  navItems: {
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  navItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  navItemActive: {
    backgroundColor: colors.neutral100,
  },
  sidebarFooter: {
    alignItems: 'flex-start',
  },
  main: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  layout: {
    gap: theme.spacing.lg,
  },
  topbar: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    backgroundColor: colors.neutral50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
