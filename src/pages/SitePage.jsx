import React from "react";
import { SECTION_TYPES, sectionOptions } from "@/lib/content/sectionTypes";
import { SECTION_COMPONENTS, SECTION_FRAMES } from "./sections";

/** Consecutive sections with the same frame share one wrapper (e.g. the home column). */
const groupByFrame = (sections) => {
  const groups = [];
  for (const section of sections) {
    const frame = SECTION_TYPES[section.type].frame;
    const last = groups.at(-1);
    if (last && last.frame === frame && frame !== "page") last.sections.push(section);
    else groups.push({ frame, sections: [section] });
  }
  return groups;
};

/** One page from content/site/layout.json: its enabled sections, in order. */
export default function SitePage({ page, isTransitioning }) {
  return (
    <main>
      <div className="body-panel">
        {groupByFrame(page.sections).map((group) => {
          const Frame = SECTION_FRAMES[group.frame] || React.Fragment;
          return (
            <Frame key={group.sections[0].id}>
              {group.sections.map((section) => {
                const Component = SECTION_COMPONENTS[section.type];
                if (!Component) return null;
                const extra = SECTION_TYPES[section.type].exitDelay ? { isTransitioning } : {};
                return <Component key={section.id} {...sectionOptions(section)} {...extra} />;
              })}
            </Frame>
          );
        })}
      </div>
    </main>
  );
}
