---
# DEMO / not wired into any page yet -- see lib/sharedContent.ts.
# This shows how "osf" would select from content/_shared/case-studies/
# instead of keeping its own full copies of case-study-01.md, -02.md, -03.md.
caseStudies:
  - slug: digitalundivided
    order: 1
    # No overrides needed -- same story works for this audience as-is.
  - slug: academia-edu
    order: 2
    overrides:
      deliverables: "Consistent visual design across product and communications, supporting a platform used by millions of researchers worldwide"
  - slug: codesmith
    order: 3
---
