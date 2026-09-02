import { useState } from 'react'
import { Button, Input, Progress, Tag, Spin, Alert } from 'antd'
import {
  ThunderboltOutlined, CheckCircleOutlined, CloseCircleOutlined,
  FileTextOutlined, BulbOutlined, ArrowRightOutlined,
} from '@ant-design/icons'

const SAMPLE_JD = `We are looking for a Java Backend Engineer with strong experience in:
- Java 17+ and Spring Boot 3.x
- REST API design and microservices architecture
- PostgreSQL or MySQL database design
- Redis caching
- Docker and Kubernetes
- CI/CD pipelines
- Good understanding of system design principles`

const SAMPLE_RESUME = `2 years of experience as Software Engineer at a startup.
Tech stack: Java Spring Boot, React, C# .NET.
Built REST APIs, worked with PostgreSQL, deployed using Docker.
Familiar with Redis and microservices. Used CI/CD pipelines.`

const MOCK_RESULT = {
  score: 82,
  matched: ['Java Spring Boot', 'REST API design', 'PostgreSQL', 'Docker', 'Redis', 'Microservices'],
  missing: ['Kubernetes', 'Java 17+ specific features', 'CI/CD pipeline tools (Jenkins/GitHub Actions)'],
  tips: [
    'Mention specific Spring Boot 3.x features you have used (Virtual Threads, AOT processing)',
    'Add your Docker experience with specific examples — image building, docker-compose',
    'Learn basic Kubernetes concepts (Pods, Deployments, Services) — it appears often in JDs',
    'Quantify your impact — e.g. "reduced API response time by 40% using Redis caching"',
  ],
}

export default function AiScorerPage() {
  const [jd, setJd] = useState('')
  const [resume, setResume] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleScore = async () => {
    if (!jd.trim() || !resume.trim()) {
      setError('Please fill in both the job description and your resume summary.')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)
    // TODO: replace with real Spring Boot API call
    // const res = await api.post('/ai/score', { jobDescription: jd, resumeSummary: resume })
    // setResult(res.data)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setResult(MOCK_RESULT)
  }

  const scoreColor = result
    ? result.score >= 75 ? '#10b981' : result.score >= 50 ? '#f59e0b' : '#ef4444'
    : '#4f46e5'

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ThunderboltOutlined className="text-violet-500" /> AI Resume Scorer
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Paste a job description and your resume summary to get an instant match score and keyword gap analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Job description */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
              <FileTextOutlined className="text-gray-400" /> Job Description
            </h3>
            <button
              onClick={() => setJd(SAMPLE_JD)}
              className="text-xs text-primary-600 hover:underline"
            >
              Load sample
            </button>
          </div>
          <Input.TextArea
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={10}
            className="resize-none text-sm"
          />
        </div>

        {/* Resume summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
              <FileTextOutlined className="text-gray-400" /> Your Resume Summary
            </h3>
            <button
              onClick={() => setResume(SAMPLE_RESUME)}
              className="text-xs text-primary-600 hover:underline"
            >
              Load sample
            </button>
          </div>
          <Input.TextArea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Paste a summary of your skills and experience..."
            rows={10}
            className="resize-none text-sm"
          />
        </div>
      </div>

      {error && <Alert message={error} type="error" showIcon className="mb-4 rounded-xl" />}

      <div className="flex justify-center mb-7">
        <Button
          type="primary"
          size="large"
          icon={loading ? <Spin size="small" /> : <ThunderboltOutlined />}
          onClick={handleScore}
          disabled={loading}
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', height: 44, paddingInline: 32 }}
          className="font-semibold rounded-xl"
        >
          {loading ? 'Analysing...' : 'Score My Resume'}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Score */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-gray-600 mb-3">Match Score</p>
            <Progress
              type="circle"
              percent={result.score}
              strokeColor={scoreColor}
              strokeWidth={8}
              size={120}
              format={p => <span className="text-2xl font-bold" style={{ color: scoreColor }}>{p}%</span>}
            />
            <p className="mt-4 text-sm font-medium" style={{ color: scoreColor }}>
              {result.score >= 75 ? '🟢 Strong match' : result.score >= 50 ? '🟡 Moderate match' : '🔴 Needs work'}
            </p>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
              <CheckCircleOutlined className="text-emerald-500" /> Matched Keywords
            </h3>
            <div className="flex flex-wrap gap-2 mb-5">
              {result.matched.map(k => (
                <Tag key={k} color="success" className="rounded-full text-xs">{k}</Tag>
              ))}
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
              <CloseCircleOutlined className="text-red-400" /> Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missing.map(k => (
                <Tag key={k} color="error" className="rounded-full text-xs">{k}</Tag>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
              <BulbOutlined className="text-amber-500" /> Improvement Tips
            </h3>
            <ul className="space-y-3">
              {result.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                  <ArrowRightOutlined className="text-primary-500 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}