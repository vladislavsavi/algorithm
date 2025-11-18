
import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 text-sm rounded transition-colors"
      >
        {copied ? 'Скопировано!' : 'Копировать'}
      </button>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="language-javascript text-gray-300 font-mono">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
