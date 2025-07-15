import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MarkdownRenderer.css';

const MarkdownRenderer = ({ markdownPath, className = '' }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      if (!markdownPath) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(markdownPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch markdown: ${response.status}`);
        }
        
        const markdownContent = await response.text();
        setContent(markdownContent);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [markdownPath]);

  if (loading) {
    return (
      <div className={`markdown-loading ${className}`}>
        <div className="loading-spinner">📄</div>
        <p>Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`markdown-error ${className}`}>
        <p>⚠️ Unable to load content</p>
        <small>{error}</small>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for different markdown elements
          h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
          h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
          h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
          p: ({ children }) => <p className="markdown-p">{children}</p>,
          ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
          ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
          li: ({ children }) => <li className="markdown-li">{children}</li>,
          strong: ({ children }) => <strong className="markdown-strong">{children}</strong>,
          em: ({ children }) => <em className="markdown-em">{children}</em>,
          code: ({ children }) => <code className="markdown-code">{children}</code>,
          pre: ({ children }) => <pre className="markdown-pre">{children}</pre>,
          blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 