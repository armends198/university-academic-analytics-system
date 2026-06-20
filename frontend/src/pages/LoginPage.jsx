import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function isValidEmailFormat(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const errs = {}
    if (!form.email.trim()) {
      errs.email = 'Ky fushë është e detyrueshme.'
    } else if (!isValidEmailFormat(form.email)) {
      errs.email = 'Formati i email-it është i pasaktë.'
    }
    if (!form.password.trim()) {
      errs.password = 'Ky fushë është e detyrueshme.'
    }
    return errs
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined, auth: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', {
        email: form.email.trim(),
        password: form.password,
      })
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('firstName', data.firstName)
      navigate(data.role === 'Administrator' ? '/dashboard' : '/at-risk')
    } catch (err) {
      const status = err.response?.status
      setErrors({
        auth: status === 401
          ? 'Email ose password gabim.'
          : 'Gabim gjatë kyçjes. Provoni përsëri.',
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 text-white bg-gradient-to-br from-violet-700 via-violet-800 to-purple-900 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-[-80px] left-[-80px] w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-[-40px] w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Icon */}
          <div className="mb-8 w-20 h-20 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-center mb-3">
            Sistemi Akademik
          </h1>
          <p className="text-purple-200 text-center text-base max-w-xs leading-relaxed">
            Platforma e menaxhimit të studentëve dhe stafit akademik
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">2,400+</div>
              <div className="text-purple-200 text-xs mt-1 font-medium uppercase tracking-wide">Studentë Aktivë</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">150+</div>
              <div className="text-purple-200 text-xs mt-1 font-medium uppercase tracking-wide">Staf Akademik</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">40+</div>
              <div className="text-purple-200 text-xs mt-1 font-medium uppercase tracking-wide">Programe</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-purple-200 text-xs mt-1 font-medium uppercase tracking-wide">Disponueshmëri</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo (visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">Sistemi Akademik</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Mirë se vini</h2>
            <p className="text-gray-500 mt-1 text-sm">Kyçuni në llogarinë tuaj akademike</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Auth error banner */}
            {errors.auth && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd" />
                </svg>
                {errors.auth}
              </div>
            )}

            {/* Email field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email / Emri i Përdoruesit
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                value={form.email}
                onChange={handleChange}
                placeholder="email@seeu.edu.mk"
                className={[
                  'w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow',
                  errors.email
                    ? 'border-red-400 bg-red-50 focus:ring-red-400'
                    : 'border-gray-300 bg-white',
                ].join(' ')}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Fjalëkalimi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={[
                  'w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow',
                  errors.password
                    ? 'border-red-400 bg-red-50 focus:ring-red-400'
                    : 'border-gray-300 bg-white',
                ].join(' ')}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Duke u kyçur…
                </>
              ) : (
                'Kyçu'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Sistemi Akademik · v1.0
          </p>
        </div>
      </div>
    </div>
  )
}
