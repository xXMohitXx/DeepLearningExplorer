import { useEffect, useRef, useState } from 'react';
import { Container, Typography, Paper, Box, Button, TextField, Grid } from '@mui/material';
import * as d3 from 'd3';
import { MathJax } from 'better-react-mathjax';

const LSTM = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [sequence, setSequence] = useState('1010');
  const [currentStep, setCurrentStep] = useState(0);
  const [cellState, setCellState] = useState(0);
  const [hiddenState, setHiddenState] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Draw LSTM structure
    const nodeRadius = 30;
    const timeSteps = sequence.length;
    const stepWidth = (width - 2 * margin.left) / (timeSteps - 1);

    // Draw LSTM cells
    sequence.split('').forEach((input, i) => {
      const x = margin.left + i * stepWidth;
      const y = margin.top + 100;

      // Input node
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y - 100)
        .attr('r', nodeRadius)
        .attr('fill', '#90caf9')
        .attr('stroke', '#000')
        .attr('stroke-width', 2);

      svg.append('text')
        .attr('x', x)
        .attr('y', y - 100)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(input);

      // LSTM cell
      const cellWidth = 120;
      const cellHeight = 160;
      const cellX = x - cellWidth / 2;
      const cellY = y - cellHeight / 2;

      // Cell outline
      svg.append('rect')
        .attr('x', cellX)
        .attr('y', cellY)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', i <= currentStep ? '#f48fb1' : '#e0e0e0')
        .attr('stroke', '#000')
        .attr('stroke-width', 2)
        .attr('rx', 10);

      // Gates
      const gateRadius = 15;
      const gates = [
        { name: 'f', x: cellX + 30, y: cellY + 40 },
        { name: 'i', x: cellX + 90, y: cellY + 40 },
        { name: 'g', x: cellX + 30, y: cellY + 100 },
        { name: 'o', x: cellX + 90, y: cellY + 100 }
      ];

      gates.forEach(gate => {
        svg.append('circle')
          .attr('cx', gate.x)
          .attr('cy', gate.y)
          .attr('r', gateRadius)
          .attr('fill', i <= currentStep ? '#90caf9' : '#e0e0e0')
          .attr('stroke', '#000')
          .attr('stroke-width', 1);

        svg.append('text')
          .attr('x', gate.x)
          .attr('y', gate.y)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .text(gate.name);
      });

      // Connect cells
      if (i > 0) {
        svg.append('line')
          .attr('x1', x - stepWidth)
          .attr('y1', y)
          .attr('x2', x)
          .attr('y2', y)
          .attr('stroke', '#000')
          .attr('stroke-width', 1)
          .attr('marker-end', 'url(#arrow)');
      }

      // Connect input to cell
      svg.append('line')
        .attr('x1', x)
        .attr('y1', y - 100 + nodeRadius)
        .attr('x2', x)
        .attr('y2', cellY)
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('marker-end', 'url(#arrow)');

      // Show cell state and hidden state if processed
      if (i <= currentStep) {
        svg.append('text')
          .attr('x', x)
          .attr('y', cellY + cellHeight + 20)
          .attr('text-anchor', 'middle')
          .text(`c: ${cellState.toFixed(2)}`);

        svg.append('text')
          .attr('x', x)
          .attr('y', cellY + cellHeight + 40)
          .attr('text-anchor', 'middle')
          .text(`h: ${hiddenState.toFixed(2)}`);
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
      .attr('y', margin.top)
      .attr('text-anchor', 'start')
      .text('Input Sequence');

    svg.append('text')
      .attr('x', margin.left)
      .attr('y', margin.top + 200)
      .attr('text-anchor', 'start')
      .text('LSTM Cells');

  }, [sequence, currentStep, cellState, hiddenState]);

  const processNextStep = () => {
    if (currentStep < sequence.length) {
      const input = parseInt(sequence[currentStep]);
      
      // Simple LSTM update rules
      const f = 0.5; // forget gate
      const i = 0.3; // input gate
      const g = 0.2; // candidate
      const o = 0.4; // output gate
      
      const newCellState = f * cellState + i * g * input;
      const newHiddenState = o * Math.tanh(newCellState);
      
      setCellState(newCellState);
      setHiddenState(newHiddenState);
      setCurrentStep(prev => prev + 1);
    }
  };

  const resetSequence = () => {
    setCurrentStep(0);
    setCellState(0);
    setHiddenState(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Long Short-Term Memory (LSTM)
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          What is LSTM?
        </Typography>
        <Typography paragraph>
          Long Short-Term Memory (LSTM) is a type of recurrent neural network architecture designed to
          overcome the vanishing gradient problem in traditional RNNs. It uses a system of gates to
          control the flow of information.
        </Typography>
        <Box sx={{ mb: 2 }}>
          <MathJax>
            {`\\[\\begin{align*}
            f_t &= \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f) \\\\
            i_t &= \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i) \\\\
            \\tilde{C}_t &= \\tanh(W_C \\cdot [h_{t-1}, x_t] + b_C) \\\\
            C_t &= f_t * C_{t-1} + i_t * \\tilde{C}_t \\\\
            o_t &= \\sigma(W_o \\cdot [h_{t-1}, x_t] + b_o) \\\\
            h_t &= o_t * \\tanh(C_t)
            \\end{align*}\\]`}
          </MathJax>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Interactive LSTM Visualization
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
            height={600}
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
          LSTM Components
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Gates
            </Typography>
            <ul>
              <li>Forget Gate (f): Decides what information to discard</li>
              <li>Input Gate (i): Decides what new information to store</li>
              <li>Output Gate (o): Decides what information to output</li>
            </ul>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              States
            </Typography>
            <ul>
              <li>Cell State (C): Long-term memory</li>
              <li>Hidden State (h): Short-term memory</li>
            </ul>
          </Grid>
        </Grid>
        <Typography paragraph sx={{ mt: 2 }}>
          LSTM networks are particularly effective for:
        </Typography>
        <ul>
          <li>Long-term dependency learning</li>
          <li>Sequence prediction</li>
          <li>Natural language processing</li>
          <li>Time series analysis</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default LSTM; 