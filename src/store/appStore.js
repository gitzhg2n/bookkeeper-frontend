// Enhanced state management with Zustand (already installed)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Global app store for complex state
export const useAppStore = create(
  persist(
    (set, get) => ({
      // UI state
      sidebarCollapsed: false,
      theme: 'light',
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setTheme: (theme) => set({ theme }),

      // Financial data cache
      accounts: [],
      transactions: [],
      budgets: [],
      categories: [],

      // Actions
      setAccounts: (accounts) => set({ accounts }),
      setTransactions: (transactions) => set({ transactions }),
      setBudgets: (budgets) => set({ budgets }),
      setCategories: (categories) => set({ categories }),

      // Computed values
      getTotalBalance: () => {
        const { accounts } = get();
        return accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
      },

      getTransactionsByAccount: (accountId) => {
        const { transactions } = get();
        return transactions.filter(tx => tx.account_id === accountId);
      },

      // Data refresh
      refreshData: async (api) => {
        try {
          const [accounts, transactions, budgets, categories] = await Promise.all([
            api.getAccounts(),
            api.getTransactions(),
            api.getBudgets(),
            api.getCategories(),
          ]);

          set({
            accounts: accounts.data || [],
            transactions: transactions.data || [],
            budgets: budgets.data || [],
            categories: categories.data || [],
          });
        } catch (error) {
          console.error('Failed to refresh data:', error);
        }
      },
    }),
    {
      name: 'bookkeeper-app-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        sidebarCollapsed: state.sidebarCollapsed 
      }),
    }
  )
);
