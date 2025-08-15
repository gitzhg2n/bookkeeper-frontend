import React from "react";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const navigate = useNavigate();

  function handleContinue() {
    navigate("/dashboard");
  }

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: '1rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.7rem', marginBottom: '1rem' }}>Welcome to Bookkeeper!</h2>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Let's get you started. You can set up your first account, budget, or alert now, or skip to the dashboard.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <button onClick={() => navigate("/accounts")}>Set Up Account</button>
        <button onClick={() => navigate("/budgets")}>Set Up Budget</button>
        <button onClick={() => navigate("/alerts")}>Set Up Alert</button>
        <button onClick={handleContinue}>Skip to Dashboard</button>
      </div>
    </div>
  );
}
