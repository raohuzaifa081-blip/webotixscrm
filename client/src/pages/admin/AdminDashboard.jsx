import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, UserPlus, Calendar, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [reports, setReports] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', projectName: '', deadline: ''
  });

  const fetchReports = async () => {
    try {
      const { data } = await axios.get('/api/admin/reports');
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      alert('Failed to load reports. Please refresh the page.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/clients', formData);
      setShowModal(false);
      fetchReports();
      alert('Client onboarded and automated workflow started!');
    } catch (err) {
      alert('Error creating client');
    }
  };

  if (!reports) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500">Manage your agency workflow</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} />
          <span>New Client Onboarding</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Projects', value: reports.summary?.totalProjects || 0, icon: <Calendar className="text-blue-500" /> },
          { label: 'Completed', value: reports.summary?.completedProjects || 0, icon: <CheckCircle className="text-green-500" /> },
          { label: 'Active Tasks', value: reports.summary?.totalTasks || 0, icon: <Clock className="text-orange-500" /> },
          { label: 'Completed Tasks', value: reports.summary?.completedTasks || 0, icon: <CheckCircle className="text-indigo-500" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-slate-50 rounded-lg">{stat.icon}</div>
            <div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Project Status Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Project Status</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {reports.projectStats && reports.projectStats.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Project Name</th>
                    <th className="px-6 py-4 font-medium">Client</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.projectStats.map((proj) => (
                    <tr key={proj._id || proj.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{proj.name}</td>
                      <td className="px-6 py-4 text-slate-600">{proj.client?.name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          proj.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          proj.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {proj.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${proj.progress || 0}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500 mt-1 inline-block">{proj.progress || 0}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <p>No projects found. Create a new client to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Team Performance / User Board Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Team Performance</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {reports.teamPerformance && reports.teamPerformance.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {reports.teamPerformance.map((member) => (
                  <div key={member._id || member.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{member.name}</h3>
                        <p className="text-sm text-slate-500">{member.email}</p>
                        {member.specialization && (
                          <span className="inline-block mt-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                            {member.specialization}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Tasks Assigned</p>
                        <p className="text-2xl font-bold text-slate-800">{member.tasksAssigned || 0}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Tasks Completed</p>
                        <p className="text-2xl font-bold text-green-600">{member.tasksCompleted || 0}</p>
                      </div>
                    </div>
                    {member.tasksAssigned > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all" 
                            style={{ width: `${Math.round((member.tasksCompleted / member.tasksAssigned) * 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {Math.round((member.tasksCompleted / member.tasksAssigned) * 100)}% Completion Rate
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <UserPlus className="mx-auto mb-3 text-slate-300" size={48} />
                <p>No team members found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8">
            <h2 className="text-xl font-bold mb-6">Automated Client Onboarding</h2>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name</label>
                  <input required className="w-full border rounded-lg p-2" onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input required type="email" className="w-full border rounded-lg p-2" onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password (Temporary)</label>
                <input required type="password" placeholder="Min 6 chars" className="w-full border rounded-lg p-2" onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input required className="w-full border rounded-lg p-2" onChange={e => setFormData({...formData, projectName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input required type="date" className="w-full border rounded-lg p-2" onChange={e => setFormData({...formData, deadline: e.target.value})} />
              </div>
              <div className="flex space-x-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">Create Workflow</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
