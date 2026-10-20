import { useEffect, useState } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { Cursor, Marquee, Navbar, Preloader, ScrollProgress, SmoothScroll } from "./components/Core";
import { MaskHero } from "./components/Hero";
import { Bestsellers, Collections, Faq, Intro, Process, Rooms, Visit, Woods } from "./components/Sections";
import { Footer } from "./components/Footer";

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const fix = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
    document.fonts.ready.then(fix); addEventListener("load", fix);
    return () => removeEventListener("load", fix);
  }, []);
  useEffect(() => { if (ready) { ScrollTrigger.sort(); ScrollTrigger.refresh(); } }, [ready]);
  return (
    <SmoothScroll>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <MaskHero ready={ready} />
        <Intro />
        <Marquee items={["Sheesham", "Teak", "Mango wood", "Hand-woven cane", "10-year warranty", "Made to order"]} />
        <Collections />
        <Bestsellers />
        <Woods />
        <Rooms />
        <Process />
        <Visit />
        <Faq />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
