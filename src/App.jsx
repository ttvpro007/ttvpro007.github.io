import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import { AnimatePresence, motion } from "framer-motion";

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
            background: 'linear-gradient(90deg, #FC9460 0%, #EEB64B 100%)',
            color: '#fff',
            border: '3px solid #A92F5F',
            borderRadius: 16,
            padding: '1rem 2.5rem',
            fontFamily: 'Orbitron, Rajdhani, Segoe UI, Arial, sans-serif',
            fontWeight: 700,
            fontSize: '1.5rem',
            boxShadow: '0 0 24px #FC9460, 0 0 8px #A92F5F',
            textShadow: '0 0 8px #EEB64B, 0 0 2px #A92F5F',
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
  const [page, setPage] = React.useState("Home");
  const [konami, setKonami] = React.useState([]);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (e) => {
      setKonami((prev) => {
        const next = [...prev, e.key].slice(-KONAMI_CODE.length);
        if (next.join() === KONAMI_CODE.join()) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handlePageChange = (newPage) => {
    // If we're leaving the Projects page, add a delay for search component exit
    if (page === "Projects" && newPage !== "Projects") {
      setIsTransitioning(true);
      // Delay matches the search component's exit animation duration
      setTimeout(() => {
        setPage(newPage);
        setIsTransitioning(false);
      }, 150); // 50ms animation + 100ms buffer
    } else {
      setPage(newPage);
    }
  };

  const renderPage = () => {
    switch (page) {
      case "Home":
        return <Home />;
      case "Projects":
        return <Projects isTransitioning={isTransitioning} />;
      case "Resume":
        return <Resume />;
      case "Contact":
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div>
      <SecretBadge show={showConfetti} />
      {showConfetti && <Confetti />}
      <Navbar setPage={handlePageChange} currentPage={page} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={page}
          style={{ padding: "2rem", paddingTop: "5rem" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

export default App;
