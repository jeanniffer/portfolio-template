"use client";

import { useEffect, useRef } from "react";
import type p5 from "p5";

const ACCENT = [220, 239, 102]; // #dcef66 as RGB
const PARTICLE_COUNT = 70;
const LINK_DISTANCE = 130;
const MOUSE_RADIUS = 220;

type Particle = { x: number; y: number; vx: number; vy: number };

/**
 * A subtle connect-the-dots field behind the hero title. Particles drift
 * slowly and link to nearby neighbors with faint lines; get near the
 * cursor and the links around it brighten and thicken. Built with p5.js
 * in instance mode so it only ever touches its own <div>, and it's
 * dynamically loaded client-side since p5 needs a real DOM/canvas.
 */
export default function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p5Instance: p5 | null = null;
    let cancelled = false;

    import("p5").then(({ default: P5 }) => {
      if (cancelled || !containerRef.current) return;

      const sketch = (p: p5) => {
        let particles: Particle[] = [];
        let mouse = { x: -9999, y: -9999 };

        const spawn = (w: number, h: number) => {
          particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: p.random(w),
            y: p.random(h),
            vx: p.random(-0.25, 0.25),
            vy: p.random(-0.25, 0.25),
          }));
        };

        p.setup = () => {
          const el = containerRef.current!;
          const canvas = p.createCanvas(el.clientWidth, el.clientHeight);
          canvas.parent(el);
          spawn(el.clientWidth, el.clientHeight);
        };

        p.windowResized = () => {
          const el = containerRef.current;
          if (!el) return;
          p.resizeCanvas(el.clientWidth, el.clientHeight);
          spawn(el.clientWidth, el.clientHeight);
        };

        p.mouseMoved = () => {
          mouse.x = p.mouseX;
          mouse.y = p.mouseY;
        };

        p.draw = () => {
          p.clear();

          // Move + wrap particles
          for (const particle of particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < 0) particle.x = p.width;
            if (particle.x > p.width) particle.x = 0;
            if (particle.y < 0) particle.y = p.height;
            if (particle.y > p.height) particle.y = 0;
          }

          // Connections between nearby particles
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const a = particles[i];
              const b = particles[j];
              const d = p.dist(a.x, a.y, b.x, b.y);
              if (d > LINK_DISTANCE) continue;

              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              const distFromMouse = p.dist(midX, midY, mouse.x, mouse.y);
              const boost = p.constrain(
                p.map(distFromMouse, 0, MOUSE_RADIUS, 1, 0),
                0,
                1
              );

              const baseAlpha = p.map(d, 0, LINK_DISTANCE, 22, 0);
              const alpha = baseAlpha + boost * 90;
              const weight = 0.6 + boost * 1.4;

              p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], alpha);
              p.strokeWeight(weight);
              p.line(a.x, a.y, b.x, b.y);
            }
          }

          // Dots themselves, brighter near the cursor
          p.noStroke();
          for (const particle of particles) {
            const distFromMouse = p.dist(
              particle.x,
              particle.y,
              mouse.x,
              mouse.y
            );
            const boost = p.constrain(
              p.map(distFromMouse, 0, MOUSE_RADIUS, 1, 0),
              0,
              1
            );
            p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 30 + boost * 180);
            p.circle(particle.x, particle.y, 2 + boost * 2.5);
          }
        };
      };

      p5Instance = new P5(sketch, containerRef.current);
    });

    return () => {
      cancelled = true;
      p5Instance?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-auto absolute inset-0 z-0"
    />
  );
}
