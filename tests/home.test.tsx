import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { concepts } from "@/lib/concepts";

describe("home page", () => {
  it("renders the first concept, the empty margin and the not-diagnosis notice", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("what</i> moves.");
    expect(html).toContain(concepts[0].name);
    expect(html).toMatch(/0(<!-- -->)? saved prompts/);
    expect(html).toContain("Saved prompts and your notes stay in this browser only.");
    expect(html).toContain("leave diagnosis to qualified professionals");
    expect(html).toContain("Educational information · not diagnosis or treatment");
  });
});
