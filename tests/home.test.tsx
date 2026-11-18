// @vitest-environment happy-dom
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
    press(button("Save this prompt"));
    expect(button("Saved to your margin").getAttribute("aria-pressed")).toBe("true");
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
