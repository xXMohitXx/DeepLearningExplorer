import { useEffect, useRef, useState } from 'react';
import { Container, Typography, Paper, Box, Slider } from '@mui/material';
import * as d3 from 'd3';
import { MathJax } from 'better-react-mathjax';

const NeuronBasics = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [inputValue, setInputValue] = useState(0.5);
  const [weight, setWeight] = useState(1.0);
  const [bias, setBias] = useState(0.0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Create scales
    const x = d3.scaleLinear()
      .domain([-2, 2])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([-2, 2])
      .range([height - margin.bottom, margin.top]);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${y(0)})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${x(0)},0)`)
      .call(d3.axisLeft(y));

    // Plot activation function
    const line = d3.line<number>()
      .x(d => x(d))
      .y(d => y(1 / (1 + Math.exp(-d))));

    const data = d3.range(-10, 10, 0.1);
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#90caf9')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Plot current point
    const output = 1 / (1 + Math.exp(-(inputValue * weight + bias)));
    svg.append('circle')
      .attr('cx', x(inputValue))
      .attr('cy', y(output))
      .attr('r', 6)
      .attr('fill', '#f48fb1');

  }, [inputValue, weight, bias]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Neuron Basics
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          What is a Neuron?
        </Typography>
        <Typography paragraph>
          A neuron is the fundamental building block of neural networks. It receives inputs, processes them,
          and produces an output. The basic mathematical model of a neuron is:
        </Typography>
        <Box sx={{ mb: 2 }}>
          <MathJax>
            {`\\[y = f(\\sum_{i=1}^{n} w_i x_i + b)\\]`}
          </MathJax>
        </Box>
        <Typography paragraph>
          Where:
          • x_i are the inputs
          • w_i are the weights
          • b is the bias
          • f is the activation function (commonly sigmoid)
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Interactive Neuron Visualization
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <svg
            ref={svgRef}
            width={600}
            height={400}
            style={{ border: '1px solid #ccc' }}
          />
          <Box sx={{ width: '100%', maxWidth: 600 }}>
            <Typography gutterBottom>Input Value</Typography>
            <Slider
              value={inputValue}
              onChange={(_, value) => setInputValue(value as number)}
              min={-2}
              max={2}
              step={0.1}
            />
            <Typography gutterBottom>Weight</Typography>
            <Slider
              value={weight}
              onChange={(_, value) => setWeight(value as number)}
              min={-2}
              max={2}
              step={0.1}
            />
            <Typography gutterBottom>Bias</Typography>
            <Slider
              value={bias}
              onChange={(_, value) => setBias(value as number)}
              min={-2}
              max={2}
              step={0.1}
            />
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Activation Functions
        </Typography>
        <Typography paragraph>
          The activation function determines the output of a neuron. Common activation functions include:
        </Typography>
        <Box sx={{ mb: 2 }}>
          <MathJax>
            {`\\[\\text{Sigmoid: } f(x) = \\frac{1}{1 + e^{-x}}\\]`}
          </MathJax>
        </Box>
        <Box sx={{ mb: 2 }}>
          <MathJax>
            {`\\[\\text{ReLU: } f(x) = \\max(0, x)\\]`}
          </MathJax>
        </Box>
        <Box sx={{ mb: 2 }}>
          <MathJax>
            {`\\[\\text{tanh: } f(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}\\]`}
          </MathJax>
        </Box>
      </Paper>
    </Container>
  );
};

export default NeuronBasics; 