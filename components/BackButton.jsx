import React from 'react';

const BackButton = ({ onBack }) => {
  if (!onBack) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={onBack}
        className="bg-white shadow-lg px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm"
      >
        ← Menu
      </button>
    </div>
  );
};

export default BackButton;
