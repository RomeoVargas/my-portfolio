---
version: alpha
colors:
  background: "#171a2c"
  surface: "#22263b"
  text: "#f4f1e9"
  muted: "#c4c7d7"
  primary: "#b7a0f4"
  accent: "#f8d581"
typography:
  display:
    fontFamily: "Silkscreen, monospace"
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
rounded:
  card: "16px"
spacing:
  unit: "8px"
---

# Romeo’s World

## Overview

An English-language portfolio for prospective clients and employers. A cozy handheld adventure game, set on a floating developer island, is the signature. Professional content stays accessible through ordinary buttons and navigation; playing is optional. Experience comes from the supplied sResume.pdf, plus the local PAYCOINECT-Nexus and PAYCOINECT-main repositories for recent product work. Pacific Wireless’s solo-development credit and all project URLs come from the owner. No invented client outcomes or testimonials.

## Colors

The six tokens above map directly to CSS custom properties in src/styles.css, the canonical runtime owner. Lavender is the interaction color; butter yellow highlights the invitation to explore. Forest green, jade, peach, and brown are scene illustration colors, not additional UI semantic tones.

## Typography

Readability is a user requirement. Use 18px-equivalent (1.125rem) body text and descriptions, with a 16px-equivalent (1rem) minimum for all visible labels and metadata at every breakpoint. Use DM Sans for all reading and navigation; reserve Silkscreen for the large hero heading. Text uses relative units so browser font preferences work. Use 1.65–1.75 line height for prose, stronger secondary-text contrast, and 48px primary icon controls. Never shrink text to fit a mobile layout; reflow it. On narrow screens, replace map labels with full-sized destination buttons below the artwork. Verify 320px width and 200% text scaling.

## Layout

An approximately 1400px centered shell. Header, split introduction and playable scene, navigation dock, services, and a compact contact footer. Collapse the split at 1000px; preserve the map’s aspect ratio. Content dialogs scroll within the viewport.

## Elevation & Depth

Subtle panel outlines and dark shadows. Pixel illustrations use stepped silhouettes and layered flat color, never glass effects. World art stays restrained around functional labels.

## Shapes

Rounded UI panels, squared keycaps, pixel-cut illustration outlines.

## Components

Native buttons and links. A single native modal dialog owns focus trapping, Escape, and return focus for services, projects, resume, contact, and help. Character input only captures movement while the game has focus. Touch controls and direct destination buttons provide alternatives. The island uses the supplied animated cursor with a standard pointer fallback, freezes it when reduced motion is preferred, and has a visible click/tap instruction so movement and building interactions are discoverable before playing. Sound defaults to enabled; a welcome dialog with the pixel avatar and “Explore my world” button supplies the gesture to begin playback. A persistent icon-only control only in the sticky header controls looping music and click effects; muting stops both, and enabling resumes music. Effects play only when popups open or close. An explicit mute stays muted. Media failures reset the toggle and show a readable retry message. Motion respects reduced-motion preferences. The island instruction row spans the full width with movement, interaction, and click/tap guidance; progress and scene settings are omitted.

## Do's and Don'ts

Keep original resume private: omit street address, personal demographic data, and references. Show an email contact action, not a pretend submission form. Use supplied brand artwork for Nexus and Paycoinect; keep other project representations illustrative. Do not gate content behind game progress. Do not imply resume employment dates have been independently updated.

Star collection plays the original three-note synthesized chime, separate from the popup MP3. The header mute control silences it too.
