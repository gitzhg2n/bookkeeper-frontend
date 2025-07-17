import IncomeSources from './pages/IncomeSources';
// ...rest of imports...

function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <Container maxWidth="lg" sx={{ flexGrow: 1, mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/login" element={<Login />} />
          <Route path="/breakup" element={<BreakupWizard />} />
          <Route path="/household" element={<HouseholdManager />} />
          <Route path="/income-sources" element={<IncomeSources />} /> {/* Add this line */}
        </Routes>
      </Container>
    </Box>
  );
}

export default App;