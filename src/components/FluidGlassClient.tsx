'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const FluidGlass = dynamic(() => import('./FluidGlass'), {
  ssr: false,
  loading: () => null
})

export default function FluidGlassClient() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Pre-flight checks
    try {
      // Check if files exist
      fetch('/assets/3d/lens.glb', { method: 'HEAD' })
        .then(res => {
          if (!res.ok) {
            setError('lens.glb not found! Check /public/assets/3d/lens.glb')
            return
          }
          console.log('✅ lens.glb found')
          setMounted(true)
        })
        .catch(err => {
          setError('Cannot load lens.glb: ' + err.message)
        })
    } catch (e) {
      setError('Setup error: ' + (e as Error).message)
    }

    // Memory cleanup
    return () => {
      const canvases = document.querySelectorAll('canvas')
      canvases.forEach(canvas => {
        try {
          const ctx = canvas.getContext('webgl') || canvas.getContext('webgl2')
          if (ctx) {
            const ext = ctx.getExtension('WEBGL_lose_context')
            if (ext) ext.loseContext()
          }
        } catch (e) {
          // Silent fail
        }
      })
    }
  }, [])

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: 'rgba(255,0,0,0.9)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        zIndex: 999999,
        maxWidth: '400px',
        fontSize: '14px',
        fontFamily: 'monospace',
      }}>
        ❌ {error}
      </div>
    )
  }

  if (!mounted) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <FluidGlass />
    </div>
  )
}