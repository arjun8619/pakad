import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './sidber';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (

      <Sidebar isOpen={isSidebarOpen} />
     
  );
}
