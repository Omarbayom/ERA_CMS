# EZVent M-202 — Integration Flow Presentation (React + Vite)

An interactive slide presentation that walks the real **CAR 14914 / Power Inlet Fuse**
scenario through the **CMS → ERA → DCR → OMS** integration flow, using the actual
ezzmedical system screenshots.

## Run locally

```bash
cd presentation
npm install      # first time only
npm run dev      # starts http://localhost:5180
```

Open the printed URL in a browser.

## Build a static site (deployable / openable offline)

```bash
npm run build    # outputs to presentation/dist
npm run preview  # serve the production build locally
```

## Navigate

- **→ / Space / PageDown** — next slide
- **← / PageUp** — previous slide
- **Home / End** — first / last slide
- Click the **dots** to jump; use the **‹ ›** buttons

## Structure

- `src/slides.js` — scenario content + lane themes (edit text here)
- `src/App.jsx` — slide engine (cover / content / diagram slides, navigation)
- `src/styles.css` — styling
- `public/images/` — the WhatsApp screenshots (renamed by flow step)
- `public/diagram/` — the live swimlane diagram, embedded on the final slide

## The 10 slides

1. Cover — the scenario
2. CMS · CAR 14914 raised (CAR Management R&D)
3. CMS · Action 5150 assigned to System Engineering (Action Assignment)
4. CMS · Engineering response / design fix (Action Response)
5. ERA · CAR received in EZVent M-202 (Projects)
6. ERA · Link & analyze (Sub-System Requirements)
7. ERA · Impact assessment — Power Inlet, affects design (Component attributes)
8. DCR · Design change on the Power Inlet (Sub-System Design)
9. OMS · Implement & verify (Design Verification)
10. Closing — the full swimlane diagram + feedback loops
