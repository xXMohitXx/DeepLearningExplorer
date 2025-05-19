import { useEffect, useRef, useState } from 'react';
import { Container, Typography, Paper, Box, Button, Slider } from '@mui/material';
import * as d3 from 'd3';
import { MathJax } from 'better-react-mathjax';

const Backpropagation = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [learningRate, setLearningRate] = useState(0.1);
  const [currentStep, setCurrentStep] = useState(0);
  const [weights, setWeights] = useState([0.5, 0.3]);
  const [error, setError] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

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

    // Plot loss function (simple quadratic)
    const line = d3.line<number>()
      .x(d => x(d))
      .y(d => y(d * d));

    const data = d3.range(-2, 2, 0.1);
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#90caf9')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Plot current weights and error
    const currentError = weights[0] * weights[0] + weights[1] * weights[1];
    setError(currentError);

    weights.forEach((weight, i) => {
      svg.append('circle')
        .attr('cx', x(weight))
        .attr('cy', y(weight * weight))
        .attr('r', 6)
        .attr('fill', '#f48fb1');

      svg.append('text')
        .attr('x', x(weight))
        .attr('y', y(weight * weight) - 10)
        .attr('text-anchor', 'middle')
        .text(`w${i + 1}: ${weight.toFixed(2)}`);
    });

    // Add gradient arrows if step > 0
    if (currentStep > 0) {
      weights.forEach((weight, i) => {
        const gradient = 2 * weight; // derivative of x^2
        const arrowLength = 50;
        const angle = Math.atan2(-gradient, 1);
        
        svg.append('line')
          .attr('x1', x(weight))
          .attr('y1', y(weight * weight))
          .attr('x2', x(weight) + arrowLength * Math.cos(angle))
          .attr('y2', y(weight * weight) + arrowLength * Math.sin(angle))
          .attr('stroke', '#000')
          .attr('stroke-width', 1)
          .attr('marker-end', 'url(#arrow)');
      });
    }

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
      .attr('x', width / 2)
      .attr('y', margin.top - 20)
      .attr('text-anchor', 'middle')
      .text('Loss Function: L(w) = w₁² + w₂²');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom + 30)
      .attr('text-anchor', 'middle')
      .text('Weight Value');

    svg.append('text')
      .attr('transform', `translate(${margin.left - 40},${height / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text('Loss');

  }, [currentStep, weights, learningRate]);

  const performBackpropagation = () => {
    // Simple gradient descent update
    const newWeights = weights.map(weight => {
      const gradient = 2 * weight; // derivative of x^2
      return weight - learningRate * gradient;
    });
    setWeights(newWeights);
    setCurrentStep(prev => prev + 1);
  };

  const resetWeights = () => {
    setWeights([0.5, 0.3]);
    setCurrentStep(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Backpropagation
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          What is Backpropagation?
        </Typography>
        <Typography paragraph>
          Backpropagation is an algorithm used to train neural networks by computing gradients of the loss
          function with respect to the network's weights. It uses the chain rule to efficiently calculate
          these gradients.
        </Typography>
        <Box sx={{ mb: 2 }}>
          <MathJax>
            {`\\[\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial y} \\cdot \\frac{\\partial y}{\\partial w}\\]`}
          </MathJax>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Interactive Backpropagation Visualization
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
            <Typography gutterBottom>Learning Rate</Typography>
            <Slider
              value={learningRate}
              onChange={(_, value) => setLearningRate(value as number)}
              min={0.01}
              max={0.5}
              step={0.01}
            />
          </Box>
          <svg
            ref={svgRef}
            width={800}
            height={600}
            style={{ border: '1px solid #ccc' }}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={performBackpropagation}
            >
              Perform Backpropagation
            </Button>
            <Button
              variant="outlined"
              onClick={resetWeights}
            >
              Reset Weights
            </Button>
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Current Error: {error.toFixed(4)}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Backpropagation Steps
        </Typography>
        <ol>
          <li>
            <Typography variant="subtitle1" gutterBottom>
              Forward Pass
            </Typography>
            <Typography paragraph>
              Compute the network's output for a given input by propagating the input through the network.
            </Typography>
          </li>
          <li>
            <Typography variant="subtitle1" gutterBottom>
              Compute Loss
            </Typography>
            <Typography paragraph>
              Calculate the difference between the predicted output and the actual target.
            </Typography>
          </li>
          <li>
            <Typography variant="subtitle1" gutterBottom>
              Backward Pass
            </Typography>
            <Typography paragraph>
              Compute gradients of the loss with respect to each weight using the chain rule.
            </Typography>
          </li>
          <li>
            <Typography variant="subtitle1" gutterBottom>
              Weight Update
            </Typography>
            <Typography paragraph>
              Update the weights in the opposite direction of their gradients, scaled by the learning rate.
            </Typography>
          </li>
        </ol>
      </Paper>
    </Container>
  );
};

export default Backpropagation; 