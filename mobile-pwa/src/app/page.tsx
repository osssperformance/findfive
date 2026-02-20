'use client'

import { useEffect, useState, useRef } from 'react'
import { TaskList } from '@/components/task-list-mantine'
import { TaskModal } from '@/components/task-modal-mantine'
import { BottomNav } from '@/components/bottom-nav-mantine'
import { SyncStatus } from '@/components/sync-status'
import { SessionCard } from '@/components/session/session-card'
import { InterruptionFAB } from '@/components/interruption/interruption-fab'
import { useEntriesStore } from '@/store/entries-store'
import { useUser } from '@/lib/user-context'
import { VoiceRecorder } from '@/lib/voice-recorder'
import { Mic, Keyboard, RotateCcw, Plus } from 'lucide-react'
import {
  Container,
  Title,
  Text,
  Card,
  Button,
  Group,
  Stack,
  SegmentedControl,
  Box,
  Affix,
  Transition,
} from '@mantine/core'

export default function Home() {
  const { addEntryFromVoice } = useEntriesStore()
  const { userId, isAuthenticated, isLoading } = useUser()
  const [activeTab, setActiveTab] = useState('Today')
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const recorderRef = useRef<VoiceRecorder | null>(null)

  useEffect(() => {
    setMounted(true)
    const date = new Date()
    setCurrentDate(date.toLocaleDateString('en-AU', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }))
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/signin?redirect=/'
    }
  }, [isAuthenticated, isLoading])

  useEffect(() => {
    if (!mounted || !isAuthenticated) return

    const recorder = new VoiceRecorder({
      onStart: () => {
        setIsRecording(true)
        setTranscript('')
      },
      onStop: () => {
        setIsRecording(false)
        if (transcript.trim()) {
          handleVoiceTranscript(transcript.trim())
          setTranscript('')
        }
      },
      onTranscript: (text) => {
        setTranscript(text)
      },
      onError: (err) => {
        console.error('Voice recording error:', err)
        setIsRecording(false)
        setTranscript('')
      }
    })

    recorderRef.current = recorder

    return () => {
      if (recorder.getIsRecording()) {
        recorder.stopRecording()
      }
    }
  }, [mounted, isAuthenticated, transcript])

  if (isLoading || !mounted) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          background: 'var(--ff-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack align="center" gap="xs">
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '2px solid var(--ff-border)',
              borderTopColor: 'var(--ff-accent)',
              animation: 'spin 0.7s linear infinite',
            }}
          />
          <Text size="sm" c="dimmed">Loading...</Text>
        </Stack>
      </Box>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleVoiceTranscript = async (transcript: string) => {
    await addEntryFromVoice(transcript, userId, 15)
  }

  const handleMouseDown = () => {
    if (!isRecording) {
      recorderRef.current?.startRecording()
    }
  }

  const handleMouseUp = () => {
    if (isRecording) {
      recorderRef.current?.stopRecording()
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    handleMouseDown()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    handleMouseUp()
  }

  return (
    <Box
      pb={80}
      style={{
        minHeight: '100vh',
        background: 'var(--ff-bg)',
      }}
    >
      <Container size="sm" px="md">
        <Stack py="xl" gap="xl">

          {/* ── Header ─────────────────────────────── */}
          <Box className="animate-in" style={{ animationDelay: '0ms' }}>
            <Title
              order={1}
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 800,
                fontSize: '2rem',
                letterSpacing: '-0.03em',
                color: 'var(--ff-ink)',
                lineHeight: 1.1,
              }}
            >
              Find Five
            </Title>
            <Text
              size="sm"
              mt={4}
              style={{ color: 'var(--ff-ink-secondary)', letterSpacing: '0.01em' }}
            >
              {currentDate}
            </Text>
          </Box>

          {/* ── Tab Navigation ─────────────────────── */}
          <Box className="animate-in" style={{ animationDelay: '40ms' }}>
            <SegmentedControl
              value={activeTab}
              onChange={setActiveTab}
              data={['Today', 'This Week', 'Insights']}
              radius="xl"
              size="sm"
              fullWidth
              styles={{
                root: {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  border: '1px solid var(--ff-border)',
                  padding: 3,
                },
                label: {
                  fontWeight: 500,
                  fontSize: 13,
                },
              }}
            />
          </Box>

          {/* ── Quick Capture Card ─────────────────── */}
          <Card
            className="animate-in"
            radius="xl"
            padding={0}
            withBorder={false}
            style={{
              background: 'var(--ff-capture)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.12)',
              animationDelay: '80ms',
            }}
          >
            {/* Subtle top gradient accent */}
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
              }}
            />

            <Stack gap={0} p="xl">
              {/* Card label + headline */}
              <Box mb="xl">
                <Text
                  size="xs"
                  fw={500}
                  style={{
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontSize: 11,
                  }}
                >
                  Quick Capture
                </Text>
                <Text
                  mt={6}
                  fw={600}
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '1.1rem',
                    lineHeight: 1.3,
                  }}
                >
                  {isRecording ? 'Listening…' : 'What are you working on?'}
                </Text>
              </Box>

              {/* Voice Button */}
              <Box ta="center" py="md">
                <Box style={{ position: 'relative', display: 'inline-flex' }}>
                  {/* Outer pulse ring (recording only) */}
                  {isRecording && (
                    <Box
                      style={{
                        position: 'absolute',
                        inset: -20,
                        borderRadius: '50%',
                        border: '1.5px solid rgba(239,68,68,0.2)',
                        animation: 'pulse-ring-outer 1.8s ease-out 0.4s infinite',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  {/* Inner pulse ring (recording only) */}
                  {isRecording && (
                    <Box
                      style={{
                        position: 'absolute',
                        inset: -10,
                        borderRadius: '50%',
                        border: '1.5px solid rgba(239,68,68,0.35)',
                        animation: 'pulse-ring 1.8s ease-out infinite',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  <Box
                    component="button"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isRecording
                        ? '1.5px solid rgba(239,68,68,0.4)'
                        : '1.5px solid rgba(255,255,255,0.14)',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      background: isRecording
                        ? 'rgba(239,68,68,0.15)'
                        : 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(8px)',
                      transform: isRecording ? 'scale(1.07)' : 'scale(1)',
                      position: 'relative',
                      boxShadow: isRecording
                        ? '0 0 0 1px rgba(239,68,68,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <Mic
                      size={34}
                      strokeWidth={1.75}
                      color={isRecording ? '#FCA5A5' : 'rgba(255,255,255,0.85)'}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Transcript */}
              <Transition mounted={isRecording && !!transcript} transition="fade" duration={200}>
                {(styles) => (
                  <Text
                    style={{ ...styles, color: 'rgba(255,255,255,0.55)', fontSize: 13, fontStyle: 'italic' }}
                    ta="center"
                    mb="sm"
                  >
                    "{transcript}"
                  </Text>
                )}
              </Transition>

              {/* Status text */}
              <Transition mounted={!isRecording} transition="fade" duration={150}>
                {(styles) => (
                  <Text
                    style={{ ...styles, color: 'rgba(255,255,255,0.35)', fontSize: 12 }}
                    ta="center"
                    mb="md"
                  >
                    Hold to record • Release to save
                  </Text>
                )}
              </Transition>

              <Transition mounted={isRecording} transition="fade" duration={150}>
                {(styles) => (
                  <Text
                    style={{ ...styles, color: 'rgba(239,68,68,0.8)', fontSize: 12, fontWeight: 500 }}
                    ta="center"
                    mb="md"
                  >
                    Recording · Release to stop
                  </Text>
                )}
              </Transition>

              {/* Action Buttons */}
              <Group justify="center" gap="sm">
                <Button
                  leftSection={<Keyboard size={14} strokeWidth={1.75} />}
                  onClick={() => setIsModalOpen(true)}
                  size="sm"
                  radius="xl"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.65)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  Type
                </Button>
                <Button
                  leftSection={<RotateCcw size={14} strokeWidth={1.75} />}
                  onClick={() => {
                    setTranscript('')
                    if (isRecording) {
                      recorderRef.current?.stopRecording()
                    }
                  }}
                  size="sm"
                  radius="xl"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.65)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  Reset
                </Button>
              </Group>
            </Stack>
          </Card>

          {/* ── Session Card ────────────────────────── */}
          <Box className="animate-in" style={{ animationDelay: '120ms' }}>
            <SessionCard />
          </Box>

          {/* ── Task List ───────────────────────────── */}
          <Box className="animate-in" style={{ animationDelay: '160ms' }}>
            <TaskList />
          </Box>

          {/* ── Sync Status ─────────────────────────── */}
          <SyncStatus />

        </Stack>
      </Container>

      {/* ── FAB ─────────────────────────────────────── */}
      <Affix position={{ bottom: 90, right: 20 }}>
        <Transition transition="slide-up" mounted={true}>
          {(transitionStyles) => (
            <Button
              size="xl"
              radius="xl"
              onClick={() => setIsModalOpen(true)}
              style={{
                ...transitionStyles,
                width: 52,
                height: 52,
                padding: 0,
                background: 'var(--ff-ink)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Plus size={22} strokeWidth={2} />
            </Button>
          )}
        </Transition>
      </Affix>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <InterruptionFAB />
      <BottomNav />
    </Box>
  )
}
