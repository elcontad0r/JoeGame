import React from 'react';

const ScenarioLoading = () => (
  <div className="max-w-2xl mx-auto p-6">
    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
      <p className="text-lg text-gray-700 font-medium">Creating your scenario...</p>
    </div>
  </div>
);

export default ScenarioLoading;
