import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Alert } from 'antd'
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { useAuth } from '../store/AuthContext'

export default function RegisterPage() {
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form]    = Form.useForm()

  const onFinish = async (values) => {
    setError(''); setLoading(true)
    try {
      // TODO: replace with real API call
      // const res = await api.post('/auth/register', { name: values.name, email: values.email, password: values.password })
      // login(res.data.user, res.data.token)
      await new Promise(r => setTimeout(r, 700))
      login({ name: values.name, email: values.email }, 'mock-jwt-token')
      navigate('/board')
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Create account</h2>
      <p className="text-sm text-gray-500 mb-6">Start tracking your job applications today</p>

      {error && (
        <Alert message={error} type="error" showIcon className="mb-4 rounded-lg" />
      )}

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
        <Form.Item
          name="name"
          label={<span className="text-sm font-medium text-gray-700">Full name</span>}
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="John Doe" />
        </Form.Item>

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
          rules={[
            { required: true, message: 'Password is required' },
            { min: 8, message: 'At least 8 characters' },
          ]}
        >
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Min. 8 characters" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<span className="text-sm font-medium text-gray-700">Confirm password</span>}
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve()
                return Promise.reject(new Error('Passwords do not match'))
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
        </Form.Item>

        <Form.Item className="mb-2 mt-2">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="h-10 font-semibold rounded-lg"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none' }}
          >
            Create account
          </Button>
        </Form.Item>
      </Form>

      <p className="text-sm text-center text-gray-500 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}