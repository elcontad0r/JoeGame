import React from 'react';

const GeneratingState = ({ generationStep }) => (
  <div className="max-w-2xl mx-auto p-6">
    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
      <p className="text-lg text-gray-700 font-medium mb-2">{generationStep}</p>
      <p className="text-sm text-gray-500">This may take a moment...</p>
    </div>
  </div>
);

export default GeneratingState;
