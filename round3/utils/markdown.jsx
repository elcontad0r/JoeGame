import React from 'react';

// Simple markdown parser for generated content
export const parseBold = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export const renderMarkdown = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  lines.forEach((line, idx) => {
    if (line.startsWith('### ')) {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(<h3 key={idx} className="text-lg font-bold mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(<h2 key={idx} className="text-xl font-bold mt-4 mb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(<h1 key={idx} className="text-2xl font-bold mt-4 mb-3">{line.slice(2)}</h1>);
    } else if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
      const textContent = line.trim().slice(2);
      currentList.push(<li key={idx}>{parseBold(textContent)}</li>);
    } else if (line.trim() === '') {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
        currentList = [];
      }
    } else if (line.trim()) {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(<p key={idx} className="mb-3 leading-relaxed">{parseBold(line)}</p>);
    }
  });

  if (currentList.length > 0) {
    elements.push(<ul key="list-final" className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
  }

  return elements;
};

export const highlightQuotes = (text) => {
  if (!text) return text;

  const parts = [];
  const segments = text.split('"');

  segments.forEach((segment, idx) => {
    if (idx % 2 === 1) {
      parts.push(
        <span key={idx} className="bg-orange-100 text-orange-900 px-1.5 py-0.5 rounded font-semibold italic">
          "{segment}"
        </span>
      );
    } else {
      parts.push(segment);
    }
  });

  return parts;
};
