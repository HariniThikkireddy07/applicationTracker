import { ConfigProvider } from 'antd'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './router/ProtectedRoute'

import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BoardPage    from './pages/BoardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AiScorerPage from './pages/AiScorerPage'
import SettingsPage from './pages/SettingsPage'

const antdTheme = {
  token: {
    colorPrimary: '#4f46e5',
    colorPrimaryHover: '#4338ca',
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, sans-serif',
    colorBgContainer: '#ffffff',
    colorBorder: '#e5e7eb',
  },
  components: {
    Button: { controlHeight: 36 },
    Input:  { controlHeight: 36 },
  },
}

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route element={<AuthLayout />}>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/board"     element={<BoardPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/ai-scorer" element={<AiScorerPage />} />
              <Route path="/settings"  element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="/"  element={<Navigate to="/board" replace />} />
          <Route path="*"  element={<Navigate to="/board" replace />} />
        </Routes>
      </AuthProvider>
    </ConfigProvider>
  )
}