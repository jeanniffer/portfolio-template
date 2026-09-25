// Client-safe site-wide feature flags. Kept separate from lib/content.ts
// (which imports Node's `fs`/`path` and can only run server-side) so
// "use client" components can import flags here without pulling server-only
// code into the browser bundle.

// Toggle: hides the Let's Talk / quick-contact CTAs (side nav pill,
// floating Upwork button, case-study header + footer email/button) across
// the whole site without deleting any of that code. Flip back to true to
// bring them all back at once.
export const SHOW_QUICK_CONTACT_CTAS = false;
