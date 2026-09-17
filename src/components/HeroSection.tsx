import { Profile } from "@/lib/types";

export default function HeroSection({ profile }: { profile: Profile | null }) {
  const name = profile?.name || "Dave";
  const bio =
    profile?.bio ||
    "Specializing in developing responsive, scalable web systems using modern frameworks like Vue.js, Next.js, and Node/Express with custom headless CMS architectures.";
  const badge =
    profile?.location_badge || "Full Stack & Frontend Engineer based in PH";
  const tagline = profile?.hero_tagline || "resilient & dynamic";
  const techStack = profile?.tech_stack || [];

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Location badge */}
        <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 border border-[var(--border)] rounded-full px-4 py-1.5 mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          {badge}
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
          Hi, I&apos;m {name} — crafting{" "}
          <span className="gradient-text">{tagline}</span> web applications.
        </h1>

        {/* Bio */}
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {bio}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <a
            href="#projects"
            className="px-7 py-3 border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white rounded-lg font-medium transition-colors text-sm"
          >
            Explore Portfolio
          </a>
          {profile?.resume_url ? (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white rounded-lg font-medium transition-colors text-sm"
            >
              Download CV
            </a>
          ) : (
            <a
              href="#contact"
              className="px-7 py-3 border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white rounded-lg font-medium transition-colors text-sm"
            >
              Download CV
            </a>
          )}
        </div>

        {/* Tech stack — infinite marquee */}
        {techStack.length > 0 && (
          <div>
            <p className="section-label mb-5">Core Technology Stack</p>
            <div
              className="relative overflow-hidden"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              }}
            >
              <div className="marquee-track">
                {[...techStack, ...techStack].map((tech, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 border border-[var(--border)] rounded-full px-3 py-1.5 bg-[var(--card)] hover:border-[var(--accent)]/40 transition-colors mx-2 flex-shrink-0"
                  >
                    {tech.icon?.startsWith("http") || tech.icon?.startsWith("/") ? (
                      <img src={tech.icon} alt={tech.name} className="w-4 h-4 object-contain" />
                    ) : tech.icon ? (
                      <span className="text-sm leading-none">{tech.icon}</span>
                    ) : (
                      <span className="w-4 h-4 rounded bg-white/10 flex-shrink-0" />
                    )}
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
