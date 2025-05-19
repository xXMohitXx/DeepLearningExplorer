import { useEffect, useRef, useState } from 'react';
import { Container, Typography, Paper, Box, Button, TextField } from '@mui/material';
import * as d3 from 'd3';
import { MathJax } from 'better-react-mathjax';

const RNN = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [sequence, setSequence] = useState('1010');
  const [currentStep, setCurrentStep] = useState(0);
  const [hiddenState, setHiddenState] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Draw RNN structure
    const nodeRadius = 30;
    const timeSteps = sequence.length;
    const stepWidth = (width - 2 * margin.left) / (timeSteps - 1);

    // Draw input nodes
    sequence.split('').forEach((input, i) => {
      const x = margin.left + i * stepWidth;
      const y = margin.top + 50;

      // Input node
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', nodeRadius)
        .attr('fill', '#90caf9')
        .attr('stroke', '#000')
        .attr('stroke-width', 2);

      svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(input);

      // Hidden state node
      const hiddenY = y + 150;
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', hiddenY)
        .attr('r', nodeRadius)
        .attr('fill', i <= currentStep ? '#f48fb1' : '#e0e0e0')
        .attr('stroke', '#000')
        .attr('stroke-width', 2);

      if (i <= currentStep) {
        svg.append('text')
          .attr('x', x)
          .attr('y', hiddenY)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .text(hiddenState.toFixed(2));
      }

      // Connect input to hidden
      svg.append('line')
        .attr('x1', x)
        .attr('y1', y + nodeRadius)
        .attr('x2', x)
        .attr('y2', hiddenY - nodeRadius)
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('marker-end', 'url(#arrow)');

      // Connect hidden states
      if (i > 0) {
        svg.append('line')
          .attr('x1', x - stepWidth)
          .attr('y1', hiddenY)
          .attr('x2', x)
          .attr('y2', hiddenY)
          .attr('stroke', '#000')
          .attr('stroke-width', 1)
          .attr('marker-end', 'url(#arrow)');
      }
    });

    // Add arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000');

    // Add labels
    svg.append('text')
      .attr('x', margin.left)
      .attr('y', margin.top + 20)
      .attr('text-anchor', 'start')
      .text('Input Sequence');

    svg.append('text')
      .attr('x', margin.left)
      .attr('y', margin.top + 170)
      .attr('text-anchor', 'start')
      .text('Hidden States');

  }, [sequence, currentStep, hiddenState]);

  const processNextStep = () => {
    if (currentStep < sequence.length) {
      const input = parseInt(sequence[currentStep]);
      // Simple RNN update rule: h_t = tanh(W_h * h_{t-1} + W_x * x_t + b)
      const newHiddenState = Math.tanh(0.5 * hiddenState + 0.3 * input + 0.1);
      setHiddenState(newHiddenState);
      setCurrentStep(prev => prev + 1);
    }
  };

  const resetSequence = () => {
    setCurrentStep(0);
    setHiddenState(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Recurrent Neural Networks (RNN)
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          What is a Recurrent Neural Network?
        </Typography>
        <Typography paragraph>
          A Recurrent Neural Network (RNN) is a type of neural network designed to process sequential data.
          Unlike feedforward neural networks, RNNs have connections that form directed cycles, allowing them
          to maintain a memory of previous inputs.
        </Typography>
        <Box sx={{ mb: 2 }}>
          <MathJax>
            {`\\[h_t = \\tanh(W_{hh}h_{t-1} + W_{xh}x_t + b_h)\\]`}
          </MathJax>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Interactive RNN Visualization
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Input Sequence"
              value={sequence}
              onChange={(e) => {
                const value = e.target.value.replace(/[^01]/g, '');
                setSequence(value);
                resetSequence();
              }}
              helperText="Enter a sequence of 0s and 1s"
            />
            <Button
              variant="contained"
              onClick={resetSequence}
              disabled={currentStep === 0}
            >
              Reset
            </Button>
          </Box>
          <svg
            ref={svgRef}
            width={800}
            height={400}
            style={{ border: '1px solid #ccc' }}
          />
          <Button
            variant="contained"
            onClick={processNextStep}
            disabled={currentStep >= sequence.length}
          >
            Process Next Step
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          RNN Components
        </Typography>
        <Typography paragraph>
          • Input Layer: Processes the current input in the sequence
        </Typography>
        <Typography paragraph>
          • Hidden Layer: Maintains the network's memory through recurrent connections
        </Typography>
        <Typography paragraph>
          • Output Layer: Produces predictions based on the current hidden state
        </Typography>
        <Typography paragraph>
          The key feature of RNNs is their ability to maintain a hidden state that captures information
          about previous inputs in the sequence. This makes them particularly effective for tasks like:
        </Typography>
        <ul>
          <li>Natural Language Processing</li>
          <li>Time Series Prediction</li>
          <li>Speech Recognition</li>
          <li>Music Generation</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default RNN; 