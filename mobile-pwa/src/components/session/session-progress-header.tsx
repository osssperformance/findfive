'use client'

import { 
  Paper, 
  Group, 
  Text,
  Box
} from '@mantine/core'
import { SessionProgress } from './session-progress'
import { useSession } from '@/contexts/session-context'

interface SessionProgressHeaderProps {
  className?: string
}

export function SessionProgressHeader({ className }: SessionProgressHeaderProps) {
  const { currentSession } = useSession()

  if (!currentSession) {
    return null
  }

  return (
    <Paper
      radius={0}
      p="sm"
      style={{
        background: 'var(--ff-capture)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}
      className={className}
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <Box flex={1}>
          <Text size="sm" c="white" fw={500} mb={2}>
            Current Session
          </Text>
          <SessionProgress variant="compact" showRefresh={false} textColor="white" />
        </Box>
        
        <SessionProgress variant="ring" showRefresh={false} />
      </Group>
    </Paper>
  )
}