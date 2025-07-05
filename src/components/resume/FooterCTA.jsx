import React from 'react';
import { motion } from 'framer-motion';

const FooterCTA = ({ contactData }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-center text-white shadow-xl border border-blue-500/20"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl mb-4"
        >
          ☕
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 font-orbitron">
          {contactData.message}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/contact'}
          className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50"
        >
          {contactData.buttonText} →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FooterCTA; 