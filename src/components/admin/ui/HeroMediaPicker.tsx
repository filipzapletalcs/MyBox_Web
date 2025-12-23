'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MediaPickerModal } from './MediaPickerModal'
import {
  Image as ImageIcon,
  Video,
  X,
  ImagePlus,
  Play,
  ExternalLink,
  FolderOpen,
  Link2,
} from 'lucide-react'

interface HeroMediaPickerProps {
  imageValue?: string | null
  videoValue?: string | null
  onImageChange: (url: string | null) => void
  onVideoChange: (url: string | null) => void
  bucket?: 'article-images' | 'product-images' | 'media'
}

// Extract YouTube video ID from URL
function getYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Extract Vimeo video ID from URL
function getVimeoId(url: string): string | null {
  const regex = /(?:vimeo\.com\/)(\d+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Get video thumbnail URL
function getVideoThumbnail(url: string): string | null {
  const youtubeId = getYouTubeId(url)
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  }
  return null
}

// Check if URL is a self-hosted video
function isSelfHostedVideo(url: string): boolean {
  return url.match(/\.(mp4|webm|mov|avi)$/i) !== null ||
    url.includes('/storage/') ||
    url.includes('supabase')
}

export function HeroMediaPicker({
  imageValue,
  videoValue,
  onImageChange,
  onVideoChange,
  bucket = 'product-images',
}: HeroMediaPickerProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false)
  const [videoUrlInput, setVideoUrlInput] = useState('')

  // Determine active mode based on what's set
  const hasVideo = !!videoValue
  const hasImage = !!imageValue

  const videoThumbnail = videoValue ? getVideoThumbnail(videoValue) : null
  const youtubeId = videoValue ? getYouTubeId(videoValue) : null
  const vimeoId = videoValue ? getVimeoId(videoValue) : null
  const isSelfHosted = videoValue ? isSelfHostedVideo(videoValue) : false

  const handleRemoveImage = () => {
    onImageChange(null)
  }

  const handleRemoveVideo = () => {
    onVideoChange(null)
  }

  const handleVideoUrlSubmit = () => {
    if (videoUrlInput.trim()) {
      onVideoChange(videoUrlInput.trim())
      setVideoUrlInput('')
      setShowVideoUrlInput(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
          hasVideo
            ? 'bg-purple-500/20 text-purple-400'
            : hasImage
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-gray-500/20 text-gray-400'
        }`}>
          {hasVideo ? (
            <>
              <Video className="h-3 w-3" />
              Video aktivní
            </>
          ) : hasImage ? (
            <>
              <ImageIcon className="h-3 w-3" />
              Obrázek aktivní
            </>
          ) : (
            <>
              <ImageIcon className="h-3 w-3" />
              Nic nenastaveno
            </>
          )}
        </div>
        {hasVideo && hasImage && (
          <span className="text-xs text-text-muted">
            (Video má přednost, obrázek je fallback)
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Video Section */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <Video className="h-4 w-4 text-purple-400" />
            Hero video
          </label>

          {videoValue ? (
            <div className="relative overflow-hidden rounded-xl border border-purple-500/30 bg-bg-tertiary">
              {/* Video Preview */}
              <div className="aspect-video relative bg-black">
                {isSelfHosted ? (
                  // Self-hosted video preview
                  <div className="relative h-full w-full group">
                    <video
                      src={videoValue}
                      className="h-full w-full object-contain"
                      muted
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause()
                        e.currentTarget.currentTime = 0
                      }}
                    />
                    {/* Play button overlay - hidden on hover when video plays */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:opacity-0 pointer-events-none">
                      <div className="rounded-full bg-purple-500/90 p-4 shadow-lg">
                        <Play className="h-8 w-8 text-white" fill="white" />
                      </div>
                    </div>
                  </div>
                ) : videoThumbnail ? (
                  // YouTube thumbnail
                  <>
                    <img
                      src={videoThumbnail}
                      alt="Video thumbnail"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="rounded-full bg-purple-500/90 p-4 shadow-lg">
                        <Play className="h-8 w-8 text-white" fill="white" />
                      </div>
                    </div>
                  </>
                ) : (
                  // Generic video placeholder
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <Video className="mx-auto h-12 w-12 text-purple-400" />
                      <p className="mt-2 text-sm text-text-muted">Video</p>
                    </div>
                  </div>
                )}

                {/* Platform badge */}
                <div className="absolute top-2 left-2">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                    isSelfHosted
                      ? 'bg-green-600 text-white'
                      : youtubeId
                        ? 'bg-red-600 text-white'
                        : vimeoId
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-600 text-white'
                  }`}>
                    {isSelfHosted ? 'Storage' : youtubeId ? 'YouTube' : vimeoId ? 'Vimeo' : 'External'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-border-subtle p-3">
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-xs text-text-muted truncate" title={videoValue}>
                    {videoValue.length > 50 ? videoValue.slice(0, 50) + '...' : videoValue}
                  </p>
                  {!isSelfHosted && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(videoValue, '_blank')}
                      title="Otevřít video"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveVideo}
                    className="text-red-400 hover:text-red-300"
                    title="Odebrat video"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : showVideoUrlInput ? (
            // URL input mode
            <div className="space-y-3 rounded-xl border border-purple-500/30 bg-bg-tertiary p-4">
              <Input
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="https://youtube.com/watch?v=... nebo https://vimeo.com/..."
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleVideoUrlSubmit}
                  disabled={!videoUrlInput.trim()}
                >
                  Použít URL
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowVideoUrlInput(false)
                    setVideoUrlInput('')
                  }}
                >
                  Zrušit
                </Button>
              </div>
              <p className="text-xs text-text-muted">
                Podporujeme YouTube, Vimeo a přímé URL
              </p>
            </div>
          ) : (
            // Empty state - options to select video
            <div className="rounded-xl border-2 border-dashed border-purple-500/30 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-purple-500/10 p-3">
                  <Video className="h-6 w-6 text-purple-400" />
                </div>
                <p className="mt-3 text-sm font-medium text-text-primary">
                  Přidat video
                </p>
                <p className="mt-1 text-xs text-text-muted mb-4">
                  Video má přednost před obrázkem
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsVideoModalOpen(true)}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Ze storage
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowVideoUrlInput(true)}
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    YouTube/Vimeo
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Section */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <ImageIcon className="h-4 w-4 text-blue-400" />
            Hero obrázek
            {hasVideo && (
              <span className="text-xs font-normal text-text-muted">(fallback)</span>
            )}
          </label>

          {imageValue ? (
            <div className={`group relative overflow-hidden rounded-xl border ${
              hasVideo ? 'border-border-subtle opacity-60' : 'border-blue-500/30'
            }`}>
              <div className="aspect-video bg-bg-tertiary">
                <img
                  src={imageValue}
                  alt="Hero obrázek"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              {/* Overlay actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Změnit
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="mr-2 h-4 w-4" />
                  Odebrat
                </Button>
              </div>

              {hasVideo && (
                <div className="absolute top-2 right-2">
                  <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                    Fallback
                  </span>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className={`w-full rounded-xl border-2 border-dashed p-6 transition-colors ${
                hasVideo
                  ? 'border-border-subtle hover:border-border-default'
                  : 'border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/5'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <ImageIcon className="h-6 w-6 text-blue-400" />
                </div>
                <p className="mt-3 text-sm font-medium text-text-primary">
                  Vybrat obrázek
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {hasVideo
                    ? 'Volitelný fallback obrázek'
                    : 'Klikněte pro výběr z knihovny'}
                </p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-text-muted">
        Pokud je nastaveno video i obrázek, zobrazí se video. Obrázek slouží jako fallback.
      </p>

      {/* Image Modal */}
      <MediaPickerModal
        open={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelect={(url) => {
          onImageChange(url)
          setIsImageModalOpen(false)
        }}
        bucket="media"
        uploadBucket={bucket}
        title="Vybrat hero obrázek"
        mediaType="image"
      />

      {/* Video Modal */}
      <MediaPickerModal
        open={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSelect={(url) => {
          onVideoChange(url)
          setIsVideoModalOpen(false)
        }}
        bucket="media"
        uploadBucket={bucket}
        title="Vybrat hero video"
        mediaType="video"
      />
    </div>
  )
}
