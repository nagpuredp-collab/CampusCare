import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, GrievanceCategory } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';

type Props = {
  onBack: () => void;
};

export default function GrievanceForm({ onBack }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GrievanceCategory>('Academic');
  const [subCategory, setSubCategory] = useState('');
  const [details, setDetails] = useState<Record<string, any>>({});

  const categories = {
    Academic: ['Teaching Quality', 'Syllabus', 'Time-Table Clash', 'Lab/Equipment'],
    Facility: ['Classroom Infrastructure', 'WiFi', 'Water Supply', 'Restrooms', 'Canteen', 'Hostel', 'Library', 'Parking'],
    Examination: ['Marks Related', 'Exam Scheduling', 'Exam Not Given', 'Results Delay', 'Invigilation/Conduct'],
    Placement: ['Eligibility Issues', 'Company Opportunity', 'Documentation', 'Placement Cell Support', 'Interview Process'],
    Other: ['General']
  };

  const handleDetailChange = (key: string, value: any) => {
    setDetails({ ...details, [key]: value });
  };

  const renderDynamicFields = () => {
    const commonFields = (
      <>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Sub-Category
          </label>
          <select
            value={subCategory}
            onChange={(e) => {
              setSubCategory(e.target.value);
              setDetails({});
            }}
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Select sub-category</option>
            {categories[category]?.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </>
    );

    if (!subCategory) return commonFields;

    const additionalFields = [];

    if (category === 'Academic') {
      if (subCategory === 'Teaching Quality') {
        additionalFields.push(
          <div key="subjectName">
            <label className="block text-sm font-medium text-slate-700 mb-2">Subject Name</label>
            <input type="text" value={details.subjectName || ''} onChange={(e) => handleDetailChange('subjectName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>,
          <div key="facultyName">
            <label className="block text-sm font-medium text-slate-700 mb-2">Faculty Name</label>
            <input type="text" value={details.facultyName || ''} onChange={(e) => handleDetailChange('facultyName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>,
          <div key="issueType">
            <label className="block text-sm font-medium text-slate-700 mb-2">Issue Type</label>
            <input type="text" value={details.issueType || ''} onChange={(e) => handleDetailChange('issueType', e.target.value)} placeholder="e.g., Pace of teaching, Methodology" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
        );
      } else if (subCategory === 'Lab/Equipment') {
        additionalFields.push(
          <div key="labName">
            <label className="block text-sm font-medium text-slate-700 mb-2">Lab Name/Number</label>
            <input type="text" value={details.labNameOrNumber || ''} onChange={(e) => handleDetailChange('labNameOrNumber', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>,
          <div key="equipment">
            <label className="block text-sm font-medium text-slate-700 mb-2">Equipment/Software</label>
            <input type="text" value={details.equipmentOrSoftware || ''} onChange={(e) => handleDetailChange('equipmentOrSoftware', e.target.value)} placeholder="e.g., Computer #5, AutoCAD" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
        );
      }
    } else if (category === 'Facility') {
      if (['Classroom Infrastructure', 'WiFi', 'Water Supply', 'Restrooms'].includes(subCategory)) {
        additionalFields.push(
          <div key="building">
            <label className="block text-sm font-medium text-slate-700 mb-2">Building</label>
            <input type="text" value={details.building || ''} onChange={(e) => handleDetailChange('building', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
        );
      }
      if (subCategory === 'Classroom Infrastructure') {
        additionalFields.push(
          <div key="roomNo">
            <label className="block text-sm font-medium text-slate-700 mb-2">Room Number</label>
            <input type="text" value={details.roomNo || ''} onChange={(e) => handleDetailChange('roomNo', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>,
          <div key="item">
            <label className="block text-sm font-medium text-slate-700 mb-2">Item</label>
            <input type="text" value={details.item || ''} onChange={(e) => handleDetailChange('item', e.target.value)} placeholder="e.g., Projector, Fan, Light" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
        );
      } else if (subCategory === 'Hostel') {
        additionalFields.push(
          <div key="hostelName">
            <label className="block text-sm font-medium text-slate-700 mb-2">Hostel Name</label>
            <input type="text" value={details.hostelName || ''} onChange={(e) => handleDetailChange('hostelName', e.target.value)} placeholder="e.g., Boys Hostel A" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>,
          <div key="roomNo">
            <label className="block text-sm font-medium text-slate-700 mb-2">Room Number</label>
            <input type="text" value={details.roomNo || ''} onChange={(e) => handleDetailChange('roomNo', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
        );
      }
    } else if (category === 'Examination') {
      if (subCategory === 'Marks Related') {
        additionalFields.push(
          <div key="subject">
            <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
            <input type="text" value={details.subject || ''} onChange={(e) => handleDetailChange('subject', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>,
          <div key="examName">
            <label className="block text-sm font-medium text-slate-700 mb-2">Exam Name</label>
            <input type="text" value={details.examName || ''} onChange={(e) => handleDetailChange('examName', e.target.value)} placeholder="e.g., Mid-Term 1" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
        );
      }
    } else if (category === 'Placement') {
      if (['Eligibility Issues', 'Company Opportunity', 'Interview Process'].includes(subCategory)) {
        additionalFields.push(
          <div key="companyName">
            <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
            <input type="text" value={details.companyName || ''} onChange={(e) => handleDetailChange('companyName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
        );
      }
    }

    return (
      <>
        {commonFields}
        {additionalFields}
      </>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user) throw new Error('Not authenticated');

      const { data: insertedData, error: insertError } = await supabase
        .from('grievances')
        .insert({
          submitted_by: user.id,
          title,
          description,
          category,
          status: 'Submitted',
          details: { subCategory, ...details }
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      if (insertedData) {
        const year = new Date().getFullYear();
        const shortId = insertedData.id.split('-')[0];
        const grievanceId = `G-${year}-${shortId}`;

        const { error: updateError } = await supabase
          .from('grievances')
          .update({ grievance_id: grievanceId })
          .eq('id', insertedData.id);

        if (updateError) throw updateError;
      }

      setSuccess(true);
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit grievance');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Grievance Submitted!</h2>
          <p className="text-slate-600">Your grievance has been successfully submitted and will be reviewed shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Submit New Grievance</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief title of your grievance"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as GrievanceCategory);
                  setSubCategory('');
                  setDetails({});
                }}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Academic">Academic</option>
                <option value="Facility">Facility</option>
                <option value="Examination">Examination</option>
                <option value="Placement">Placement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {renderDynamicFields()}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide detailed information about your grievance"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Grievance'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
