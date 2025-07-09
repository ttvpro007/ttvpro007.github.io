import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './base';

export default function QuestForm({ formFields, submitLabel, onSubmit, progressPerField, maxProgress }) {
  const [formData, setFormData] = useState({});
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate XP based on valid fields
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

    const fieldStyle = {
      padding: '0.75rem 1rem',
      background: 'var(--card-bg)',
      border: `2px solid ${isValid ? 'var(--mint)' : 'var(--border)'}`,
      borderRadius: '8px',
      color: 'var(--text)',
      fontFamily: 'inherit',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      resize: 'vertical',
      width: '100%',
      boxSizing: 'border-box'
    };

    if (isValid) {
      fieldStyle.boxShadow = '0 0 0 2px rgba(100, 164, 127, 0.2)';
    }

    // Add focus styles that work in both light and dark modes
    const handleFocus = (e) => {
      e.target.style.borderColor = 'var(--primary)';
      e.target.style.boxShadow = '0 0 0 3px rgba(238, 182, 75, 0.2)';
      e.target.style.background = 'var(--card-bg)';
    };

    const handleBlur = (e) => {
      if (!isValid) {
        e.target.style.borderColor = 'var(--border)';
        e.target.style.boxShadow = 'none';
      }
    };

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={fieldStyle}
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
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            style={fieldStyle}
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
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            style={fieldStyle}
            required={field.required}
          />
        );
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card style={{ padding: '2rem' }} hover={false}>
        {/* Progress Bar */}
        <div style={{
          background: 'var(--card-bg)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--primary)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚡</span>
            Quest Progress: {progress}/{maxProgress}
          </div>
          <div style={{
            height: '12px',
            background: 'var(--border)',
            borderRadius: '6px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)',
                borderRadius: '6px',
                position: 'relative'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(progress / maxProgress) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {formFields.map((field, index) => (
            <motion.div
              key={field.id}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                color: 'var(--primary)',
                fontSize: '1rem'
              }}>
                <span style={{ fontSize: '1.1rem' }}>📜</span>
                {field.label}
              </label>
              {renderField(field)}
            </motion.div>
          ))}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          style={{
            background: progress >= maxProgress 
              ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
              : 'var(--border)',
            color: progress >= maxProgress ? '#fff' : '#666',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: progress >= maxProgress && !isSubmitting ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            minHeight: '60px',
            marginTop: '2rem',
            boxShadow: progress >= maxProgress 
              ? '0 0 20px rgba(238, 182, 75, 0.4), 0 0 40px rgba(238, 182, 75, 0.2), 0 2px 8px rgba(0,0,0,0.1)'
              : 'none'
          }}
          disabled={progress < maxProgress || isSubmitting}
          whileHover={progress >= maxProgress ? { 
            scale: 1.02,
            boxShadow: '0 8px 25px rgba(238, 182, 75, 0.5), 0 0 50px rgba(238, 182, 75, 0.3), 0 4px 12px rgba(0,0,0,0.15)'
          } : {}}
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
          <span style={{ fontSize: '1.2rem' }}>💎</span>
          {isSubmitting ? 'Sending Quest...' : submitLabel}
        </motion.button>
      </Card>
    </motion.form>
  );
} 