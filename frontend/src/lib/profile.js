// Operator avatar: stored locally (dataURL) because the API has no media
// backend (Vercel serverless has no persistent disk). Per-browser storage.

import { useEffect, useState } from 'react'
import avatarDefault from '../assets/avatar.png'

const KEY = 'iamfit_avatar_v1'
export const AVATAR_EVENT = 'iamfit:avatar-changed'

export function getAvatar() {
  try {
    return localStorage.getItem(KEY) || avatarDefault
  } catch {
    return avatarDefault
  }
}

export function setAvatar(dataUrl) {
  try {
    localStorage.setItem(KEY, dataUrl)
  } catch {
    // quota full/blocked — keep in-memory only
  }
  window.dispatchEvent(new Event(AVATAR_EVENT))
}

export function clearAvatar() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(AVATAR_EVENT))
}

export function useAvatar() {
  const [src, setSrc] = useState(getAvatar())
  useEffect(() => {
    const onChange = () => setSrc(getAvatar())
    window.addEventListener(AVATAR_EVENT, onChange)
    return () => window.removeEventListener(AVATAR_EVENT, onChange)
  }, [])
  return src
}
