import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import { LoginPage, DashboardPage, MembersPage } from './pages/Pages';
import { PaymentsPage } from './pages/PaymentsPage';
import { MembershipsPage } from './pages/MembershipsPage';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/members" element={<MembersPage />} />
                  <Route path="/memberships" element={<MembershipsPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/attendance" element={<div className="text-gray-500">Attendance — coming in phase 2</div>} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
