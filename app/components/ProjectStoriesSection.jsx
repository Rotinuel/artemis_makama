'use client'

import Link from 'next/link'
import { useState } from 'react'

const projects = [
  {
    category: 'Sports + Rec + Entertainment',
    title: "St. Louis CITY SC's Energizer Park",
    href: '#',
    image: '/26.jpg',
    color: '#2d4a7a',
  },
  {
    category: 'Corporate + Commercial',
    title: 'Honeywell Global Headquarters',
    href: '#',
    image: '/31.jpg',
    color: '#3a3a3a',
  },
  {
    category: 'Corporate + Commercial',
    title: 'BCG Headquarters',
    href: '#',
    image: '/32.jpg',
    color: '#1a3a2a',
  },
  {
    category: 'Civic + Justice',
    title: '10th and O Street State Office Building',
    href: '#',
    image: '/33.jpg',
    color: '#4a3a1a',
  },
  {
    category: 'Lifestyle',
    title: 'Msheireb Downtown Doha',
    href: '#',
    image: '/34.jpg',
    color: '#2a1a3a',
  },
  {
    category: 'Corporate + Commercial',
    title: 'Norfolk Southern Headquarters',
    href: '#',
    image: '/36.jpg',
    color: '#1a2a3a',
  },
  {
    category: 'Corporate + Commercial',
    title: 'LG North American Headquarters',
    href: '#',
    image: '/38.jpg',
    color: '#3a1a1a',
  },
  {
    category: 'Healthcare',
    title: 'NewYork-Presbyterian David H. Koch Center',
    href: '#',
    image: '/44.jpg',
    color: '#1a3a3a',
  },
]

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={project.href}
      className="block relative overflow-hidden group cursor-pointer"
      style={{ aspectRatio: '4/3' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out"
        style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        loading="lazy"
      />

      {/* Category pill */}
      <span
        className="absolute top-4 left-4 text-[10px] tracking-[0.1em] uppercase text-white bg-black/50 px-2.5 py-1 font-medium"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {project.category}
      </span>

      {/* Bottom overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)',
          opacity: hovered ? 1 : 0.7,
        }}
      >
        <h3 className="text-white text-[16px] md:text-[18px]  leading-snug">
          {project.title}
        </h3>
        <span className="inline-block mt-3 text-[11px] tracking-[0.1em] uppercase text-white/80 border-b border-white/50 pb-0.5 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          View Project
        </span>
      </div>
    </Link>
  )
}

export default function ProjectStoriesSection() {
  return (
    <section className="py-20 md:py-28 bg-[#f5f5f5]">
      <div className="px-6 md:px-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 border-b border-[#e0e0e0] pb-6">
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#6b6b6b] mb-2 font-medium">Portfolio</p>
            <h2 className="text-[28px] md:text-[36px]  text-[#1a1a1a]">Project Stories</h2>
          </div>
          <Link
            href="/projects/stories"
            className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:opacity-60 transition-opacity hidden md:block"
          >
            See All Projects
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link href="/projects/stories" className="text-[12px] tracking-[0.1em] uppercase text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5">
            See All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
