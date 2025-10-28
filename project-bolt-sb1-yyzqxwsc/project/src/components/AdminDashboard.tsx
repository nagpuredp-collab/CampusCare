import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Grievance, Profile, GrievanceStatus } from '../lib/supabase';
import { LogOut, Filter, TrendingUp, Clock, CheckCircle, FileText } from 'lucide-react';
import Chatbot from './Chatbot';

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [filteredGrievances, setFilteredGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [resolutionComment, setResolutionComment] = useState('');
  const [newStatus, setNewStatus] = useState<GrievanceStatus>('In Progress');
  const [admins, setAdmins] = useState<Profile[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [grievances, filterStatus, filterCategory]);

  const loadData = async () => {
    try {
      const [grievancesRes, adminsRes] = await Promise.all([
        supabase
          .from('grievances')
          .select(`
            *,
            submitter:profiles!grievances_submitted_by_fkey(*)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('*')
          .eq('role', 'Admin')
      ]);

      if (grievancesRes.error) throw grievancesRes.error;
      if (adminsRes.error) throw adminsRes.error;

      setGrievances(grievancesRes.data || []);
      setAdmins(adminsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...grievances];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(g => g.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(g => g.category === filterCategory);
    }

    setFilteredGrievances(filtered);
  };

  const handleUpdateGrievance = async () => {
    if (!selectedGrievance) return;

    try {
      const { error } = await supabase
        .from('grievances')
        .update({
          status: newStatus,
          resolution_comments: resolutionComment,
          assigned_to: profile?.id
        })
        .eq('id', selectedGrievance.id);

      if (error) throw error;

      setSelectedGrievance(null);
      setResolutionComment('');
      loadData();
    } catch (error) {
      console.error('Error updating grievance:', error);
    }
  };

  const stats = {
    total: grievances.length,
    submitted: grievances.filter(g => g.status === 'Submitted').length,
    inProgress: grievances.filter(g => g.status === 'In Progress').length,
    resolved: grievances.filter(g => g.status === 'Resolved').length,
  };

  const categoryStats = grievances.reduce((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Admin Panel
              </h1>
              <p className="text-sm text-slate-600">
                Welcome, {profile?.full_name}
              </p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Grievances</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Submitted</p>
                <p className="text-3xl font-bold text-blue-600">{stats.submitted}</p>
              </div>
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Category Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{count}</p>
                <p className="text-sm text-slate-600">{category}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">All Grievances</h2>
            <div className="flex gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Facility">Facility</option>
                <option value="Examination">Examination</option>
                <option value="Placement">Placement</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGrievances.map((grievance) => (
                <div
                  key={grievance.id}
                  className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer"
                  onClick={() => {
                    setSelectedGrievance(grievance);
                    setNewStatus(grievance.status);
                    setResolutionComment(grievance.resolution_comments || '');
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded">
                          {grievance.grievance_id}
                        </span>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {grievance.status}
                        </span>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                          {grievance.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {grievance.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        Submitted by: {grievance.submitter?.full_name} ({grievance.submitter?.user_id})
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm mb-3">{grievance.description}</p>
                  <div className="text-sm text-slate-500">
                    {new Date(grievance.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedGrievance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Update Grievance
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-sm font-medium text-slate-700">Grievance ID:</span>
                <span className="ml-2 font-mono">{selectedGrievance.grievance_id}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Title:</span>
                <span className="ml-2">{selectedGrievance.title}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700">Description:</span>
                <p className="mt-1 text-slate-600">{selectedGrievance.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as GrievanceStatus)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resolution Comments
                </label>
                <textarea
                  value={resolutionComment}
                  onChange={(e) => setResolutionComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Add resolution comments..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateGrievance}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
              >
                Update Grievance
              </button>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2.5 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Chatbot />
    </div>
  );
}
