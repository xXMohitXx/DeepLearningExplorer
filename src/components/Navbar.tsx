import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Neuron Basics', path: '/neuron-basics' },
    { name: 'ANN', path: '/ann' },
    { name: 'CNN', path: '/cnn' },
    { name: 'RNN', path: '/rnn' },
    { name: 'LSTM', path: '/lstm' },
    { name: 'Backpropagation', path: '/backpropagation' },
    { name: 'Math Fundamentals', path: '/math-fundamentals' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Deep Learning Explorer
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.name}
              color="inherit"
              component={RouterLink}
              to={item.path}
            >
              {item.name}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 