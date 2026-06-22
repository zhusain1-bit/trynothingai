'use client'

import { useEffect, useRef } from 'react'

interface Step {
  ms: number
  action: () => void
}

export function useAnimationLoop(
  steps: Step[],
  totalMs: number,
  reset: () => void,
  enabled = true,
) {
  const stepsRef = useRef(steps)
  const resetRef = useRef(reset)
  stepsRef.current = steps
  resetRef.current = reset

  useEffect(() => {
    if (!enabled) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      // Jump to final state immediately
      const last = stepsRef.current[stepsRef.current.length - 1]
      last?.action()
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []

    function runCycle() {
      resetRef.current()
      stepsRef.current.forEach(s => {
        timers.push(setTimeout(s.action, s.ms))
      })
    }

    runCycle()
    const loop = setInterval(() => {
      timers.forEach(clearTimeout)
      timers.length = 0
      runCycle()
    }, totalMs)

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(loop)
    }
  }, [enabled, totalMs])
}
