'use client'

import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { UserProvider } from '@/lib/user-context'
import { SessionProvider } from '@/contexts/session-context'
import { ConnectivityProvider } from '@/lib/connectivity-provider'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'

const theme = createTheme({
  primaryColor: 'indigo',
  colors: {
    brand: [
      '#EFF6FF',
      '#DBEAFE',
      '#BFDBFE',
      '#93C5FD',
      '#60A5FA',
      '#3B82F6',
      '#2563EB',
      '#1D4ED8',
      '#1E40AF',
      '#1E3A8A'
    ]
  },
  fontFamily: 'var(--font-geist-sans, -apple-system), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: 'var(--font-geist-mono, "SF Mono"), "SF Mono", Monaco, Inconsolata, monospace',
  headings: {
    fontFamily: 'var(--font-syne, var(--font-geist-sans)), sans-serif',
    sizes: {
      h1: { fontSize: '2rem', fontWeight: '800', lineHeight: '1.1' },
      h2: { fontSize: '1.5rem', fontWeight: '700', lineHeight: '1.2' },
      h3: { fontSize: '1.25rem', fontWeight: '700', lineHeight: '1.3' },
    }
  },
  defaultRadius: 'lg',
  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'xl',
        centered: true,
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Card: {
      defaultProps: {
        radius: 'xl',
        withBorder: true,
      },
    },
    SegmentedControl: {
      styles: {
        root: {
          backgroundColor: 'var(--ff-border-subtle)',
          border: '1px solid var(--ff-border)',
        },
      },
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      <ModalsProvider>
        <ConnectivityProvider>
          <UserProvider>
            <SessionProvider>
              {children}
            </SessionProvider>
          </UserProvider>
        </ConnectivityProvider>
      </ModalsProvider>
    </MantineProvider>
  )
}
