import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@webotixs.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'team') navigate('/team');
      else navigate('/client');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid credentials';
      setError(errorMessage);
    }
  };

  const fillCredentials = (role) => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@webotixs.com');
      setPassword('admin123');
    } else if (role === 'team') {
      setEmail('team@webotixs.com');
      setPassword('team123');
    } else if (role === 'client') {
      setEmail('client@webotixs.com');
      setPassword('client123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-3 rounded-2xl">
            <ShieldCheck className="text-white" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Welcome Back</h2>
        <p className="text-center text-slate-500 mb-8">Sign in to Webotixs CRM</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="admin@webotixs.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 text-center mb-4">Quick Login (Click to fill credentials):</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all border border-slate-200"
            >
              <div className="font-semibold text-indigo-600">Admin</div>
              <div className="text-[10px] text-slate-400 mt-1">admin@webotixs.com</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('team')}
              className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all border border-slate-200"
            >
              <div className="font-semibold text-indigo-600">Team</div>
              <div className="text-[10px] text-slate-400 mt-1">team@webotixs.com</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('client')}
              className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all border border-slate-200"
            >
              <div className="font-semibold text-indigo-600">Client</div>
              <div className="text-[10px] text-slate-400 mt-1">client@webotixs.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
