import React, { useState } from "react";
import { motion } from "framer-motion";
import QuestForm from "../components/QuestForm";
import SocialLinks from "../components/SocialLinks";
import ConfirmationModal from "../components/ConfirmationModal";
import HQ from "../components/HQ";
import { Card, Section } from "../components/base";
import profileData from "../data/profile.json";

export default function Contact() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleQuestSubmit = async (formData) => {
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a successful submission
    console.log("Quest submitted:", formData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <main>
      <div className="body-panel">
        <section style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '2rem'
        }}>
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              background: 'var(--card-bg)',
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--shadow)',
              border: '2px solid var(--primary)',
              padding: '2.5rem 2rem',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <h1 className="header-1" style={{ margin: '0 0 1rem 0' }}>
              <span style={{ marginRight: '0.5rem' }}>🗺️</span>
              {profileData.contact.titleText}
            </h1>
            <p className="body-text" style={{ 
              fontStyle: 'italic', 
              margin: 0, 
              color: 'var(--text-secondary)',
              fontSize: '1.1rem'
            }}>
              <span style={{ marginRight: '0.5rem' }}>📜</span>
              {profileData.contact.subtitleText}
            </p>
          </motion.div>

          {/* Main Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '2rem',
            width: '100%',
            alignItems: 'start'
          }}
          className="quest-content-grid"
          >
            {/* Sidebar */}
            <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
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
              formFields={profileData.contact.formFields}
              submitLabel={profileData.contact.submitLabel}
              onSubmit={handleQuestSubmit}
              progressPerField={profileData.contact.progressPerField}
              maxProgress={profileData.contact.maxProgress}
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