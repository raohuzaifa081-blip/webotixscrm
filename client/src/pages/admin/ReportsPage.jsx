import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, Clock, BarChart3 } from 'lucide-react';

const ReportsPage = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get('/api/admin/reports');
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading reports...</div>
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
            onClick={fetchReports}
            className="ml-4 text-red-700 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="p-8">
        <div className="text-slate-500">No reports available.</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-8">
        <BarChart3 className="text-indigo-600" size={32} />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Report Board</h1>
          <p className="text-slate-500">Comprehensive analytics and project insights</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Projects', value: reports.summary?.totalProjects || 0, icon: <Calendar className="text-blue-500" /> },
          { label: 'Completed Projects', value: reports.summary?.completedProjects || 0, icon: <CheckCircle className="text-green-500" /> },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        {/* Team Performance Section */}
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
                <p>No team members found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

