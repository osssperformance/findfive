'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, Settings } from 'lucide-react'
import { Group, UnstyledButton, Text } from '@mantine/core'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      active: pathname === '/'
    },
    {
      href: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
      active: pathname === '/analytics'
    },
    {
      href: '/settings',
      icon: Settings,
      label: 'Settings',
      active: pathname === '/settings'
    },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 'env(safe-area-inset-bottom)',
        backgroundColor: 'rgba(242, 241, 237, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        zIndex: 100,
      }}
    >
      <Group justify="space-around" px="sm" py={6}>
        {navItems.map(({ href, icon: Icon, label, active }) => (
          <UnstyledButton
            key={href}
            component={Link}
            href={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '6px 20px',
              borderRadius: 12,
              backgroundColor: active ? 'rgba(37, 99, 235, 0.09)' : 'transparent',
              color: active ? 'var(--ff-accent)' : 'var(--ff-ink-tertiary)',
              transition: 'all 0.15s ease-out',
              textDecoration: 'none',
            }}
          >
            <Icon size={22} strokeWidth={active ? 2 : 1.75} />
            <Text
              size="xs"
              fw={active ? 600 : 400}
              style={{
                fontSize: 11,
                letterSpacing: active ? '0.01em' : 0,
                color: 'inherit',
              }}
            >
              {label}
            </Text>
          </UnstyledButton>
        ))}
      </Group>
    </div>
  )
}
