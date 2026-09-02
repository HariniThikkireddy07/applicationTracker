import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/board" replace />

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-4">
      {/* Brand mark */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-base leading-none">J</span>
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">JobTracker</span>
      </div>

      <Outlet />

      <p className="mt-8 text-xs text-gray-400">
        © {new Date().getFullYear()} JobTracker. All rights reserved.
      </p>
    </div>
  )
}