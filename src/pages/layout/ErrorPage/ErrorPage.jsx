import React from 'react';
import { motion } from 'framer-motion';
import { PageContainer, PageHeader, PageFooter } from '../../base';
import './ErrorPage.css';

const ErrorPage = ({ 
  errorCode = '404', 
  title = 'Page Not Found', 
  message = 'The page you are looking for does not exist.',
  showHomeButton = true,
  ...props 
}) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <PageContainer className="error-page" {...props}>
      <PageHeader
        title={title}
        subtitle={message}
        icon="⚠️"
        className="error-page-header"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="error-page-content"
      >
        <div className="error-code">
          {errorCode}
        </div>
        
        {showHomeButton && (
          <motion.button
            onClick={handleGoHome}
            className="error-home-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            🏠 Return Home
          </motion.button>
        )}
      </motion.div>
      
      <PageFooter showBackToTop={false} />
    </PageContainer>
  );
};

export default ErrorPage; 