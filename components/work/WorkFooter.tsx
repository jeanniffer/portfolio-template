import type { SiteMeta } from "@/lib/content";

export default function WorkFooter({ meta }: { meta: SiteMeta }) {
  return (
    <footer className="flex w-full items-center justify-between whitespace-nowrap py-6 font-mono text-sm tracking-[-0.56px] text-[#474746]">
      {meta.contactEmail ? (
        <a href={`mailto:${meta.contactEmail}`} className="hover:text-[#1a1a1a]">
          {meta.contactEmail}
        </a>
      ) : (
        <span />
      )}
      {meta.socials?.length ? (
        <div className="flex items-center gap-6">
          {meta.socials
            .filter((s) => s.url && s.url !== "#")
            .map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1a1a1a]"
              >
                {s.label}
              </a>
            ))}
        </div>
      ) : null}
    </footer>
  );
}
