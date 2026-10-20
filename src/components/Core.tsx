import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, SplitText, useGSAP, reduced, finePointer } from "../lib/gsap";

/* Brand mark: a "K" built from a chair leg and two planks */
export function Logo({ className = "h-9 w-9", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const bg = tone === "dark" ? "#4f2e1d" : "#f1efe9", fg = tone === "dark" ? "#f1efe9" : "#4f2e1d";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="14" fill={bg} />
      <rect x="16" y="12" width="9" height="40" rx="2" fill={fg} />
      <path d="M27 33 L45 12 L52 18 L34 36 Z" fill="#c48a3a" />
      <path d="M30 36 L38 30 L52 50 L44 54 Z" fill={fg} />
    </svg>
  );
}
export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo tone={light ? "light" : "dark"} />
      <span className={`disp text-xl ${light ? "text-paper" : ""}`}>Kaath <span className="text-brass">&amp;</span> Co.</span>
    </span>
  );
}

/* C001 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -72 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}

/* C002 thin brass progress */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => { gsap.to(bar.current, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } }); });
  return <div ref={bar} className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left scale-x-0 bg-brass" />;
}

/* C008 preloader: catalogue counter + split curtain */
export function Preloader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null), num = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  useGSAP(() => {
    if (reduced()) { setDone(true); onDone(); return; }
    const o = { v: 0 };
    gsap.timeline({ onComplete: () => { setDone(true); onDone(); } })
      .from(".pl-logo", { scale: 0.6, rotate: -20, opacity: 0, duration: 0.6, ease: "back.out(2)" })
      .to(o, { v: 100, duration: 1.2, ease: "power2.inOut", onUpdate: () => { num.current!.textContent = String(Math.round(o.v)).padStart(3, "0"); } }, 0.1)
      .to(".pl-in", { opacity: 0, duration: 0.25 })
      .to(".pl-top", { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "<")
      .to(".pl-bot", { yPercent: 100, duration: 0.8, ease: "power4.inOut" }, "<");
  });
  if (done) return null;
  return (
    <div ref={ref} className="fixed inset-0 z-[90]">
      <div className="pl-top absolute inset-x-0 top-0 h-1/2 bg-teak" />
      <div className="pl-bot absolute inset-x-0 bottom-0 h-1/2 bg-teak" />
      <div className="pl-in absolute inset-0 flex flex-col items-center justify-center gap-5 text-paper">
        <div className="pl-logo"><Logo className="h-16 w-16" tone="light" /></div>
        <span className="cat text-paper/70">Opening the catalogue · <span ref={num}>000</span></span>
      </div>
    </div>
  );
}

/* C006 custom cursor (desktop only) */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null), ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!finePointer() || reduced()) return;
    setOn(true); document.documentElement.classList.add("has-cursor");
    const xd = gsap.quickTo(dot.current, "x", { duration: 0.1 }), yd = gsap.quickTo(dot.current, "y", { duration: 0.1 });
    const xr = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" }), yr = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    const move = (e: PointerEvent) => { xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY);
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      const l = t?.dataset.cursor ?? ""; setLabel(l);
      gsap.to(ring.current, { scale: l ? 2.4 : (e.target as HTMLElement).closest("a,button") ? 1.5 : 1, duration: 0.3 }); };
    addEventListener("pointermove", move);
    return () => { removeEventListener("pointermove", move); document.documentElement.classList.remove("has-cursor"); };
  }, []);
  if (!on && typeof window !== "undefined" && !finePointer()) return null;
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1 -mt-1 h-2 w-2 rounded-full bg-brass" />
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[99] -ml-5 -mt-5 grid h-10 w-10 place-items-center rounded-full border border-ink/40 bg-plaster/10 backdrop-blur-[1px]">
        <span className="cat text-[5px] text-ink">{label}</span>
      </div>
    </>
  );
}

/* C079 magnetic wrapper */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactElement; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || !finePointer() || reduced()) return;
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1,0.4)" }), y = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1,0.4)" });
    const mv = (e: PointerEvent) => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * strength); y((e.clientY - r.top - r.height / 2) * strength); };
    const lv = () => { x(0); y(0); };
    el.addEventListener("pointermove", mv); el.addEventListener("pointerleave", lv);
    return () => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerleave", lv); };
  }, [strength]);
  return <span ref={ref} className="inline-block">{children}</span>;
}

/* C075 + C076 + C077 + C080 */
const LINKS = [["Collections", "collections"], ["Bestsellers", "bestsellers"], ["Woods", "woods"], ["Showroom", "showroom"]];
export function Navbar() {
  const ref = useRef<HTMLElement>(null), menu = useRef<HTMLDivElement>(null);
  const [solid, setSolid] = useState(false), [open, setOpen] = useState(false);
  useGSAP(() => {
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => {
      ref.current!.style.transform = s.direction === 1 && s.scroll() > 400 ? "translateY(-110%)" : "translateY(0)";
      setSolid(s.scroll() > 60);
    } });
  });
  useGSAP(() => {
    if (!open || !menu.current) return;
    gsap.fromTo(menu.current, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "power3.inOut" });
    gsap.from(".mlink", { yPercent: 120, stagger: 0.06, delay: 0.3, duration: 0.7, ease: "power4.out" });
  }, { dependencies: [open] });
  return (
    <>
      <nav ref={ref} style={{ top: "env(safe-area-inset-top,0px)" }} className="fixed inset-x-0 z-50 transition-transform duration-500">
        <div className={`gutter mx-auto mt-3 flex h-14 max-w-[1400px] items-center justify-between rounded-full transition-all duration-500 md:mx-4 ${solid ? "mx-3 bg-paper/80 shadow-[0_8px_30px_rgba(29,26,23,.08)] backdrop-blur-md" : ""}`}>
          <a href="#top" aria-label="Kaath & Co. home"><Wordmark /></a>
          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map(([l, h]) => <a key={h} href={`#${h}`} className="group relative text-sm font-medium">{l}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" /></a>)}
            <Magnetic><a href="#visit" className="inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-teak">Book a visit</a></Magnetic>
          </div>
          <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)} className="relative z-[70] grid h-10 w-10 place-items-center rounded-full bg-ink md:hidden">
            <span className={`absolute h-[1.5px] w-4 bg-paper transition-transform ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
            <span className={`absolute h-[1.5px] w-4 bg-paper transition-transform ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
          </button>
        </div>
      </nav>
      {open && (
        <div ref={menu} className="gutter fixed inset-0 z-[65] flex flex-col justify-end bg-teak pb-16 text-paper">
          {[...LINKS, ["Book a visit", "visit"]].map(([l, h], i) => (
            <div key={h} className="overflow-hidden border-b border-paper/15">
              <a href={`#${h}`} onClick={() => setOpen(false)} className="mlink flex items-baseline justify-between py-4">
                <span className="disp text-5xl">{l}</span><span className="cat text-brass">0{i + 1}</span></a>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* C063 */
export function Reveal({ children, stagger = 0.1, className = "", y = 50 }: { children: React.ReactNode; stagger?: number; className?: string; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    gsap.from(ref.current!.children, { y, opacity: 0, duration: 1, ease: "power3.out", stagger, scrollTrigger: { trigger: ref.current, start: "top 85%" } });
  }, { scope: ref });
  return <div ref={ref} className={className}>{children}</div>;
}

/* C021 line mask reveal */
export function Lines({ text, as: Tag = "h2", className = "", delay = 0, onLoad = false }:
  { text: string; as?: any; className?: string; delay?: number; onLoad?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    document.fonts.ready.then(() => {
      if (!ref.current) return;
      SplitText.create(ref.current, { type: "lines", mask: "lines", autoSplit: true,
        onSplit: (s) => gsap.from(s.lines, { yPercent: 105, duration: 1.1, ease: "power4.out", stagger: 0.09, delay,
          scrollTrigger: onLoad ? undefined : { trigger: ref.current, start: "top 88%" } }) });
    });
  });
  return <Tag ref={ref} className={className}>{text}</Tag>;
}

/* C022 word opacity scrub */
export function ScrubText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    document.fonts.ready.then(() => {
      if (!ref.current) return;
      const s = SplitText.create(ref.current, { type: "words" });
      gsap.fromTo(s.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 50%", scrub: true } });
    });
  });
  return <p ref={ref} className={className}>{text}</p>;
}

/* C027 velocity marquee */
export function Marquee({ items }: { items: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    const tw = gsap.to(track.current, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => {
      gsap.to(tw, { timeScale: s.direction * Math.min(5, 1 + Math.abs(s.getVelocity()) / 300), duration: 0.4, overwrite: true });
    } });
  });
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-line py-5">
      <div ref={track} className="inline-flex whitespace-nowrap">
        {row.map((t, i) => <span key={i} className="disp flex shrink-0 items-center gap-8 pr-8 text-4xl md:text-6xl">{t}<svg viewBox="0 0 20 20" className="h-5 w-5 fill-brass"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" /></svg></span>)}
      </div>
    </div>
  );
}

/* C030 */
export function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: 2, ease: "power2.out", onUpdate: () => { ref.current!.textContent = o.v.toFixed(decimals) + suffix; },
      scrollTrigger: { trigger: ref.current, start: "top 92%" } });
  });
  return <span ref={ref}>{to.toFixed(decimals)}{suffix}</span>;
}
