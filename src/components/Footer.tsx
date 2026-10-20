import { useRef } from "react";
import { gsap, useGSAP, reduced } from "../lib/gsap";
import { Logo, Magnetic } from "./Core";

/* C099 parallax footer with big CTA */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    gsap.from(".ft-inner", { yPercent: -35, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: true } });
  }, { scope: ref });
  return (
    <footer ref={ref} className="overflow-hidden bg-ink text-paper" style={{ paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
      <div className="ft-inner gutter mx-auto max-w-[1400px] pb-10 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-paper/15 pb-14">
          <h2 className="disp max-w-[12ch] text-[clamp(48px,8vw,128px)]">Come sit on everything.</h2>
          <Magnetic><a href="#visit" className="grid h-36 w-36 place-items-center rounded-full bg-brass text-center font-semibold text-ink md:h-44 md:w-44">Book a<br />visit →</a></Magnetic>
        </div>
        <div className="grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex items-start gap-3"><Logo className="h-12 w-12" tone="light" /><div><div className="disp text-2xl">Kaath &amp; Co.</div><div className="text-sm text-paper/60">Solid wood furniture</div></div></div>
          <div><div className="cat mb-3 text-brass">Showroom</div><p className="text-paper/75">MG Marg, Civil Lines<br />Prayagraj 211001</p></div>
          <div><div className="cat mb-3 text-brass">Hours</div><p className="text-paper/75">Daily 10:30 AM – 8:30 PM</p></div>
          <div><div className="cat mb-3 text-brass">Shop</div><ul className="space-y-1 text-paper/75">{["Living", "Bedroom", "Dining", "Study"].map(x => <li key={x}><a href="#collections" className="hover:text-paper">{x}</a></li>)}</ul></div>
        </div>
        <div className="cat flex flex-wrap justify-between gap-3 text-paper/45">
          <span>Demo store · brand, products and prices are samples</span><span>Designed &amp; built by pixelvantastudio</span>
        </div>
      </div>
    </footer>
  );
}
