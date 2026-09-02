import { useState } from 'react'
import { Form, Input, Button, Switch, Select, message, Avatar, Divider } from 'antd'
import {
  UserOutlined, MailOutlined, LockOutlined, BellOutlined,
  SaveOutlined, CameraOutlined,
} from '@ant-design/icons'
import { useAuth } from '../store/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [saving, setSaving] = useState(false)

  const [notifications, setNotifications] = useState({
    followUpReminders: true,
    weeklyDigest: true,
    offerAlerts: true,
    emailNotifications: false,
  })

  const handleProfileSave = async (values) => {
    setSaving(true)
    // TODO: api.put('/users/profile', values)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
    message.success('Profile updated successfully')
  }

  const handlePasswordSave = async (values) => {
    setSaving(true)
    // TODO: api.put('/users/password', values)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
    message.success('Password updated successfully')
    passwordForm.resetFields()
  }

  const Section = ({ title, subtitle, children }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5 mb-5">{subtitle}</p>}
      <Divider className="my-4" />
      {children}
    </div>
  )

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <Section title="Profile" subtitle="Update your personal information">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar
              size={64}
              className="text-xl font-bold"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
              <CameraOutlined style={{ fontSize: 11 }} />
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <Form
          form={profileForm}
          layout="vertical"
          requiredMark={false}
          initialValues={{ name: user?.name, email: user?.email }}
          onFinish={handleProfileSave}
        >
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="name" label={<span className="text-sm font-medium text-gray-700">Full name</span>}
              rules={[{ required: true, message: 'Required' }]}>
              <Input prefix={<UserOutlined className="text-gray-400" />} />
            </Form.Item>
            <Form.Item name="email" label={<span className="text-sm font-medium text-gray-700">Email</span>}
              rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined className="text-gray-400" />} />
            </Form.Item>
          </div>
          <Form.Item name="targetRole" label={<span className="text-sm font-medium text-gray-700">Target role</span>}>
            <Select
              placeholder="Select your target role"
              options={[
                { value: 'java_backend', label: 'Java Backend Engineer' },
                { value: 'java_fullstack', label: 'Java Full Stack Engineer' },
                { value: 'backend', label: 'Backend Engineer' },
                { value: 'fullstack', label: 'Full Stack Engineer' },
              ]}
            />
          </Form.Item>
          <Form.Item name="experienceLevel" label={<span className="text-sm font-medium text-gray-700">Experience level</span>}>
            <Select
              placeholder="Select your experience level"
              options={[
                { value: '0_2', label: '0–2 years' },
                { value: '2_5', label: '2–5 years' },
                { value: '5_plus', label: '5+ years' },
              ]}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={saving}
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none' }}
          >
            Save profile
          </Button>
        </Form>
      </Section>

      {/* Password */}
      <Section title="Change Password" subtitle="Use a strong password of at least 8 characters">
        <Form
          form={passwordForm}
          layout="vertical"
          requiredMark={false}
          onFinish={handlePasswordSave}
        >
          <Form.Item name="currentPassword" label={<span className="text-sm font-medium text-gray-700">Current password</span>}
            rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="newPassword" label={<span className="text-sm font-medium text-gray-700">New password</span>}
              rules={[{ required: true }, { min: 8, message: 'At least 8 characters' }]}>
              <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label={<span className="text-sm font-medium text-gray-700">Confirm password</span>}
              dependencies={['newPassword']}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
                    return Promise.reject(new Error('Passwords do not match'))
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
            </Form.Item>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            icon={<LockOutlined />}
            loading={saving}
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none' }}
          >
            Update password
          </Button>
        </Form>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" subtitle="Control when and how you get reminded">
        <div className="space-y-4">
          {[
            { key: 'followUpReminders', label: 'Follow-up reminders', desc: 'Get reminded when a follow-up is due' },
            { key: 'weeklyDigest',      label: 'Weekly digest',       desc: 'Summary of your job search activity every Monday' },
            { key: 'offerAlerts',       label: 'Offer alerts',        desc: 'Instant notification when an application moves to Offer' },
            { key: 'emailNotifications',label: 'Email notifications', desc: 'Receive all notifications via email as well' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onChange={val => setNotifications(prev => ({ ...prev, [item.key]: val }))}
                style={notifications[item.key] ? { background: '#4f46e5' } : {}}
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}