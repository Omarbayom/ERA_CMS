import { useRef, useEffect, useState, useCallback } from 'react'

const FOCUS_SEL = { CMS: '.cms-bg', ERA: '.era-bg', DCR: '.dcr-bg', OMS: '.oms-bg', all: '.diagram' }

// Shows the swimlane diagram (diagram/index.html) full-bleed, zoomed to the lane in focus.
export default function DiagramStage({ focus, title, note, laneColor }) {
  const wrapRef = useRef(null)
  const frameRef = useRef(null)
  const [ready, setReady] = useState(false)

  const fit = useCallback(() => {
    const wrap = wrapRef.current, frame = frameRef.current
    if (!wrap || !frame) return
    let doc
    try { doc = frame.contentDocument } catch { return }
    if (!doc || !doc.body) return
    const target = doc.querySelector(FOCUS_SEL[focus] || '.diagram')
    if (!target) return
    // Size the iframe to its full content so nothing scrolls inside it.
    const dw = Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth, 1648)
    const dh = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight, 1380)
    frame.style.width = dw + 'px'
    frame.style.height = dh + 'px'
    const r = target.getBoundingClientRect() // doc coords (no inner scroll/transform)
    const cw = wrap.clientWidth, ch = wrap.clientHeight
    const pad = focus === 'all' ? 0.97 : 0.9
    const s = Math.min(cw / r.width, ch / r.height) * pad
    const tx = (cw - r.width * s) / 2 - r.left * s
    const ty = (ch - r.height * s) / 2 - r.top * s
    frame.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`
  }, [focus])

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

  return (
    <div className="tour">
      <div className="tour-bar" style={{ borderColor: laneColor }}>
        <span className="tour-title" style={{ color: laneColor }}>{title}</span>
        <span className="tour-note">{note}</span>
        <button className="tour-full" onClick={toggleFull}>⛶ Fullscreen</button>
      </div>
      <div className="tour-stage" ref={wrapRef}>
        <iframe
          ref={frameRef}
          src="diagram/index.html"
          title="Integration flow diagram"
          onLoad={() => { setReady(true); requestAnimationFrame(fit) }}
        />
      </div>
    </div>
  )
}
