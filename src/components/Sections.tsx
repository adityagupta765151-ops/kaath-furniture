import { useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip, ScrollTrigger, useGSAP, reduced, finePointer } from "../lib/gsap";
import { Counter, Lines, Magnetic, Reveal, ScrubText } from "./Core";

const IMG = (n: string) => `./img/${n}.jpg`;
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function Head({ no, kicker, title, note, light = false }: { no: string; kicker: string; title: string; note?: string; light?: boolean }) {
  return (
    <div className="grid gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <div className={`cat mb-5 flex items-center gap-3 ${light ? "text-brass" : "text-mute"}`}><span className={light ? "text-paper/60" : "text-ink"}>§ {no}</span><span className="h-px w-10 bg-current" />{kicker}</div>
        <Lines text={title} className="disp text-[clamp(40px,6.5vw,96px)]" />
      </div>
      {note && <p className={`max-w-[38ch] md:col-span-4 md:justify-self-end ${light ? "text-paper/70" : "text-mute"}`}>{note}</p>}
    </div>
  );
}

/* Intro: statement + facts */
export function Intro() {
  const facts: [React.ReactNode, string][] = [
    [<><Counter to={4} /> woods</>, "Sheesham, teak, mango, cane"],
    [<><Counter to={10} /> yrs</>, "Warranty on every frame"],
    [<>3–4 wks</>, "Made to order, to your size"],
    [<>₹<Counter to={0} /></>, "Delivery & fitting in Prayagraj"],
  ];
  return (
    <section className="gutter mx-auto max-w-[1400px] py-24 md:py-36">
      <div className="cat mb-8 text-mute">§ 01 — The workshop</div>
      <ScrubText className="disp max-w-[24ch] text-[clamp(32px,4.6vw,72px)] !leading-[1.05]"
        text="We build sofas, beds and dining tables from seasoned solid wood, in finishes chosen for Indian homes, and we deliver every piece ourselves." />
      <Reveal className="mt-20 grid grid-cols-2 gap-y-10 border-t border-line pt-10 md:grid-cols-4">
        {facts.map(([v, l], i) => (
          <div key={i} className={`pr-4 ${i ? "md:border-l md:border-line md:pl-8" : ""}`}>
            <div className="disp text-5xl tabular-nums md:text-6xl">{v}</div>
            <div className="mt-3 text-sm text-mute">{l}</div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* C051 horizontal collections */
const COLLECTIONS = [
  { n: "Living", img: "living", from: 18900, count: 42, note: "Sofas, armchairs, coffee tables, TV units" },
  { n: "Bedroom", img: "bedroom", from: 24500, count: 31, note: "Storage beds, wardrobes, side tables" },
  { n: "Dining", img: "dining", from: 22000, count: 18, note: "4, 6 and 8 seaters, benches, crockery units" },
  { n: "Study", img: "study", from: 9800, count: 15, note: "Desks, bookshelves, reading lamps and chairs" },
  { n: "Accents", img: "decor", from: 2400, count: 60, note: "Moodhas, cane stools, mirrors, lamps" },
];
export function Collections() {
  const sec = useRef<HTMLElement>(null), track = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    ScrollTrigger.matchMedia({ "(min-width: 769px)": () => {
      if (reduced()) return;
      const tw = gsap.to(track.current, { x: () => -(track.current!.scrollWidth - innerWidth), ease: "none",
        scrollTrigger: { trigger: sec.current, pin: true, scrub: 1, end: () => "+=" + (track.current!.scrollWidth - innerWidth), invalidateOnRefresh: true } });
      gsap.utils.toArray<HTMLElement>(".col-img").forEach((img) =>
        gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tw, start: "left right", end: "right left", scrub: true } }));
    } });
  });
  return (
    <section ref={sec} id="collections" className="overflow-hidden bg-paper md:flex md:h-screen md:items-center">
      <div ref={track} className="gutter flex flex-col gap-10 py-24 md:w-max md:flex-row md:items-center md:gap-8 md:py-0">
        <div className="md:w-[34vw] md:shrink-0 md:pr-10">
          <Head no="02" kicker="Collections" title="Five rooms, one workshop." />
          <p className="mt-6 max-w-[34ch] text-mute">Every collection uses the same joinery and the same seasoned wood. Pick a room to start.</p>
        </div>
        {COLLECTIONS.map((c, i) => (
          <a key={c.n} href="#bestsellers" data-cursor="Explore" className="group block md:w-[30vw] md:min-w-[340px] md:shrink-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-line">
              <img src={IMG(c.img)} alt={`${c.n} collection`} loading="lazy" className="col-img absolute inset-0 h-full w-[116%] max-w-none -translate-x-[8%] object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="cat absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1.5">0{i + 1} / 05</span>
              <span className="cat absolute right-4 top-4 rounded-full bg-ink/80 px-3 py-1.5 text-paper">{c.count} pieces</span>
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div><h3 className="disp text-4xl">{c.n}</h3><p className="mt-2 text-sm text-mute">{c.note}</p></div>
              <div className="text-right"><div className="cat text-mute">from</div><div className="font-mono text-lg text-teak">{inr(c.from)}</div></div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* C064 tilt + C046 grid → fullscreen detail */
type P = { id: string; name: string; type: string; wood: string; dims: string; price: number; img: string; desc: string };
const PRODUCTS: P[] = [
  { id: "noor", name: "Noor", type: "3-seater sofa", wood: "Sheesham frame, emerald velvet", dims: "210 × 90 × 85 cm", price: 48500, img: "p-sofa", desc: "Deep seat, kiln-dried sheesham frame and a soft velvet that holds its colour through Prayagraj summers." },
  { id: "dhoop", name: "Dhoop", type: "3-seater sofa", wood: "Sheesham frame, tan leatherette", dims: "220 × 92 × 84 cm", price: 56000, img: "p-leather", desc: "Mid-century lines with splayed wooden legs. Wipe-clean leatherette for homes with kids and chai." },
  { id: "baithak", name: "Baithak", type: "Lounge armchair", wood: "Sheesham legs, cotton velvet", dims: "76 × 80 × 88 cm", price: 18900, img: "p-chair", desc: "A wingback reading chair in turmeric yellow. Wide arms for a book and a cup." },
  { id: "kursi", name: "Kursi", type: "Dining chair", wood: "Mango wood legs, boucle fabric", dims: "52 × 58 × 92 cm", price: 7800, img: "p-dchair", desc: "A curved-back dining chair that is comfortable through a long Sunday lunch. Sold in sets of 2, 4 or 6." },
  { id: "patla", name: "Patla", type: "Counter stool", wood: "Solid teak, whitewash finish", dims: "38 × 38 × 75 cm", price: 4200, img: "p-stool", desc: "A simple four-leg teak stool with a footrest rail. Made for kitchen counters and breakfast bars." },
  { id: "taak", name: "Taak", type: "Wall cabinet", wood: "Mango wood, open shelves", dims: "60 × 30 × 180 cm", price: 14500, img: "p-cabinet", desc: "Tall open shelving for books, plants and the good crockery. Fixed to the wall by our fitting team." },
];
function TiltCard({ p, onOpen }: { p: P; onOpen: (p: P) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: React.PointerEvent) => {
    if (!finePointer() || reduced()) return;
    const r = ref.current!.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, { rotateY: x * 10, rotateX: -y * 10, duration: 0.5, ease: "power3.out", transformPerspective: 900 });
  };
  const leave = () => gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
  return (
    <button ref={ref} onPointerMove={move} onPointerLeave={leave} onClick={() => onOpen(p)} data-cursor="View" className="group block w-full text-left">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-line">
        <img data-flip-id={`img-${p.id}`} src={IMG(p.img)} alt={`${p.name} ${p.type}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="cat absolute bottom-4 left-4 rounded-full bg-paper/90 px-3 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">View details</span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div><div className="cat text-mute">KC-{p.id.toUpperCase().slice(0, 3)}-{String(p.price).slice(0, 2)}</div><h3 className="disp mt-1 text-3xl">{p.name}</h3><p className="text-sm text-mute">{p.type} · {p.wood.split(",")[0]}</p></div>
        <div className="text-right"><div className="font-mono text-lg">{inr(p.price)}</div><div className="cat mt-1 text-teak">EMI {inr(Math.round(p.price / 12))}/mo</div></div>
      </div>
    </button>
  );
}
export function Bestsellers() {
  const [sel, setSel] = useState<P | null>(null);
  const flipState = useRef<Flip.FlipState | null>(null), closing = useRef<string | null>(null);
  const open = (p: P) => { flipState.current = Flip.getState(`[data-flip-id="img-${p.id}"]`); setSel(p); };
  const close = () => {
    if (!sel) return;
    if (reduced()) { setSel(null); return; }
    gsap.to(".pd-panel > *", { opacity: 0, duration: 0.2 });
    flipState.current = Flip.getState(".pd-img"); closing.current = sel.id; setSel(null);
  };
  useLayoutEffect(() => {
    if (reduced() || !flipState.current) return;
    if (sel) {
      Flip.from(flipState.current, { targets: ".pd-img", duration: 0.8, ease: "power3.inOut", absolute: true, scale: true });
      gsap.from(".pd-panel > *", { y: 30, opacity: 0, stagger: 0.06, delay: 0.45, duration: 0.6, ease: "power3.out" });
      gsap.from(".pd-bg", { opacity: 0, duration: 0.5 });
    } else if (closing.current) {
      Flip.from(flipState.current, { targets: `[data-flip-id="img-${closing.current}"]`, duration: 0.7, ease: "power3.inOut", scale: true, zIndex: 120 });
      closing.current = null;
    }
    flipState.current = null;
  }, [sel]);
  return (
    <section id="bestsellers" className="gutter mx-auto max-w-[1400px] py-24 md:py-36">
      <Head no="03" kicker="Bestsellers" title="Pieces people come back for." note="Tap a piece to see its wood, size and price. Every price includes delivery and fitting in Prayagraj." />
      <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => <TiltCard key={p.id} p={p} onOpen={open} />)}
      </div>
      {sel && (
        <div data-lenis-prevent className="fixed inset-0 z-[80] overflow-y-auto" role="dialog" aria-modal="true" aria-label={`${sel.name} details`}
          onKeyDown={(e) => e.key === "Escape" && close()}>
          <div className="pd-bg fixed inset-0 bg-plaster" />
          <div className="relative grid min-h-full md:grid-cols-[1.3fr_1fr]">
            <div className="relative h-[55vh] md:sticky md:top-0 md:h-screen">
              <img data-flip-id={`img-${sel.id}`} src={IMG(sel.img)} alt={`${sel.name} ${sel.type}`} className="pd-img absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="pd-panel gutter flex flex-col justify-center gap-6 py-12 md:px-14">
              <button autoFocus onClick={close} className="cat self-start rounded-full border border-ink px-4 py-2 hover:bg-ink hover:text-paper">← Back to catalogue</button>
              <div className="cat text-mute">{sel.type}</div>
              <h3 className="disp text-[clamp(56px,7vw,110px)]">{sel.name}</h3>
              <p className="max-w-[42ch] text-lg text-mute">{sel.desc}</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-y border-line py-5 text-sm">
                <dt className="cat text-mute">Material</dt><dd>{sel.wood}</dd>
                <dt className="cat text-mute">Size (W×D×H)</dt><dd className="font-mono">{sel.dims}</dd>
                <dt className="cat text-mute">Delivery</dt><dd>3–4 weeks, fitted at home</dd>
                <dt className="cat text-mute">Warranty</dt><dd>10 years on the frame</dd>
              </dl>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div><div className="font-mono text-3xl">{inr(sel.price)}</div><div className="cat mt-1 text-teak">or {inr(Math.round(sel.price / 12))}/mo for 12 months</div></div>
                <a href="#visit" onClick={close} className="rounded-full bg-ink px-6 py-3.5 font-semibold text-paper hover:bg-teak">See it in the showroom</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* C053 sticky swatch + changing content */
const WOODS = [
  { n: "Sheesham", hi: "Indian rosewood", c1: "#6b3a22", c2: "#3e1f12", text: "Dense, dark-streaked and naturally termite resistant. Our first choice for sofa frames and dining tables.", tag: "Hardness ★★★★★" },
  { n: "Teak", hi: "Sagwan", c1: "#a8743c", c2: "#7a4f24", text: "Golden and naturally oily, so it shrugs off humidity. We use it for stools, cane pieces and anything near a window.", tag: "Weather ★★★★★" },
  { n: "Mango", hi: "Aam ki lakdi", c1: "#c9a173", c2: "#9c7449", text: "Lighter in tone and in price. A sustainable wood from fruit-bearing trees that have finished fruiting.", tag: "Value ★★★★★" },
  { n: "Cane", hi: "Hand-woven", c1: "#d9b77e", c2: "#b48d52", text: "Woven by hand in a classic open weave. It keeps a seat cool through May and June.", tag: "Airflow ★★★★★" },
];
export function Woods() {
  const sec = useRef<HTMLElement>(null);
  const [act, setAct] = useState(0);
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".wood-item").forEach((el, i) =>
      ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && setAct(i) }));
  }, { scope: sec });
  const w = WOODS[act];
  const grain = (a: string, b: string) => ({ background: `repeating-radial-gradient(ellipse 120% 18% at 30% 120%, ${a} 0 6px, ${b} 7px 9px, ${a} 10px 16px), linear-gradient(${a}, ${b})` });
  return (
    <section ref={sec} id="woods" className="bg-teak text-paper">
      <div className="gutter mx-auto max-w-[1400px] py-24 md:py-36">
        <Head light no="04" kicker="Materials" title="Know your wood." note="Every piece is tagged with its wood. Here is what each one is good at." />
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div className="hidden md:block">
            <div className="sticky top-28">
              <div className="relative aspect-square overflow-hidden rounded-[32px] transition-[background] duration-700" style={grain(w.c1, w.c2)}>
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between rounded-2xl bg-paper/90 p-5 text-ink backdrop-blur">
                  <div><div className="cat text-mute">Swatch 0{act + 1}</div><div className="disp mt-1 text-4xl">{w.n}</div></div>
                  <div className="cat text-teak">{w.tag}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {WOODS.map((x, i) => (
              <article key={x.n} className={`wood-item border-t border-paper/15 py-12 transition-opacity duration-500 md:min-h-[55vh] ${i === act ? "opacity-100" : "md:opacity-35"}`}>
                <div className="mb-6 h-24 rounded-2xl md:hidden" style={grain(x.c1, x.c2)} />
                <div className="cat text-brass">0{i + 1} · {x.hi}</div>
                <h3 className="disp mt-3 text-6xl md:text-7xl">{x.n}</h3>
                <p className="mt-5 max-w-[40ch] text-lg text-paper/75">{x.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* C044 pinned image stack */
const ROOMS = [
  ["room1", "The family living room", "Try: Dhoop sofa · round coffee table · Taak cabinet"],
  ["room2", "The boho corner", "Try: cane pendants · jute rug · Patla stools"],
  ["room3", "The calm white lounge", "Try: Noor sofa in ivory · cane mirrors"],
  ["room4", "The compact flat", "Try: L-shaped sofa · nesting tables"],
];
export function Rooms() {
  const sec = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  useGSAP(() => {
    if (reduced()) return;
    const cards = gsap.utils.toArray<HTMLElement>(".room-card");
    const tl = gsap.timeline({ scrollTrigger: { trigger: sec.current, start: "top top", end: "+=" + (cards.length - 1) * 90 + "%", pin: true, scrub: 1,
      onUpdate: (s) => setIdx(Math.min(cards.length - 1, Math.round(s.progress * (cards.length - 1)))) } });
    cards.slice(1).forEach((c, i) => {
      tl.fromTo(c, { yPercent: 105, rotate: i % 2 ? -4 : 4 }, { yPercent: 0, rotate: 0, ease: "none" })
        .to(cards[i], { scale: 0.9, filter: "brightness(.6)", ease: "none" }, "<");
    });
  }, { scope: sec });
  return (
    <section ref={sec} className="relative overflow-hidden bg-plaster md:h-screen">
      <div className="gutter mx-auto grid h-full max-w-[1400px] items-center gap-10 py-24 md:grid-cols-[1fr_1.5fr] md:py-0">
        <div>
          <div className="cat mb-5 text-mute">§ 05 — Room ideas</div>
          <h2 className="disp text-[clamp(40px,5.5vw,84px)]">Rooms to borrow ideas from.</h2>
          <div className="mt-10 hidden md:block">
            <div className="cat text-mute">0{idx + 1} / 0{ROOMS.length}</div>
            <div className="disp mt-2 text-3xl">{ROOMS[idx][1]}</div>
            <div className="mt-2 text-mute">{ROOMS[idx][2]}</div>
          </div>
        </div>
        <div className="relative grid gap-6 md:block md:aspect-[4/3]">
          {ROOMS.map(([img, t, d]) => (
            <figure key={img} className="room-card overflow-hidden rounded-[28px] md:absolute md:inset-0">
              <img src={IMG(img)} alt={t} loading="lazy" className="aspect-[4/3] h-full w-full object-cover" />
              <figcaption className="p-4 md:hidden"><div className="disp text-2xl">{t}</div><div className="text-sm text-mute">{d}</div></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* C054 how buying works */
const STEPS = [
  ["Visit or video call", "Walk through the showroom, or ask for a WhatsApp video tour of any piece."],
  ["Pick wood, fabric and size", "Choose from 4 woods, 30+ fabrics and custom widths for your wall."],
  ["We build it", "Your piece is made to order in 3–4 weeks. We send photos before it leaves the workshop."],
  ["Delivered and fitted", "Our own team delivers, assembles and takes the packaging away."],
];
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    gsap.fromTo(".pr-line", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 60%", scrub: true } });
  }, { scope: ref });
  return (
    <section className="gutter mx-auto max-w-[1400px] py-24 md:py-36">
      <Head no="06" kicker="How buying works" title="From showroom to your home." />
      <div ref={ref} className="relative mt-16">
        <span className="pr-line absolute left-0 right-0 top-[15px] hidden h-px origin-left bg-ink md:block" />
        <Reveal className="grid gap-10 md:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="relative">
              <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-brass font-mono text-sm text-ink">{i + 1}</span>
              <h3 className="disp mt-6 text-3xl">{t}</h3>
              <p className="mt-3 max-w-[30ch] text-mute">{d}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* Visit + booking */
export function Visit() {
  const [sent, setSent] = useState<string | null>(null);
  const field = "mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-base outline-none transition-colors focus:border-ink";
  return (
    <section id="visit" className="gutter mx-auto max-w-[1400px] py-24 md:py-32">
      <div className="grid overflow-hidden rounded-[36px] bg-paper md:grid-cols-2">
        <div id="showroom" className="relative min-h-[380px]">
          <img src={IMG("showroom")} alt="Inside the Kaath & Co. showroom" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-paper">
            <div className="cat text-brass">Showroom</div>
            <p className="disp mt-3 text-3xl">MG Marg, Civil Lines<br />Prayagraj 211001</p>
            <p className="mt-3 text-paper/75">Open daily, 10:30 AM – 8:30 PM</p>
          </div>
        </div>
        <div className="p-7 md:p-12">
          <div className="cat text-mute">§ 07 — Book a visit</div>
          <h2 className="disp mt-4 text-[clamp(36px,4vw,60px)]">Sit on it before you buy it.</h2>
          {sent ? <p className="mt-8 rounded-2xl bg-plaster p-6 text-lg">{sent}</p> : (
            <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={(e) => {
              e.preventDefault(); const f = new FormData(e.currentTarget);
              setSent(`Thanks ${f.get("name")}. Your visit on ${f.get("date") || "your chosen day"} is requested. We'll call to confirm and keep the ${String(f.get("room")).toLowerCase()} pieces ready.`);
            }}>
              <label className="cat text-mute">Name<input id="v-name" name="name" required placeholder="Ananya Mishra" className={field + " font-sans normal-case tracking-normal text-ink"} /></label>
              <label className="cat text-mute">Mobile<input id="v-phone" name="phone" required inputMode="tel" pattern="[0-9 +]{10,14}" placeholder="98xxxxxx21" className={field + " font-sans normal-case tracking-normal text-ink"} /></label>
              <label className="cat text-mute">Looking for<select id="v-room" name="room" className={field + " font-sans normal-case tracking-normal text-ink"}>{COLLECTIONS.map(c => <option key={c.n}>{c.n}</option>)}</select></label>
              <label className="cat text-mute">Preferred day<input id="v-date" name="date" type="date" className={field + " font-sans normal-case tracking-normal text-ink"} /></label>
              <Magnetic strength={0.2}><button className="mt-2 rounded-full bg-ink px-7 py-4 font-semibold text-paper hover:bg-teak">Request a visit →</button></Magnetic>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* C091 */
const FAQ = [
  ["Can I order a custom size?", "Yes. Most sofas, beds and tables can be made wider or narrower. Share your wall size and we'll suggest options."],
  ["Is there EMI?", "Yes. No-cost EMI for 6 or 12 months on orders above ₹15,000 with most credit cards."],
  ["Do you deliver outside Prayagraj?", "We deliver across Uttar Pradesh. Delivery and fitting are free inside Prayagraj city."],
  ["How do I care for solid wood?", "Wipe with a dry cloth, keep it out of direct afternoon sun and use coasters. We polish your piece free once a year."],
  ["What does the warranty cover?", "Ten years on the wooden frame and joinery, one year on fabric, foam and hardware."],
];
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="gutter mx-auto grid max-w-[1400px] gap-12 py-24 md:grid-cols-[1fr_1.4fr] md:py-32">
      <div><div className="cat mb-5 text-mute">§ 08 — Questions</div><Lines text="Good to know." className="disp text-[clamp(40px,5.5vw,84px)]" /></div>
      <div className="border-t border-line">
        {FAQ.map(([q, a], i) => (
          <div key={q} className="border-b border-line">
            <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left">
              <span className="disp text-2xl">{q}</span>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink transition-all duration-300 ${open === i ? "rotate-45 bg-ink text-paper" : ""}`}>+</span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <p className="overflow-hidden text-lg text-mute"><span className="block max-w-[52ch] pb-6">{a}</span></p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
