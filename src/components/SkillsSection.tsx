import { Skill } from '@/lib/types'

const categoryColors: Record<string, string> = {
  Frontend: 'from-blue-600 to-cyan-400',
  Backend: 'from-green-600 to-emerald-400',
  Database: 'from-orange-600 to-yellow-400',
  DevOps: 'from-purple-600 to-pink-400',
  Tools: 'from-gray-600 to-gray-400',
  Other: 'from-red-600 to-pink-400',
}

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = [...new Set(skills.map(s => s.category))]

  return (
    <section id="skills" className="py-24 px-4" style={{ background: 'rgba(124,58,237,0.03)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            My <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-gray-400">Technologies and tools I work with</p>
        </div>

        {skills.length === 0 ? (
          <p className="text-center text-gray-500">No skills added yet.</p>
        ) : (
          <div className="space-y-12">
            {categories.map(category => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${categoryColors[category] || categoryColors.Other}`}
                  />
                  {category}
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {skills.filter(s => s.category === category).map(skill => (
                    <div
                      key={skill.id}
                      className="p-4 rounded-xl"
                      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {skill.icon && <span className="text-xl">{skill.icon}</span>}
                          <span className="text-sm font-medium">{skill.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${categoryColors[category] || categoryColors.Other}`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
