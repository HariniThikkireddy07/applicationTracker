import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Alert } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../store/AuthContext'

export default function LoginPage() {
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form]    = Form.useForm()

  const onFinish = async (values) => {
    setError(''); setLoading(true)
    try {
      // TODO: replace with real API call
      // const res = await api.post('/auth/login', values)
      // login(res.data.user, res.data.token)
      await new Promise(r => setTimeout(r, 700))
      login({ name: 'John Doe', email: values.email }, 'mock-jwt-token')
      navigate('/board')
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Welcome back</h2>
      <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue</p>

      {error && (
        <Alert message={error} type="error" showIcon className="mb-4 rounded-lg" />
      )}

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
        <Form.Item
          name="email"
          label={<span className="text-sm font-medium text-gray-700">Email address</span>}
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="you@example.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span className="text-sm font-medium text-gray-700">Password</span>}
          rules={[{ required: true, message: 'Password is required' }]}
        >
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
        </Form.Item>

        <Form.Item className="mb-2 mt-2">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="h-10 font-semibold rounded-lg bg-primary-600 border-primary-600 hover:bg-primary-700"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none' }}
          >
            Sign in
          </Button>
        </Form.Item>
      </Form>

      <p className="text-sm text-center text-gray-500 mt-4">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
          Create one
        </Link>
      </p>
    </div>
  )
}