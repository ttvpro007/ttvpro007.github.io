import React from "react";
import { Navbar } from "@/components/layout";
import { layout } from "@/data";
import { SECTION_TYPES } from "@/lib/content/sectionTypes";
import { visiblePages } from "@/lib/content/siteLayout";
import SitePage from "./pages/SitePage";
import { AnimatePresence, motion } from "framer-motion";

// Pages and their sections come from content/site/layout.json (section components load on first use)
const PAGES = visiblePages(layout);
const pageById = (id) => PAGES.find((p) => p.id === id);
const exitDelayOf = (page) => Math.max(0, ...(page?.sections || []).map((s) => SECTION_TYPES[s.type].exitDelay || 0));

/** ?project=<slug> deep-links to the page that opens project modals; ?page=<slug> picks a page; else the first one. */
const initialPage = () => {
  const params = new URLSearchParams(window.location.search);
  const linked = params.has("project") && PAGES.find((p) => p.sections.some((s) => SECTION_TYPES[s.type].deepLink));
  return (linked || PAGES.find((p) => p.slug === params.get("page")) || PAGES[0])?.id;
};

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];

function Confetti() {
  // Simple confetti effect using CSS
  const confettiPieces = Array.from({ length: 40 });
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: 2000,
      overflow: "hidden"
    }}>
      {confettiPieces.map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20 + 5}%`,
            width: 12,
            height: 12,
            borderRadius: 3,
            background: `hsl(${Math.random() * 360}, 80%, 60%)`,
            opacity: 0.85,
            animation: `confetti-fall 1.8s cubic-bezier(.4,2,.6,1) forwards`,
            animationDelay: `${Math.random() * 0.8}s`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}

function SecretBadge({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.5, type: 'spring' }}
          style={{
            position: 'fixed',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2100,
            background: 'linear-gradient(90deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
            color: '#fff',
            border: '3px solid var(--color-highlight)',
            borderRadius: 16,
            padding: '1rem 2.5rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.5rem',
            boxShadow: '0 0 24px var(--color-secondary), 0 0 8px var(--color-highlight)',
            textShadow: '0 0 8px var(--color-primary), 0 0 2px var(--color-highlight)',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span role="img" aria-label="trophy">🏆</span> Secret Unlocked!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [page, setPage] = React.useState(initialPage);
  const konamiRef = React.useRef([]);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (e) => {
      const next = [...konamiRef.current, e.key].slice(-KONAMI_CODE.length);
      konamiRef.current = next;
      if (next.join() === KONAMI_CODE.join()) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handlePageChange = (newPage) => {
    // Some sections (the projects search bar) animate out before the page switches
    const delay = newPage !== page ? exitDelayOf(pageById(page)) : 0;
    if (delay) {
      setIsTransitioning(true);
      setTimeout(() => {
        setPage(newPage);
        setIsTransitioning(false);
      }, delay);
    } else {
      setPage(newPage);
    }
  };

  const current = pageById(page);

  return (
    <div>
      <SecretBadge show={showConfetti} />
      {showConfetti && <Confetti />}
      <Navbar pages={PAGES} setPage={handlePageChange} currentPage={page} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={page}
          className="app-main"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <React.Suspense fallback={null}>
            {current && <SitePage page={current} isTransitioning={isTransitioning} />}
          </React.Suspense>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default App;
