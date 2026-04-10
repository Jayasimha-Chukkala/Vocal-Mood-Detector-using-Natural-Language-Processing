import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Type, Brain } from 'lucide-react';

export default function ResultsStagger({ results }) {
  if (!results) return null;

  const { primary_emotion, confidence, confidence_score, transcript, timeline } = results;
  const activeConfidence = confidence !== undefined ? confidence : confidence_score;

  // Map emotion to colors
  const emotionColorMap = {
    Angry: 'text-emotion-angry',
    Sad: 'text-emotion-sad',
    Happy: 'text-emotion-happy',
    Neutral: 'text-emotion-neutral'
  };

  const getEmotionColor = (emotion) => {
    // If emotion is something like 'Angular/Angry', map the second part
    const key = Object.keys(emotionColorMap).find(k => emotion.includes(k)) || 'Neutral';
    return emotionColorMap[key];
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-2xl mx-auto mt-8 space-y-6"
    >
      <motion.div variants={item} className="glass-panel p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-space-900 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Detected Mood</p>
            <h2 className={`text-3xl font-display font-bold ${getEmotionColor(primary_emotion)}`}>
              {primary_emotion}
            </h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Confidence</p>
          <p className="text-2xl font-bold text-white">{(activeConfidence * 100).toFixed(1)}%</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-panel p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Type className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-200">Linguistic Transcript</h3>
        </div>
        <p className="text-gray-300 leading-relaxed bg-space-900/50 p-4 rounded-xl border border-space-border italic">
          "{transcript}"
        </p>
      </motion.div>

      <motion.div variants={item} className="glass-panel p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-200">Emotion Timeline</h3>
        </div>
        <div className="flex space-x-2">
          {timeline && timeline.map((pt, idx) => (
             <div key={idx} className="flex-1 bg-space-900 p-3 rounded-lg text-center text-sm border border-space-border">
                <span className="block text-gray-400 mb-1">{pt.time}s</span>
                <span className={`font-bold ${getEmotionColor(pt.emotion)}`}>{pt.emotion}</span>
             </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
