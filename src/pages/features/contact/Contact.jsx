import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Confetti from 'react-dom-confetti';
import { QuestForm } from "@/components/features/forms";
import { SocialLinks, HQ } from "@/components/features/showcase";
import { profile as profileData, contact } from "@/data";
import "./Contact.css";

/**
 * Confetti animation configuration
 */
const CONFETTI_CONFIG = {
  angle: 90,
  spread: 60,
  startVelocity: 35,
  elementCount: 50,
  dragFriction: 0.1,
  duration: 3000,
  stagger: 0,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

export default function Contact() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({});
  const [confetti, setConfetti] = useState(false);
  const questFormRefs = useRef({ form: null, hiddenMessage: null });

  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  /**
   * Trigger confetti animation
   */
  const triggerConfetti = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 700); // 700ms duration
  };

  const handleSubmit = (e) => {
    // Add delay to let confetti animation finish before showing confirmation
    setTimeout(() => {
      setShowConfirmation(true);
    }, 3000); // 3 seconds delay to match confetti duration
    // Let the form submit naturally
  };

  return (
    <main>
      <div className="body-panel">
        <section className="contact-section">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="contact-header-banner"
          >
            <h1 className="header-1 contact-header-title">
              <span style={{ marginRight: '0.5rem' }}>🗺️</span>
              {contact.content.titleText}
            </h1>
            <p className="body-text contact-header-subtitle">
              <span style={{ marginRight: '0.5rem' }}>📜</span>
              {contact.content.subtitleText}
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="quest-content-grid">
            {/* Sidebar */}
            <div className="contact-sidebar">
              {/* Social Links */}
              <SocialLinks socialLinks={profileData.socialLinks} />
              {/* HQ Component */}
              <HQ 
                title={profileData.hq.title}
                location={profileData.hq.location}
                coordinates={profileData.hq.coordinates}
                timezone={profileData.hq.timezone}
                status={profileData.hq.status}
                description={profileData.hq.description}
                icon={profileData.hq.icon}
              />
            </div>
            {/* Quest Form Area */}
            <QuestForm
              ref={questFormRefs}
              formFields={contact.formFields}
              submitLabel={contact.content.submitLabel}
              progressPerField={contact.formConfig.progressPerField}
              maxProgress={contact.formConfig.maxProgress}
              onInputChange={handleInputChange}
              formData={formData}
              onSubmit={handleSubmit}
              formConfig={contact.formConfig}
              onConfettiTrigger={triggerConfetti}
            />
          </div>

          {/* Confetti Container */}
          <div className="quest-confetti-container">
            <Confetti active={confetti} config={CONFETTI_CONFIG} />
          </div>
        </section>
      </div>
    </main>
  );
} 