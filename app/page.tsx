import {
  getSiteMeta,
  getSection,
  getCaseStudies,
  getSneakPeekSection,
  getWhatICanBuildSection,
  getTestimonialsSection,
  getVariant,
} from "@/lib/content";
import SideNav from "@/components/SideNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ByTheNumbers from "@/components/ByTheNumbers";
import CaseStudy from "@/components/CaseStudy";
import SneakPeek from "@/components/SneakPeek";
import WhatICanBuild from "@/components/WhatICanBuild";
import Testimonials from "@/components/Testimonials";
import ContactBand from "@/components/ContactBand";
import FloatingCTA from "@/components/FloatingCTA";
import WorkHome from "@/components/work/WorkHome";

export default function Home() {
  // New "30-second" homepage template (filterable work gallery) --
  // opt-in per Vercel project via SITE_VARIANT=jeanniffer, will
  // eventually become www.jeanniffer.com. Every other variant keeps
  // the existing long-scroll layout untouched below.
  if (getVariant() === "jeanniffer") {
    return <WorkHome activeTypes={[]} />;
  }

  const meta = getSiteMeta();
  const about = getSection("about");
  const byTheNumbers = getSection("by-the-numbers");
  const sneakPeek = getSneakPeekSection();
  const whatICanBuild = getWhatICanBuildSection();
  const testimonials = getTestimonialsSection();
  const caseStudies = getCaseStudies();

  return (
    <>
      <SideNav meta={meta} />
      <FloatingCTA meta={meta} />
      <main className="flex flex-col pl-0 min-[426px]:pl-36 md:pl-32">
      <Hero meta={meta} />
      <About section={about} meta={meta} />
      <ByTheNumbers section={byTheNumbers} />
      {caseStudies.map((cs, i) => (
        <CaseStudy
          key={cs.slug}
          section={cs}
          anchorId={i === 0 ? "work" : undefined}
        />
      ))}
      <SneakPeek section={sneakPeek} />
      <WhatICanBuild section={whatICanBuild} />
      <Testimonials section={testimonials} />
      <ContactBand meta={meta} />
      </main>
    </>
  );
}
