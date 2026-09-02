import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Badge, Tooltip, Drawer, Avatar } from 'antd'
import {
  AppstoreOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { useAuth } from '../store/AuthContext'

const NAV = [
  { label: 'Board',      path: '/board',      icon: <AppstoreOutlined /> },
  { label: 'Analytics',  path: '/analytics',  icon: <BarChartOutlined /> },
  { label: 'AI Scorer',  path: '/ai-scorer',  icon: <ThunderboltOutlined />, badge: 'New' },
  { label: 'Settings',   path: '/settings',   icon: <SettingOutlined /> },
]

const SIDEBAR_W = 232

function SidebarContent({ onNav }) {
  const location = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()

  const go = (path) => { navigate(path); onNav?.() }
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow">
          <BulbOutlined className="text-white text-sm" />
        </div>
        <span className="font-bold text-gray-900 tracking-tight">JobTracker</span>
      </div>

      <div className="mx-4 border-b border-gray-100" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ label, path, icon, badge }) => {
          const active = location.pathname === path
          return (
            <div
              key={path}
              onClick={() => go(path)}
              className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}
            >
              <span className={`text-base ${active ? 'text-primary-600' : 'text-gray-400'}`}>
                {icon}
              </span>
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-100 text-violet-600 leading-none">
                  {badge}
                </span>
              )}
            </div>
          )
        })}
      </nav>

      <div className="mx-4 border-b border-gray-100" />

      {/* User footer */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <Avatar
          size={32}
          className="bg-gradient-to-br from-primary-600 to-violet-600 flex-shrink-0 font-semibold"
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
            {user?.name || 'User'}
          </p>
          <p className="text-xs text-gray-400 truncate leading-tight">{user?.email || ''}</p>
        </div>
        <Tooltip title="Logout">
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
          >
            <LogoutOutlined />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  const pageTitle = NAV.find(n => n.path === location.pathname)?.label || 'JobTracker'

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside
        style={{ width: SIDEBAR_W }}
        className="hidden md:flex flex-col flex-shrink-0 border-r border-gray-100 bg-white"
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
        width={SIDEBAR_W}
        styles={{ body: { padding: 0 }, header: { display: 'none' } }}
        closeIcon={null}
      >
        <div className="relative h-full">
          <button
            className="absolute top-4 right-3 z-10 text-gray-400 hover:text-gray-600"
            onClick={() => setDrawerOpen(false)}
          >
            <CloseOutlined />
          </button>
          <SidebarContent onNav={() => setDrawerOpen(false)} />
        </div>
      </Drawer>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 h-14 flex items-center px-4 md:px-6 gap-3">
          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-800 mr-1"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuOutlined className="text-lg" />
          </button>

          <h1 className="flex-1 text-base font-semibold text-gray-900">{pageTitle}</h1>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
              <Badge count={2} size="small" offset={[2, -2]}>
                <BellOutlined className="text-base" />
              </Badge>
            </button>
          </Tooltip>

          {/* Avatar */}
          <Avatar
            size={30}
            className="bg-gradient-to-br from-primary-600 to-violet-600 font-semibold text-xs cursor-pointer flex-shrink-0"
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}