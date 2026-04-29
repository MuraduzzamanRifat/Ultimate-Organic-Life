'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function PdpGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid sm:grid-cols-[72px_1fr] gap-3 sm:gap-4">
      <div className="flex sm:flex-col gap-2 order-2 sm:order-1 overflow-x-auto sm:overflow-visible">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            className={`flex-shrink-0 w-[72px] h-[90px] overflow-hidden bg-surface rounded-sm border-2 transition-colors ${
              active === i ? 'border-green' : 'border-transparent hover:border-green-soft'
            }`}
            aria-label={`Image ${i + 1}`}
          >
            <Image src={src} alt="" width={72} height={90} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      <figure className="order-1 sm:order-2 aspect-[4/5] bg-paper rounded-md overflow-hidden">
        <Image
          src={images[active]}
          alt={title}
          width={1200}
          height={1500}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full h-full object-cover"
        />
      </figure>
    </div>
  );
}
