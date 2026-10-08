const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api/v1';

export async function submitCodeReview(language, code) {
  if (!language || !language.trim()) {
    throw new Error('Please select a programming language.');
  }

  if (!code || !code.trim()) {
    throw new Error('Please enter some code to review.');
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: language.toLowerCase().trim(),
        code,
      }),
    });
  } catch {
    throw new Error(
      `Unable to reach backend server at ${API_BASE_URL}. Make sure the backend is running.`
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('Received an invalid response from the server.');
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data?.message || 'Failed to analyze code.'
    );
  }

  return data.data;
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      return {
        ok: false,
        status: 'unhealthy',
      };
    }

    const data = await response.json();

    return {
      ok: true,
      status: data.status || 'healthy',
    };
  } catch {
    return {
      ok: false,
      status: 'offline',
    };
  }
}

export async function getReviews({
  page = 1,
  limit = 20,
  language,
} = {}) {
  const params = new URLSearchParams();

  params.set('page', String(page));
  params.set('limit', String(limit));

  if (language) {
    params.set('language', language);
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/reviews?${params.toString()}`
    );
  } catch {
    throw new Error(
      `Unable to reach backend server at ${API_BASE_URL}.`
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('Received an invalid response from the server.');
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data?.message || 'Failed to fetch reviews.'
    );
  }

  return data;
}

export async function getReviewById(id) {
  if (!id) {
    throw new Error('Review ID is required.');
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/reviews/${id}`
    );
  } catch {
    throw new Error(
      `Unable to reach backend server at ${API_BASE_URL}.`
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('Received an invalid response from the server.');
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data?.message || 'Failed to fetch review.'
    );
  }

  return data;
}

export async function deleteReview(id) {
  if (!id) {
    throw new Error('Review ID is required.');
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/reviews/${id}`,
      {
        method: 'DELETE',
      }
    );
  } catch {
    throw new Error(
      `Unable to reach backend server at ${API_BASE_URL}.`
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('Received an invalid response from the server.');
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data?.message || 'Failed to delete review.'
    );
  }

  return data;
}