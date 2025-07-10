import React, { useState, useEffect, forwardRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from './base';
import { formatQuestEmailContent } from '../utils/questUtils';
import '../styling/components/quest-form.css';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * Form validation constants
 */
const VALIDATION_CONFIG = {
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 2000,
  RATE_LIMIT_COOLDOWN: 60000, // 1 minute
  SUBMISSION_DELAY: 3000, // 3 seconds
  DEFAULT_MAX_PROGRESS: 100,
  DEFAULT_PROGRESS_PER_FIELD: 0
};

/**
 * Spam protection patterns
 */
const SPAM_PATTERNS = {
  HONEYPOT_FIELDS: ['website', 'email_confirm'],
  SUSPICIOUS_CONTENT: [
    /http[s]?:\/\//i, // URLs
    /[A-Z]{5,}/g, // ALL CAPS
    /\b(spam|viagra|casino|poker|lottery|make money|earn money|weight loss|free money|get rich)\b/i
  ],
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

/**
 * FormSubmit configuration
 */
const FORM_SUBMIT_CONFIG = {
  DEFAULT_ACTION: "https://formsubmit.co/vitiet.programmer@gmail.com",
  DEFAULT_METHOD: "POST",
  SUBJECT: "⚔️ New Quest Alert! 🗺️",
  TEMPLATE: "table",
  CAPTCHA: false,
  AUTORESPONSE: "🎉 Thank you for your quest submission! I'll review your message and get back to you soon. Your adventure awaits! 🏰",
  BLACKLIST: "spam,viagra,casino,poker,lottery,make money fast,work from home,earn money online,weight loss,free money,click here,limited time,act now,urgent,exclusive offer,guaranteed,no risk,100% free,amazing results,miracle cure"
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates form data for spam and content requirements
 * @param {Object} formData - The form data to validate
 * @returns {boolean} - True if validation passes, false otherwise
 */
const validateFormData = (formData) => {
  // Check honeypot fields (should be empty)
  for (const field of SPAM_PATTERNS.HONEYPOT_FIELDS) {
    if (formData[field] && formData[field].trim() !== '') {
      console.log('Spam detected: honeypot field filled');
      return false;
    }
  }
  
  // Check for suspicious content
  const messageText = formData.details || '';
  for (const pattern of SPAM_PATTERNS.SUSPICIOUS_CONTENT) {
    if (pattern.test(messageText)) {
      console.log('Spam detected: suspicious content');
      return false;
    }
  }
  
  // Check message length
  if (messageText.length < VALIDATION_CONFIG.MIN_MESSAGE_LENGTH || 
      messageText.length > VALIDATION_CONFIG.MAX_MESSAGE_LENGTH) {
    alert('📜 Quest details should be between 10 and 2000 characters!');
    return false;
  }
  
  // Check email format
  if (!SPAM_PATTERNS.EMAIL_REGEX.test(formData.email || '')) {
    alert('📧 Please enter a valid email address!');
    return false;
  }
  
  return true;
};

/**
 * Calculates form progress based on filled fields
 * @param {Array} formFields - Array of form field configurations
 * @param {Object} formData - Current form data
 * @param {number} progressPerField - Progress points per valid field
 * @param {number} maxProgress - Maximum progress value
 * @returns {number} - Current progress value
 */
const calculateProgress = (formFields, formData, progressPerField, maxProgress) => {
  const validFields = formFields.filter(field => {
    const value = formData[field.id];
    return value && value.trim() !== '';
  }).length;
  
  const progressPerFieldValue = Number(progressPerField) || VALIDATION_CONFIG.DEFAULT_PROGRESS_PER_FIELD;
  const maxProgressValue = Number(maxProgress) || VALIDATION_CONFIG.DEFAULT_MAX_PROGRESS;
  
  return Math.min(validFields * progressPerFieldValue, maxProgressValue);
};

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================

/**
 * QuestForm Component
 * 
 * A gamified contact form component with RPG-themed styling, progress tracking,
 * spam protection, and animated feedback. Uses FormSubmit for email processing.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.formFields - Array of field configurations
 * @param {string} props.submitLabel - Text for submit button
 * @param {number} props.progressPerField - Progress points per valid field
 * @param {number} props.maxProgress - Maximum progress value
 * @param {Function} props.onInputChange - Callback for input changes
 * @param {Object} props.formData - Current form data
 * @param {Function} props.onSubmit - Callback for form submission
 * @param {Object} props.formConfig - Form configuration (action, method)
 * @param {Function} props.onConfettiTrigger - Callback to trigger confetti animation
 * @param {React.Ref} ref - Forwarded ref for form access
 */
const QuestForm = forwardRef(function QuestForm({ 
  formFields, 
  submitLabel, 
  progressPerField, 
  maxProgress, 
  onInputChange, 
  formData, 
  onSubmit, 
  formConfig,
  onConfettiTrigger
}, ref) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Update progress when form data changes
   */
  useEffect(() => {
    const newProgress = calculateProgress(formFields, formData, progressPerField, maxProgress);
    setProgress(newProgress);
  }, [formData, formFields, progressPerField, maxProgress]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle input field changes
   * @param {string} id - Field ID
   * @param {string} value - Field value
   */
  const handleInputChange = useCallback((id, value) => {
    if (onInputChange) {
      onInputChange(id, value);
    }
  }, [onInputChange]);

  /**
   * Submit form data using traditional form submission
   */
  const submitFormData = useCallback(() => {
    if (ref?.current?.form) {
      // Set form target to open in new tab
      ref.current.form.target = '_blank';
      ref.current.form.submit();
      
      // Reset target after submission
      setTimeout(() => {
        if (ref.current.form) {
          ref.current.form.target = '_self';
        }
      }, 100);
    }
  }, [ref]);

  /**
   * Handle form submission with validation and rate limiting
   * @param {Event} e - Form submission event
   */
  const handleSubmitClick = useCallback((e) => {
    e.preventDefault();
    
    // Spam protection checks
    if (!validateFormData(formData)) {
      return;
    }
    
    // Rate limiting - prevent multiple submissions
    const now = Date.now();
    if (now - lastSubmitTime < VALIDATION_CONFIG.RATE_LIMIT_COOLDOWN) {
      alert('⏰ Please wait a moment before submitting another quest!');
      return;
    }
    
    const maxProgressValue = Number(maxProgress) || VALIDATION_CONFIG.DEFAULT_MAX_PROGRESS;
    
    if (progress >= maxProgressValue && !isSubmitting) {
      setIsSubmitting(true);
      setLastSubmitTime(now);
      
      // Trigger confetti animation via parent callback
      if (onConfettiTrigger) {
        onConfettiTrigger();
      }
      
      // Format the HTML template for the email body
      if (ref?.current?.hiddenMessage) {
        const formatted = formatQuestEmailContent(formData);
        ref.current.hiddenMessage.value = formatted;
        console.log('Formatted RPG HTML template for email body:', formatted);
      }
      
      // Delay the actual form submission
      setTimeout(() => {
        if (onSubmit) {
          onSubmit(e);
        }
        submitFormData();
        setIsSubmitting(false);
      }, VALIDATION_CONFIG.SUBMISSION_DELAY);
    }
  }, [formData, lastSubmitTime, progress, maxProgress, isSubmitting, ref, onSubmit, submitFormData, onConfettiTrigger]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  /**
   * Render individual form field based on type
   * @param {Object} field - Field configuration
   * @returns {JSX.Element} - Rendered field component
   */
  const renderField = useCallback((field) => {
    const value = formData[field.id] || '';
    const isValid = value && value.trim() !== '';
    const fieldClass = `quest-field${isValid ? ' valid' : ''}`;

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={fieldClass}
            required={field.required}
          >
            <option value="">Select your {field.label.toLowerCase()}...</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
        
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`${fieldClass}${field.id === 'details' ? ' quest-details' : ''}`}
            required={field.required}
            rows={4}
          />
        );
        
      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={fieldClass}
            required={field.required}
          />
        );
    }
  }, [formData, handleInputChange]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const maxProgressValue = Number(maxProgress) || VALIDATION_CONFIG.DEFAULT_MAX_PROGRESS;
  const isFormReady = progress >= maxProgressValue;
  const submitClass = `quest-submit${isFormReady ? ' ready' : ''}${isSubmitting ? ' submitting' : ''}`;
  
  const progressPercentage = useMemo(() => 
    `${(progress / maxProgressValue) * 100}%`, 
    [progress, maxProgressValue]
  );

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <form
      ref={el => { 
        if (ref?.current) ref.current.form = el; 
      }}
      action={formConfig?.action || FORM_SUBMIT_CONFIG.DEFAULT_ACTION}
      method={formConfig?.method || FORM_SUBMIT_CONFIG.DEFAULT_METHOD}
      className="quest-form"
    >
      <Card className="quest-form-container" hover={false}>
        {/* Progress Bar */}
        <div className="xp-progress-container">
          <div className="xp-label">
            <span className="xp-icon">⚡</span>
            Quest Progress: {progress}/{maxProgressValue}
          </div>
          <div className="xp-bar">
            <motion.div
              className="xp-fill"
              initial={{ width: 0 }}
              animate={{ width: progressPercentage }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="form-fields">
          {formFields.map((field, index) => (
            <motion.div
              key={field.id}
              className="field-container"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <label className="field-label">
                <span className="label-icon">📜</span>
                {field.label}
              </label>
              {renderField(field)}
            </motion.div>
          ))}
        </div>

        {/* Hidden fields for FormSubmit processing */}
        <input type="hidden" name="_replyto" value={formData.email || ''} />
        <input type="hidden" name="_subject" value={FORM_SUBMIT_CONFIG.SUBJECT} />
        <input type="hidden" name="_captcha" value={FORM_SUBMIT_CONFIG.CAPTCHA} />
        <input type="hidden" name="_template" value={FORM_SUBMIT_CONFIG.TEMPLATE} />
        <input type="hidden" name="_autoresponse" value={FORM_SUBMIT_CONFIG.AUTORESPONSE} />
        <input type="hidden" name="_blacklist" value={FORM_SUBMIT_CONFIG.BLACKLIST} />
        
        {/* Hidden fields for structured data */}
        <input type="hidden" name="name" value={formData.name || ''} />
        <input type="hidden" name="email" value={formData.email || ''} />
        <input type="hidden" name="role" value={formData.role || ''} />
        <input type="hidden" name="questType" value={formData.questType || ''} />
        <input type="hidden" name="details" value={formData.details || ''} />
        
        {/* Hidden field for the HTML template */}
        <input
          type="hidden"
          name="message"
          ref={el => { 
            if (ref?.current) ref.current.hiddenMessage = el; 
          }}
        />
        
        {/* Spam Protection - Honeypot Fields */}
        <div style={{ display: 'none' }}>
          <input type="text" name="website" tabIndex="-1" autoComplete="off" />
          <input type="email" name="email_confirm" tabIndex="-1" autoComplete="off" />
        </div>

        {/* Submit Button */}
        <div className="quest-submit-container">
          <motion.button
            type="submit"
            className={`${submitClass} center-submit`}
            disabled={!isFormReady}
            whileHover={isFormReady ? { scale: 1.02 } : {}}
            whileTap={isFormReady ? { scale: 0.98 } : {}}
            animate={isFormReady ? {
              boxShadow: [
                "0 0 20px rgba(255, 215, 0, 0.3)",
                "0 0 30px rgba(255, 215, 0, 0.6)",
                "0 0 20px rgba(255, 215, 0, 0.3)"
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={handleSubmitClick}
          >
            <span className="submit-icon">💎</span>
            {submitLabel}
          </motion.button>
        </div>
      </Card>
    </form>
  );
});

export default QuestForm; 