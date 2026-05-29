import Link from 'next/link'

export default function CultureSection() {
  return (
    <section className="py-20 md:py-28 bg-[#1a1a1a]">
      <div className="px-6 md:px-10 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Content */}
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-4 font-medium">Our Team</p>
            <h2 className="text-[28px] md:text-[38px] font-light text-white leading-tight mb-6">
              Culture
            </h2>
            <p className="text-[15px] md:text-[16px] text-[#aaa] leading-relaxed mb-8 font-light">
              We think the warm, friendly culture in our studios—each with its own local vibe—is pretty special. We&apos;re a highly collaborative group of people who enjoy working together and are generous about sharing our knowledge, research and innovations.
            </p>
            <Link
              href="/people/culture"
              className="inline-block text-[12px] tracking-[0.12em] uppercase text-white border-b border-white pb-1 hover:opacity-60 transition-opacity"
            >
              Learn More About Culture
            </Link>
          </div>

          {/* Image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80"
              alt="AAL Culture"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
