import Link from 'next/link'

export default function CareersSection() {
    return (
        <section className="py-12 md:py-16 px-6 md:px-10 max-w-[1600px] mx-auto">
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
                    <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-3 font-medium">Join Us</p>
                    <h2 className="text-[26px] md:text-[34px] font-light text-[#1a1a1a] leading-tight mb-4">
                        Careers at AAL
                    </h2>
                    <p className="text-[14px] md:text-[15px] text-[#6b6b6b] leading-relaxed mb-6 font-light">
                        We&apos;re excited about the future. Join our team and design it with us. AAL designs buildings and spaces that inspire people. We&apos;re a diverse team of innovative, entrepreneurial people with an ambitious vision: to create the world&apos;s best, most sustainable places.
                    </p>
                    <Link
                        href="/people/careers"
                        className="inline-block text-[11px] tracking-[0.12em] uppercase text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1 hover:opacity-60 transition-opacity"
                    >
                        Explore Opportunities
                    </Link>
                </div>
            </div>
        </section>
    )
}

// import Link from 'next/link'
//
// export default function CareersSection() {
//   return (
//     <section className="py-20 md:py-28 px-6 md:px-10 max-w-[1600px] mx-auto">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
//         {/* Image */}
//         <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
//           <img
//             src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80"
//             alt="AAL
//  Careers"
//             className="w-full h-full object-cover"
//             loading="lazy"
//           />
//           <div
//             className="absolute inset-0"
//             style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)' }}
//           />
//         </div>
//
//         {/* Content */}
//         <div>
//           <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-4 font-medium">Join Us</p>
//           <h2 className="text-[28px] md:text-[38px] font-light text-[#1a1a1a] leading-tight mb-6">
//             Careers at AAL
//
//           </h2>
//           <p className="text-[15px] md:text-[16px] text-[#6b6b6b] leading-relaxed mb-8 font-light">
//             We&apos;re excited about the future. Join our team and design it with us. AAL
//  designs buildings and spaces that inspire people. We&apos;re a diverse team of innovative, entrepreneurial people with an ambitious vision: to create the world&apos;s best, most sustainable places.
//           </p>
//           <Link
//             href="/people/careers"
//             className="inline-block text-[12px] tracking-[0.12em] uppercase text-[#1a1a1a] border-b-2 border-[#1a1a1a] pb-1 hover:opacity-60 transition-opacity"
//           >
//             Explore Opportunities
//           </Link>
//         </div>
//       </div>
//     </section>
//   )
// }
