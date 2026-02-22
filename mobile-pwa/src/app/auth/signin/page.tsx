'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Text, Center } from '@mantine/core'
import { AuthForms } from '@/components/auth/auth-forms'
import { useAuth } from '@/lib/auth-client'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()

  const redirectTo = searchParams.get('redirect') || '/'

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo])

  if (isAuthenticated) {
    return (
      <Center h="100vh" style={{ background: 'var(--ff-bg)' }}>
        <Text size="sm" c="dimmed">Redirecting…</Text>
      </Center>
    )
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'var(--ff-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      {/* Brand mark */}
      <Box mb={40} style={{ textAlign: 'center' }}>
        <Text
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: '2.2rem',
            letterSpacing: '-0.03em',
            color: 'var(--ff-ink)',
            lineHeight: 1.1,
          }}
        >
          Find Five
        </Text>
        <Text
          size="sm"
          mt={6}
          style={{ color: 'var(--ff-ink-secondary)', letterSpacing: '0.01em' }}
        >
          Track what you can let go of
        </Text>
      </Box>

      {/* Form */}
      <Box style={{ width: '100%', maxWidth: 380 }}>
        <AuthForms
          onSuccess={() => router.push(redirectTo)}
          redirectTo={redirectTo}
        />
      </Box>
    </Box>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <Center h="100vh" style={{ background: 'var(--ff-bg)' }}>
        <Text size="sm" c="dimmed">Loading…</Text>
      </Center>
    }>
      <SignInContent />
    </Suspense>
  )
}
