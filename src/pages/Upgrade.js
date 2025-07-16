import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import UpgradeIcon from '@mui/icons-material/Upgrade';

function Upgrade() {
  return (
    <Box maxWidth={500} mx="auto" my={5} p={4} borderRadius={2} boxShadow={2} bgcolor="#f9f9f9">
      <Typography variant="h5" mb={2}>Upgrade Your Plan</Typography>
      <Typography mb={2}>
        Unlock advanced features such as household management, detailed analytics, and more!
      </Typography>
      <List>
        {['Household Manager', 'Breakup Wizard', 'Advanced Dashboard Charts', 'Priority Support'].map((feature, i) => (
          <ListItem key={i}>
            <ListItemIcon><UpgradeIcon /></ListItemIcon>
            <ListItemText primary={feature} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="success" sx={{ mt: 2 }} fullWidth>
        Upgrade Now
      </Button>
    </Box>
  );
}

export default Upgrade;