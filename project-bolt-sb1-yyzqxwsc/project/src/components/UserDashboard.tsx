import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Grievance } from '../lib/supabase';
import { LogOut, Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import GrievanceForm from './GrievanceForm';
import Chatbot from './Chatbot';

export default function UserDashboard() {
  const { profile, signOut } = useAuth();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadGrievances();
  }, []);

  const loadGrievances = async () => {
    try {
      const { data, error } = await supabase
        .from('grievances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGrievances(data || []);
    } catch (error) {
      console.error('Error loading grievances:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'In Progress':
        return <FileText className="w-5 h-5 text-yellow-500" />;
      case 'Resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Closed':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      case 'Closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (showForm) {
    return (
      <GrievanceForm
        onBack={() => {
          setShowForm(false);
          loadGrievances();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                College Grievance System
              </h1>
              <p className="text-sm text-slate-600">
                Welcome, {profile?.full_name} ({profile?.role})
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">My Grievances</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
          >
            <Plus className="w-5 h-5" />
            Submit New Grievance
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600">Loading your grievances...</p>
          </div>
        ) : grievances.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No Grievances Yet
            </h3>
            <p className="text-slate-600 mb-6">
              You haven't submitted any grievances. Click the button above to submit your first one.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {grievances.map((grievance) => (
              <div
                key={grievance.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded">
                        {grievance.grievance_id}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(grievance.status)}`}>
                        {grievance.status}
                      </span>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                        {grievance.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {grievance.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {grievance.description}
                    </p>
                  </div>
                  {getStatusIcon(grievance.status)}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500">
                    Submitted {new Date(grievance.created_at).toLocaleDateString()}
                  </span>
                  {grievance.resolution_comments && (
                    <div className="text-sm">
                      <span className="text-slate-500">Resolution: </span>
                      <span className="text-slate-700">{grievance.resolution_comments}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
}
