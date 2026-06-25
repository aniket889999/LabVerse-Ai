'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lab } from '@/types';
import { api } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
import { CheckCircle } from 'lucide-react';

function BookingFormInner({ labs }: { labs: Lab[] }) {
  const searchParams = useSearchParams();
  const preselectedLabId = searchParams.get('labId') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    requesterName: '',
    requesterEmail: '',
    organizationName: '',
    role: '',
    requestType: 'PHYSICAL_VISIT',
    preferredDate: '',
    preferredTimeSlot: '',
    selectedLabId: preselectedLabId,
    purpose: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.createBooking(formData);
      if (res.success) {
        setIsSuccess(true);
        trackEvent({
          eventType: 'BOOKING_SUBMITTED',
          metadata: { requestType: formData.requestType, role: formData.role }
        });
      } else {
        setErrorMsg(res.error || 'Failed to submit booking. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h2>
        <p className="text-gray-600 text-lg max-w-lg mx-auto">
          Thank you, {formData.requesterName}. We have received your request and our faculty administration team will be in touch with you shortly at {formData.requesterEmail}.
        </p>
        <button onClick={() => window.location.href = '/'} className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-full transition">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-12 space-y-8">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Visitor Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Visitor Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input required type="text" name="requesterName" value={formData.requesterName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input required type="email" name="requesterEmail" value={formData.requesterEmail} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization / University</label>
            <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Select a role...</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty / Academic</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Industry Professional">Industry Professional</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visit Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Request Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Request Type *</label>
            <div className="flex flex-col sm:flex-row gap-4">
              {['PHYSICAL_VISIT', 'ONLINE_DEMO', 'PARTNERSHIP'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-gray-50 flex-1">
                  <input type="radio" name="requestType" value={type} checked={formData.requestType === type} onChange={handleChange} className="text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">{type.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {(formData.requestType === 'PHYSICAL_VISIT' || formData.requestType === 'ONLINE_DEMO') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Lab (Optional)</label>
              <select name="selectedLabId" value={formData.selectedLabId} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="">I'm interested in multiple/all labs</option>
                {labs.map(lab => (
                  <option key={lab.id} value={lab.id}>{lab.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
            <select name="preferredTimeSlot" value={formData.preferredTimeSlot} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Any time</option>
              <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
              <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
              <option value="Evening (5 PM - 7 PM)">Evening (5 PM - 7 PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Purpose */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Additional Information</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Request *</label>
          <input required type="text" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="e.g. Academic Research, Talent Scouting, Project Collaboration" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Tell us more about what you hope to achieve..." className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
        </div>
      </div>

      <button disabled={isSubmitting} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 rounded-xl transition shadow-md">
        {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
      </button>
    </form>
  );
}

export default function BookingForm({ labs }: { labs: Lab[] }) {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-500">Loading form...</div>}>
      <BookingFormInner labs={labs} />
    </Suspense>
  );
}
