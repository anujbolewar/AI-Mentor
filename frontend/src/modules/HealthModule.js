import React from 'react';

export default function HealthModule() {
  return (
    <div className="card p-12 flex flex-col items-center justify-center text-center">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#cbd5e1" strokeWidth="1.5" className="mb-4">
        <path d="M20 34 A14 14 0 0 1 6 20 A14 14 0 0 1 20 6"/>
        <path d="M20 28 A8 8 0 0 1 12 20 A8 8 0 0 1 20 12"/>
        <path d="M20 22 A2 2 0 0 1 18 20 A2 2 0 0 1 20 18"/>
      </svg>
      <h3 className="display-heading text-xl text-slate-400 italic">Your score awaits</h3>
      <p className="body-text text-sm text-slate-400 max-w-xs mt-2 font-medium">Complete the form in the FIRE Plan tab and your health score generates automatically.</p>
    </div>
  );
}
