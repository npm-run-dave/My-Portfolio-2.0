export interface Project {
  id: string
  title: string
  description: string
  long_description: string | null
  image_url: string | null
  live_url: string | null
  github_url: string | null
  tags: string[]
  featured: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: number
  icon: string | null
  order_index: number
}

export interface SocialLink {
  platform: string
  url: string
  icon?: string
}

export interface Experience {
  id: string
  type: 'work' | 'education'
  title: string
  organization: string
  period: string
  description: string
  tags: string[]
  order_index: number
  created_at: string
}

export interface TechItem {
  name: string
  icon: string
}

export type ContactFieldType = 'text' | 'email' | 'tel' | 'number' | 'url' | 'textarea' | 'select'

export interface ContactField {
  key: string
  label: string
  type: ContactFieldType
  required: boolean
  enabled: boolean
  placeholder?: string
  options?: string[]
  order: number
}

export interface ContactFormConfig {
  fields: ContactField[]
  notification_email: string
  auto_reply_enabled: boolean
  auto_reply_subject: string
  auto_reply_body: string
}

export const DEFAULT_CONTACT_FORM_CONFIG: ContactFormConfig = {
  fields: [
    { key: 'name', label: 'Your Full Name', type: 'text', required: true, enabled: true, placeholder: 'John Doe', order: 0 },
    { key: 'email', label: 'Your Work Email', type: 'email', required: true, enabled: true, placeholder: 'john@company.com', order: 1 },
    { key: 'type', label: 'Project Type / Inquiry', type: 'select', required: false, enabled: true, placeholder: '', options: ['Full-Stack Application Development', 'Frontend / UI Development', 'CMS Integration & Setup', 'UI/UX Design & Prototyping', 'Branding & Visual Identity', 'SEO & Performance Audit', 'Other'], order: 2 },
    { key: 'brief', label: 'Project Brief & Details', type: 'textarea', required: true, enabled: true, placeholder: 'Tell me about your project, timeline, and budget...', order: 3 },
  ],
  notification_email: '',
  auto_reply_enabled: false,
  auto_reply_subject: 'Thanks for reaching out, {{name}}!',
  auto_reply_body: 'Hi {{name}},\n\nThank you for reaching out! I received your message and will get back to you within 24 hours.\n\nBest regards,\nDave',
}

export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar_url: string | null
  email: string | null
  resume_url: string | null
  social_links: SocialLink[]
  location_badge: string | null
  hero_tagline: string | null
  tech_stack: TechItem[] | null
  contact_form_config: ContactFormConfig | null
}
