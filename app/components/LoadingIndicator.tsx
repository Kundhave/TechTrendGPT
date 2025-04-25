'use client';

import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="loading-indicator">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <style jsx>{`
        .loading-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 1.5rem;
          animation: fadeIn 0.3s ease-in-out;
          background-color: var(--chat-bg);
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: absolute;
          bottom: 90px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--primary-color);
          animation: bounce 1.4s infinite ease-in-out both;
          opacity: 0.9;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { 
            transform: translateY(0) scale(0.8);
            opacity: 0.5;
          }
          40% { 
            transform: translateY(-6px) scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        
        @media (prefers-color-scheme: dark) {
          .dot {
            background-color: #6366f1;
          }
        }
      `}</style>
    </div>
  );
} 