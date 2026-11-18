"use client";

import { useState } from "react";
import { EmptyState, Reader, ReaderFoot, ReaderHead, ReaderTop, ResultCount } from "@/components/reader-shell";
import { concepts, conceptsForTheme, MAX_NOTE, parseNotes, parseSaved, setNote, THEMES, toggleSaved, type Notes } from "@/lib/concepts";
import { useStoredState } from "@/lib/use-stored-state";

// Psychology Explorer on the Reader shell: every concept is a card with its definition, an everyday
// example and a reflection prompt; theme chips narrow the shelf; saved prompts and private notes live
// in "Your margin", in this browser only.

const NO_SAVED: string[] = [];
const NO_NOTES: Notes = {};
const SOURCE = "https://github.com/bookchaowalit-website/education-psychology-web";

export function PsychologyView() {
  const [theme, setTheme] = useState("all");
  const [saved, setSaved] = useStoredState("psychology-saved-prompts-v1", NO_SAVED, parseSaved);
  const [notes, setNotes] = useStoredState("psychology-notes-v1", NO_NOTES, parseNotes);
  const visible = conceptsForTheme(theme);
  const savedConcepts = concepts.filter((concept) => saved.includes(concept.id));

  return (
    <Reader>
      <ReaderTop name="Psychology Explorer" tagline="Quiet study archive" links={[{ href: "#concepts", label: "Concepts" }, { href: "#margin", label: "Your margin" }]} />
      <main id="main" className="rs-main">
        <ReaderHead
          eyebrow="A small reading room for everyday psychology"
          title="Notice what moves."
          lede="Short concept notes for learning and reflection. Take one idea into the day; leave diagnosis to qualified professionals."
        />

        <section aria-labelledby="concepts">
          <div className="rs-section-head"><h2 id="concepts">Concepts</h2></div>
          <div className="rs-toolbar">
            <ul className="psy-chips" aria-label="Filter by theme">
              {THEMES.map((item) => (
                <li key={item}>
                  <button type="button" className="rs-chip" aria-pressed={theme === item} onClick={() => setTheme(item)}>
                    {item === "all" ? "All" : item}<small>{conceptsForTheme(item).length}</small>
                  </button>
                </li>
              ))}
            </ul>
            <ResultCount shown={visible.length} total={concepts.length} noun="concept" filter={theme === "all" ? undefined : `“${theme}”`} />
          </div>
          <ul className="rs-list" data-layout="cards">
            {visible.map((concept) => {
              const isSaved = saved.includes(concept.id);
              return (
                <li key={concept.id}>
                  <article className="rs-entry">
                    <h3>{concept.name}</h3>
                    <p className="rs-entry-meta">Concept {concept.id} · {concept.theme}</p>
                    <p className="rs-entry-summary">{concept.definition}</p>
                    <div className="psy-detail">
                      <p><span className="psy-label">Everyday example</span>{concept.example}</p>
                      <p><span className="psy-label">Reflection prompt</span>{concept.prompt}</p>
                      <button type="button" className="rs-plain" aria-pressed={isSaved} onClick={() => setSaved((items) => toggleSaved(items, concept.id))}>
                        {isSaved ? "Saved to your margin ✓" : "Save this prompt"}
                      </button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="margin" className="psy-margin">
          <div className="rs-section-head"><h2 id="margin">Your margin</h2></div>
          {savedConcepts.length === 0 ? (
            <EmptyState title="No prompts saved yet" headingLevel={3} action={<a className="rs-button" href="#concepts">Choose a prompt</a>}>
              Press “Save this prompt” on any concept to keep it here with a private note. Saved prompts and notes stay in this browser only.
            </EmptyState>
          ) : (
            <ul className="rs-list">
              {savedConcepts.map((concept) => (
                <li key={concept.id}>
                  <article className="psy-saved">
                    <h3>{concept.name}</h3>
                    <p>{concept.prompt}</p>
                    <label>
                      Your note on {concept.name} (private, this browser only)
                      <textarea rows={3} maxLength={MAX_NOTE} value={notes[concept.id] ?? ""} onChange={(event) => setNotes((current) => setNote(current, concept.id, event.target.value))} />
                    </label>
                    <button type="button" className="rs-plain" onClick={() => setSaved((items) => toggleSaved(items, concept.id))} aria-label={`Remove saved prompt for ${concept.name}`}>Remove</button>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <ReaderFoot source={SOURCE} note="Educational information for learning and self-observation, not diagnosis or treatment." />
    </Reader>
  );
}
