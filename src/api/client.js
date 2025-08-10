const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000';

export class APIClient {
  constructor(getTokens, setTokens) {
    this.getTokens = getTokens;
    this.setTokens = setTokens;
    this.refreshInFlight = null;
  }

  async request(path, options = {}, retry = true) {
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

    if (res.status === 401 && retry && tokens?.refreshToken) {
      const refreshed = await this.tryRefresh(tokens.refreshToken);
      if (refreshed) {
        return this.request(path, options, false);
      }
    }

    let json = null;
    try {
      json = await res.json();
    } catch { /* ignore */ }

    if (!res.ok) {
      throw new Error(json?.message || `Request failed (${res.status})`);
    }
    return json;
  }

  async tryRefresh(refreshToken) {
    if (!this.refreshInFlight) {
      this.refreshInFlight = (async () => {
        try {
          const resp = await fetch(`${API_BASE}/v1/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          if (!resp.ok) {
            return false;
          }
          const json = await resp.json();
          this.setTokens({
            accessToken: json.data.access_token,
            refreshToken: json.data.refresh_token,
            expiresAt: json.data.expires_at,
          });
          return true;
        } catch {
          return false;
        } finally {
          this.refreshInFlight = null;
        }
      })();
    }
    return this.refreshInFlight;
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

  // Households
  createHousehold(name) {
    return this.request('/v1/households', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }
  listHouseholds() {
    return this.request('/v1/households');
  }

  // Accounts
  createAccount(householdId, payload) {
    return this.request(`/v1/households/${householdId}/accounts`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  listAccounts(householdId) {
    return this.request(`/v1/households/${householdId}/accounts`);
  }

  // Transactions
  createTransaction(accountId, payload) {
    return this.request(`/v1/accounts/${accountId}/transactions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
  listTransactions(accountId, params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/v1/accounts/${accountId}/transactions${qs ? `?${qs}` : ''}`);
  }

  // Categories
  createCategory(householdId, name, parent_id = null) {
    return this.request(`/v1/households/${householdId}/categories`, {
      method: 'POST',
      body: JSON.stringify({ name, parent_id }),
    });
  }
  listCategories(householdId) {
    return this.request(`/v1/households/${householdId}/categories`);
  }

  // Budgets
  upsertBudget(householdId, month, category_id, planned_cents) {
    return this.request(`/v1/households/${householdId}/budgets`, {
      method: 'PUT',
      body: JSON.stringify({ month, category_id, planned_cents }),
    });
  }
  listBudgets(householdId, month) {
    return this.request(`/v1/households/${householdId}/budgets?month=${encodeURIComponent(month)}`);
  }
  budgetSummary(householdId, month) {
    return this.request(`/v1/households/${householdId}/budget_summary?month=${encodeURIComponent(month)}`);
  }
}

export const createAPIClient = (getTokens, setTokens) =>
  new APIClient(getTokens, setTokens);
