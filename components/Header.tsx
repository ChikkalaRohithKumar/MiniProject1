import React from "react";
import { motion } from "framer-motion";
import { MicroscopeIcon } from "./Icons";

export const Header: React.FC = () => {
  return (
    <header className="relative bg-white/90 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-sm opacity-30"></div>
              <div className="relative bg-white p-3 rounded-xl shadow-lg">
                <MicroscopeIcon className="h-8 w-8 text-gradient" />
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="text-gray-800">
                  GI (gastrointestinal) diseases Diagnosis
                </span>
              </h1>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >


          </motion.div>
        </div>
      </div>
    </header>
  );
};
