// @vitest-environment happy-dom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Home from "@/app/page";
import { concepts } from "@/lib/concepts";
import nextConfig from "@/next.config";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("home page (server render)", () => {
  it("renders one h1, every concept, the empty margin and the not-diagnosis notice", () => {
    const html = renderToString(<Home />);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("Notice what moves.");
    for (const concept of concepts) expect(html).toContain(concept.name);
    expect(html).toContain("No prompts saved yet");
    expect(html).toContain("Saved prompts and notes stay in this browser only.");
    expect(html).toContain("leave diagnosis to qualified professionals");
    expect(html).toContain("not diagnosis or treatment");
    expect(html).toContain('href="https://bookchaowalit.com/"');
  });
});

describe("home page (mounted)", () => {
  let root: Root;
  let host: HTMLDivElement;
  const $ = <T extends Element = HTMLElement>(selector: string) => host.querySelector(selector) as T | null;
  const button = (text: string) => [...host.querySelectorAll("button")].find((b) => (b.getAttribute("aria-label") ?? b.textContent)?.trim().startsWith(text)) as HTMLButtonElement;
  const press = (el: Element) => act(() => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
  const names = () => [...host.querySelectorAll(".rs-entry h3")].map((h) => h.textContent);

  beforeEach(() => {
    localStorage.clear();
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    act(() => root.render(<Home />));
  });
  afterEach(() => { act(() => root.unmount()); host.remove(); });

  it("filters by theme with pressed chips and says how many show", () => {
    expect(names()).toHaveLength(concepts.length);
    press(button("learning"));
    expect(names()).toEqual(["The spacing effect"]);
    expect(button("learning").getAttribute("aria-pressed")).toBe("true");
    expect($(".rs-count")!.textContent).toBe(`Showing 1 of ${concepts.length} concepts in “learning”`);
    press(button("All"));
    expect($(".rs-count")!.textContent).toBe(`${concepts.length} concepts`);
  });

  it("saves a prompt to the margin, keeps a private note, and removes it again", () => {
    press(button(`Save this prompt for ${concepts[0].name}`));
    expect(button(`Save this prompt for ${concepts[0].name}`).getAttribute("aria-pressed")).toBe("true");
    expect($(".psy-saved h3")!.textContent).toBe(concepts[0].name);
    expect(JSON.parse(localStorage.getItem("psychology-saved-prompts-v1")!)).toEqual([concepts[0].id]);
    const area = $<HTMLTextAreaElement>(".psy-saved textarea")!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")!.set!.call(area, "Noticed it after lunch");
      area.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(JSON.parse(localStorage.getItem("psychology-notes-v1")!)).toEqual({ [concepts[0].id]: "Noticed it after lunch" });
    press(button(`Remove saved prompt for ${concepts[0].name}`));
    expect($(".rs-empty h3")!.textContent).toBe("No prompts saved yet");
  });

  it("names each Save button after its concept, and keeps the name when pressed (aria-pressed carries the state)", () => {
    const saveNames = () => [...host.querySelectorAll<HTMLButtonElement>(".psy-detail button")].map((b) => b.textContent);
    const before = saveNames();
    expect(before).toEqual(concepts.map((concept) => `Save this prompt for ${concept.name}`));
    press(button(`Save this prompt for ${concepts[0].name}`));
    expect(saveNames()).toEqual(before);
    const card = host.querySelectorAll(".psy-detail")[0];
    expect(card.querySelector("button")!.getAttribute("aria-pressed")).toBe("true");
    expect(card.querySelector(".psy-saved-mark")?.textContent).toBe("✓ Saved to your margin");
  });

  it("keeps scroll targets clear of the top bar at its real height (it wraps to two rows on some widths)", () => {
    act(() => root.unmount());
    let notify: (() => void) | undefined;
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class { constructor(cb: () => void) { notify = cb; } observe() {} disconnect() {} unobserve() {} } as unknown as typeof ResizeObserver;
    const rect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () { return { height: this.classList.contains("rs-top") ? 103.4 : 0 } as DOMRect; };
    try {
      root = createRoot(host);
      act(() => root.render(<Home />));
      act(() => notify?.());
      expect(document.documentElement.style.getPropertyValue("--psy-top-height")).toBe("104px");
    } finally {
      globalThis.ResizeObserver = original;
      HTMLElement.prototype.getBoundingClientRect = rect;
    }
    const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
    expect(css).toMatch(/html \{ scroll-padding-top: calc\(var\(--psy-top-height, 52px\) \+ 12px\); \}/);
  });

  it("on a direct deep link (/#concepts) scrolls to the target again once the bar is measured", () => {
    act(() => root.unmount());
    window.location.hash = "#concepts";
    const scrolled: string[] = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function () { scrolled.push(this.id); };
    try {
      root = createRoot(host);
      act(() => root.render(<Home />));
      expect(scrolled).toEqual(["concepts"]);
    } finally {
      Element.prototype.scrollIntoView = original;
      window.location.hash = "";
    }
  });

  it("a malformed hash does not crash the page", () => {
    act(() => root.unmount());
    window.location.hash = "#%E0%A4%A";
    try {
      root = createRoot(host);
      expect(() => act(() => root.render(<Home />))).not.toThrow();
      expect(host.querySelector("h1")).not.toBeNull();
    } finally {
      window.location.hash = "";
    }
  });

  it("covers the two-row bar in CSS alone between 641px and 760px (before script runs, or without it)", () => {
    const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
    expect(css).toMatch(/@media \(min-width: 641px\) and \(max-width: 760px\) \{\s*html \{ scroll-padding-top: calc\(var\(--psy-top-height, 89px\) \+ 12px\); \}/);
  });

  it("reads saved prompts back from this browser on load", () => {
    act(() => root.unmount());
    localStorage.setItem("psychology-saved-prompts-v1", JSON.stringify([concepts[1].id]));
    root = createRoot(host);
    act(() => root.render(<Home />));
    expect($(".psy-saved h3")!.textContent).toBe(concepts[1].name);
  });
});

describe("next.config", () => {
  it("sends /more-projects to the hub with a permanent redirect", async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: "/more-projects", destination: "https://bookchaowalit.com/", permanent: true });
  });
});
