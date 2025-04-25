'use client';

import React from 'react';
import { formatResponseForMobile } from '../utils/responseFormatter';

interface FormattedResponseProps {
  content: string;
}

/**
 * Component that formats and displays responses in a mobile-friendly way
 */
export default function FormattedResponse({ content }: FormattedResponseProps) {
  // Format the content for mobile display
  const formattedContent = formatResponseForMobile(content);
  
  // Convert markdown-style formatting to HTML
  const htmlContent = formattedContent
    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert code blocks
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Convert links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Convert bullet points
    .replace(/^[-*]\s+(.*)$/gm, '<li>$1</li>')
    // Convert numbered lists
    .replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>')
    // Convert paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Wrap lists - using a different approach to avoid the 's' flag
    .replace(/(<li>.*?<\/li>)+/g, match => {
      if (match.includes('1.')) {
        return `<ol>${match}</ol>`;
      }
      return `<ul>${match}</ul>`;
    });
  
  return (
    <div className="formatted-response">
      <div 
        dangerouslySetInnerHTML={{ 
          __html: `<p>${htmlContent}</p>` 
        }} 
      />
      <style jsx>{`
        .formatted-response {
          font-family: var(--font-family);
          line-height: 1.6;
          color: var(--text-color);
          max-width: 100%;
        }
        
        .formatted-response p {
          margin-bottom: 1rem;
        }
        
        .formatted-response p:last-child {
          margin-bottom: 0;
        }
        
        .formatted-response strong {
          font-weight: 600;
          color: var(--text-color);
        }
        
        .formatted-response em {
          font-style: italic;
        }
        
        .formatted-response ul,
        .formatted-response ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .formatted-response li {
          margin-bottom: 0.5rem;
        }
        
        .formatted-response li:last-child {
          margin-bottom: 0;
        }
        
        .formatted-response code {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.9em;
          color: #e83e8c;
        }
        
        .formatted-response a {
          color: var(--primary-color);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s ease;
        }
        
        .formatted-response a:hover {
          border-bottom-color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
          .formatted-response {
            font-size: 0.95rem;
          }
        }
        
        @media (prefers-color-scheme: dark) {
          .formatted-response code {
            background-color: rgba(255, 255, 255, 0.1);
            color: #f78da7;
          }
        }
      `}</style>
    </div>
  );
} 