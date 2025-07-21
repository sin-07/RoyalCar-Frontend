import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ReviewManagement = () => {
  const { axios } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all'); // all, approved, pending, testimonials
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, rating_high, rating_low

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let url = '/api/reviews/all';
      
      if (filter === 'approved') {
        url += '?approved=true';
      } else if (filter === 'pending') {
        url += '?approved=false';
      } else if (filter === 'testimonials') {
        url += '?testimonial=true';
      }

      const { data } = await axios.get(url);
      
      if (data.success) {
        setReviews(data.reviews);
      } else {
        toast.error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/reviews/stats');
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (reviewId, isApproved) => {
    try {
      const { data } = await axios.put(`/api/reviews/approve/${reviewId}`, {
        isApproved
      });
      
      if (data.success) {
        toast.success(`Review ${isApproved ? 'approved' : 'unapproved'} successfully`);
        fetchReviews();
        fetchStats();
      } else {
        toast.error('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  const handleTestimonial = async (reviewId, isTestimonial) => {
    try {
      const { data } = await axios.put(`/api/reviews/approve/${reviewId}`, {
        isTestimonial,
        isApproved: true // Auto-approve when marking as testimonial
      });
      
      if (data.success) {
        toast.success(`Review ${isTestimonial ? 'added to' : 'removed from'} testimonials`);
        fetchReviews();
        fetchStats();
      } else {
        toast.error('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
    
    try {
      const { data } = await axios.delete(`/api/reviews/${reviewId}`);
      
      if (data.success) {
        toast.success('Review deleted successfully');
        fetchReviews();
        fetchStats();
      } else {
        toast.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={`text-lg ${
            index < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ));
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => 
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewText.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'rating_high':
          return b.rating - a.rating;
        case 'rating_low':
          return a.rating - b.rating;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Review Management</h1>
            <p className="text-gray-600 mt-2">Manage customer reviews and select testimonials for your website</p>
          </div>
          <button
            onClick={() => {
              fetchReviews();
              fetchStats();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-blue-600 font-semibold text-sm">Total Reviews</h3>
            <p className="text-2xl font-bold text-blue-800">{stats.totalReviews || 0}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-yellow-600 font-semibold text-sm">Pending</h3>
            <p className="text-2xl font-bold text-yellow-800">{(stats.totalReviews || 0) - (stats.approvedReviews || 0)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-green-600 font-semibold text-sm">Approved</h3>
            <p className="text-2xl font-bold text-green-800">{stats.approvedReviews || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-purple-600 font-semibold text-sm">Testimonials</h3>
            <p className="text-2xl font-bold text-purple-800">{stats.testimonials || 0}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-orange-600 font-semibold text-sm">Avg Rating</h3>
            <p className="text-2xl font-bold text-orange-800">{stats.avgRating || 0}★</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'testimonials'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    filter === filterType
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterType}
                  {filterType === 'pending' && ` (${(stats.totalReviews || 0) - (stats.approvedReviews || 0)})`}
                  {filterType === 'approved' && ` (${stats.approvedReviews || 0})`}
                  {filterType === 'testimonials' && ` (${stats.testimonials || 0})`}
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating_high">Highest Rating</option>
                <option value="rating_low">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <motion.div
            className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedReviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v8a2 2 0 002 2h6a2 2 0 002-2V8M7 8v8a2 2 0 002 2h6a2 2 0 002-2V8" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No reviews found</p>
              <p className="text-gray-400 text-sm">
                {searchTerm ? 'Try adjusting your search terms' : 'Customer reviews will appear here'}
              </p>
            </div>
          ) : (
            filteredAndSortedReviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">{review.customerName}</h3>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500 ml-1">
                          ({review.rating}/5)
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        review.isApproved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    {review.isTestimonial && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        ⭐ Testimonial
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  "{review.reviewText}"
                </p>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleApprove(review._id, !review.isApproved)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      review.isApproved
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {review.isApproved ? '✗ Unapprove' : '✓ Approve'}
                  </button>
                  
                  <button
                    onClick={() => handleTestimonial(review._id, !review.isTestimonial)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      review.isTestimonial
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {review.isTestimonial ? '⭐ Remove from Testimonials' : '⭐ Add to Testimonials'}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
