import type { Section } from "@/lib/content";
import UXUIReveal from "./UXUIReveal";

type ServiceItem = { title: string; price?: string; description: string };
type StackTool = { name: string; icon?: string };

export default function UXUIServices({ section }: { section: Section }) {
  const { titleA, titleB, services = [], stack = [] } = section.frontmatter;

  return (
    <section
      id="services"
      data-section-label="Services"
      className="relative flex flex-col justify-center px-6 py-14 md:px-20"
    >
      <UXUIReveal>
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10">
        {titleA ? (
          <h2 className="font-archivo max-w-2xl text-3xl font-medium leading-[1.15] tracking-[-0.8px] text-[#1a1a1a] md:text-[42px]">
            {titleA}
            <span className="italic">{titleB}</span>
          </h2>
        ) : null}

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          {services.map((service: ServiceItem) => (
            <div
              key={service.title}
              className="flex flex-col gap-3 border-t border-[#e3e0d3] pt-5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-archivo text-xl font-medium tracking-[-0.4px] text-[#1a1a1a]">
                  {service.title}
                </p>
                {service.price ? (
                  <p className="font-mono whitespace-nowrap text-xs uppercase tracking-[0.48px] text-[#818181]">
                    {service.price}
                  </p>
                ) : null}
              </div>
              <p className="font-archivo text-sm font-light leading-relaxed tracking-[-0.24px] text-[#6e6e6d]">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {stack.length ? (
          <div className="mt-2 flex flex-col gap-6 border-t border-[#6e6e6d] pt-8">
            <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.48px] text-[#818181]">
                My Stack
              </p>
              <p className="font-mono text-xs italic text-[#a3a3a2]">
                (always growing)
              </p>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-6">
              {stack.map((tool: string | StackTool) => {
                const { name, icon } =
                  typeof tool === "string" ? { name: tool, icon: undefined } : tool;
                return (
                  <span
                    key={name}
                    className="flex w-16 flex-col items-center gap-2 text-center font-archivo text-xs font-light tracking-[-0.2px] text-[#6e6e6d]"
                  >
                    {icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={icon} alt="" className="h-8 w-8 object-contain" />
                    ) : null}
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
      </UXUIReveal>
    </section>
  );
}
