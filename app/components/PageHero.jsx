export default function PageHero({ label, title, description, image, dark = false }) {
  return (
    <div
      className="relative w-full flex items-end"
      style={{
        minHeight: 420,
        background: dark ? '#111' : '#f5f5f5',
        paddingTop: 64,
      }}
    >
      {image && (
        <>
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)' }}
          />
        </>
      )}
      <div className="relative z-10 px-6 md:px-10 pb-14 pt-20 max-w-400 mx-auto w-full">
        {label && (
          <p className={`text-[11px] tracking-[0.14em] uppercase font-medium mb-3 ${image ? 'text-white/70' : dark ? 'text-[#666]' : 'text-[#6b6b6b]'}`}>
            {label}
          </p>
        )}
        <h1 className={`text-[36px] md:text-[56px] lg:text-[68px] font-light leading-none mb-4 ${image ? 'text-white' : dark ? 'text-white' : 'text-[#1a1a1a]'}`}>
          {title}
        </h1>
        {description && (
          <p className={`text-[15px] md:text-[17px] font-light leading-relaxed max-w-2xl ${image ? 'text-white/80' : dark ? 'text-[#aaa]' : 'text-[#6b6b6b]'}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
