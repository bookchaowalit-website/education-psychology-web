import { useEffect } from "react";

/**
 * Site-local fix for the shared Reader shell (reader-shell.css stays byte-identical): the shell keeps 64px of
 * scroll-padding for its sticky top bar, but on some widths above 640px this site's name and links wrap the bar to
 * two rows, so a jump to #concepts or #margin landed under it. This keeps --psy-top-height equal to the bar's real
 * height; globals.css adds it to scroll-padding-top.
 */
export function useTopBarHeight() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".rs-top");
    if (!bar || typeof ResizeObserver !== "function") return;
    const root = document.documentElement.style;
    const update = () => root.setProperty("--psy-top-height", `${Math.ceil(bar.getBoundingClientRect().height)}px`);
    const observer = new ResizeObserver(update);
    observer.observe(bar);
    update();
    return () => { observer.disconnect(); root.removeProperty("--psy-top-height"); };
  }, []);
}
