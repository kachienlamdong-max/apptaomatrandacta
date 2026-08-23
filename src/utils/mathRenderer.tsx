import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text by block math $$...$$ and inline math $...$
  // Example: "Cho hàm số $f(x) = x^3 - 3x^2 + 2$. Giá trị cực đại là:"
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  // Regex to match $$block$$ or $inline$
  const regex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = regex.exec(remaining)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      parts.push(
        <span key={`txt-${keyIndex++}`}>
          {remaining.substring(lastIndex, match.index)}
        </span>
      );
    }

    const matchedStr = match[0];
    const isBlock = matchedStr.startsWith('$$');
    const formula = isBlock 
      ? matchedStr.slice(2, -2).trim() 
      : matchedStr.slice(1, -1).trim();

    try {
      const html = katex.renderToString(formula, {
        displayMode: isBlock,
        throwOnError: false,
      });
      parts.push(
        <span
          key={`math-${keyIndex++}`}
          className={isBlock ? 'block my-2 overflow-x-auto text-center' : 'inline-block px-0.5'}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      parts.push(
        <code key={`err-${keyIndex++}`} className="text-amber-700 bg-amber-50 px-1 rounded">
          {matchedStr}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Push remainder
  if (lastIndex < remaining.length) {
    parts.push(
      <span key={`txt-${keyIndex++}`}>
        {remaining.substring(lastIndex)}
      </span>
    );
  }

  return <span className={`inline-text-content ${className}`}>{parts}</span>;
};
