'use client'

import { useState } from 'react'
import {
  TextInput,
  Button,
  Paper,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
  Tabs,
  PasswordInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { authActions } from '@/lib/auth-client'

interface AuthFormsProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function AuthForms({ onSuccess, redirectTo }: AuthFormsProps) {
  const [activeTab, setActiveTab] = useState<string | null>('signin')
  const [isLoading, setIsLoading] = useState(false)

  // Sign In Form
  const signInForm = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  })

  // Sign Up Form
  const signUpForm = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
      confirmPassword: (val, values) => val !== values.password ? 'Passwords did not match' : null,
      name: (val) => (val.length < 2 ? 'Name should include at least 2 characters' : null),
    },
  })

  const handleSignIn = async (values: typeof signInForm.values) => {
    try {
      setIsLoading(true)
      await authActions.signInWithEmailPassword(values.email, values.password)
      
      notifications.show({
        title: 'Welcome back!',
        message: 'You have successfully signed in to Find Five Desktop',
        color: 'green',
      })
      
      onSuccess?.()
    } catch (error) {
      notifications.show({
        title: 'Sign in failed',
        message: error instanceof Error ? error.message : 'An error occurred during sign in',
        color: 'red',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (values: typeof signUpForm.values) => {
    try {
      setIsLoading(true)
      await authActions.signUpWithEmailPassword(values.email, values.password, values.name)
      
      notifications.show({
        title: 'Account created!',
        message: 'Welcome to Find Five Desktop! You are now signed in.',
        color: 'green',
      })
      
      onSuccess?.()
    } catch (error) {
      notifications.show({
        title: 'Sign up failed', 
        message: error instanceof Error ? error.message : 'An error occurred during sign up',
        color: 'red',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mt="md" mb={50}>
        Welcome to Find Five Desktop
      </Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List grow mb="md">
          <Tabs.Tab value="signin">Sign In</Tabs.Tab>
          <Tabs.Tab value="signup">Sign Up</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="signin">
          <form onSubmit={signInForm.onSubmit(handleSignIn)}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                {...signInForm.getInputProps('email')}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                {...signInForm.getInputProps('password')}
              />

              <Button
                type="submit"
                loading={isLoading}
                fullWidth
                mt="xl"
              >
                Sign In
              </Button>
            </Stack>
          </form>

          <Text ta="center" mt="md">
            Don&apos;t have an account?{' '}
            <Anchor onClick={() => setActiveTab('signup')}>
              Sign up
            </Anchor>
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="signup">
          <form onSubmit={signUpForm.onSubmit(handleSignUp)}>
            <Stack>
              <TextInput
                label="Name"
                placeholder="Your name"
                required
                {...signUpForm.getInputProps('name')}
              />

              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                {...signUpForm.getInputProps('email')}
              />

              <PasswordInput
                label="Password"
                placeholder="Create a password"
                required
                {...signUpForm.getInputProps('password')}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                {...signUpForm.getInputProps('confirmPassword')}
              />

              <Button
                type="submit"
                loading={isLoading}
                fullWidth
                mt="xl"
              >
                Create Account
              </Button>
            </Stack>
          </form>

          <Text ta="center" mt="md">
            Already have an account?{' '}
            <Anchor onClick={() => setActiveTab('signin')}>
              Sign in
            </Anchor>
          </Text>
        </Tabs.Panel>
      </Tabs>

      <Alert mt="md" variant="light">
        Your desktop and mobile apps share the same account. 
        Sign in with your existing credentials or create a new account.
      </Alert>
    </Paper>
  )
}