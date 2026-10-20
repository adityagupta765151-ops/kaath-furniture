import { useRef } from "react";
import { gsap, useGSAP, reduced } from "../lib/gsap";
import { Magnetic } from "./Core";

/* C015 zoom-out mask hero: the photo shows through the word KAATH, then the word opens up into the room */
export function MaskHero({ ready }: { ready: boolean }) {
  const sec = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (!ready || reduced()) return;
    gsap.from(".mh-word", { yPercent: 40, opacity: 0, duration: 1.1, ease: "power4.out" });
    gsap.from(".mh-pre > *", { y: 20, opacity: 0, stagger: 0.08, duration: 0.8, delay: 0.3, ease: "power3.out" });
  }, { scope: sec, dependencies: [ready] });
  useGSAP(() => {
    if (reduced()) { gsap.set([".mh-plate", ".mh-pre"], { autoAlpha: 0 }); return; }
    const tl = gsap.timeline({ scrollTrigger: { trigger: sec.current, start: "top top", end: "+=170%", pin: true, scrub: 1 } });
    tl.to(".mh-pre", { opacity: 0, y: -30, duration: 0.15 }, 0)
      .to(".mh-mask", { scale: 32, svgOrigin: "657 330", ease: "power2.in", duration: 0.7 }, 0)
      .fromTo(".mh-img", { scale: 1.35 }, { scale: 1, ease: "none", duration: 0.85 }, 0)
      .to(".mh-plate", { opacity: 0, duration: 0.2 }, 0.45)
      .from(".mh-copy > *", { y: 50, opacity: 0, stagger: 0.05, duration: 0.25 }, 0.7);
  }, { scope: sec });
  return (
    <section ref={sec} id="top" className="relative h-[100svh] overflow-hidden bg-plaster">
      <img src="./img/hero.jpg" alt="Sunlit living room with a solid wood sofa and coffee table" fetchPriority="high" className="mh-img absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/5" /><div className="absolute inset-0 bg-gradient-to-r from-ink/45 to-transparent" />
      <svg className="mh-plate absolute inset-0 h-full w-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <defs>
          <mask id="kaath-mask" maskUnits="userSpaceOnUse" x="-6000" y="-6000" width="13000" height="13000">
            <rect x="-6000" y="-6000" width="13000" height="13000" fill="white" />
            <g className="mh-mask"><text className="mh-word" x="500" y="372" textAnchor="middle" fill="black"
              style={{ font: "800 238px Syne, 'Trebuchet MS', sans-serif", letterSpacing: "-12px" }}>KAATH</text></g>
          </mask>
        </defs>
        <rect x="-6000" y="-6000" width="13000" height="13000" fill="#e4e2da" mask="url(#kaath-mask)" />
      </svg>
      <div className="mh-pre gutter pointer-events-none absolute inset-0 flex flex-col justify-between pb-8 pt-28">
        <div className="flex flex-wrap justify-between gap-4">
          <span className="cat max-w-[22ch] text-mute">Solid wood furniture · Made to order · Prayagraj</span>
          <span className="cat text-mute">Catalogue Nº 07 / 2026</span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <p className="max-w-[30ch] text-mute">Sheesham, teak and mango wood pieces, built for Indian homes and Indian summers.</p>
          <span className="cat flex items-center gap-2 text-ink">Scroll to step inside <span className="inline-block h-8 w-px bg-ink" /></span>
        </div>
      </div>
      <div className="mh-copy gutter absolute inset-x-0 bottom-0 pb-12 text-paper md:pb-16">
        <div className="cat mb-4 text-brass">The living room collection</div>
        <h1 className="disp max-w-[13ch] text-[clamp(44px,8vw,128px)]">Furniture that grows old with you.</h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <Magnetic><a href="#collections" className="inline-block rounded-full bg-paper px-6 py-3.5 font-semibold text-ink hover:bg-brass">Browse collections</a></Magnetic>
          <Magnetic><a href="#visit" className="inline-block rounded-full border border-paper/50 px-6 py-3.5 font-semibold hover:border-paper">Book a showroom visit</a></Magnetic>
        </div>
      </div>
    </section>
  );
}
