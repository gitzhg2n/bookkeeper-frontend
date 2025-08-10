const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000';

export class APIClient {
  constructor(getTokens, setTokens) {
    this.getTokens = getTokens;
    this.setTokens = setTokens;
  }

  async request(path, options = {}) {
    const tokens = this.getTokens();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (tokens?.accessToken) {
      headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      // TODO: implement refresh flow when refresh endpoint exists
    }

    let json;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (!res.ok) {
      const msg = json?.message || `Request failed (${res.status})`;
      throw new Error(msg);
    }
    return json;
  }

  register(email, password) {
    return this.request('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  login(email, password) {
    return this.request('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  me() {
    return this.request('/v1/users/me');
  }
}

export const createAPIClient = (getTokens, setTokens) =>
  new APIClient(getTokens, setTokens);