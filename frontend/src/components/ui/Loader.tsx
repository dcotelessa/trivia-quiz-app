import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="loader-spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
