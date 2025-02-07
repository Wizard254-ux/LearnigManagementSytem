import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const CustomAlert = ({ 
  show = false, 
  title, 
  message, 
  status = 'success', 
  onClose 
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 self-center z-[100000000]  w-96 animate-in fade-in slide-in-from-top-2">
      <div className={`relative flex items-start gap-3 p-4 border-l-4 rounded-lg shadow-lg ${
        status === 'success' 
          ? 'bg-green-50 border-green-500 text-green-800' 
          : 'bg-red-50 border-red-500 text-red-800'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 rounded-full hover:bg-black/5"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        {status === 'success' ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-600" />
        )}

        {/* Text Content */}
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
