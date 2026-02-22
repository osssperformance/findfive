'use client'

import { useState } from 'react'
import {
  TextInput,
  Button,
  Paper,
  Text,
  Anchor,
  Stack,
  Tabs,
  PasswordInput,
  Box,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { authActions } from '@/lib/auth-client'

interface AuthFormsProps {
  onSuccess?: () => void
  redirectTo?: string
}

const inputStyles = {
  input: {
    backgroundColor: 'var(--ff-bg)',
    border: '1px solid var(--ff-border)',
    borderRadius: 12,
    fontSize: 15,
  },
  label: {
    fontWeight: 500,
    fontSize: 13,
    color: 'var(--ff-ink-secondary)',
    marginBottom: 4,
  },
}

export function AuthForms({ onSuccess }: AuthFormsProps) {
  const [activeTab, setActiveTab] = useState<string | null>('signin')
  const [isLoading, setIsLoading] = useState(false)

  const signInForm = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  })

  const signUpForm = useForm({
    initialValues: { email: '', password: '', confirmPassword: '', name: '' },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (val, values) =>
        val !== values.password ? 'Passwords do not match' : null,
      name: (val) => (val.length < 2 ? 'Name must be at least 2 characters' : null),
    },
  })

  const handleSignIn = async (values: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      await authActions.signInWithEmailPassword(values.email, values.password)
      notifications.show({ title: 'Welcome back', message: 'Signed in successfully', color: 'green' })
      onSuccess?.()
    } catch (error) {
      notifications.show({
        title: 'Sign in failed',
        message: error instanceof Error ? error.message : 'An error occurred',
        color: 'red',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (values: { email: string; password: string; name: string }) => {
    setIsLoading(true)
    try {
      await authActions.signUpWithEmailPassword(values.email, values.password, values.name)
      notifications.show({
        title: 'Account created',
        message: 'Check your email to verify your account',
        color: 'green',
      })
      onSuccess?.()
    } catch (error) {
      notifications.show({
        title: 'Sign up failed',
        message: error instanceof Error ? error.message : 'An error occurred',
        color: 'red',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Paper
      radius="xl"
      p="xl"
      withBorder={false}
      style={{
        background: 'white',
        boxShadow: '0 8px 40px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid var(--ff-border)',
      }}
    >
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        styles={{
          list: {
            borderBottom: '1px solid var(--ff-border)',
            marginBottom: 24,
            gap: 0,
          },
          tab: {
            fontWeight: 500,
            fontSize: 14,
            color: 'var(--ff-ink-tertiary)',
            paddingBottom: 12,
            paddingTop: 4,
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="signin">Sign In</Tabs.Tab>
          <Tabs.Tab value="signup">Sign Up</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="signin">
          <form onSubmit={signInForm.onSubmit(handleSignIn)}>
            <Stack gap="md">
              <TextInput
                required
                label="Email"
                placeholder="your@email.com"
                styles={inputStyles}
                {...signInForm.getInputProps('email')}
              />
              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                styles={inputStyles}
                {...signInForm.getInputProps('password')}
              />
              <Box mt={4}>
                <Button
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  radius="xl"
                  size="md"
                  style={{
                    background: 'var(--ff-ink)',
                    color: 'white',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Stack>
          </form>
          <Text ta="center" size="sm" mt="lg" style={{ color: 'var(--ff-ink-tertiary)' }}>
            No account?{' '}
            <Anchor
              onClick={() => setActiveTab('signup')}
              style={{ color: 'var(--ff-accent)', fontWeight: 500 }}
            >
              Sign up
            </Anchor>
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="signup">
          <form onSubmit={signUpForm.onSubmit(handleSignUp)}>
            <Stack gap="md">
              <TextInput
                required
                label="Name"
                placeholder="Your full name"
                styles={inputStyles}
                {...signUpForm.getInputProps('name')}
              />
              <TextInput
                required
                label="Email"
                placeholder="your@email.com"
                styles={inputStyles}
                {...signUpForm.getInputProps('email')}
              />
              <PasswordInput
                required
                label="Password"
                placeholder="Create a password"
                styles={inputStyles}
                {...signUpForm.getInputProps('password')}
              />
              <PasswordInput
                required
                label="Confirm Password"
                placeholder="Confirm your password"
                styles={inputStyles}
                {...signUpForm.getInputProps('confirmPassword')}
              />
              <Box mt={4}>
                <Button
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  radius="xl"
                  size="md"
                  style={{
                    background: 'var(--ff-ink)',
                    color: 'white',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                  }}
                >
                  Create Account
                </Button>
              </Box>
            </Stack>
          </form>
          <Text ta="center" size="sm" mt="lg" style={{ color: 'var(--ff-ink-tertiary)' }}>
            Already have an account?{' '}
            <Anchor
              onClick={() => setActiveTab('signin')}
              style={{ color: 'var(--ff-accent)', fontWeight: 500 }}
            >
              Sign in
            </Anchor>
          </Text>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  )
}
