'use client'
import { useState } from 'react'
import { Project, Skill, Profile, SocialLink, Experience, TechItem, ContactFormConfig, ContactField, ContactFieldType, DEFAULT_CONTACT_FORM_CONFIG } from '@/lib/types'

type Tab = 'profile' | 'projects' | 'skills' | 'experience' | 'contact'

const emptyProject = (): Partial<Project> => ({
  title: '', description: '', long_description: '', image_url: '',
  live_url: '', github_url: '', tags: [], featured: false, order_index: 0,
})

const emptySkill = (): Partial<Skill> => ({
  name: '', category: 'Frontend', level: 80, icon: '', order_index: 0,
})

const emptyExperience = (): Partial<Experience> => ({
  type: 'work', title: '', organization: '', period: '', description: '', tags: [], order_index: 0,
})

const NAV = [
  {
    id: 'profile' as Tab, label: 'Profile',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    id: 'projects' as Tab, label: 'Projects',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  },
  {
    id: 'skills' as Tab, label: 'Skills',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  },
  {
    id: 'experience' as Tab, label: 'Experience',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
  {
    id: 'contact' as Tab, label: 'Contact Form',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
]

const FIELD_TYPES: { value: ContactFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'url', label: 'URL' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Dropdown' },
]

function Toast({ msg }: { msg: string }) {
  if (!msg) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium text-white animate-in"
      style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}>
      <svg className="w-4 h-4 text-purple-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {msg}
    </div>
  )
}

export default function AdminDashboard({
  initialProfile, initialProjects, initialSkills, initialExperience, onLogout,
}: {
  initialProfile: Profile | null
  initialProjects: Project[]
  initialSkills: Skill[]
  initialExperience: Experience[]
  onLogout: () => void
}) {
  const [tab, setTab] = useState<Tab>('profile')
  const [profile, setProfile] = useState<Partial<Profile>>(initialProfile || {
    name: '', title: '', bio: '', email: '', avatar_url: '', resume_url: '', social_links: [],
  })
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [experience, setExperience] = useState<Experience[]>(initialExperience)
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null)
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null)
  const [uploadingTechIdx, setUploadingTechIdx] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Contact form config state
  const [contactConfig, setContactConfig] = useState<ContactFormConfig>(
    (initialProfile?.contact_form_config) || DEFAULT_CONTACT_FORM_CONFIG
  )
  const [newField, setNewField] = useState<Partial<ContactField>>({ type: 'text', required: false, enabled: true })
  const [addingField, setAddingField] = useState(false)

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  function isTechImageUrl(s: string) { return !!(s && (s.startsWith('http') || s.startsWith('/'))) }

  async function uploadTechIcon(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingTechIdx(idx)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
    const data = await res.json()
    setUploadingTechIdx(null)
    if (res.ok) {
      const stack = [...(((profile as Record<string, TechItem[]>)['tech_stack']) || [])]
      stack[idx] = { ...stack[idx], icon: data.url }
      setProfile(prev => ({ ...prev, tech_stack: stack }))
    } else flash(data.error || 'Upload failed')
    e.target.value = ''
  }

  async function saveProfile() {
    setSaving(true)
    const res = await fetch('/api/admin/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
    const data = await res.json()
    setSaving(false)
    res.ok ? flash('Profile saved!') : flash(data.error || 'Error saving profile')
  }

  async function saveProject() {
    if (!editingProject) return
    setSaving(true)
    const method = editingProject.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/projects', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingProject) })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setProjects(prev => editingProject.id ? prev.map(p => p.id === data.id ? data : p) : [data, ...prev])
      setEditingProject(null)
      flash('Project saved!')
    } else flash(data.error || 'Error saving project')
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return
    const res = await fetch('/api/admin/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) { setProjects(prev => prev.filter(p => p.id !== id)); flash('Project deleted') }
  }

  async function saveSkill() {
    if (!editingSkill) return
    setSaving(true)
    const method = editingSkill.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/skills', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingSkill) })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setSkills(prev => editingSkill.id ? prev.map(s => s.id === data.id ? data : s) : [...prev, data])
      setEditingSkill(null)
      flash('Skill saved!')
    } else flash(data.error || 'Error saving skill')
  }

  async function deleteSkill(id: string) {
    if (!confirm('Delete this skill?')) return
    const res = await fetch('/api/admin/skills', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) { setSkills(prev => prev.filter(s => s.id !== id)); flash('Skill deleted') }
  }

  async function saveExp() {
    if (!editingExp) return
    setSaving(true)
    const method = editingExp.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/experience', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingExp) })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setExperience(prev => editingExp.id ? prev.map(e => e.id === data.id ? data : e) : [...prev, data])
      setEditingExp(null)
      flash('Experience saved!')
    } else flash(data.error || 'Error saving experience')
  }

  async function deleteExp(id: string) {
    if (!confirm('Delete this entry?')) return
    const res = await fetch('/api/admin/experience', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) { setExperience(prev => prev.filter(e => e.id !== id)); flash('Entry deleted') }
  }

  async function saveContactConfig() {
    setSaving(true)
    const res = await fetch('/api/admin/contact-form', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactConfig) })
    setSaving(false)
    res.ok ? flash('Contact form saved!') : flash('Error saving contact form')
  }

  function updateContactField(index: number, patch: Partial<ContactField>) {
    setContactConfig(prev => {
      const fields = [...prev.fields]
      fields[index] = { ...fields[index], ...patch }
      return { ...prev, fields }
    })
  }

  function moveContactField(index: number, dir: -1 | 1) {
    setContactConfig(prev => {
      const fields = [...prev.fields]
      const target = index + dir
      if (target < 0 || target >= fields.length) return prev
      ;[fields[index], fields[target]] = [fields[target], fields[index]]
      return { ...prev, fields: fields.map((f, i) => ({ ...f, order: i })) }
    })
  }

  function deleteContactField(index: number) {
    setContactConfig(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index).map((f, i) => ({ ...f, order: i })),
    }))
  }

  function addContactField() {
    if (!newField.key || !newField.label) return flash('Field key and label are required')
    if (contactConfig.fields.some(f => f.key === newField.key)) return flash('A field with that key already exists')
    const field: ContactField = {
      key: newField.key!,
      label: newField.label!,
      type: newField.type || 'text',
      required: newField.required ?? false,
      enabled: true,
      placeholder: newField.placeholder || '',
      options: newField.type === 'select' ? (newField.options || ['Option 1']) : undefined,
      order: contactConfig.fields.length,
    }
    setContactConfig(prev => ({ ...prev, fields: [...prev.fields, field] }))
    setNewField({ type: 'text', required: false, enabled: true })
    setAddingField(false)
  }

  const inp = "w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#0f0f1a] border border-white/10 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
  const lbl = "block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest"

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080812' }}>
      <Toast msg={msg} />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#0d0d1a', borderRight: '1px solid rgba(124,58,237,0.15)' }}>

        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Portfolio CMS</p>
              <p className="text-xs text-gray-600">Content Manager</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-4 border-b border-white/5 grid grid-cols-3 gap-2">
          {[
            { label: 'Projects', value: projects.length },
            { label: 'Skills', value: skills.length },
            { label: 'Exp', value: experience.length },
          ].map(s => (
            <div key={s.label} className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <p className="text-lg font-bold text-purple-300">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-widest">Navigation</p>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => { setTab(n.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === n.id
                ? 'text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
              style={tab === n.id ? { background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(79,70,229,0.2))', border: '1px solid rgba(124,58,237,0.3)', color: 'white' } : {}}
            >
              <span className={tab === n.id ? 'text-purple-400' : ''}>{n.icon}</span>
              {n.label}
              {n.id === 'projects' && projects.length > 0 && (
                <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 rounded-full px-1.5 py-0.5">{projects.length}</span>
              )}
              {n.id === 'skills' && skills.length > 0 && (
                <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 rounded-full px-1.5 py-0.5">{skills.length}</span>
              )}
              {n.id === 'experience' && experience.length > 0 && (
                <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 rounded-full px-1.5 py-0.5">{experience.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <a href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            View Portfolio
          </a>
          <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-500/70 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 h-14 border-b flex-shrink-0" style={{ background: '#0d0d1a', borderColor: 'rgba(124,58,237,0.15)' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-sm font-semibold text-white capitalize">{tab}</h1>
              <p className="text-xs text-gray-600 hidden sm:block">
                {tab === 'profile' ? 'Manage your personal information'
                  : tab === 'projects' ? `${projects.length} project${projects.length !== 1 ? 's' : ''}`
                  : tab === 'skills' ? `${skills.length} skill${skills.length !== 1 ? 's' : ''}`
                  : tab === 'contact' ? 'Dynamic fields, email notifications & auto-reply'
                  : `${experience.length} entr${experience.length !== 1 ? 'ies' : 'y'}`}
              </p>
            </div>
          </div>

          {tab === 'projects' && (
            <button onClick={() => setEditingProject(emptyProject())}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Project
            </button>
          )}
          {tab === 'skills' && (
            <button onClick={() => setEditingSkill(emptySkill())}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Skill
            </button>
          )}
          {tab === 'experience' && (
            <button onClick={() => setEditingExp(emptyExperience())}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Entry
            </button>
          )}
          {tab === 'profile' && (
            <button onClick={saveProfile} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
              {saving ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />Saving…</> : <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Save Profile</>}
            </button>
          )}
          {tab === 'contact' && (
            <button onClick={saveContactConfig} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
              {saving ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />Saving…</> : <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Save Contact Form</>}
            </button>
          )}
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* ── PROFILE TAB ── */}
          {tab === 'profile' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Basic info card */}
              <section className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <h2 className="text-sm font-semibold text-white">Basic Information</h2>
                </div>
                <div className="p-6 grid sm:grid-cols-2 gap-5">
                  {([
                    ['name', 'Full Name', 'text', 'e.g. Dave Smith'],
                    ['title', 'Title / Role', 'text', 'e.g. Full-Stack Developer'],
                    ['email', 'Email Address', 'email', 'hello@example.com'],
                    ['avatar_url', 'Avatar Image URL', 'url', 'https://...'],
                    ['resume_url', 'Resume / CV URL', 'url', 'https://...'],
                  ] as [string, string, string, string][]).map(([field, label, type, placeholder]) => (
                    <div key={field} className={field === 'name' || field === 'title' ? '' : ''}>
                      <label className={lbl}>{label}</label>
                      <input type={type} value={(profile as Record<string, string>)[field] || ''}
                        onChange={e => setProfile(prev => ({ ...prev, [field]: e.target.value }))}
                        placeholder={placeholder} className={inp} />
                    </div>
                  ))}
                </div>
              </section>

              {/* Bio card */}
              <section className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" /></svg>
                  <h2 className="text-sm font-semibold text-white">Bio</h2>
                </div>
                <div className="p-6">
                  <textarea rows={5} value={profile.bio || ''}
                    onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Write a short bio about yourself — your experience, passions, and what you do best..."
                    className={inp + ' resize-none'} />
                  <p className="text-xs text-gray-600 mt-2">{(profile.bio || '').length} characters</p>
                </div>
              </section>

              {/* Hero settings card */}
              <section className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  <h2 className="text-sm font-semibold text-white">Hero Section</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className={lbl}>Location Badge Text</label>
                    <input type="text"
                      value={(profile as Record<string, string>)['location_badge'] || ''}
                      onChange={e => setProfile(prev => ({ ...prev, location_badge: e.target.value }))}
                      placeholder="Full Stack & Frontend Engineer based in PH"
                      className={inp} />
                    <p className="text-xs text-gray-600 mt-1.5">Shown in the pill badge above the headline</p>
                  </div>
                  <div>
                    <label className={lbl}>Headline Gradient Words</label>
                    <input type="text"
                      value={(profile as Record<string, string>)['hero_tagline'] || ''}
                      onChange={e => setProfile(prev => ({ ...prev, hero_tagline: e.target.value }))}
                      placeholder="resilient & dynamic"
                      className={inp} />
                    <p className="text-xs text-gray-600 mt-1.5">The highlighted words in: Hi, I&apos;m [name] — crafting <em>these words</em> web applications.</p>
                  </div>
                </div>
              </section>

              {/* Tech stack card */}
              <section className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>
                    <h2 className="text-sm font-semibold text-white">Tech Stack</h2>
                    <span className="text-xs text-gray-600 ml-1">({((profile as Record<string, TechItem[]>)['tech_stack'] || []).length})</span>
                  </div>
                  <button type="button"
                    onClick={() => setProfile(prev => ({ ...prev, tech_stack: [...((prev as Record<string, TechItem[]>)['tech_stack'] || []), { name: '', icon: '⚡' }] }))}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-500/60 rounded-lg px-3 py-1.5 transition-all">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Tech
                  </button>
                </div>
                <div className="p-6">
                  {(((profile as Record<string, TechItem[]>)['tech_stack']) || []).length === 0 ? (
                    <div className="text-center py-8 rounded-xl" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
                      <p className="text-sm text-gray-600">No tech stack items yet</p>
                      <p className="text-xs text-gray-700 mt-1">Click &quot;Add Tech&quot; to add items</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Column headers */}
                      <div className="grid gap-3 px-1" style={{ gridTemplateColumns: '72px 1fr 32px' }}>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Image</p>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Name</p>
                        <span />
                      </div>
                      {(((profile as Record<string, TechItem[]>)['tech_stack']) || []).map((tech: TechItem, i: number) => {
                        const updateTech = (patch: Partial<TechItem>) => {
                          const u = [...(((profile as Record<string, TechItem[]>)['tech_stack']) || [])]
                          u[i] = { ...u[i], ...patch }
                          setProfile(prev => ({ ...prev, tech_stack: u }))
                        }
                        return (
                          <div key={i} className="group grid items-center gap-3 rounded-xl p-3" style={{ gridTemplateColumns: '72px 1fr 32px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            {/* Image upload cell */}
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                id={`tech-icon-${i}`}
                                className="sr-only"
                                onChange={e => uploadTechIcon(e, i)}
                              />
                              <label
                                htmlFor={`tech-icon-${i}`}
                                className="cursor-pointer w-[72px] h-[72px] rounded-xl flex items-center justify-center overflow-hidden relative transition-all"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)' }}
                              >
                                {uploadingTechIdx === i ? (
                                  <div className="w-5 h-5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                                ) : isTechImageUrl(tech.icon) ? (
                                  <>
                                    <img src={tech.icon} alt="" className="w-full h-full object-contain p-2" />
                                    <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                      <span className="text-[10px] text-white font-medium">Replace</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    <span className="text-[10px] font-medium">Upload</span>
                                  </div>
                                )}
                              </label>
                            </div>
                            {/* Name input */}
                            <input type="text" value={tech.name}
                              onChange={e => updateTech({ name: e.target.value })}
                              placeholder="e.g. React"
                              className={inp} />
                            {/* Delete */}
                            <button type="button"
                              onClick={() => setProfile(prev => ({ ...prev, tech_stack: (((prev as Record<string, TechItem[]>)['tech_stack']) || []).filter((_: TechItem, idx: number) => idx !== i) }))}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </section>

              {/* Social links card */}
              <section className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    <h2 className="text-sm font-semibold text-white">Social Links</h2>
                    <span className="text-xs text-gray-600 ml-1">({(profile.social_links || []).length})</span>
                  </div>
                  <button type="button" onClick={() => setProfile(prev => ({ ...prev, social_links: [...(prev.social_links || []), { platform: '', url: '' }] }))}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-500/60 rounded-lg px-3 py-1.5 transition-all">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Link
                  </button>
                </div>
                <div className="p-6">
                  {(profile.social_links || []).length === 0 ? (
                    <div className="text-center py-8 rounded-xl" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
                      <svg className="w-8 h-8 text-gray-700 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      <p className="text-sm text-gray-600">No social links yet</p>
                      <p className="text-xs text-gray-700 mt-1">Click &quot;Add Link&quot; to add GitHub, LinkedIn, etc.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Column headers */}
                      <div className="grid gap-3 px-1" style={{ gridTemplateColumns: '1fr 1fr 72px' }}>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Name / Platform</p>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Link / URL</p>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Icon</p>
                      </div>
                      {(profile.social_links || []).map((link: SocialLink, i: number) => {
                        const domain = (() => { try { return new URL(link.url).hostname } catch { return '' } })()
                        const faviconSrc = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : ''
                        const updateLink = (patch: Partial<SocialLink>) => {
                          const u = [...(profile.social_links || [])]
                          u[i] = { ...u[i], ...patch }
                          setProfile(prev => ({ ...prev, social_links: u }))
                        }
                        return (
                          <div key={i} className="group rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="grid gap-3 items-center" style={{ gridTemplateColumns: '1fr 1fr 72px auto' }}>
                              {/* Name */}
                              <input type="text" value={link.platform}
                                onChange={e => updateLink({ platform: e.target.value })}
                                placeholder="e.g. GitHub" className={inp} />
                              {/* URL */}
                              <input type="url" value={link.url}
                                onChange={e => updateLink({ url: e.target.value })}
                                placeholder="https://..." className={inp} />
                              {/* Icon / favicon */}
                              <div className="relative">
                                <input type="text" value={link.icon || ''}
                                  onChange={e => updateLink({ icon: e.target.value })}
                                  placeholder="😀"
                                  className={inp + ' pl-8 text-center'}
                                  style={{ paddingLeft: '2rem' }}
                                  title="Paste an emoji or leave empty to auto-use favicon"
                                />
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center pointer-events-none">
                                  {link.icon ? (
                                    <span className="text-base leading-none">{link.icon}</span>
                                  ) : faviconSrc ? (
                                    <img src={faviconSrc} alt="" className="w-4 h-4 rounded-sm" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                  ) : (
                                    <span className="text-xs font-bold text-purple-400">{link.platform?.charAt(0)?.toUpperCase() || '#'}</span>
                                  )}
                                </div>
                              </div>
                              {/* Delete */}
                              <button type="button"
                                onClick={() => setProfile(prev => ({ ...prev, social_links: (prev.social_links || []).filter((_, idx) => idx !== i) }))}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* ── PROJECTS TAB ── */}
          {tab === 'projects' && (
            <div className="max-w-4xl mx-auto space-y-4">

              {/* Slide-in form panel */}
              {editingProject && (
                <div className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(124,58,237,0.3)' }}>
                  <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.08)' }}>
                    <h3 className="text-sm font-semibold text-white">{editingProject.id ? 'Edit Project' : 'New Project'}</h3>
                    <button onClick={() => setEditingProject(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className={lbl}>Project Title *</label>
                        <input type="text" value={editingProject.title || ''} onChange={e => setEditingProject(p => ({ ...p, title: e.target.value }))} placeholder="e.g. E-Commerce Platform" className={inp} />
                      </div>
                      {([['image_url', 'Thumbnail URL', 'url', 'https://...'], ['live_url', 'Live Demo URL', 'url', 'https://...'], ['github_url', 'GitHub Repository URL', 'url', 'https://github.com/...'], ['order_index', 'Display Order', 'number', '0']] as [string,string,string,string][]).map(([f, l, t, ph]) => (
                        <div key={f}>
                          <label className={lbl}>{l}</label>
                          <input type={t} value={(editingProject as Record<string, string | number>)[f] || ''} onChange={e => setEditingProject(p => ({ ...p, [f]: t === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))} placeholder={ph} className={inp} />
                        </div>
                      ))}
                      <div>
                        <label className={lbl}>Tags <span className="text-gray-600 normal-case">(comma separated)</span></label>
                        <input type="text" value={editingProject.tags?.join(', ') || ''} onChange={e => setEditingProject(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} placeholder="React, TypeScript, Supabase" className={inp} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Short Description *</label>
                      <textarea rows={2} value={editingProject.description || ''} onChange={e => setEditingProject(p => ({ ...p, description: e.target.value }))} placeholder="Brief description shown on the project card…" className={inp + ' resize-none'} />
                    </div>
                    <div>
                      <label className={lbl}>Full Description</label>
                      <textarea rows={4} value={editingProject.long_description || ''} onChange={e => setEditingProject(p => ({ ...p, long_description: e.target.value }))} placeholder="Detailed description of the project…" className={inp + ' resize-none'} />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer w-fit">
                      <div className="relative">
                        <input type="checkbox" checked={editingProject.featured || false} onChange={e => setEditingProject(p => ({ ...p, featured: e.target.checked }))} className="sr-only" />
                        <div className={`w-10 h-5 rounded-full transition-colors ${editingProject.featured ? 'bg-purple-600' : 'bg-gray-700'}`}>
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${editingProject.featured ? 'translate-x-5' : ''}`} />
                        </div>
                      </div>
                      <span className="text-sm text-gray-300">Mark as featured project</span>
                    </label>
                    <div className="flex gap-3 pt-2 border-t border-white/5">
                      <button onClick={saveProject} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                        {saving ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />Saving…</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{editingProject.id ? 'Update' : 'Create'} Project</>}
                      </button>
                      <button onClick={() => setEditingProject(null)} className="px-5 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Project list */}
              {projects.length === 0 && !editingProject ? (
                <div className="text-center py-20 rounded-2xl" style={{ background: '#0d0d1a', border: '1px dashed rgba(255,255,255,0.08)' }}>
                  <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  <p className="text-gray-500 mb-1">No projects yet</p>
                  <p className="text-xs text-gray-700">Click &ldquo;New Project&rdquo; to add your first project</p>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {projects.map((project, idx) => (
                    <div key={project.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors ${idx !== 0 ? 'border-t border-white/5' : ''}`}>
                      {project.image_url ? (
                        <img src={project.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-white/10" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-xl" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>⚡</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-white truncate">{project.title}</p>
                          {project.featured && <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-2 py-0.5 flex-shrink-0">Featured</span>}
                        </div>
                        <p className="text-xs text-gray-500 truncate mb-1.5">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tags?.slice(0, 4).map(tag => (
                            <span key={tag} className="text-xs text-blue-400/70 bg-blue-500/5 border border-blue-500/10 rounded px-1.5 py-0.5">{tag}</span>
                          ))}
                          {(project.tags?.length || 0) > 4 && <span className="text-xs text-gray-600">+{(project.tags?.length || 0) - 4} more</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all" title="Open live site">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        )}
                        <button onClick={() => setEditingProject(project)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Edit
                        </button>
                        <button onClick={() => deleteProject(project.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-500/60 hover:text-red-400 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SKILLS TAB ── */}
          {tab === 'skills' && (
            <div className="max-w-4xl mx-auto space-y-4">

              {/* Skill form */}
              {editingSkill && (
                <div className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(124,58,237,0.3)' }}>
                  <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.08)' }}>
                    <h3 className="text-sm font-semibold text-white">{editingSkill.id ? 'Edit Skill' : 'New Skill'}</h3>
                    <button onClick={() => setEditingSkill(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={lbl}>Skill Name *</label>
                        <input type="text" value={editingSkill.name || ''} onChange={e => setEditingSkill(p => ({ ...p, name: e.target.value }))} placeholder="e.g. React" className={inp} autoFocus />
                      </div>
                      <div>
                        <label className={lbl}>Category</label>
                        <select value={editingSkill.category || 'Frontend'} onChange={e => setEditingSkill(p => ({ ...p, category: e.target.value }))} className={inp + ' appearance-none cursor-pointer'} style={{ background: '#0f0f1a' }}>
                          {['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={lbl}>Icon <span className="text-gray-600 normal-case">(emoji)</span></label>
                        <input type="text" value={editingSkill.icon || ''} onChange={e => setEditingSkill(p => ({ ...p, icon: e.target.value }))} placeholder="⚛️" className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Display Order</label>
                        <input type="number" value={editingSkill.order_index || 0} onChange={e => setEditingSkill(p => ({ ...p, order_index: parseInt(e.target.value) || 0 }))} className={inp} />
                      </div>
                    </div>
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <label className={lbl}>Proficiency Level</label>
                        <span className="text-sm font-bold text-purple-400">{editingSkill.level || 80}%</span>
                      </div>
                      <div className="relative">
                        <input type="range" min={10} max={100} value={editingSkill.level || 80} onChange={e => setEditingSkill(p => ({ ...p, level: parseInt(e.target.value) }))} className="w-full h-2 rounded-full appearance-none cursor-pointer accent-purple-500" style={{ background: `linear-gradient(to right, #7c3aed ${editingSkill.level || 80}%, #1f1f2e ${editingSkill.level || 80}%)` }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-700 mt-1">
                        <span>Beginner</span><span>Expert</span>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-white/5">
                      <button onClick={saveSkill} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                        {saving ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />Saving…</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{editingSkill.id ? 'Update' : 'Create'} Skill</>}
                      </button>
                      <button onClick={() => setEditingSkill(null)} className="px-5 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills grid */}
              {skills.length === 0 && !editingSkill ? (
                <div className="text-center py-20 rounded-2xl" style={{ background: '#0d0d1a', border: '1px dashed rgba(255,255,255,0.08)' }}>
                  <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  <p className="text-gray-500 mb-1">No skills yet</p>
                  <p className="text-xs text-gray-700">Click &ldquo;New Skill&rdquo; to add your first skill</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skills.map(skill => (
                    <div key={skill.id} className="group rounded-xl p-4 hover:border-white/10 transition-all" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          {skill.icon ? (
                            <span className="text-2xl">{skill.icon}</span>
                          ) : (
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>
                              {skill.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-white">{skill.name}</p>
                            <p className="text-xs text-gray-600">{skill.category}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-purple-400">{skill.level}%</span>
                      </div>
                      <div className="w-full h-1 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${skill.level}%`, background: 'linear-gradient(90deg,#7c3aed,#a78bfa)' }} />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingSkill(skill)} className="flex-1 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">Edit</button>
                        <button onClick={() => deleteSkill(skill.id)} className="flex-1 py-1.5 rounded-lg text-xs text-red-500/60 hover:text-red-400 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* ── EXPERIENCE TAB ── */}
          {tab === 'experience' && (
            <div className="max-w-4xl mx-auto space-y-4">

              {/* Experience form */}
              {editingExp && (
                <div className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(124,58,237,0.3)' }}>
                  <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.08)' }}>
                    <h3 className="text-sm font-semibold text-white">{editingExp.id ? 'Edit Entry' : 'New Entry'}</h3>
                    <button onClick={() => setEditingExp(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Type toggle */}
                    <div>
                      <label className={lbl}>Type</label>
                      <div className="flex gap-2">
                        {(['work', 'education'] as const).map(t => (
                          <button key={t} type="button"
                            onClick={() => setEditingExp(p => ({ ...p, type: t }))}
                            className="px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize"
                            style={editingExp.type === t
                              ? { background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.5)', color: '#c4b5fd' }
                              : { background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                            {t === 'work' ? '💼 Work' : '🎓 Education'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className={lbl}>{editingExp.type === 'work' ? 'Job Title' : 'Degree / Program'} *</label>
                        <input type="text" value={editingExp.title || ''} onChange={e => setEditingExp(p => ({ ...p, title: e.target.value }))} placeholder={editingExp.type === 'work' ? 'e.g. Frontend Developer' : 'e.g. BS Computer Science'} className={inp} autoFocus />
                      </div>
                      <div>
                        <label className={lbl}>{editingExp.type === 'work' ? 'Company' : 'School / University'}</label>
                        <input type="text" value={editingExp.organization || ''} onChange={e => setEditingExp(p => ({ ...p, organization: e.target.value }))} placeholder={editingExp.type === 'work' ? 'e.g. Acme Corp' : 'e.g. University of Santo Tomas'} className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Period</label>
                        <input type="text" value={editingExp.period || ''} onChange={e => setEditingExp(p => ({ ...p, period: e.target.value }))} placeholder="e.g. 2022 – Present" className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Display Order</label>
                        <input type="number" value={editingExp.order_index || 0} onChange={e => setEditingExp(p => ({ ...p, order_index: parseInt(e.target.value) || 0 }))} className={inp} />
                      </div>
                      {editingExp.type === 'work' && (
                        <div>
                          <label className={lbl}>Tags <span className="text-gray-600 normal-case">(comma separated)</span></label>
                          <input type="text" value={editingExp.tags?.join(', ') || ''} onChange={e => setEditingExp(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} placeholder="React, TypeScript, Node.js" className={inp} />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={lbl}>Description</label>
                      <textarea rows={3} value={editingExp.description || ''} onChange={e => setEditingExp(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of your role and responsibilities…" className={inp + ' resize-none'} />
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-white/5">
                      <button onClick={saveExp} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-all" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                        {saving ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />Saving…</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{editingExp.id ? 'Update' : 'Create'} Entry</>}
                      </button>
                      <button onClick={() => setEditingExp(null)} className="px-5 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Experience list */}
              {experience.length === 0 && !editingExp ? (
                <div className="text-center py-20 rounded-2xl" style={{ background: '#0d0d1a', border: '1px dashed rgba(255,255,255,0.08)' }}>
                  <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <p className="text-gray-500 mb-1">No entries yet</p>
                  <p className="text-xs text-gray-700">Click &ldquo;New Entry&rdquo; to add work or education</p>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {experience
                    .slice()
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((item, idx) => (
                    <div key={item.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors ${idx !== 0 ? 'border-t border-white/5' : ''}`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                        style={{ background: item.type === 'work' ? 'rgba(74,222,128,0.12)' : 'rgba(96,165,250,0.12)', border: `1px solid ${item.type === 'work' ? 'rgba(74,222,128,0.2)' : 'rgba(96,165,250,0.2)'}` }}>
                        {item.type === 'work' ? '💼' : '🎓'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          <span className="text-[10px] font-mono rounded px-1.5 py-0.5"
                            style={item.type === 'work'
                              ? { background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }
                              : { background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
                            {item.period}
                          </span>
                        </div>
                        <p className="text-xs mb-1" style={{ color: item.type === 'work' ? '#2dd4bf' : '#93c5fd' }}>{item.organization}</p>
                        {item.description && <p className="text-xs text-gray-500 truncate mb-1.5">{item.description}</p>}
                        {item.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 4).map(tag => (
                              <span key={tag} className="text-xs text-blue-400/70 bg-blue-500/5 border border-blue-500/10 rounded px-1.5 py-0.5">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setEditingExp(item)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Edit
                        </button>
                        <button onClick={() => deleteExp(item.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-500/60 hover:text-red-400 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* ── CONTACT TAB ── */}
          {tab === 'contact' && (
            <div className="max-w-3xl mx-auto space-y-6">

              {/* Form Fields */}
              <section className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" /></svg>
                    <h2 className="text-sm font-semibold text-white">Form Fields</h2>
                    <span className="text-xs text-gray-600 ml-1">({contactConfig.fields.length})</span>
                  </div>
                  <button onClick={() => setAddingField(v => !v)}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-500/60 rounded-lg px-3 py-1.5 transition-all">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Field
                  </button>
                </div>

                {/* Add field form */}
                {addingField && (
                  <div className="px-6 py-4 border-b border-white/5" style={{ background: 'rgba(124,58,237,0.06)' }}>
                    <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">New Field</p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className={lbl}>Key <span className="text-gray-600 normal-case">(unique, no spaces)</span></label>
                        <input type="text" value={newField.key || ''} onChange={e => setNewField(p => ({ ...p, key: e.target.value.replace(/\s/g, '_') }))} placeholder="e.g. phone_number" className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Label</label>
                        <input type="text" value={newField.label || ''} onChange={e => setNewField(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Phone Number" className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Type</label>
                        <select value={newField.type || 'text'} onChange={e => setNewField(p => ({ ...p, type: e.target.value as ContactFieldType }))} className={inp + ' appearance-none cursor-pointer'} style={{ background: '#0f0f1a' }}>
                          {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={lbl}>Placeholder</label>
                        <input type="text" value={newField.placeholder || ''} onChange={e => setNewField(p => ({ ...p, placeholder: e.target.value }))} placeholder="e.g. +1 555 000 0000" className={inp} />
                      </div>
                      {newField.type === 'select' && (
                        <div className="sm:col-span-2">
                          <label className={lbl}>Options <span className="text-gray-600 normal-case">(comma separated)</span></label>
                          <input type="text" value={newField.options?.join(', ') || ''} onChange={e => setNewField(p => ({ ...p, options: e.target.value.split(',').map(o => o.trim()).filter(Boolean) }))} placeholder="Option 1, Option 2, Option 3" className={inp} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={newField.required ?? false} onChange={e => setNewField(p => ({ ...p, required: e.target.checked }))} className="w-3.5 h-3.5 accent-purple-500" />
                        <span className="text-xs text-gray-400">Required</span>
                      </label>
                      <div className="flex gap-2 ml-auto">
                        <button onClick={() => { setAddingField(false); setNewField({ type: 'text', required: false, enabled: true }) }} className="px-4 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                        <button onClick={addContactField} className="px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-all" style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>Add Field</button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-3">
                  {contactConfig.fields.length === 0 ? (
                    <div className="text-center py-8 rounded-xl" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
                      <p className="text-sm text-gray-600">No fields yet. Click &quot;Add Field&quot; to start.</p>
                    </div>
                  ) : contactConfig.fields.map((field, idx) => (
                    <div key={field.key} className="group rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${field.enabled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'}`, opacity: field.enabled ? 1 : 0.5 }}>
                      <div className="flex items-start gap-3">
                        {/* Toggle */}
                        <button type="button" onClick={() => updateContactField(idx, { enabled: !field.enabled })}
                          className={`relative mt-0.5 w-8 h-4 rounded-full flex-shrink-0 transition-colors ${field.enabled ? 'bg-purple-600' : 'bg-gray-700'}`}>
                          <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${field.enabled ? 'translate-x-4' : ''}`} />
                        </button>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded px-1.5 py-0.5">{field.key}</span>
                            <span className="text-[10px] text-gray-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">{FIELD_TYPES.find(t => t.value === field.type)?.label || field.type}</span>
                            {field.required && <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5">Required</span>}
                          </div>

                          <div className="grid sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Label</label>
                              <input type="text" value={field.label} onChange={e => updateContactField(idx, { label: e.target.value })} className={inp} />
                            </div>
                            <div>
                              <label className="block text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Placeholder</label>
                              <input type="text" value={field.placeholder || ''} onChange={e => updateContactField(idx, { placeholder: e.target.value })} className={inp} />
                            </div>
                            {field.type === 'select' && (
                              <div className="sm:col-span-2">
                                <label className="block text-[9px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Options <span className="normal-case text-gray-700">(comma separated)</span></label>
                                <input type="text" value={field.options?.join(', ') || ''} onChange={e => updateContactField(idx, { options: e.target.value.split(',').map(o => o.trim()).filter(Boolean) })} className={inp} placeholder="Option 1, Option 2" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={field.required} onChange={e => updateContactField(idx, { required: e.target.checked })} className="w-3 h-3 accent-purple-500" />
                              <span className="text-xs text-gray-500">Required</span>
                            </label>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button onClick={() => moveContactField(idx, -1)} disabled={idx === 0}
                            className="w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:text-gray-300 hover:bg-white/5 disabled:opacity-30 transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                          </button>
                          <button onClick={() => moveContactField(idx, 1)} disabled={idx === contactConfig.fields.length - 1}
                            className="w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:text-gray-300 hover:bg-white/5 disabled:opacity-30 transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                          <button onClick={() => deleteContactField(idx)}
                            className="w-7 h-7 flex items-center justify-center rounded text-gray-700 hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Email Notifications */}
              <section className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  <h2 className="text-sm font-semibold text-white">Email Notifications</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className={lbl}>Notification Email</label>
                    <input type="email" value={contactConfig.notification_email || ''} onChange={e => setContactConfig(prev => ({ ...prev, notification_email: e.target.value }))} placeholder="you@yourdomain.com" className={inp} />
                    <p className="text-xs text-gray-600 mt-1.5">Receive an email with form details every time someone submits. Requires SMTP credentials in your <code className="text-purple-400 font-mono">.env.local</code>.</p>
                  </div>
                  <div className="rounded-lg px-4 py-3 text-xs text-gray-500 space-y-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="font-semibold text-gray-400">SMTP setup (.env.local)</p>
                    <p><code className="text-purple-400">SMTP_HOST</code> — e.g. <span className="text-gray-400">smtp.gmail.com</span></p>
                    <p><code className="text-purple-400">SMTP_PORT</code> — e.g. <span className="text-gray-400">587</span> (default)</p>
                    <p><code className="text-purple-400">SMTP_USER</code> — your email address</p>
                    <p><code className="text-purple-400">SMTP_PASS</code> — your password or app password</p>
                    <p><code className="text-purple-400">SMTP_SECURE</code> — <span className="text-gray-400">true</span> for port 465, omit otherwise</p>
                    <p><code className="text-purple-400">EMAIL_FROM</code> — sender address (defaults to SMTP_USER)</p>
                  </div>
                </div>
              </section>

              {/* Auto-Reply */}
              <section className="rounded-2xl overflow-hidden" style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                    <h2 className="text-sm font-semibold text-white">Auto-Reply</h2>
                  </div>
                  <button type="button" onClick={() => setContactConfig(prev => ({ ...prev, auto_reply_enabled: !prev.auto_reply_enabled }))}
                    className={`relative w-10 h-5 rounded-full transition-colors ${contactConfig.auto_reply_enabled ? 'bg-purple-600' : 'bg-gray-700'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${contactConfig.auto_reply_enabled ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                <div className={`p-6 space-y-4 ${contactConfig.auto_reply_enabled ? '' : 'opacity-50 pointer-events-none'}`}>
                  <p className="text-xs text-gray-500">Automatically send a reply to the submitter&apos;s email. Use <code className="text-purple-400 font-mono">{'{{name}}'}</code>, <code className="text-purple-400 font-mono">{'{{email}}'}</code>, or any field key as template variables.</p>
                  <div>
                    <label className={lbl}>Subject</label>
                    <input type="text" value={contactConfig.auto_reply_subject || ''} onChange={e => setContactConfig(prev => ({ ...prev, auto_reply_subject: e.target.value }))} placeholder="Thanks for reaching out, {{name}}!" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Message Body</label>
                    <textarea rows={7} value={contactConfig.auto_reply_body || ''} onChange={e => setContactConfig(prev => ({ ...prev, auto_reply_body: e.target.value }))} placeholder="Hi {{name}},&#10;&#10;Thanks for reaching out!..." className={inp + ' resize-none'} />
                    <p className="text-xs text-gray-600 mt-1.5">Plain text. New lines become line breaks in the email.</p>
                  </div>
                  <div className="rounded-lg px-4 py-3 text-xs text-gray-500 space-y-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="font-semibold text-gray-400">Available variables</p>
                    {contactConfig.fields.filter(f => f.enabled).map(f => (
                      <span key={f.key} className="inline-block mr-2 mb-1 font-mono text-purple-400">{`{{${f.key}}}`}</span>
                    ))}
                  </div>
                </div>
              </section>

            </div>
          )}

        </main>
      </div>
    </div>
  )
}
