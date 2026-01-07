import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle, Folder, User, Calendar } from 'lucide-react';

const TeamDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get('/api/team/projects');
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const updateStatus = async (taskId, status) => {
    try {
      await axios.patch(`/api/team/tasks/${taskId}`, { status });
      fetchProjects(); // Refresh all projects
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading projects...</div>
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
            onClick={fetchProjects}
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">My Task Board</h1>
        <p className="text-slate-500">View all projects and tasks. You can update tasks assigned to you.</p>
      </div>

      {projects.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <Folder className="mx-auto mb-3 text-slate-300" size={48} />
          <p className="text-slate-400">No projects found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Project Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{project.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-indigo-100">
                      {project.client && (
                        <div className="flex items-center space-x-1">
                          <User size={16} />
                          <span>Client: {project.client.name}</span>
                        </div>
                      )}
                      {project.deadline && (
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Completed' ? 'bg-green-500' : 
                      project.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}>
                      {project.status}
                    </span>
                    <div className="mt-2">
                      <div className="w-32 bg-indigo-500 rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full transition-all" 
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-indigo-100 mt-1">{project.progress || 0}% Complete</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks Grid */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Tasks ({project.tasks.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.tasks.map((task) => (
                    <div 
                      key={task._id} 
                      className={`p-4 rounded-lg border-2 transition-all ${
                        task.canUpdate 
                          ? 'border-indigo-200 bg-indigo-50 hover:border-indigo-300' 
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {task.status}
                        </span>
                        {task.assignedToName && (
                          <span className="text-xs text-slate-500">
                            {task.canUpdate ? '✓ Your Task' : task.assignedToName}
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-3">{task.title}</h4>
                      
                      {task.canUpdate ? (
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-slate-600">Update Status</label>
                          <div className="flex space-x-1">
                            {['Pending', 'In Progress', 'Completed'].map((s) => (
                              <button
                                key={s}
                                onClick={() => updateStatus(task._id, s)}
                                className={`flex-1 text-[10px] font-bold py-2 rounded-lg border transition-all ${
                                  task.status === s 
                                    ? 'bg-indigo-600 text-white border-indigo-600' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">
                          Assigned to: {task.assignedToName || 'Unassigned'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {project.tasks.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    No tasks for this project yet.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamDashboard;
