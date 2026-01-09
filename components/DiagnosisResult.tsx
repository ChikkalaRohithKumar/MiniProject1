import React from "react";
import { motion } from "framer-motion";
import type { DiagnosisResponse } from "../types";
import { FuzzyRuleDisplay } from "./FuzzyRuleDisplay";
import { ResultCard } from "./ResultCard";
import {
  StethoscopeIcon,
  LightbulbIcon,
  ClipboardListIcon,
  TrendingUpIcon,
} from "./Icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../src/components/ui/card";
import { Badge } from "../src/components/ui/badge";

interface DiagnosisResultProps {
  result: DiagnosisResponse;
}

const getRiskColorClasses = (
  level: string
): { bg: string; text: string; border: string } => {
  switch (level.toLowerCase()) {
    case "low":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-400",
      };
    case "moderate":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-400",
      };
    case "high":
      return {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-400",
      };
    case "critical":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-400",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-400",
      };
  }
};

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ result }) => {
  const riskColor = getRiskColorClasses(result.riskLevel);
  const riskBarColor = riskColor.bg.replace("100", "500");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full space-y-6"
    >
      {/* Primary Diagnosis Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`relative overflow-hidden rounded-2xl border-l-4 ${riskColor.border} ${riskColor.bg} p-6 shadow-lg`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"></div>
          </div>

          <h3 className="text-4xl font-bold text-gray-900 mb-2">
            {result.disease}
          </h3>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-lg font-semibold text-gray-700">
                Confidence: {result.confidence.toFixed(1)}%
              </span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="text-sm text-gray-600">
              Based on advanced fuzzy inference system analysis
            </div>
          </div>
        </div>
      </motion.div>

      {/* Risk Assessment Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg"></div>
              Overall Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    result.riskLevel.toLowerCase() === "low"
                      ? "success"
                      : result.riskLevel.toLowerCase() === "moderate"
                      ? "warning"
                      : result.riskLevel.toLowerCase() === "high"
                      ? "destructive"
                      : "destructive"
                  }
                  className="text-lg px-4 py-2"
                >
                  {result.riskLevel}
                </Badge>
                <div className="text-3xl font-bold text-gray-800">
                  {result.riskScore.toFixed(0)}/100
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Risk Level</span>
                <span>{result.riskScore.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.riskScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-3 rounded-full bg-gradient-to-r ${riskBarColor} shadow-sm`}
                />
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">{result.summary}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fuzzy Rules Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LightbulbIcon className="h-6 w-6 text-purple-600" />
              </div>
              Analysis: Fuzzy Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FuzzyRuleDisplay rules={result.fuzzyRules} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Clinical Recommendations Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <ClipboardListIcon className="h-6 w-6 text-green-600" />
              </div>
              Clinical Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-green-200"
                >
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{rec}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
