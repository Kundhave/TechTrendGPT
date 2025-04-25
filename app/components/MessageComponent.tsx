'use client';

import React from 'react';
import Image from 'next/image';
import FormattedMessage from './FormattedMessage';
import TechTrendGPT_Logo from '../assets/TechTrendGPT_Logo.png';
import { Message } from 'ai/react';

interface MessageComponentProps {
  message: Message;
  isLastMessage: boolean;
  isStreaming?: boolean;
}

export default function MessageComponent({ message, isLastMessage, isStreaming = false }: MessageComponentProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  if (!isUser && !isAssistant) return null;

  return (
    <div className={`message-container ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isAssistant ? (
          <div className="assistant-avatar">
            <Image 
              src={TechTrendGPT_Logo} 
              alt="TechTrendGPT Logo" 
              width={24} 
              height={24} 
            />
          </div>
        ) : (
          <div className="user-avatar">
            <span>U</span>
          </div>
        )}
      </div>
      <div className="message-content">
        {isAssistant ? (
          <FormattedMessage 
            content={message.content} 
            isStreaming={isStreaming && isLastMessage} 
          />
        ) : (
          <div className="message-text">{message.content}</div>
        )}
      </div>
    </div>
  );
} 