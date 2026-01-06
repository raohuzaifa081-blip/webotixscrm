import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, Shield, Briefcase, User } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get('/api/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="text-purple-500" size={20} />;
      case 'team':
        return <Briefcase className="text-blue-500" size={20} />;
      case 'client':
        return <User className="text-green-500" size={20} />;
      default:
        return <UserPlus className="text-gray-500" size={20} />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'team':
        return 'bg-blue-100 text-blue-700';
      case 'client':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={fetchUsers}
            className="ml-4 text-red-700 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Users className="text-indigo-600" size={32} />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users Management</h1>
          <p className="text-slate-500">View and manage all system users</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-slate-800">{users.length}</p>
            </div>
            <Users className="text-indigo-500" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Team Members</p>
              <p className="text-3xl font-bold text-blue-600">
                {users.filter(u => u.role === 'team').length}
              </p>
            </div>
            <Briefcase className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Clients</p>
              <p className="text-3xl font-bold text-green-600">
                {users.filter(u => u.role === 'client').length}
              </p>
            </div>
            <User className="text-green-500" size={32} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Specialization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.specialization && user.specialization !== 'None' ? (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                        {user.specialization}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                  <UserPlus className="mx-auto mb-3 text-slate-300" size={48} />
                  <p>No users found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;

