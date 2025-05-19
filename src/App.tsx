import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NeuronBasics from './pages/NeuronBasics';
import ANN from './pages/ANN';
import CNN from './pages/CNN';
import RNN from './pages/RNN';
import LSTM from './pages/LSTM';
import Backpropagation from './pages/Backpropagation';
import MathFundamentals from './pages/MathFundamentals';
import { MathJaxContext } from 'better-react-mathjax';
import { Analytics } from '@vercel/analytics/react';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MathJaxContext>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/neuron-basics" element={<NeuronBasics />} />
            <Route path="/ann" element={<ANN />} />
            <Route path="/cnn" element={<CNN />} />
            <Route path="/rnn" element={<RNN />} />
            <Route path="/lstm" element={<LSTM />} />
            <Route path="/backpropagation" element={<Backpropagation />} />
            <Route path="/math-fundamentals" element={<MathFundamentals />} />
          </Routes>
        </Router>
      </MathJaxContext>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
