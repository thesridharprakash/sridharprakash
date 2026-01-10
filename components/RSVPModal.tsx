"use client";

import { motion, AnimatePresence } from "framer-motion";

type RSVPModalProps = {
  open: boolean;
  onClose: () => void;
  eventTitle?: string;
};

export default function RSVPModal({
  open,
  onClose,
  eventTitle,
}: RSVPModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              RSVP
            </h2>

            {eventTitle && (
              <p className="mt-1 text-sm text-gray-600">
                {eventTitle}
              </p>
            )}

            <p className="mt-4 text-gray-700">
              RSVP functionality will be enabled soon.
            </p>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-md bg-orange-600 py-2 text-white font-medium hover:bg-orange-700 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
