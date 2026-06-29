import Link from 'next/link'

const ideas = [
  {
    type: 'Annual',
    title: 'AAL 2026 Design Annual',
    href: '#',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
    featured: true,
  },
  {
    type: 'Publication',
    title: 'Pediatric Design for Improved Patient Experiences',
    href: '#',
    image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=600&q=80',
  },
  {
    type: 'Publication',
    title: 'AAL Forward 2025: The Evolution of' +
        ' Neuroinclusive Workplaces',
    href: '#',
    image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=600&q=80',
  },
  {
    type: 'Publication',
    title: 'Neuroinclusive Design Guide by AAL\'s Kay' +
        ' Sargent',
    href: '#',
    image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=600&q=80',
  },
  {
    type: 'AAL Voices',
    title: 'How do I conceive a new idea? | Aman Krishan',
    href: '#',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80',
  },
]

export default function IdeasSection() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-10 max-w-400 mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 border-b border-aal-border pb-6">
        <div>
          <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-2 font-medium">Insights</p>
          <h2 className="text-[28px] md:text-[36px] font-light text-[#1a1a1a]">Ideas</h2>
        </div>
        <Link
          href="/ideas"
          className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity hidden md:block"
        >
          See All Ideas
        </Link>
      </div>

      {/* Ideas grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Featured */}
        <div className="md:col-span-2">
          <Link href={ideas[0].href} className="block relative overflow-hidden group" style={{ aspectRatio: '16/9' }}>
            <img
              src={ideas[0].image}
              alt={ideas[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}>
              <div className="absolute bottom-0 left-0 p-8">
                <span className="text-[10px] tracking-[0.1em] uppercase text-white/70 font-medium">{ideas[0].type}</span>
                <h3 className="text-white text-[20px] md:text-[24px] font-light leading-snug mt-2 max-w-lg">
                  {ideas[0].title}
                </h3>
              </div>
            </div>
          </Link>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {ideas.slice(1).map((idea, i) => (
            <Link key={i} href={idea.href} className="flex gap-4 group">
              <div className="flex-shrink-0 w-20 h-20 overflow-hidden">
                <img
                  src={idea.image}
                  alt={idea.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] tracking-[0.1em] uppercase text-[#6b6b6b] font-medium">{idea.type}</span>
                <p className="text-[13px] text-[#1a1a1a] leading-snug mt-1 font-light group-hover:opacity-60 transition-opacity">
                  {idea.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 md:hidden">
        <Link href="/ideas" className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5">
          See All Ideas
        </Link>
      </div>
    </section>
  )
}
