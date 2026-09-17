'use client'
import { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard'
import { createClient } from '@/lib/supabase/client'
import { Project, Skill, Profile, Experience } from '@/lib/types'

export default function AdminPage() {
  const [screen, setScreen] = useState<'login' | 'loading' | 'dashboard'>('login')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [experience, setExperience] = useState<Experience[]>([])

  useEffect(() => {
    if (localStorage.getItem('cms_auth') === 'true') {
      loadDashboard()
    }
  }, [])

  async function loadDashboard() {
    setScreen('loading')
    try {
      const supabase = createClient()
      const [{ data: p }, { data: proj }, { data: sk }, { data: exp }] = await Promise.all([
        supabase.from('profiles').select('*').single(),
        supabase.from('projects').select('*').order('order_index').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('order_index'),
        supabase.from('experience').select('*').order('order_index'),
      ])
      setProfile(p as Profile | null)
      setProjects((proj || []) as Project[])
      setSkills((sk || []) as Skill[])
      setExperience((exp || []) as Experience[])
    } catch (err) {
      console.error('Failed to load data:', err)
    }
    setScreen('dashboard')
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        localStorage.setItem('cms_auth', 'true')
        loadDashboard()
      } else {
        setError('Invalid password')
        setSubmitting(false)
      }
    } catch {
      setError('Connection error. Try again.')
      setSubmitting(false)
    }
  }

  function logout() {
    localStorage.removeItem('cms_auth')
    setScreen('login')
    setPassword('')
  }

  if (screen === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        <p className="text-gray-400 text-sm">Loading dashboard…</p>
      </div>
    )
  }

  if (screen === 'dashboard') {
    return (
      <AdminDashboard
        initialProfile={profile}
        initialProjects={projects}
        initialSkills={skills}
        initialExperience={experience}
        onLogout={logout}
      />
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold gradient-text">CMS Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Portfolio management</p>
        </div>

        <form onSubmit={handleLogin} className="glass rounded-2xl p-8 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Signing in…
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          <a href="/" className="hover:text-gray-400 transition-colors">← Back to portfolio</a>
        </p>
      </div>
    </main>
  )
}
