"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import MessageComponent from './components/MessageComponent';
import Image from 'next/image';
import TechTrendGPT_Logo from './assets/TechTrendGPT_Logo.png';
import PromptSuggestionButton from './components/PromptSuggestionButton';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat'
  });
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const lastAssistantMessageRef = useRef<string>('');

  const promptSuggestions = [
    "What are the latest trends in AI?",
    "Explain quantum computing in simple terms",
    "How does blockchain technology work?",
    "What are the top news in the tech industry today?",
    "Explain the concept of cloud computing",
    "What are the ethical concerns with AI?"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>);
    setShowSuggestions(false);
    
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  useEffect(() => {
    if (isLoading) {
      lastAssistantMessageRef.current = '';
      setIsStreaming(true);
    } else {
      setIsStreaming(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    if (assistantMessages.length > 0) {
      const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
      
      if (lastAssistantMessage.content !== lastAssistantMessageRef.current) {
        lastAssistantMessageRef.current = lastAssistantMessage.content;
        if (lastAssistantMessage.content.length > 0) {
          setIsStreaming(true);
        }
      }
    }
  }, [messages]);

  useEffect(() => {
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    if (assistantMessages.length > 0) {
      const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
      if (lastAssistantMessage.content.length > 0) {
        setIsStreaming(true);
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!outputContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = outputContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (!isUserScrollingRef.current) {
      setUserScrolledUp(!isNearBottom);
    }
  };

  useEffect(() => {
    const container = outputContainerRef.current;
    if (!container) return;

    const handleScrollStart = () => {
      isUserScrollingRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };

    const handleScrollEnd = () => {
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 150);
    };

    container.addEventListener('scroll', handleScrollStart);
    container.addEventListener('scrollend', handleScrollEnd);

    return () => {
      container.removeEventListener('scroll', handleScrollStart);
      container.removeEventListener('scrollend', handleScrollEnd);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (messages.length === 1) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <main className="flex flex-col min-h-screen">
      <div className="logo-container">
        <Image 
          src={TechTrendGPT_Logo} 
          alt="TechTrendGPT Logo" 
          width={32} 
          height={32} 
        />
        <h1 className="text-xl font-semibold ml-2">TechTrendGPT</h1>
      </div>
      
      <div
        ref={outputContainerRef}
        className="output-container"
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <div className="empty-state">
            <h1>Welcome to TechTrendGPT</h1>
            <p>Ask me anything about technology!</p>
            
            {showSuggestions && (
              <div className="suggestions-container">
                <h2>Try asking about:</h2>
                <div className="suggestions-grid">
                  {promptSuggestions.map((suggestion, index) => (
                    <PromptSuggestionButton
                      key={index}
                      suggestion={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageComponent
                key={index}
                message={message}
                isLastMessage={index === messages.length - 1}
                isStreaming={isStreaming && index === messages.length - 1}
              />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="message-container assistant">
                <div className="message-avatar">
                  <div className="assistant-avatar">
                    <Image 
                      src={TechTrendGPT_Logo} 
                      alt="TechTrendGPT Logo" 
                      width={24} 
                      height={24} 
                    />
                  </div>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form ref={formRef} onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="input-field"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </main>
  );
}