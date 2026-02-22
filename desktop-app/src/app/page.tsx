'use client'

import { Container, Title, Text, Paper, Stack, Button, Group } from '@mantine/core';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useAuth, authActions } from '@/lib/auth-client';

function HomePage() {
  const { user, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await authActions.signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Paper p="xl" withBorder radius="md">
          <Stack gap="md" align="center">
            <Group justify="space-between" w="100%">
              <div></div>
              <Title order={1}>Find Five Desktop</Title>
              <Button variant="subtle" onClick={handleSignOut}>
                Sign Out
              </Button>
            </Group>
            <Text size="lg" ta="center" c="dimmed">
              Task Categorization & Management Interface
            </Text>
            {user && (
              <Text ta="center" c="blue">
                Welcome back, {user.name || user.email}!
              </Text>
            )}
            <Text ta="center">
              This is the desktop version of Find Five focused on categorizing 
              and managing tasks recorded from the mobile app using the Eisenhower Matrix.
            </Text>
          </Stack>
        </Paper>
        
        <Paper p="xl" withBorder radius="md">
          <Stack gap="md">
            <Title order={2}>Coming Soon</Title>
            <Text>
              • View all recorded tasks from mobile sessions
            </Text>
            <Text>
              • Eisenhower Matrix categorization interface
            </Text>
            <Text>
              • Bulk task management and actions
            </Text>
            <Text>
              • Advanced filtering and search
            </Text>
            <Text>
              • Analytics and reporting dashboard
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default function AuthenticatedHomePage() {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  );
}