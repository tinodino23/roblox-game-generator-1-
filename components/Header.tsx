
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-slate-950/50 border-b border-slate-800 px-6 lg:px-8 py-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </header>
  );
};

export default Header;
