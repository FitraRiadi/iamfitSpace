import { useCallback, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { Modal, Btn, ErrorBox, TSlider } from './ui'

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function getCroppedDataUrl(imageSrc, pixels, size = 256) {
  const img = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, pixels.x, pixels.y, pixels.width, pixels.height, 0, 0, size, size)
  return canvas.toDataURL('image/jpeg', 0.85)
}

export default function AvatarCrop({ image, onCancel, onDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const pixelsRef = useRef(null)

  const onCropComplete = useCallback((_, pixels) => {
    pixelsRef.current = pixels
  }, [])

  const save = async () => {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      if (!pixelsRef.current) throw new Error('Adjust the crop first.')
      const url = await getCroppedDataUrl(image, pixelsRef.current)
      onDone(url)
    } catch {
      setError('Failed to crop image. Try another file.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open onClose={onCancel} title="CROP PROFILE PHOTO">
      <div className="flex flex-col gap-4">
        <div className="relative w-full h-72 bg-[#0e0e0e] border border-[#2a2a2a]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#a8b09a] uppercase">
          <span className="shrink-0">Zoom</span>
          <TSlider
            min={1}
            max={3}
            step={0.05}
            value={[zoom]}
            onValueChange={([z]) => setZoom(z)}
            className="flex-1"
          />
        </div>
        {error && <ErrorBox message={error} />}
        <div className="flex gap-2 justify-end">
              <Btn variant="secondary" onClick={onCancel}>
                CANCEL
              </Btn>
              <Btn onClick={save} disabled={busy}>
                {busy ? 'CROPPING...' : 'USE THIS PHOTO'}
              </Btn>
        </div>
      </div>
    </Modal>
  )
}
