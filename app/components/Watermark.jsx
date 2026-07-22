'use client'

import Image from 'next/image'

export default function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
    >
      <div className="watermark-mark relative h-[70vmin] w-[70vmin] opacity-[0.07] contrast-125">
        <Image
          src="/watermark.png"
          alt=""
          fill
          priority={false}
          className="object-contain"
        />
      </div>
    </div>
  )
}


// 'use client'

// import Image from 'next/image'

// export default function Watermark() {
//   return (
//     <div
//       aria-hidden="true"
//       className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
//     >
//       <div className="watermark-mark relative h-[70vmin] w-[70vmin] opacity-[0.035]">
//         <Image
//           src="/watermark.png"
//           alt=""
//           fill
//           priority={false}
//           className="object-contain"
//         />
//       </div>
//     </div>
//   )
// }