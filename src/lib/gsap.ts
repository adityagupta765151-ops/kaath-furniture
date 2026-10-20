import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
export const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 769px)").matches;
export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
