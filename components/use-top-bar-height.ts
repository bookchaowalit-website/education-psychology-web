import { useEffect } from "react";

/**
 * Site-local fix for the shared Reader shell (reader-shell.css stays byte-identical): the shell keeps 64px of
 * scroll-padding for its sticky top bar, but between 641px and 692px this site's name and links wrap the bar to two
 * rows (89px), so a jump to #concepts or #margin landed under it. This keeps --psy-top-height equal to the bar's real
 * height; globals.css adds it to scroll-padding-top (with an 89px CSS-only fallback in that range). A page opened on
 * a hash was scrolled before this ran, so it scrolls to that target once more with the measured padding.
 */
export function useTopBarHeight() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".rs-top");
    if (!bar) return;
    const root = document.documentElement.style;
    const update = () => root.setProperty("--psy-top-height", `${Math.ceil(bar.getBoundingClientRect().height)}px`);
    update();
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
    if (typeof ResizeObserver !== "function") return () => root.removeProperty("--psy-top-height");
    const observer = new ResizeObserver(update);
    observer.observe(bar);
    return () => { observer.disconnect(); root.removeProperty("--psy-top-height"); };
  }, []);
}
