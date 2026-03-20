'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Play } from 'lucide-react'

interface VideoTestimonialModalProps {
  isOpen: boolean
  onClose: () => void
  videoId: string
}

export function VideoTestimonialModal({ isOpen, onClose, videoId }: VideoTestimonialModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
          aria-label="Fechar vídeo"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Video container - 9:16 aspect ratio for Shorts */}
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '9/16' }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="Depoimento"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}

interface VideoThumbnailProps {
  videoId: string
  title?: string
  description?: string
}

export function VideoThumbnail({ videoId, title = "Depoimento Real", description = "Veja o que nossos membros estão dizendo" }: VideoThumbnailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 border-2 border-zinc-800 hover:border-cyan-500/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/20"
      >
        {/* Thumbnail from YouTube */}
        <div className="relative w-full h-full">
          <Image
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
            unoptimized
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500 group-hover:bg-cyan-400 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-cyan-500/50">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>

        {/* Text */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
          <p className="text-white font-semibold text-sm mb-1">{title}</p>
          <p className="text-zinc-300 text-xs">{description}</p>
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded">
          VÍDEO
        </div>
      </button>

      <VideoTestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoId={videoId}
      />
    </>
  )
}
