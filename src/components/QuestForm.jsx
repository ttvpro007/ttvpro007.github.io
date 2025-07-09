import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './base';
import '../styling/components/quest-form.css';

export default function QuestForm({ formFields, submitLabel, onSubmit, progressPerField, maxProgress }) {
  const [formData, setFormData] = useState({});
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const validFields = formFields.filter(field => {
      const value = formData[field.id];
      return value && value.trim() !== '';
    }).length;
    const newProgress = Math.min(validFields * progressPerField, maxProgress);
    setProgress(newProgress);
  }, [formData, formFields, progressPerField, maxProgress]);

  const handleInputChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (progress < maxProgress) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Quest submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
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
            className={fieldClass}
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
  };

  const submitClass = `quest-submit${progress >= maxProgress ? ' ready' : ''}${isSubmitting ? ' submitting' : ''}`;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="quest-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="quest-form-container" hover={false}>
        {/* Progress Bar */}
        <div className="xp-progress-container">
          <div className="xp-label">
            <span className="xp-icon">⚡</span>
            Quest Progress: {progress}/{maxProgress}
          </div>
          <div className="xp-bar">
            <motion.div
              className="xp-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(progress / maxProgress) * 100}%` }}
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
        {/* Submit Button */}
        <motion.button
          type="submit"
          className={submitClass}
          disabled={progress < maxProgress || isSubmitting}
          whileHover={progress >= maxProgress ? { scale: 1.02 } : {}}
          whileTap={progress >= maxProgress ? { scale: 0.98 } : {}}
          animate={progress >= maxProgress ? {
            boxShadow: [
              "0 0 20px rgba(255, 215, 0, 0.3)",
              "0 0 30px rgba(255, 215, 0, 0.6)",
              "0 0 20px rgba(255, 215, 0, 0.3)"
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="submit-icon">💎</span>
          {isSubmitting ? 'Sending Quest...' : submitLabel}
        </motion.button>
      </Card>
    </motion.form>
  );
} 