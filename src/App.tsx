import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import ViewRenderer from './components/ViewRenderer';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Navigation />
          <main className="flex-1 overflow-y-auto">
            <ViewRenderer />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;