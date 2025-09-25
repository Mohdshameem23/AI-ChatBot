import React from 'react'
import { useState } from 'react';
const ReadMore = ({text}) => {
 const [showAll, setShowAll] = useState(false);
  if (text.length <= 300) return text;

  return (
    <span>
      {showAll ? text : `${text.slice(0, 300)}... `}
      <button 
        onClick={() => setShowAll(!showAll)}
        className="text-blue-500 ml-1 hover:cursor-pointer"
      >
        {showAll ? "Show Less" : "Read More"}
      </button>
    </span>
  );
}

export default ReadMore
