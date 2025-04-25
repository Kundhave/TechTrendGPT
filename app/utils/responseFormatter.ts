/**
 * Formats the response from the GPT model to be mobile-friendly and user-friendly
 * @param response The raw response from the GPT model
 * @returns Formatted response with mobile-friendly structure
 */
export function formatResponseForMobile(response: string): string {
  const paragraphs = response.split('\n\n');
  
  const formattedParagraphs = paragraphs.map(paragraph => {
    if (!paragraph.trim()) return '';
    
    const isHeading = /^(\d+\.|#|\*\*|•|•\s*[A-Z]|Key|Important|Note|Summary|Conclusion)/.test(paragraph.trim());
    
    if (isHeading) {
      return `**${paragraph.trim()}**\n\n`;
    }
    
    if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*')) {
      return `${paragraph.trim()}\n\n`;
    }
    
    if (/^\d+\.\s/.test(paragraph.trim())) {
      return `${paragraph.trim()}\n\n`;
    }
    
    if (paragraph.includes('*') && !paragraph.startsWith('*')) {
      return paragraph.replace(/\*([^*]+)\*/g, '*$1*') + '\n\n';
    }
    
    return `${paragraph.trim()}\n\n`;
  });
  
  let formattedResponse = formattedParagraphs.join('');
  
  formattedResponse = formattedResponse.replace(/\n{3,}/g, '\n\n');
  
  if (!formattedResponse.endsWith('\n')) {
    formattedResponse += '\n';
  }
  
  return formattedResponse;
}

/**
 * Wraps the response in a mobile-friendly container with proper styling
 * @param response The formatted response
 * @returns HTML/CSS wrapped response
 */
export function wrapResponseInMobileContainer(response: string): string {
  return `
<div class="mobile-friendly-response">
  ${response}
</div>
<style>
  .mobile-friendly-response {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 100%;
    margin: 0 auto;
    padding: 16px;
  }
  
  .mobile-friendly-response p {
    margin-bottom: 16px;
  }
  
  .mobile-friendly-response strong, 
  .mobile-friendly-response b {
    font-weight: 600;
    color: #000;
    display: block;
    margin-top: 24px;
    margin-bottom: 12px;
  }
  
  .mobile-friendly-response ul, 
  .mobile-friendly-response ol {
    padding-left: 24px;
    margin-bottom: 16px;
  }
  
  .mobile-friendly-response li {
    margin-bottom: 8px;
  }
</style>
`;
} 