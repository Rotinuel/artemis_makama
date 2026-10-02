import Link from 'next/link'
import Image from 'next/image'

export default function CareersSection() {
    return (
        <section className="py-12 md:py-16 px-6 md:px-10 max-w-400 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <Image src="/16.jpg" alt="Residential development designed by Artemis Atelier Ltd" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)' }}
                    />
                </div>

                {/* Content */}
                <div>
                    <p className="text-[11px] tracking-[0.14em] uppercase text-aal-gray mb-3 font-medium">Join Us</p>
                    <h2 className="text-[26px] md:text-[34px]  text-aal-black leading-tight mb-4">
                        Careers at Artemis Atelier Ltd
                    </h2>
                    <p className="text-[14px] md:text-[15px] text-aal-gray leading-relaxed mb-6 ">
                        We are a Lagos team of architects, engineers and builders who care about doing things properly. If you share that, we would like to hear from you.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1 hover:opacity-60 transition-opacity"
                    >
                        Get in touch
                    </Link>
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
