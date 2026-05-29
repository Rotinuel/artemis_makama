'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

export default function HeroVideo() {
    const [muted, setMuted] = useState(true)
    const videoRef = useRef(null)

    return (
        <section style={{ position: 'relative', width: '100%', height: '100vh', minHeight: 500, background: '#111', overflow: 'hidden' }}>

            {/* Video background */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted={muted}
                playsInline
                poster="https://www.hok.com/wp-content/uploads/2022/10/013-Boston-Consulting-Group-1900x1270-2.jpg"
                style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    minWidth: '100%', minHeight: '100%',
                    objectFit: 'cover',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <source
                    src="https://player.vimeo.com/progressive_redirect/playback/1094473397/rendition/720p/file.mp4?loc=external&signature=a788475d7c8817c4492e0866b19df3c369bcf8c1ac562295aa6d82aa5387229d"
                    type="video/mp4"
                />
            </video>

            {/* Gradient overlay */}
            <div
                style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.50) 100%)',
                }}
            />

            {/* Bottom content */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    padding: '0 40px 40px',
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                    zIndex: 5,
                }}
            >
                <div>
                    <p style={{ color: 'white', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10, opacity: 0.8, fontFamily: 'sans-serif' }}>
                        Featured Project
                    </p>
                    <h2 style={{ color: 'white', fontSize: 'clamp(16px, 2vw, 22px)', fontWeight: 300, lineHeight: 1.45, maxWidth: 420, fontFamily: "'Helvetica Neue', Helvetica, sans-serif", margin: 0 }}>
                        AAL designs buildings and spaces that respond to the needs of people and the environment
                    </h2>
                    <Link
                        href="#"
                        style={{ display: 'inline-block', marginTop: 18, color: 'white', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.7)', paddingBottom: 3, textDecoration: 'none' }}
                    >
                        Explore Our Work
                    </Link>
                </div>

                {/* Mute toggle */}
                <button
                    onClick={() => {
                        setMuted(m => !m)
                        if (videoRef.current) videoRef.current.muted = !muted
                    }}
                    aria-label={muted ? 'Unmute' : 'Mute'}
                    style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: 0.7, flexShrink: 0 }}
                >
                    {muted ? <MutedIcon /> : <UnmutedIcon />}
                </button>
            </div>

            {/* Scroll indicator */}
            <div
                style={{
                    position: 'absolute', bottom: 36, left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    opacity: 0.5,
                }}
                className="scroll-indicator"
            >
                <div style={{ width: 1, height: 48, background: 'white', animation: 'scrollDown 2s infinite' }} />
            </div>

            <style>{`
        @keyframes scrollDown {
          0%   { transform: scaleY(0); transform-origin: top; }
          49%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @media (max-width: 768px) {
          .scroll-indicator { display: none !important; }
        }
      `}</style>
        </section>
    )
}

function MutedIcon() {
    return (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
    )
}

function UnmutedIcon() {
    return (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
    )
}

// 'use client'
//
// import { useState, useRef } from 'react'
// import Link from 'next/link'
//
// export default function HeroVideo() {
//   const [muted, setMuted] = useState(true)
//   const videoRef = useRef(null)
//
//   return (
//     <section className="relative w-full" style={{ height: '100vh', minHeight: 500 }}>
//       {/* Video background */}
//       <div className="absolute inset-0 bg-[#111] overflow-hidden">
//         <video
//           ref={videoRef}
//           className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover"
//           style={{ transform: 'translate(-50%,-50%)' }}
//           autoPlay
//           loop
//           muted={muted}
//           playsInline
//           poster="https://www.hok.com/wp-content/uploads/2022/10/013-Boston-Consulting-Group-1900x1270-2.jpg"
//         >
//           <source
//             src="https://player.vimeo.com/progressive_redirect/playback/1094473397/rendition/720p/file.mp4?loc=external&signature=a788475d7c8817c4492e0866b19df3c369bcf8c1ac562295aa6d82aa5387229d"
//             type="video/mp4"
//           />
//         </video>
//         {/* Gradient overlay */}
//         <div
//           className="absolute inset-0"
//           style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%)' }}
//         />
//       </div>
//
//       {/* Bottom content */}
//       <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 flex items-end justify-between">
//         <div>
//           <p className="text-white text-[12px] tracking-[0.15em] uppercase mb-3 opacity-80">
//             Featured Project
//           </p>
//           <h2 className="text-white text-[20px] md:text-[28px] font-light leading-tight max-w-md">
//             AAL designs buildings and spaces that respond to the needs of people and the environment
//           </h2>
//           <Link
//             href="#"
//             className="inline-block mt-5 text-white text-[12px] tracking-[0.12em] uppercase border-b border-white pb-1 hover:opacity-70 transition-opacity"
//           >
//             Explore Our Work
//           </Link>
//         </div>
//
//         {/* Mute toggle */}
//         <button
//           onClick={() => {
//             setMuted(!muted)
//             if (videoRef.current) videoRef.current.muted = !muted
//           }}
//           className="flex-shrink-0 text-white opacity-70 hover:opacity-100 transition-opacity"
//           aria-label={muted ? 'Unmute' : 'Mute'}
//         >
//           {muted ? (
//             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//               <path d="M11 5L6 9H2v6h4l5 4V5z" />
//               <line x1="23" y1="9" x2="17" y2="15" />
//               <line x1="17" y1="9" x2="23" y2="15" />
//             </svg>
//           ) : (
//             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//               <path d="M11 5L6 9H2v6h4l5 4V5z" />
//               <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
//               <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
//             </svg>
//           )}
//         </button>
//       </div>
//
//       {/* Scroll indicator */}
//       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hidden md:flex">
//         <div className="w-px h-12 bg-white animate-pulse" style={{ animation: 'scrollDown 2s infinite' }} />
//       </div>
//
//       <style jsx>{`
//         @keyframes scrollDown {
//           0% { transform: scaleY(0); transform-origin: top; }
//           50% { transform: scaleY(1); transform-origin: top; }
//           51% { transform: scaleY(1); transform-origin: bottom; }
//           100% { transform: scaleY(0); transform-origin: bottom; }
//         }
//       `}</style>
//     </section>
//   )
// }
