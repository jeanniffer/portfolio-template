import {
  getSiteMeta,
  getSection,
  getCaseStudies,
  getWhatICanBuildSection,
  getTestimonialsSection,
} from "@/lib/content";
import UXUISideNav from "./UXUISideNav";
import UXUIFloatingCTA from "./UXUIFloatingCTA";
import UXUIHero from "./UXUIHero";
import UXUIAbout from "./UXUIAbout";
import UXUIStats from "./UXUIStats";
import UXUICaseStudySlide from "./UXUICaseStudySlide";
import UXUIServices from "./UXUIServices";
import UXUICertifications from "./UXUICertifications";
import UXUITestimonials from "./UXUITestimonials";
import UXUIContact from "./UXUIContact";
import UXUIFooter from "./UXUIFooter";

export default function UXUIHome() {
  const meta = getSiteMeta();
  const about = getSection("about");
  const byTheNumbers = getSection("by-the-numbers");
  const caseStudies = getCaseStudies();
  const whatICanBuild = getWhatICanBuildSection();
  const certifications = getSection("certifications");
  const testimonials = getTestimonialsSection();

  return (
    <div className="relative min-h-screen bg-[#fdfbf5] font-archivo">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 z-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[10px] z-50 border border-[#6e6e6d]"
      />

      <UXUISideNav meta={meta} />
      <UXUIFloatingCTA />

      <main className="relative z-10 flex flex-col pl-0 min-[426px]:pl-36 md:pl-32">
        <UXUIHero meta={meta} />
        <UXUIAbout section={about} />
        <UXUIStats section={byTheNumbers} />
        {caseStudies.map((cs, i) => (
          <UXUICaseStudySlide
            key={cs.slug}
            section={cs}
            anchorId={i === 0 ? "work" : undefined}
            index={i}
            total={caseStudies.length}
          />
        ))}
        <UXUIServices section={whatICanBuild} />
        <UXUICertifications section={certifications} />
        <UXUITestimonials section={testimonials} />
        <UXUIContact meta={meta} />
        <div className="px-6 md:px-20">
          <UXUIFooter meta={meta} />
        </div>
      </main>
    </div>
  );
}
