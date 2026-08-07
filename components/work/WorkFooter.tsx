import type { SiteMeta } from "@/lib/content";

export default function WorkFooter({ meta }: { meta: SiteMeta }) {
  return (
    <footer className="flex flex-col gap-4 border-t border-ink/10 px-6 py-6 text-sm text-ink md:flex-row md:items-center md:justify-between md:px-10">
      {meta.contactEmail && (
        <a href={`mailto:${meta.contactEmail}`} className="hover:opacity-70">
          {meta.contactEmail}
        </a>
      )}
      {meta.socials?.length ? (
        <div className="flex gap-6">
          {meta.socials
            .filter((s) => s.url && s.url !== "#")
            .map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="hover:opacity-70">
                {s.label}
              </a>
            ))}
        </div>
      ) : null}
    </footer>
  );
}
