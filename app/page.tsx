import { getSiteMeta, getSection, getCaseStudies } from "@/lib/content";
import SideNav from "@/components/SideNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ByTheNumbers from "@/components/ByTheNumbers";
import CaseStudy from "@/components/CaseStudy";
import SneakPeek from "@/components/SneakPeek";
import WhatICanBuild from "@/components/WhatICanBuild";
import Testimonials from "@/components/Testimonials";
import ContactBand from "@/components/ContactBand";

export default function Home() {
  const meta = getSiteMeta();
  const about = getSection("about");
  const byTheNumbers = getSection("by-the-numbers");
  const sneakPeek = getSection("sneak-peek");
  const whatICanBuild = getSection("what-i-can-build");
  const testimonials = getSection("testimonials");
  const caseStudies = getCaseStudies();

  return (
    <>
      <SideNav meta={meta} />
      <main className="flex flex-col pl-24 md:pl-32">
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
