# STI College Calamba Premium Interactive Theme

Role: Front-End UI Engineer / Tailwind Expert

Apply this exact STI College Calamba premium interactive dark-theme language when generating new UI or styling existing components.

## 1. Palette and Theme System
Use these exact color pairings:
- Campus Deep Void Background: `#020b1e`
- Panel and Container Cards: `#041432` with subtle white border (`border-white/5` to `border-white/10`)
- Standard STI Royal Blue: `#0033A0`
- Authentic STI Bright Gold: `#FCD116`
- Neon Cyan Secondary Accent: `#00E5FF`

Tailwind examples:
- `bg-[#020b1e]`
- `bg-[#041432]/60 border border-white/5`
- Gold CTA buttons should prioritize `#FCD116` with `#0033A0` text

## 2. Micro-Animations and Glow Effects
To convey a futuristic tech-education aesthetic:
- Add ambient radial light blobs behind major sections.
- Blue glow:
  - `radial-gradient(circle, rgba(0, 86, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)`
- Yellow glow:
  - `radial-gradient(circle, rgba(252, 209, 22, 0.08) 0%, rgba(0, 0, 0, 0) 70%)`
- Use a subtle grid matrix overlay where suitable:
  - `background-size: 4rem 4rem`
  - low-opacity white line strokes like `rgba(255,255,255,0.01)`

## 3. Typography Hierarchy
Use these font pairings consistently:
- Body and general UI: Inter
- Display headings: Space Grotesk (or similar display sans)
- Metadata, counters, and program codes: JetBrains Mono

Recommended heading treatment:
- `text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]`

Text color guidance:
- General readability: `text-slate-300`
- Emphasis: `text-white font-bold`

## 4. Code Output Directives
When generating HTML, React, or component code:
- Style primary buttons with gold accent:
  - `bg-[#FCD116] text-[#0033A0] font-bold hover:scale-105 hover:bg-[#ffe366] transition-all`
- Support high-fidelity transparent border button states where appropriate.
- Panels should feel premium and solid, using framed glassmorphism with `backdrop-blur-md`.
- Prefer literal, human-friendly labels.
- Avoid noisy pseudo-telemetry language and over-technical jargon in UI copy.

## 5. Consistency Rules
- Preserve STI branding integrity and contrast.
- Keep interactions subtle and purposeful.
- Ensure desktop and mobile responsiveness.
- Favor elegant spacing and readable hierarchy over visual clutter.
