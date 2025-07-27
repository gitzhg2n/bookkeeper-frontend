import { create } from 'zustand';

export const useStore = create(set => ({
  accounts: [],
  setAccounts: accounts => set({ accounts }),
  budgets: [],
  setBudgets: budgets => set({ budgets }),
  transactions: [],
  setTransactions: transactions => set({ transactions }),
  householdMembers: [],
  setHouseholdMembers: members => set({ householdMembers: members }),
  investments: [],
  setInvestments: investments => set({ investments }),
  incomeSources: [], // <-- Add this line
  setIncomeSources: sources => set({ incomeSources: sources }), // <-- And this line
  // Add more global state as needed
}));
