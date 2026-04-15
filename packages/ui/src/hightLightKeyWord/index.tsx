import React from 'react';

export interface HighlightKeywordProps {
  title: string;
  keyWord: string;
}

export const HighlightKeyword: React.FC<HighlightKeywordProps> = ({ title, keyWord }) => {
  if (!keyWord) return <span>{title}</span>;
  
  const parts = title.split(new RegExp(`(${keyWord})`, 'gi'));
  
  return (
    <span>
      {parts.map((part, index) => 
        part.toLowerCase() === keyWord.toLowerCase() ? 
          <span key={index} style={{ backgroundColor: '#ffff00' }}>{part}</span> : 
          <span key={index}>{part}</span>
      )}
    </span>
  );
};

export default HighlightKeyword;
