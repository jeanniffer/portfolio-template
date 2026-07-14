# Portfolio Template

A reusable Next.js portfolio site. Content lives in Markdown; layout and
animations live in code. One repo powers multiple niche-specific landing
pages (nonprofits, education, ...) through the `SITE_VARIANT` env var.

## Editing content (no code required)

Everything under `content/<variant>/` is plain Markdown with frontmatter:

- `site.md` — hero title, name, role, badge, skills line
- `about.md` — About Me headline + body
- `case-study-01.md`, `case-study-02.md`, ... — one file per project.
  Add more by creating `case-study-03.md`, etc.; they render in filename order.

Images referenced in frontmatter (`cover`, `photo`) go in `public/images/`.

To add a new niche/variant (e.g. education): duplicate `content/nonprofits/`
into `content/education/` and edit the copy. No component changes needed.

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000. Change `SITE_VARIANT` in `.env.local` to preview
a different niche.

## GitHub

```bash
git init
git add .
git commit -m "Initial portfolio template"
gh repo create your-username/portfolio-template --private --source=. --push
```

(No `gh` CLI? Create the repo on github.com and follow the "push an existing
repository" instructions it gives you.)

## Deploying to Vercel — one repo, multiple subdomains

Each niche gets its own **Vercel project**, all pointing at the same GitHub
repo, differing only by the `SITE_VARIANT` env var and the domain attached:

1. In Vercel, "Add New Project" → import this repo → name it e.g.
   `portfolio-nonprofits`.
2. In that project's Settings → Environment Variables, add:
   - `SITE_VARIANT=nonprofits`
   - `NEXT_PUBLIC_UPWORK_URL=<your Upwork profile URL>`
3. Settings → Domains → add `nonprofits.jeanniffer.com`.
4. Repeat steps 1–3 for the next niche: new project `portfolio-education`,
   `SITE_VARIANT=education`, domain `education.jeanniffer.com`.

**Targeted prospect variants** (e.g. `content/open-society/`) work the same
way: new Vercel project, `SITE_VARIANT=open-society`, and a domain like
`open-society.jeanniffer.com` -- handy for a one-off pitch link you can send
directly to a specific client without touching the general nonprofits site.

## DNS (at your domain registrar, for jeanniffer.com)

For each subdomain, Vercel will show you a CNAME target after you add the
domain in step 3 above (usually `cname.vercel-dns.com`). Add a CNAME record:

| Type  | Name        | Value                 |
|-------|-------------|------------------------|
| CNAME | nonprofits    | cname.vercel-dns.com  |
| CNAME | education     | cname.vercel-dns.com  |
| CNAME | open-society  | cname.vercel-dns.com  |

Propagation is usually minutes, sometimes up to a few hours.

## No personal contact info

This template intentionally has no email address or contact form. The only
call-to-action links out to your Upwork profile (`NEXT_PUBLIC_UPWORK_URL`),
so it's safe to send to Upwork clients without exposing personal channels.
