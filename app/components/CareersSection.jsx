import Link from 'next/link'

export default function CareersSection() {
    return (
        <section className="py-12 md:py-16 px-6 md:px-10 max-w-400 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                        src="/8.jpg"
                        alt="AAL Careers"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)' }}
                    />
                </div>

                {/* Content */}
                <div>
                    <p className="text-[11px] tracking-[0.14em] uppercase text-aal-gray mb-3 font-medium">Join Us</p>
                    <h2 className="text-[26px] md:text-[34px] font-light text-aal-black leading-tight mb-4">
                        Careers at Artemis Atelier Ltd
                    </h2>
                    <p className="text-[14px] md:text-[15px] text-aal-gray leading-relaxed mb-6 font-light">
                        We&apos;re excited about the future. Join our team and design it with us. Artemis Atelier Ltd designs buildings and spaces that inspire people. We&apos;re a diverse team of innovative, entrepreneurial people with an ambitious vision: to create the world&apos;s best, most sustainable places.
                    </p>
                    {/* <Link
                        href="/people/careers"
                        className="inline-block text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1 hover:opacity-60 transition-opacity"
                    >
                        Explore Opportunities
                    </Link> */}
                </div>
            </div>
        </section>
    )
}
