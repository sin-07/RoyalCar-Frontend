import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EmailTestPage = () => {
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testEmail = async () => {
    if (!bookingId.trim()) {
      setResult({ success: false, message: 'Please enter a booking ID' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`http://localhost:3000/api/test/test-email/${bookingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: 'Network error: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📧 Email Test
          </h1>
          <p className="text-gray-600">
            Test the new professional invoice email system
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booking ID
            </label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="Enter booking ID to test"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testEmail}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending Email...
              </div>
            ) : (
              'Send Test Email'
            )}
          </motion.button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center">
              <span className="text-lg mr-2">
                {result.success ? '✅' : '❌'}
              </span>
              <div>
                <p className="font-medium">{result.message}</p>
                {result.success && result.invoiceNumber && (
                  <p className="text-sm mt-1">
                    Invoice: {result.invoiceNumber}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            📝 How to use:
          </p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Enter any valid booking ID from your database</li>
            <li>• Click "Send Test Email" to test the invoice</li>
            <li>• Check the customer's email for the professional invoice</li>
            <li>• The PDF will be attached automatically</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <span className="font-bold">⚠️ Note:</span> This will send a real email to the customer associated with the booking ID. Make sure the booking exists in your database.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailTestPage;
