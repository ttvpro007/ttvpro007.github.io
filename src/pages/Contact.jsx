import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import QuestForm, { formatQuestEmailContent } from "../components/QuestForm";
import SocialLinks from "../components/SocialLinks";
import ConfirmationModal from "../components/ConfirmationModal";
import HQ from "../components/HQ";
import profileData from "../data/profile.json";
import "../styling/pages/contact.css";

export default function Contact() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({});
  const questFormRefs = useRef({ form: null, hiddenMessage: null });

  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    // e.preventDefault(); // <--- Add this back!
    if (questFormRefs.current.hiddenMessage) {
      const formatted = formatQuestEmailContent(formData);
      questFormRefs.current.hiddenMessage.value = formatted;
      console.log('Formatted RPG message:', formatted);
    }
    setShowConfirmation(true);
    // Let the form submit naturally
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
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
              {profileData.contact.titleText}
            </h1>
            <p className="body-text contact-header-subtitle">
              <span style={{ marginRight: '0.5rem' }}>📜</span>
              {profileData.contact.subtitleText}
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
              formFields={profileData.contact.formFields}
              submitLabel={profileData.contact.submitLabel}
              progressPerField={profileData.contact.progressPerField}
              maxProgress={profileData.contact.maxProgress}
              onInputChange={handleInputChange}
              formData={formData}
              onSubmit={handleSubmit}
            />
          </div>
        </section>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        title={profileData.contact.confirmationTitle}
        text={profileData.contact.confirmationText}
        onClose={handleCloseConfirmation}
      />
    </main>
  );
} 