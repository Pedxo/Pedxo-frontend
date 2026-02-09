import React, {useState, useEffect} from 'react';
import { FaStar } from "react-icons/fa";

const PerformanceReviewModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  resetKey, // ADDED
}) => {
    const [rating, setRating] = useState(0);
    const [note, setNote] = useState("");
    // ADDED: reset state when parent signals
  useEffect(() => {
    setRating(0);
    setNote("");
  }, [resetKey]);

   // ----------------------- NEW LOGIC -----------------------
   // Function to count words in the note
  const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  // Confirm button should only be enabled if:
  // - rating is selected
  // - note has at least 10 words
  const isConfirmDisabled = loading || rating === 0 || countWords(note) < 2;  

  // ---------------------------------------------------------

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className='bg-white w-[90%] max-w-md rounded-lg p-6'>
            <h2 className='text-lg font-bold text-black mb-4 text-center'>
                 Performance Review
            </h2>
            {/* Rating */}
        <p className="mb-2 font-medium text-center">Rate by star from 1 to 5</p>
        <div className='flex gap-2 mb-8 justify-center'>
            {[1,2,3,4,5].map((star) => (
                <FaStar 
                key={star}
                size={32}
                className={`cursor-pointer ${rating >= star ? "text-yellow-600" : "text-gray-300"}`}
                onClick={() => setRating(star)}
                />
            ))}
        </div>
        {/* Note */}
        <p className="font-medium mb-2">
          Leave a note for reason of termination
        </p>
        <textarea
          rows={4}
          className="w-full border rounded p-2 mb-6"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter termination note..."
        />
        {/* Actions */}
        <div className="flex justify-between ">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            disabled={isConfirmDisabled} // new logic
            onClick={() => onConfirm({ rating, note })}
            className="px-4 py-2 rounded text-white bg-red-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
        </div>
      
    </div>
  )
}

export default PerformanceReviewModal
