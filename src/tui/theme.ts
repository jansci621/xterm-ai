/**
 * Dark Operator Console palette with Editorial whitespace influence.
 *
 * Design decisions:
 * - Operator Console structure: strong framing, data-first, explicit state
 * - Editorial whitespace: generous spacing between sections, one dominant action
 * - Warm industrial palette: rust accent, not neon/purple/blue
 *
 * Reference: DARK_THEME_SPEC.md + brainstorming decision log
 */

export const colors = {
  // Background layers
  bg: '#121416',
  panel: '#1A1D21',
  border: '#2B3138',

  // Text hierarchy
  text: '#F3EEE6',       // warm white — primary content
  muted: '#9B9288',      // warm gray — labels, secondary info

  // Semantic states
  accent: '#C76632',     // rust orange — active selection, primary action
  success: '#6F9B74',    // muted green — OK, installed, ready
  warning: '#D1A34A',    // amber — partial, empty field (system env may exist)
  error: '#C85A54',      // muted red — missing, unavailable
} as const

export const sourceLabel = {
  explicit: 'explicit',
  session: 'restored',
  toolDefault: 'default',
  fallback: 'fallback',
} as const
