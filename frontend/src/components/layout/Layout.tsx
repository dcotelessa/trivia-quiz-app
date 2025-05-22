import React, { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content" role="main">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
