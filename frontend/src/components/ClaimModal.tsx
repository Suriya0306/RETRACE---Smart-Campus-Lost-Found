import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import type { Item } from '../data/mockData';
import { api } from '../services/api';

interface ClaimModalProps {
  foundItem: Item;
  onClose: () => void;
  onClaimSubmitted: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ foundItem, onClose, onClaimSubmitted }) => {
  const [userBeliefReason, setUserBeliefReason] = useState(
    'The Swissgear backpack matched all my lost item details exactly and has my turtle keychain.'
  );
  const [uniqueFeatureAnswer, setUniqueFeatureAnswer] = useState(
    'Blue turtle keychain attached to side zipper with slight scratch on front pocket.'
  );
  const [lastSeenLocationAnswer, setLastSeenLocationAnswer] = useState(
    'Left on chair in CSE Block 3rd floor Lab 4 near window.'
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userBeliefReason || !uniqueFeatureAnswer) return;

    setSubmitting(true);
    await api.submitClaim({
      itemId: foundItem.id,
      userId: 'u1',
      userBeliefReason,
      uniqueFeatureAnswer,
      lastSeenLocationAnswer
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Ownership Claim Verification</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900">Claim Submitted</h4>
              <p className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
                Status: Pending Verification
              </p>
            </div>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Campus Security Admin will review your ownership details. You will receive a notification upon approval.
            </p>
            <button
              onClick={() => {
                onClose();
                onClaimSubmitted();
              }}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
            >
              Go to My Reports Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-3">
              <img src={foundItem.image} alt={foundItem.name} className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <span className="font-bold text-slate-900 block">{foundItem.name}</span>
                <span className="text-slate-500">{foundItem.category} • {foundItem.location}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                1. Why do you believe this is your item? *
              </label>
              <textarea
                rows={2}
                required
                value={userBeliefReason}
                onChange={(e) => setUserBeliefReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                2. Describe one unique feature of the item. *
              </label>
              <textarea
                rows={2}
                required
                value={uniqueFeatureAnswer}
                onChange={(e) => setUniqueFeatureAnswer(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                3. Where did you last have the item? *
              </label>
              <input
                type="text"
                required
                value={lastSeenLocationAnswer}
                onChange={(e) => setLastSeenLocationAnswer(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-extrabold text-xs shadow-md"
              >
                {submitting ? 'Submitting Verification Claim...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
