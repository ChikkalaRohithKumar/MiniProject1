import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "./components/Header";
import { ImageUploader } from "./components/ImageUploader";
import { DiagnosisResult } from "./components/DiagnosisResult";
import { Spinner } from "./components/Spinner";
import { analyzeImageWithGemini } from "./services/geminiService";
import type { DiagnosisResponse } from "./types";
import { InfoIcon, AlertTriangleIcon } from "./components/Icons";

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");

  const [analysisResult, setAnalysisResult] =
    useState<DiagnosisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File, base64: string) => {
    setImageFile(file);
    setImageBase64(base64);
    setMimeType(file.type);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!imageBase64 || !mimeType) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeImageWithGemini(imageBase64, mimeType);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      let errorMessage = "An unknown error occurred during analysis.";

      if (e instanceof TypeError && e.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error: Unable to connect to the server. Please check your internet connection and try again.";
      } else if (e instanceof Error) {
        if (e.message.includes("Gemini API Error")) {
          errorMessage = "error";
        } else {
          errorMessage = e.message;
        }
      }

      setError(`Analysis failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      <Header />

      <main className="relative z-10 container mx-auto p-4 md:p-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 card-hover"
          >
            <ImageUploader
              onImageSelect={handleImageSelect}
              onAnalyze={handleAnalyzeClick}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 min-h-[600px] flex flex-col card-hover"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gradient">
                Analysis Report
              </h2>
            </div>

            <div className="flex-grow flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Spinner />
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="text-center text-red-600 bg-red-50/80 backdrop-blur-sm p-8 rounded-2xl border border-red-200"
                  >
                    <AlertTriangleIcon className="mx-auto h-16 w-16 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Analysis Error
                    </h3>
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                {analysisResult && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                  >
                    <DiagnosisResult result={analysisResult} />
                  </motion.div>
                )}

                {!isLoading && !error && !analysisResult && (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center text-gray-500"
                  >
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-12 border border-blue-200">
                      <InfoIcon className="mx-auto h-20 w-20 text-blue-400 mb-6" />
                      <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                        Ready for Analysis
                      </h3>
                      <p className="text-lg text-gray-600 max-w-md mx-auto">
                        Upload an endoscopic image and click "Analyze Image" to
                        view the diagnostic report with advanced fuzzy
                        inference.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="relative z-10 text-center p-8 text-gray-600">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <p className="text-sm">GI Disease Diagnosis</p>
          <p className="text-xs text-gray-500 mt-2"></p>
        </div>
      </footer>
    </div>
  );
};

export default App;
