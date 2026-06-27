import { useRef, useEffect, useState, useCallback } from 'react'

const FOCUS_SEL = {
  CMS: '.cms-bg',
  ERA: '.era-bg',
  DCR: '.n-dcr',
  OMS: '.oms-bg',
  explore: '.diagram',
}

const FULL_BOUNDS = { left: 110, top: 190, right: 7425, bottom: 1140 }
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// Shows the swimlane diagram full-bleed.
// Lane slides stay focused. The final slide is pure Explorer mode: drag, zoom, fit all.
export default function DiagramStage({ focus, title, note, laneColor }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const overlayRef = useRef(null)
  const transformRef = useRef({ tx: 0, ty: 0, scale: 1 })
  const dragRef = useRef(null)
  const [ready, setReady] = useState(false)
  const isExplore = focus === 'explore'

  const getFrameDoc = useCallback(() => {
    const frame = frameRef.current
    if (!frame) return null
    try { return frame.contentDocument } catch { return null }
  }, [])

  const applyTransform = useCallback((tx, ty, scale, instant = false) => {
    const frame = frameRef.current
    if (!frame) return

    transformRef.current = { tx, ty, scale }
    frame.style.transition = instant ? 'none' : 'transform .75s cubic-bezier(.18,.84,.16,1)'
    frame.style.transform = `translate(${Math.round(tx)}px, ${Math.round(ty)}px) scale(${scale})`

    if (instant) {
      requestAnimationFrame(() => {
        frame.style.transition = 'transform .75s cubic-bezier(.18,.84,.16,1)'
      })
    }
  }, [])

  const cameraToBounds = useCallback((bounds, options = {}) => {
    const wrap = wrapRef.current
    if (!wrap) return

    const cw = wrap.clientWidth
    const ch = wrap.clientHeight
    const width = Math.max(1, bounds.right - bounds.left)
    const height = Math.max(1, bounds.bottom - bounds.top)
    const fitScale = Math.min((cw / width) * (options.padX ?? 0.94), (ch / height) * (options.padY ?? 0.86))
    const scale = clamp(fitScale, options.minScale ?? 0.12, options.maxScale ?? 2.25)
    const tx = (cw - width * scale) / 2 - bounds.left * scale
    const ty = (ch - height * scale) / 2 - bounds.top * scale

    applyTransform(tx, ty, scale, options.instant)
  }, [applyTransform])

  const fitAllExplore = useCallback((instant = false) => {
    cameraToBounds(FULL_BOUNDS, { maxScale: 1, padX: 0.94, padY: 0.86, instant })
  }, [cameraToBounds])

  const zoomBy = useCallback((factor, centerPoint) => {
    const wrap = wrapRef.current
    if (!wrap) return

    const rect = wrap.getBoundingClientRect()
    const cx = centerPoint?.x ?? rect.width / 2
    const cy = centerPoint?.y ?? rect.height / 2
    const { tx, ty, scale } = transformRef.current
    const nextScale = clamp(scale * factor, 0.13, 2.6)
    const diagramX = (cx - tx) / scale
    const diagramY = (cy - ty) / scale

    applyTransform(cx - diagramX * nextScale, cy - diagramY * nextScale, nextScale, true)
  }, [applyTransform])

  const fit = useCallback(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const frame = frameRef.current
    if (!wrap || !canvas || !frame) return

    const doc = getFrameDoc()
    if (!doc || !doc.body) return

    doc.body.classList.remove('presentation-trace')

    const target = doc.querySelector(FOCUS_SEL[focus] || '.diagram')
    if (!target) return

    const dw = Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth, 7500)
    const dh = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight, 1320)
    frame.style.width = `${dw}px`
    frame.style.height = `${dh}px`
    frame.style.left = '0px'
    frame.style.top = '0px'
    canvas.style.width = '100%'
    canvas.style.height = '100%'

    if (isExplore) {
      fitAllExplore(true)
      return
    }

    const r = target.getBoundingClientRect()
    const cw = wrap.clientWidth
    const ch = wrap.clientHeight
    const scale = Math.min(cw / r.width, ch / r.height) * 0.9
    const tx = (cw - r.width * scale) / 2 - r.left * scale
    const ty = (ch - r.height * scale) / 2 - r.top * scale
    applyTransform(tx, ty, scale, false)
  }, [applyTransform, fitAllExplore, focus, getFrameDoc, isExplore])

  useEffect(() => { if (ready) fit() }, [ready, fit])

  useEffect(() => {
    const onResize = () => fit()
    window.addEventListener('resize', onResize)
    document.addEventListener('fullscreenchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('fullscreenchange', onResize)
    }
  }, [fit])

  const toggleFull = () => {
    const el = wrapRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen()
    else if (el.requestFullscreen) el.requestFullscreen()
  }

  const onWheel = (event) => {
    if (!isExplore) return
    event.preventDefault()
    const rect = wrapRef.current.getBoundingClientRect()
    zoomBy(event.deltaY < 0 ? 1.12 : 0.89, { x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  const onPointerDown = (event) => {
    if (!isExplore) return
    event.preventDefault()
    overlayRef.current?.setPointerCapture(event.pointerId)
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...transformRef.current },
    }
  }

  const onPointerMove = (event) => {
    if (!isExplore || !dragRef.current) return
    event.preventDefault()
    const dx = event.clientX - dragRef.current.startX
    const dy = event.clientY - dragRef.current.startY
    applyTransform(dragRef.current.origin.tx + dx, dragRef.current.origin.ty + dy, dragRef.current.origin.scale, true)
  }

  const onPointerUp = (event) => {
    if (!isExplore) return
    try { overlayRef.current?.releasePointerCapture(event.pointerId) } catch { /* ignore */ }
    dragRef.current = null
  }

  return (
    <div className={'tour' + (isExplore ? ' tour-explore' : '')}>
      <div className="tour-bar" style={{ borderColor: laneColor }}>
        <span className="tour-title" style={{ color: laneColor }}>{title}</span>
        <span className="tour-note">{note}</span>
        {isExplore && <span className="tour-explore-hint">Explore mode — drag to move, wheel to zoom</span>}
        {isExplore && <button className="tour-mini" onClick={() => zoomBy(0.82)}>−</button>}
        {isExplore && <button className="tour-mini" onClick={() => zoomBy(1.22)}>+</button>}
        {isExplore && <button className="tour-full" onClick={() => fitAllExplore(false)}>Fit all</button>}
        <button className="tour-full" onClick={toggleFull}>⛶ Fullscreen</button>
      </div>

      <div className="tour-stage" ref={wrapRef}>
        <div className="tour-canvas" ref={canvasRef}>
          <iframe
            ref={frameRef}
            src={import.meta.env.BASE_URL + 'diagram/index.html'}
            title="Integration flow diagram"
            onLoad={() => { setReady(true); requestAnimationFrame(fit) }}
          />
          {isExplore && (
            <div
              ref={overlayRef}
              className="tour-pan-layer"
              onWheel={onWheel}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
          )}
        </div>
      </div>
    </div>
  )
}
