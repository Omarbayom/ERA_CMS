import { useState, useEffect, useCallback } from 'react'
import { SLIDES, LANES } from './slides.js'
import DiagramStage from './DiagramStage.jsx'

const LANE_ORDER = ['CMS', 'ERA', 'DCR', 'OMS']

function FlowRibbon({ activeLane }) {
  return (
    <div className="ribbon">
      {LANE_ORDER.map((k, i) => {
        const lane = LANES[k]
        const active = k === activeLane
        return (
          <div key={k} className="ribbon-item">
            <span
              className={'ribbon-pill' + (active ? ' active' : '')}
              style={active ? { background: lane.color, color: '#fff', borderColor: lane.color } : { color: lane.color, borderColor: lane.color }}
            >
              <b>{lane.code}</b>
            </span>
            {i < LANE_ORDER.length - 1 && <span className="ribbon-arrow">→</span>}
          </div>
        )
      })}
    </div>
  )
}

function Cover({ slide }) {
  const lane = LANES[slide.lane]
  return (
    <div className="cover">
      <div className="cover-lanes">
        {LANE_ORDER.map((k) => (
          <span key={k} className="cover-chip" style={{ background: LANES[k].color }}>{k}</span>
        ))}
      </div>
      <p className="cover-kicker">{slide.kicker}</p>
      <h1 className="cover-title">{slide.title}</h1>
      <p className="cover-subtitle">{slide.subtitle}</p>
      <div className="cover-scenario" style={{ borderColor: lane.color, color: lane.color }}>
        {slide.scenario}
      </div>
      <p className="cover-blurb">{slide.blurb}</p>
      <p className="cover-hint">Use → / ← or Space to navigate</p>
    </div>
  )
}

function ContentSlide({ slide }) {
  const lane = LANES[slide.lane]
  return (
    <div className="content-slide">
      <div className="text-col">
        {slide.mapsTo && (
          <div className="maps-to" style={{ borderColor: lane.color }}>
            <span className="maps-label" style={{ color: lane.color }}>FLOW STEP</span>
            {slide.mapsTo}
          </div>
        )}
        <ul className="points">
          {slide.points.map(([h, b], i) => (
            <li key={i} style={{ borderLeftColor: lane.color }}>
              <strong>{h}</strong><span>{b}</span>
            </li>
          ))}
        </ul>
        {slide.decision && (
          <div className="decision-tag" style={{ background: lane.color }}>
            DECISION: {slide.decision}
          </div>
        )}
      </div>
      <div className="media-col">
        <figure className="shot">
          <img src={slide.image} alt={slide.caption} loading="eager" />
        </figure>
        <div className="caption">{slide.caption}</div>
      </div>
    </div>
  )
}

export default function App() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const slide = SLIDES[i]
  const lane = LANES[slide.lane]

  const jump = useCallback((target) => {
    setI((p) => {
      const n = Math.min(SLIDES.length - 1, Math.max(0, target))
      setDir(n >= p ? 1 : -1)
      return n
    })
  }, [])
  const go = useCallback((d) => { setDir(d > 0 ? 1 : -1); setI((p) => Math.min(SLIDES.length - 1, Math.max(0, p + d))) }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(1) }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1) }
      else if (e.key === 'Home') jump(0)
      else if (e.key === 'End') jump(SLIDES.length - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, jump])

  const isCover = slide.type === 'cover'
  const isTour = slide.type === 'tour'

  return (
    <div className="stage" style={{ '--lane': lane.color, '--lane-soft': lane.soft }}>
      <div className={'frame ' + (dir > 0 ? 'enter-fwd' : 'enter-back')} key={i}>
        {!isCover && !isTour && (
          <header className="bar">
            <div className="bar-left">
              <span className="lane-badge" style={{ background: lane.color }}>
                <span className="lane-ic">{lane.icon}</span>
                <span className="lane-code">{lane.code}</span>
              </span>
              <div className="bar-titles">
                <span className="bar-chapter">{slide.chapter}</span>
                <h2 className="bar-title">
                  {slide.step ? <span className="step-num" style={{ background: lane.color }}>{slide.step}</span> : null}
                  {slide.title}
                </h2>
              </div>
            </div>
            <FlowRibbon activeLane={slide.lane} />
          </header>
        )}

        <main className={'body' + (isTour ? ' body-tour' : '')}>
          {isCover ? <Cover slide={slide} />
            : isTour ? <DiagramStage focus={slide.focus} title={slide.title} note={slide.note} laneColor={lane.color} />
            : <ContentSlide slide={slide} />}
        </main>
      </div>

      <footer className="controls">
        <button className="nav-btn" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous">‹</button>
        <div className="dots">
          {SLIDES.map((s, k) => (
            <button
              key={k}
              className={'dot' + (k === i ? ' on' : '')}
              style={k === i ? { background: LANES[s.lane].color } : undefined}
              onClick={() => jump(k)}
              aria-label={'Slide ' + (k + 1)}
            />
          ))}
        </div>
        <span className="counter">{i + 1} / {SLIDES.length}</span>
        <button className="nav-btn" onClick={() => go(1)} disabled={i === SLIDES.length - 1} aria-label="Next">›</button>
      </footer>
    </div>
  )
}
