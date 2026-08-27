import ReactMarkdown from "react-markdown";
import type { Section } from "@/lib/content";
import { yearsOfExperience } from "@/lib/careerYears";
import UXUIReveal from "./UXUIReveal";

export default function UXUIAbout({ section }: { section: Section }) {
  const { titleA, titleB } = section.frontmatter;
  const content = section.content.replace(
    /\{\{AUTO_YEARS\}\}/g,
    String(yearsOfExperience())
  );

  return (
    <section
      id="about"
      data-section-label="About Me"
      className="relative flex flex-col justify-center px-6 py-14 md:px-20"
    >
      <UXUIReveal>
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10">
        <div className="flex flex-1 flex-col justify-center gap-6">
          {titleA ? (
            <h2 className="font-archivo max-w-2xl text-3xl font-medium leading-[1.15] tracking-[-0.8px] text-[#1a1a1a] md:text-[42px]">
              {titleA}
              <span className="italic">{titleB}</span>
            </h2>
          ) : null}
          <div className="prose max-w-2xl font-archivo text-base font-light leading-relaxed tracking-[-0.24px] text-[#6e6e6d] prose-strong:font-medium prose-strong:text-[#1a1a1a] md:text-lg">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
      </UXUIReveal>
    </section>
  );
}
