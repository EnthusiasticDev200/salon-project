import React from 'react'
import { motion } from "framer-motion";

const MotionDiv = ({ children, className = '', id = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className={className}
      id={id}
    >
      { children }
    </motion.div>
  )
}

export default MotionDiv