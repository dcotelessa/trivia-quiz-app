import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchCategories, selectCategoryStatus } from './features/categories/categorySlice';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPages';
import ResultsPage from './pages/ResultsPage';
import Loader from './components/ui/Loader';
import './styles/main.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const categoryStatus = useAppSelector(selectCategoryStatus);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Fetch categories when app loads
    dispatch(fetchCategories())
      .finally(() => setInitialized(true));
  }, [dispatch]);

  if (!initialized && categoryStatus === 'loading') {
    return <Loader />;
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
