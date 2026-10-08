import React, { useEffect, useState } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export default function ReviewHistory({ onBack }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();

      if (language !== 'all') {
        params.set('language', language);
      }

      params.set('page', '1');
      params.set('limit', '50');

      const response = await fetch(
        `${API_BASE_URL}/reviews?${params.toString()}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch review history');
      }

      setReviews(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load review history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [language]);

  const handleViewReview = async (review) => {
    try {
      setError('');

      const response = await fetch(
        `${API_BASE_URL}/reviews/${review._id}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to load review');
      }

      setSelectedReview(result.data);
    } catch (err) {
      setError(err.message || 'Failed to load review');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this review?'
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError('');

      const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete review');
      }

      setReviews((current) =>
        current.filter((review) => review._id !== id)
      );

      if (selectedReview?._id === id) {
        setSelectedReview(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return (
      review.title?.toLowerCase().includes(query) ||
      review.language?.toLowerCase().includes(query) ||
      review.summary?.toLowerCase().includes(query)
    );
  });

  const formatDate = (date) => {
    if (!date) return 'Unknown date';

    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getScoreStyle = (score) => {
    if (score >= 80) {
      return {
        background: 'rgba(34, 197, 94, 0.12)',
        color: '#22c55e',
      };
    }

    if (score >= 60) {
      return {
        background: 'rgba(234, 179, 8, 0.12)',
        color: '#eab308',
      };
    }

    return {
      background: 'rgba(239, 68, 68, 0.12)',
      color: '#ef4444',
    };
  };

  const containerStyle = {
    minHeight: '100vh',
    background: '#0b0f14',
    color: '#f8fafc',
    padding: '32px',
    boxSizing: 'border-box',
  };

  const cardStyle = {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '14px',
    padding: '20px',
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '28px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: 700,
              }}
            >
              Review History
            </h1>

            <p
              style={{
                margin: '8px 0 0',
                color: '#94a3b8',
              }}
            >
              View and manage your previous AI code reviews.
            </p>
          </div>

          <button
            onClick={onBack}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            ← Back to Review
          </button>
        </div>

        <div
          style={{
            ...cardStyle,
            display: 'flex',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '11px 14px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#f8fafc',
              outline: 'none',
            }}
          />

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            style={{
              padding: '11px 14px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={fetchReviews}
            style={{
              padding: '11px 16px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div
            style={{
              ...cardStyle,
              marginBottom: '20px',
              borderColor: '#7f1d1d',
              color: '#fca5a5',
            }}
          >
            {error}
          </div>
        )}

        {loading && (
          <div
            style={{
              ...cardStyle,
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            Loading review history...
          </div>
        )}

        {!loading && filteredReviews.length === 0 && (
          <div
            style={{
              ...cardStyle,
              textAlign: 'center',
              padding: '50px 20px',
            }}
          >
            <h3 style={{ marginTop: 0 }}>No reviews found</h3>

            <p style={{ color: '#94a3b8' }}>
              Your completed code reviews will appear here.
            </p>
          </div>
        )}

        {!loading && filteredReviews.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: selectedReview ? '1fr 1fr' : '1fr',
              gap: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {filteredReviews.map((review) => {
                const scoreStyle = getScoreStyle(review.score);

                return (
                  <div
                    key={review._id}
                    style={{
                      ...cardStyle,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '20px',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '17px',
                          }}
                        >
                          {review.title || 'Code Review'}
                        </h3>

                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: '#1e293b',
                            color: '#cbd5e1',
                            fontSize: '12px',
                          }}
                        >
                          {review.language}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: '8px 0',
                          color: '#94a3b8',
                          fontSize: '14px',
                          lineHeight: 1.5,
                        }}
                      >
                        {review.summary || 'No summary available.'}
                      </p>

                      <small style={{ color: '#64748b' }}>
                        {formatDate(review.createdAt)}
                      </small>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '10px',
                      }}
                    >
                      <span
                        style={{
                          ...scoreStyle,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontWeight: 700,
                        }}
                      >
                        {review.score}/100
                      </span>

                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        <button
                          onClick={() => handleViewReview(review)}
                          style={{
                            padding: '7px 11px',
                            borderRadius: '7px',
                            border: '1px solid #334155',
                            background: '#1e293b',
                            color: '#f8fafc',
                            cursor: 'pointer',
                          }}
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleDelete(review._id)}
                          disabled={deletingId === review._id}
                          style={{
                            padding: '7px 11px',
                            borderRadius: '7px',
                            border: '1px solid #7f1d1d',
                            background: 'rgba(127, 29, 29, 0.25)',
                            color: '#fca5a5',
                            cursor:
                              deletingId === review._id
                                ? 'not-allowed'
                                : 'pointer',
                          }}
                        >
                          {deletingId === review._id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedReview && (
              <div
                style={{
                  ...cardStyle,
                  height: 'fit-content',
                  position: 'sticky',
                  top: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '20px',
                    }}
                  >
                    Review Details
                  </h2>

                  <button
                    onClick={() => setSelectedReview(null)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '20px',
                    }}
                  >
                    ×
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '20px',
                  }}
                >
                  <div style={cardStyle}>
                    <div
                      style={{
                        color: '#64748b',
                        fontSize: '12px',
                      }}
                    >
                      Score
                    </div>

                    <strong style={{ fontSize: '24px' }}>
                      {selectedReview.score}/100
                    </strong>
                  </div>

                  <div style={cardStyle}>
                    <div
                      style={{
                        color: '#64748b',
                        fontSize: '12px',
                      }}
                    >
                      Issues
                    </div>

                    <strong style={{ fontSize: '24px' }}>
                      {selectedReview.metrics?.totalIssues ?? 0}
                    </strong>
                  </div>
                </div>

                <h3>Summary</h3>

                <p
                  style={{
                    color: '#cbd5e1',
                    lineHeight: 1.6,
                  }}
                >
                  {selectedReview.summary}
                </p>

                {selectedReview.improvedCode && (
                  <>
                    <h3>Improved Code</h3>

                    <pre
                      style={{
                        background: '#020617',
                        border: '1px solid #1e293b',
                        borderRadius: '8px',
                        padding: '14px',
                        overflowX: 'auto',
                        color: '#cbd5e1',
                        fontSize: '13px',
                        lineHeight: 1.5,
                      }}
                    >
                      {selectedReview.improvedCode}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}