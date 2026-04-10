import React, { useState } from 'react';
import UploadZone from './components/UploadZone';
import ResultsStagger from './components/ResultsStagger';
import MoodSphere from './animations/MoodSphere';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // In production, this would be an environment variable
      const response = await fetch("http://localhost:8000/upload_audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const data = await response.json();
      
      // Fetch full analysis block
      const analysisResponse = await fetch(`http://localhost:8000/analysis/${data.analysis_id}`);
      const analysisData = await analysisResponse.json();
      
      setResults(analysisData);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-6">
      
      {/* Header section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-display font-extrabold mb-6 tracking-tight">
          Vocal Mood Detector
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
          A multimodal AI engine analyzing both <span className="text-white font-medium">acoustic signals</span> and <span className="text-white font-medium">linguistic context</span> to accurately detect emotional state.
        </p>
      </div>

      {/* 3D Visualization */}
      <MoodSphere emotion={results ? results.primary_emotion : 'Neutral'} />

      {/* Main Interactive Zones */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-center">
          {error}
        </div>
      )}

      {!results && (
        <UploadZone onFileSelect={handleFileUpload} isAnalyzing={isAnalyzing} />
      )}

      {results && (
         <div>
            <ResultsStagger results={results} />
            <div className="text-center mt-12">
               <button 
                  onClick={() => setResults(null)}
                  className="px-8 py-3 bg-space-800 hover:bg-space-700 border border-space-border transition-colors duration-200 rounded-full text-white font-medium"
               >
                  Analyze Another Audio
               </button>
            </div>
         </div>
      )}

    </div>
  );
}

export default App;
