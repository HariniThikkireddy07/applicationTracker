import { Card, Statistic, Progress, Tag } from 'antd'
import {
  ArrowUpOutlined, SendOutlined, PhoneOutlined,
  TrophyOutlined, CloseCircleOutlined,
} from '@ant-design/icons'

const APPS = [
  { company: 'Google',   role: 'Java Backend Engineer',     status: 'INTERVIEW', salary: '₹30–40 LPA', date: '2025-05-10' },
  { company: 'Flipkart', role: 'Senior Software Engineer',  status: 'APPLIED',   salary: '₹20–28 LPA', date: '2025-05-14' },
  { company: 'Razorpay', role: 'Java Full Stack Developer', status: 'SCREENING', salary: '₹18–25 LPA', date: '2025-05-16' },
  { company: 'Swiggy',   role: 'Backend Engineer II',       status: 'SAVED',     salary: '₹22–30 LPA', date: '' },
  { company: 'PhonePe',  role: 'Software Engineer - Java',  status: 'OFFER',     salary: '₹24–32 LPA', date: '2025-05-08' },
  { company: 'Amazon',   role: 'SDE II',                    status: 'REJECTED',  salary: '₹35–45 LPA', date: '2025-05-01' },
]

const STATUS_META = {
  SAVED:      { label: 'Saved',     color: '#6366f1', tagColor: 'purple'  },
  APPLIED:    { label: 'Applied',   color: '#0ea5e9', tagColor: 'blue'    },
  SCREENING:  { label: 'Screening', color: '#f59e0b', tagColor: 'orange'  },
  INTERVIEW:  { label: 'Interview', color: '#8b5cf6', tagColor: 'geekblue'},
  OFFER:      { label: 'Offer',     color: '#10b981', tagColor: 'green'   },
  REJECTED:   { label: 'Rejected',  color: '#ef4444', tagColor: 'red'     },
}

const FUNNEL = ['APPLIED','SCREENING','INTERVIEW','OFFER']

function FunnelBar({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs text-gray-500 text-right flex-shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-12 text-xs font-semibold text-gray-700 flex-shrink-0">{count} <span className="font-normal text-gray-400">({pct}%)</span></span>
    </div>
  )
}

export default function AnalyticsPage() {
  const total    = APPS.length
  const applied  = APPS.filter(a => a.status !== 'SAVED').length
  const offers   = APPS.filter(a => a.status === 'OFFER').length
  const rejected = APPS.filter(a => a.status === 'REJECTED').length
  const responseRate = applied ? Math.round(((applied - APPS.filter(a => a.status === 'APPLIED').length) / applied) * 100) : 0

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Analytics</h2>
      <p className="text-sm text-gray-500 mb-6">Overview of your job search progress</p>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { title: 'Total Applications', value: total,        icon: <SendOutlined />,        color: '#4f46e5', bg: '#eef2ff' },
          { title: 'Response Rate',      value: `${responseRate}%`, icon: <ArrowUpOutlined />, color: '#0ea5e9', bg: '#e0f2fe' },
          { title: 'Offers',             value: offers,       icon: <TrophyOutlined />,       color: '#10b981', bg: '#d1fae5' },
          { title: 'Rejected',           value: rejected,     icon: <CloseCircleOutlined />,  color: '#ef4444', bg: '#fee2e2' },
        ].map(({ title, value, icon, color, bg }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500">{title}</p>
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: bg, color }}>
                {icon}
              </span>
            </div>
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Funnel */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Application Funnel</h3>
          <div className="space-y-3">
            {FUNNEL.map(s => (
              <FunnelBar
                key={s}
                label={STATUS_META[s].label}
                count={APPS.filter(a => a.status === s).length}
                total={applied}
                color={STATUS_META[s].color}
              />
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Status Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(STATUS_META).map(([key, { label, color }]) => {
              const count = APPS.filter(a => a.status === key).length
              const pct   = total ? Math.round((count / total) * 100) : 0
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="flex-1 text-sm text-gray-600">{label}</span>
                  <Progress percent={pct} size="small" strokeColor={color} className="w-28 mb-0" showInfo={false} />
                  <span className="text-sm font-semibold text-gray-700 w-6 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent activity table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Recent Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 font-medium">
                <th className="text-left px-5 py-3">Company</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Role</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Salary</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {APPS.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-gray-800">{a.company}</td>
                  <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{a.role}</td>
                  <td className="px-5 py-3">
                    <Tag color={STATUS_META[a.status].tagColor} className="rounded-full text-xs">
                      {STATUS_META[a.status].label}
                    </Tag>
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{a.salary}</td>
                  <td className="px-5 py-3 text-gray-400 hidden md:table-cell">{a.date || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}