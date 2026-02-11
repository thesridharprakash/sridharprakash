"use client";

import React from "react";


type RSVPModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function RSVPModal({ open, onClose }: RSVPModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900">
          RSVP Coming Soon
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          Thank you for your interest. RSVP functionality will be enabled
          shortly.
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-blue-900 py-2 text-white hover:bg-blue-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
