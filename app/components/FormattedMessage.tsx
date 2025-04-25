'use client';

import React from 'react';
import { formatResponseForMobile } from '../utils/responseFormatter';

interface FormattedMessageProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * Component that formats and displays chat messages with proper styling
 * for headings, bullet points, and other formatting elements
 */
export default function FormattedMessage({ content, isStreaming = false }: FormattedMessageProps) {
  const formattedContent = formatResponseForMobile(content);
  
  const htmlContent = formattedContent
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/👉\s*\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="read-more-link">👉 $1</a>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="read-more-link">$1</a>')
    .replace(/^[-*]\s+(.*)$/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/(<li>.*?<\/li>)+/g, match => {
      if (match.includes('1.')) {
        return `<ol>${match}</ol>`;
      }
      return `<ul>${match}</ul>`;
    });
  
  return (
    <div className="formatted-message-container">
      <div className="formatted-message">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: `<p>${htmlContent}</p>` 
          }} 
        />
        {isStreaming && content.length === 0 && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
      <style jsx>{`
        .formatted-message-container {
          position: relative;
          width: 100%;
        }
        
        .formatted-message {
          font-family: var(--font-family);
          line-height: 1.6;
          color: var(--text-color);
          max-width: 100%;
        }
        
        .formatted-message p {
          margin-bottom: 1rem;
        }
        
        .formatted-message p:last-child {
          margin-bottom: 0;
        }
        
        .formatted-message strong {
          font-weight: 600;
          color: var(--text-color);
        }
        
        .formatted-message em {
          font-style: italic;
        }
        
        .formatted-message ul,
        .formatted-message ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .formatted-message li {
          margin-bottom: 0.5rem;
        }
        
        .formatted-message li:last-child {
          margin-bottom: 0;
        }
        
        .formatted-message code {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.9em;
          color: #e83e8c;
        }
        
        .formatted-message pre {
          background-color: #f6f8fa;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }
        
        .formatted-message pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
          font-size: 0.9em;
          line-height: 1.5;
          color: #24292e;
          display: block;
        }

        .formatted-message .read-more-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          background-color: rgba(79, 70, 229, 0.1);
        }

        .formatted-message .read-more-link:hover {
          color: var(--primary-hover);
          background-color: rgba(79, 70, 229, 0.15);
          transform: translateY(-1px);
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          height: 20px;
        }
        
        .typing-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--primary-color);
          animation: typing 1.4s infinite ease-in-out both;
          opacity: 0.7;
        }
        
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
          0%, 80%, 100% { 
            transform: translateY(0) scale(0.8);
            opacity: 0.4;
          }
          40% { 
            transform: translateY(-4px) scale(1);
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .formatted-message {
            font-size: 0.95rem;
          }
          
          .formatted-message pre {
            padding: 0.75rem;
            margin: 0.75rem 0;
          }
          
          .formatted-message code {
            font-size: 0.85em;
          }
        }
        
        @media (prefers-color-scheme: dark) {
          .formatted-message code {
            background-color: rgba(255, 255, 255, 0.1);
            color: #f78da7;
          }
          
          .formatted-message pre {
            background-color: #1f2937;
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .formatted-message pre code {
            color: #e5e7eb;
          }
          
          .formatted-message .read-more-link {
            background-color: rgba(79, 70, 229, 0.2);
          }
          
          .formatted-message .read-more-link:hover {
            background-color: rgba(79, 70, 229, 0.3);
          }
        }
      `}</style>
    </div>
  );
} 