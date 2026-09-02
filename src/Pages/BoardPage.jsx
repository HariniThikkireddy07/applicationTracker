import { useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, Button, Tag, Tooltip, Empty } from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  LinkOutlined, CalendarOutlined, DollarOutlined,
  BankOutlined, FileTextOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const COLUMNS = [
  { key: 'SAVED',      label: 'Saved',      color: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af' },
  { key: 'APPLIED',    label: 'Applied',    color: '#1d4ed8', bg: '#eff6ff', dot: '#3b82f6' },
  { key: 'SCREENING',  label: 'Screening',  color: '#b45309', bg: '#fffbeb', dot: '#f59e0b' },
  { key: 'INTERVIEW',  label: 'Interview',  color: '#7c3aed', bg: '#f5f3ff', dot: '#8b5cf6' },
  { key: 'OFFER',      label: 'Offer',      color: '#065f46', bg: '#ecfdf5', dot: '#10b981' },
  { key: 'REJECTED',   label: 'Rejected',   color: '#991b1b', bg: '#fef2f2', dot: '#ef4444' },
]

const INITIAL_APPS = [
  { id: 1, company: 'Google', role: 'Java Backend Engineer', status: 'INTERVIEW', salary: '₹30-40 LPA', appliedDate: '2025-05-10', url: 'https://careers.google.com', notes: 'Round 2 scheduled' },
  { id: 2, company: 'Flipkart', role: 'Software Engineer - Backend', status: 'APPLIED', salary: '₹20-28 LPA', appliedDate: '2025-05-18', url: '', notes: '' },
  { id: 3, company: 'Swiggy', role: 'Java Full Stack Developer', status: 'SCREENING', salary: '₹18-25 LPA', appliedDate: '2025-05-15', url: '', notes: 'HR call done' },
  { id: 4, company: 'Zepto', role: 'Backend Engineer', status: 'SAVED', salary: '₹15-22 LPA', appliedDate: '', url: 'https://zepto.com/careers', notes: 'Interesting tech stack' },
  { id: 5, company: 'Razorpay', role: 'Senior Java Developer', status: 'OFFER', salary: '₹35-45 LPA', appliedDate: '2025-05-01', url: '', notes: 'Offer letter received!' },
  { id: 6, company: 'Paytm', role: 'Software Engineer', status: 'REJECTED', salary: '₹12-18 LPA', appliedDate: '2025-04-28', url: '', notes: 'No feedback provided' },
]

function AppCard({ app, onEdit, onDelete, onMove, columns }) {
  const col = COLUMN_MAP[app.status]
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm hover:shadow-md transition-shadow group">
      {/* Company + role */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{app.company}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{app.role}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <Tooltip title="Edit">
            <button onClick={() => onEdit(app)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
              <EditOutlined style={{ fontSize: 12 }} />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button onClick={() => onDelete(app.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
              <DeleteOutlined style={{ fontSize: 12 }} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Salary */}
      {app.salary && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
          <DollarOutlined />
          <span>{app.salary}</span>
        </div>
      )}

      {/* Applied date */}
      {app.appliedDate && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <CalendarOutlined />
          <span>Applied {dayjs(app.appliedDate).format('DD MMM YYYY')}</span>
        </div>
      )}

      {/* Notes */}
      {app.notes && (
        <p className="text-xs text-gray-400 italic mb-2 truncate">"{app.notes}"</p>
      )}

      {/* Footer: link + move */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
        {app.url
          ? <a href={app.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary-600 hover:underline">
              <LinkOutlined /> Job link
            </a>
          : <span />
        }
        <Select
          size="small"
          value={app.status}
          onChange={val => onMove(app.id, val)}
          style={{ width: 110 }}
          options={columns.map(c => ({ value: c.key, label: c.label }))}
          onClick={e => e.stopPropagation()}
        />
      </div>
    </div>
  )
}

const COLUMN_MAP = Object.fromEntries(COLUMNS.map(c => [c.key, c]))

export default function BoardPage() {
  const [apps, setApps] = useState(INITIAL_APPS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()

  const openAdd = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (app) => {
    setEditing(app)
    form.setFieldsValue({
      ...app,
      appliedDate: app.appliedDate ? dayjs(app.appliedDate) : null,
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    form.validateFields().then(values => {
      const data = {
        ...values,
        appliedDate: values.appliedDate ? values.appliedDate.format('YYYY-MM-DD') : '',
      }
      if (editing) {
        setApps(prev => prev.map(a => a.id === editing.id ? { ...a, ...data } : a))
      } else {
        setApps(prev => [...prev, { ...data, id: Date.now() }])
      }
      setModalOpen(false)
    })
  }

  const handleDelete = (id) => setApps(prev => prev.filter(a => a.id !== id))
  const handleMove   = (id, status) => setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))

  const total = apps.length
  const applied = apps.filter(a => a.status !== 'SAVED').length
  const interviews = apps.filter(a => a.status === 'INTERVIEW').length
  const offers = apps.filter(a => a.status === 'OFFER').length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Application Board</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track every application across all stages</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAdd}
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none' }}
          className="font-semibold"
        >
          Add Application
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total tracked', value: total,      color: 'text-gray-800' },
          { label: 'Applied',       value: applied,    color: 'text-blue-600' },
          { label: 'Interviews',    value: interviews, color: 'text-violet-600' },
          { label: 'Offers',        value: offers,     color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ alignItems: 'flex-start' }}>
        {COLUMNS.map(col => {
          const colApps = apps.filter(a => a.status === col.key)
          return (
            <div key={col.key} className="flex-shrink-0 w-64 flex flex-col">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: col.dot }} />
                <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                  {colApps.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2.5 min-h-24">
                {colApps.length === 0
                  ? <div className="border-2 border-dashed border-gray-100 rounded-xl h-20 flex items-center justify-center text-xs text-gray-300">
                      Drop here
                    </div>
                  : colApps.map(app => (
                      <AppCard
                        key={app.id}
                        app={app}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        onMove={handleMove}
                        columns={COLUMNS}
                      />
                    ))
                }
              </div>

              {/* Add button per column */}
              <button
                onClick={openAdd}
                className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-600 px-1 py-1 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <PlusOutlined /> Add card
              </button>
            </div>
          )
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        title={
          <span className="font-bold text-gray-900">
            {editing ? 'Edit Application' : 'Add Application'}
          </span>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText={editing ? 'Save changes' : 'Add'}
        okButtonProps={{ style: { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none' } }}
        width={480}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4" requiredMark={false}>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="company" label="Company" rules={[{ required: true, message: 'Required' }]}>
              <Input prefix={<BankOutlined className="text-gray-400" />} placeholder="e.g. Google" />
            </Form.Item>
            <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Required' }]}>
              <Input placeholder="e.g. Java Backend Engineer" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="status" label="Status" initialValue="SAVED">
              <Select options={COLUMNS.map(c => ({ value: c.key, label: c.label }))} />
            </Form.Item>
            <Form.Item name="salary" label="Salary range">
              <Input prefix={<DollarOutlined className="text-gray-400" />} placeholder="e.g. ₹20-30 LPA" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="appliedDate" label="Applied date">
              <DatePicker className="w-full" format="DD MMM YYYY" />
            </Form.Item>
            <Form.Item name="url" label="Job URL">
              <Input prefix={<LinkOutlined className="text-gray-400" />} placeholder="https://..." />
            </Form.Item>
          </div>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea
              prefix={<FileTextOutlined />}
              placeholder="Any notes about this application..."
              rows={2}
              className="resize-none"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}