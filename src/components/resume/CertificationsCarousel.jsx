import React from 'react';
import { motion } from 'framer-motion';

const CertificationsCarousel = ({ certifications }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-orange-600 font-orbitron flex items-center">
        🏆 Certifications & Awards
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:border-orange-300 transition-all duration-300 shadow-lg hover:shadow-2xl text-center group"
          >
            <motion.div 
              className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300"
              animate={{ 
                y: [0, -3, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                delay: index * 0.5
              }}
            >
              {cert.logo}
            </motion.div>
            <h3 className="font-bold text-lg mb-3 text-gray-800 font-orbitron">{cert.title}</h3>
            <p className="text-gray-600 text-sm mb-4 font-medium">{cert.issuer}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-orange-600 font-bold text-lg">{cert.year}</span>
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                {cert.score}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">{cert.description}</p>
            <motion.div
              className="mt-4 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: index * 0.3, duration: 1 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsCarousel; 