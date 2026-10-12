import React from "react";

/**
 * Section components — one per entry in SECTION_TYPES (src/lib/content/sectionTypes.js).
 * Each receives its options (registry defaults filled in) as props. Components load on
 * first use, grouped by module, so a page only downloads what it shows.
 */
const lazyNamed = (load, name) => React.lazy(() => load().then((m) => ({ default: m[name] })));
const showcase = () => import("@/components/features/showcase");
const resume = () => import("./features/resume");

export const SECTION_COMPONENTS = {
  hero: lazyNamed(showcase, "Hero"),
  timeline: lazyNamed(showcase, "Timeline"),
  flipCards: lazyNamed(showcase, "FlipCards"),
  funFacts: lazyNamed(showcase, "FunFacts"),
  showAndTell: lazyNamed(showcase, "ShowAndTell"),
  projectsBrowser: React.lazy(() => import("./features/projects")),
  resumeProfile: lazyNamed(resume, "ResumeProfile"),
  resumeSkills: lazyNamed(resume, "ResumeSkills"),
  resumeEducation: lazyNamed(resume, "ResumeEducation"),
  resumeProjects: lazyNamed(resume, "ResumeProjects"),
  contactQuest: React.lazy(() => import("./features/contact")),
};

/** Wrappers for runs of consecutive sections that share a frame ('page' sections get none). */
export const SECTION_FRAMES = {
  stack: lazyNamed(() => import("./features/home"), "HomeFrame"),
  resume: lazyNamed(resume, "ResumeFrame"),
};
