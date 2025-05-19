import { useEffect, useRef, useState } from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import * as d3 from 'd3';
import { MathJax } from 'better-react-mathjax';

const ANN = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [networkState, setNetworkState] = useState({
    inputLayer: [0.5, 0.3],
    hiddenLayer: [0, 0, 0],
    outputLayer: [0]
  });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Calculate node positions
    const inputNodes = networkState.inputLayer.map((_, i) => ({
      x: margin.left + 100,
      y: margin.top + (height - 2 * margin.top) * (i + 1) / (networkState.inputLayer.length + 1)
    }));

    const hiddenNodes = networkState.hiddenLayer.map((_, i) => ({
      x: margin.left + 350,
      y: margin.top + (height - 2 * margin.top) * (i + 1) / (networkState.hiddenLayer.length + 1)
    }));

    const outputNodes = networkState.outputLayer.map((_, i) => ({
      x: margin.left + 600,
      y: margin.top + (height - 2 * margin.top) * (i + 1) / (networkState.outputLayer.length + 1)
    }));

    // Draw connections
    inputNodes.forEach((inputNode, i) => {
      hiddenNodes.forEach((hiddenNode, j) => {
        svg.append('line')
          .attr('x1', inputNode.x)
          .attr('y1', inputNode.y)
          .attr('x2', hiddenNode.x)
          .attr('y2', hiddenNode.y)
          .attr('stroke', '#90caf9')
          .attr('stroke-width', 1);
      });
    });

    hiddenNodes.forEach((hiddenNode, i) => {
      outputNodes.forEach((outputNode, j) => {
        svg.append('line')
          .attr('x1', hiddenNode.x)
          .attr('y1', hiddenNode.y)
          .attr('x2', outputNode.x)
          .attr('y2', outputNode.y)
          .attr('stroke', '#90caf9')
          .attr('stroke-width', 1);
      });
    });

    // Draw nodes
    const drawNodes = (nodes: { x: number; y: number }[], values: number[]) => {
      nodes.forEach((node, i) => {
        svg.append('circle')
          .attr('cx', node.x)
          .attr('cy', node.y)
          .attr('r', 20)
          .attr('fill', d3.interpolateRdYlBu(values[i]));

        svg.append('text')
          .attr('x', node.x)
          .attr('y', node.y)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', 'white')
          .text(values[i].toFixed(2));
      });
    };

    drawNodes(inputNodes, networkState.inputLayer);
    drawNodes(hiddenNodes, networkState.hiddenLayer);
    drawNodes(outputNodes, networkState.outputLayer);

    // Add layer labels
    svg.append('text')
      .attr('x', margin.left + 100)
      .attr('y', margin.top - 20)
      .attr('text-anchor', 'middle')
      .text('Input Layer');

    svg.append('text')
      .attr('x', margin.left + 350)
      .attr('y', margin.top - 20)
      .attr('text-anchor', 'middle')
      .text('Hidden Layer');

    svg.append('text')
      .attr('x', margin.left + 600)
      .attr('y', margin.top - 20)
      .attr('text-anchor', 'middle')
      .text('Output Layer');

  }, [networkState]);

  const forwardPropagate = () => {
    // Simple forward propagation with sigmoid activation
    const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
    
    const hiddenLayer = networkState.hiddenLayer.map((_, i) => {
      const sum = networkState.inputLayer.reduce((acc, input, j) => {
        return acc + input * 0.5; // Simple weight of 0.5 for all connections
      }, 0);
      return sigmoid(sum);
    });

    const outputLayer = networkState.outputLayer.map((_, i) => {
      const sum = hiddenLayer.reduce((acc, hidden, j) => {
        return acc + hidden * 0.5; // Simple weight of 0.5 for all connections
      }, 0);
      return sigmoid(sum);
    });

    setNetworkState({
      ...networkState,
      hiddenLayer,
      outputLayer
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Artificial Neural Networks (ANN)
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          What is an Artificial Neural Network?
        </Typography>
        <Typography paragraph>
          An Artificial Neural Network (ANN) is a computing system inspired by the biological neural networks
          in human brains. ANNs consist of layers of interconnected nodes (neurons) that process information
          and learn from examples.
        </Typography>
        <Box sx={{ mb: 2 }}>
          <MathJax>
            {`\\[\\text{Forward Propagation: } a^{(l)} = f(W^{(l)}a^{(l-1)} + b^{(l)})\\]`}
          </MathJax>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Interactive Neural Network Visualization
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <svg
            ref={svgRef}
            width={800}
            height={500}
            style={{ border: '1px solid #ccc' }}
          />
          <Button
            variant="contained"
            onClick={forwardPropagate}
            sx={{ mt: 2 }}
          >
            Forward Propagate
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Network Architecture
        </Typography>
        <Typography paragraph>
          This visualization shows a simple neural network with:
        </Typography>
        <ul>
          <li>Input Layer: 2 neurons</li>
          <li>Hidden Layer: 3 neurons</li>
          <li>Output Layer: 1 neuron</li>
        </ul>
        <Typography paragraph>
          The colors of the neurons represent their activation values, ranging from blue (0) to red (1).
          Click the "Forward Propagate" button to see how information flows through the network.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ANN; 