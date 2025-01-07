import React from 'react';
import Header from '../header/Header';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <div style={{ flex: '1 0 auto', minHeight: "80vh" }} className="--pad">
        {children}
      </div>
    </div>
  );
};

export default Layout;