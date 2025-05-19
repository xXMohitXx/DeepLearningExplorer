import { useEffect, useRef, useState } from 'react';
import { Container, Typography, Paper, Box, Grid, Button, Slider } from '@mui/material';
import * as d3 from 'd3';
import { MathJax } from 'better-react-mathjax';

const CNN = () => {
  const convolutionSvgRef = useRef<SVGSVGElement>(null);
  const poolingSvgRef = useRef<SVGSVGElement>(null);
  const [currentConvolutionStep, setCurrentConvolutionStep] = useState(0);
  const [convolutionInputImage] = useState([
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0],
    [0, 1, 0, 1]
  ]);
  const [convolutionKernel] = useState([
    [1, -1],
    [-1, 1]
  ]);
  const [convolutionPadding, setConvolutionPadding] = useState(0);
  const [convolutionStride, setConvolutionStride] = useState(1);

  // Pooling state and data
  const [poolingInput, setPoolingInput] = useState([
    [1, 3, 2, 4],
    [5, 6, 7, 8],
    [9, 11, 10, 12],
    [13, 15, 14, 16]
  ]);
  const [poolingWindowSize] = useState(2);
  const [poolingStride] = useState(2);

  useEffect(() => {
    if (!convolutionSvgRef.current) return;

    const svg = d3.select(convolutionSvgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const cellSize = 40;
    const startX = margin.left;
    const startY = margin.top;

    // Create padded input image
    const paddedInput = Array(convolutionInputImage.length + 2 * convolutionPadding).fill(0).map(() =>
      Array(convolutionInputImage[0].length + 2 * convolutionPadding).fill(0)
    );

    for (let i = 0; i < convolutionInputImage.length; i++) {
      for (let j = 0; j < convolutionInputImage[0].length; j++) {
        paddedInput[i + convolutionPadding][j + convolutionPadding] = convolutionInputImage[i][j];
      }
    }

    // Draw padded input image
    paddedInput.forEach((row, i) => {
      row.forEach((cell, j) => {
        svg.append('rect')
          .attr('x', startX + j * cellSize)
          .attr('y', startY + i * cellSize)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', cell === 0 ? '#e0e0e0' : (cell === 1 ? '#90caf9' : '#f48fb1'))
          .attr('stroke', '#000')
          .attr('stroke-width', 1);

        svg.append('text')
          .attr('x', startX + j * cellSize + cellSize / 2)
          .attr('y', startY + i * cellSize + cellSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .text(cell === 0 ? '' : cell);
      });
    });

    // Draw kernel
    const kernelStartX = startX + paddedInput[0].length * cellSize + 100;
    const kernelStartY = startY;

    convolutionKernel.forEach((row, i) => {
      row.forEach((cell, j) => {
        svg.append('rect')
          .attr('x', kernelStartX + j * cellSize)
          .attr('y', kernelStartY + i * cellSize)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', cell === 1 ? '#90caf9' : '#f48fb1')
          .attr('stroke', '#000')
          .attr('stroke-width', 1);

        svg.append('text')
          .attr('x', kernelStartX + j * cellSize + cellSize / 2)
          .attr('y', kernelStartY + i * cellSize + cellSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .text(cell);
      });
    });

    // Draw feature map if step > 0
    if (currentConvolutionStep > 0) {
      const featureMap = [];
      const outputRows = Math.floor((paddedInput.length - convolutionKernel.length) / convolutionStride) + 1;
      const outputCols = Math.floor((paddedInput[0].length - convolutionKernel[0].length) / convolutionStride) + 1;

      for (let i = 0; i < outputRows; i++) {
        featureMap[i] = [];
        for (let j = 0; j < outputCols; j++) {
          let sum = 0;
          for (let ki = 0; ki < convolutionKernel.length; ki++) {
            for (let kj = 0; kj < convolutionKernel[0].length; kj++) {
              sum += paddedInput[i * convolutionStride + ki][j * convolutionStride + kj] * convolutionKernel[ki][kj];
            }
          }
          featureMap[i][j] = sum;
        }
      }

      const featureMapStartX = startX;
      const featureMapStartY = startY + (paddedInput.length) * cellSize + 50;

      featureMap.forEach((row, i) => {
        row.forEach((cell, j) => {
          svg.append('rect')
            .attr('x', featureMapStartX + j * cellSize)
            .attr('y', featureMapStartY + i * cellSize)
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('fill', cell > 0 ? '#90caf9' : '#f48fb1')
            .attr('stroke', '#000')
            .attr('stroke-width', 1);

          svg.append('text')
            .attr('x', featureMapStartX + j * cellSize + cellSize / 2)
            .attr('y', featureMapStartY + i * cellSize + cellSize / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(cell);
        });
      });

      // Add labels
      svg.append('text')
        .attr('x', featureMapStartX + (outputCols * cellSize) / 2)
        .attr('y', featureMapStartY - 10)
        .attr('text-anchor', 'middle')
        .text('Feature Map');
    }

    // Add labels
    svg.append('text')
      .attr('x', startX + (paddedInput[0].length * cellSize) / 2)
      .attr('y', startY - 10)
      .attr('text-anchor', 'middle')
      .text('Input Image (with Padding)');

    svg.append('text')
      .attr('x', kernelStartX + (convolutionKernel[0].length * cellSize) / 2)
      .attr('y', kernelStartY - 10)
      .attr('text-anchor', 'middle')
      .text('Convolution Kernel');

  }, [currentConvolutionStep, convolutionInputImage, convolutionKernel, convolutionPadding, convolutionStride]);

  // Pooling Visualization Effect
  useEffect(() => {
    if (!poolingSvgRef.current) return;

    const svg = d3.select(poolingSvgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const cellSize = 50;
    const startX = margin.left;
    const startY = margin.top;

    // Draw input grid
    poolingInput.forEach((row, i) => {
      row.forEach((cell, j) => {
        svg.append('rect')
          .attr('x', startX + j * cellSize)
          .attr('y', startY + i * cellSize)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', '#f48fb1')
          .attr('stroke', '#000')
          .attr('stroke-width', 1);

        svg.append('text')
          .attr('x', startX + j * cellSize + cellSize / 2)
          .attr('y', startY + i * cellSize + cellSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .text(cell);
      });
    });

    // Calculate and draw output grid (Max Pooling with stride)
    const outputData = [];
    const outputRows = Math.floor((poolingInput.length - poolingWindowSize) / poolingStride) + 1;
    const outputCols = Math.floor((poolingInput[0].length - poolingWindowSize) / poolingStride) + 1;

    for (let i = 0; i < outputRows; i++) {
      outputData[i] = [];
      for (let j = 0; j < outputCols; j++) {
        let maxValue = -Infinity;
        for (let wi = 0; wi < poolingWindowSize; wi++) {
          for (let wj = 0; wj < poolingWindowSize; wj++) {
            maxValue = Math.max(maxValue, poolingInput[i * poolingStride + wi][j * poolingStride + wj]);
          }
        }
        outputData[i][j] = maxValue;
      }
    }

    const outputStartX = startX + poolingInput[0].length * cellSize + 100;
    const outputStartY = startY;

    outputData.forEach((row, i) => {
      row.forEach((cell, j) => {
        svg.append('rect')
          .attr('x', outputStartX + j * cellSize)
          .attr('y', outputStartY + i * cellSize)
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', '#90caf9')
          .attr('stroke', '#000')
          .attr('stroke-width', 1);

        svg.append('text')
          .attr('x', outputStartX + j * cellSize + cellSize / 2)
          .attr('y', outputStartY + i * cellSize + cellSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .text(cell);
      });
    });

    // Add labels
    svg.append('text')
      .attr('x', startX + (poolingInput[0].length * cellSize) / 2)
      .attr('y', startY - 10)
      .attr('text-anchor', 'middle')
      .text('Input Feature Map');

    svg.append('text')
      .attr('x', outputStartX + (outputData[0].length * cellSize) / 2)
      .attr('y', outputStartY - 10)
      .attr('text-anchor', 'middle')
      .text('Output (Max Pooling)');

  }, [poolingInput, poolingWindowSize, poolingStride]);


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Convolutional Neural Networks (CNN)
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          What is a Convolutional Neural Network?
        </Typography>
        <Typography paragraph>
          A Convolutional Neural Network (CNN) is a specialized type of neural network designed for processing
          grid-like data such as images. CNNs use convolutional layers to automatically and adaptively learn
          spatial hierarchies of features, from low-level edges and textures to higher-level object parts and shapes.
        </Typography>
        <Box sx={{ mb: 2 }}>
          <MathJax>
            {`\\[(I * K)(i, j) = \\sum_m \\sum_n I(i-m, j-n)K(m, n)\\]`}
          </MathJax>
          <Typography variant="caption" display="block" align="center">
            The convolution operation where I is the input, K is the kernel, and (i, j) are the output coordinates.
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Interactive Convolution Visualization (with Padding and Stride)
        </Typography>
        <Typography paragraph>
          This visualization demonstrates the convolution operation and the effect of padding and stride.
          Padding adds extra pixels (typically zeros) around the border of the input image. Stride determines the
          step size the kernel takes as it slides across the input.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <svg
            ref={convolutionSvgRef}
            width={800}
            height={600}
            style={{ border: '1px solid #ccc' }}
          />
          <Box sx={{ width: '100%', maxWidth: 400, mt: 2 }}>
            <Typography gutterBottom>Padding Size</Typography>
            <Slider
              value={convolutionPadding}
              onChange={(_, value) => setConvolutionPadding(value as number)}
              min={0}
              max={2}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
            <Typography gutterBottom sx={{ mt: 2 }}>Stride Size</Typography>
             <Slider
              value={convolutionStride}
              onChange={(_, value) => setConvolutionStride(value as number)}
              min={1}
              max={2}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => setCurrentConvolutionStep(prev => prev + 1)}
            disabled={currentConvolutionStep >= 1}
          >
            Apply Convolution
          </Button>
           <Typography variant="body2" sx={{ mt: 1 }}>
            Original Input Size: {convolutionInputImage.length}x{convolutionInputImage[0].length}, Padding: {convolutionPadding}, Stride: {convolutionStride},
            Padded Input Size: {convolutionInputImage.length + 2 * convolutionPadding}x{convolutionInputImage[0].length + 2 * convolutionPadding},
             Kernel Size: {convolutionKernel.length}x{convolutionKernel[0].length},
             Output Size: {Math.floor((convolutionInputImage.length + 2 * convolutionPadding - convolutionKernel.length) / convolutionStride) + 1}x{Math.floor((convolutionInputImage[0].length + 2 * convolutionPadding - convolutionKernel[0].length) / convolutionStride) + 1}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
         <Typography variant="h6" gutterBottom>
          Interactive Pooling Visualization (Max Pooling)
        </Typography>
         <Typography paragraph>
          This visualization demonstrates the Max Pooling operation. A pooling window slides over the input feature map,
          and the maximum value within each window is selected to create the output. This reduces the spatial dimensions
          of the feature map.
        </Typography>
         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <svg
            ref={poolingSvgRef}
            width={600}
            height={400}
            style={{ border: '1px solid #ccc' }}
          />
           <Typography variant="body2" sx={{ mt: 1 }}>
            Input Size: {poolingInput.length}x{poolingInput[0].length}, Pooling Window: {poolingWindowSize}x{poolingWindowSize}, Stride: {poolingStride},
             Output Size: {Math.floor((poolingInput.length - poolingWindowSize) / poolingStride) + 1}x{Math.floor((poolingInput[0].length - poolingWindowSize) / poolingStride) + 1}
          </Typography>
        </Box>
      </Paper>


      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          CNN Layer Types
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Convolutional Layer
            </Typography>
            <Typography paragraph>
              Convolutional layers are the core building blocks of CNNs. They apply convolution operations
              to the input using learnable filters (kernels) to create feature maps. Key concepts include:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2" component="span" fontWeight="bold">Filters/Kernels:</Typography>
                Small matrices that slide over the input to detect specific features.
              </li>
              <li>
                <Typography variant="body2" component="span" fontWeight="bold">Stride:</Typography>
                The number of pixels the kernel shifts at each step across the input. A larger stride reduces the output size.
              </li>
              <li>
                <Typography variant="body2" component="span" fontWeight="bold">Padding:</Typography>
                Adding extra pixels (typically zeros) around the input boundary to control the output size and prevent loss of information at the edges.
              </li>
              <li>
                <Typography variant="body2" component="span" fontWeight="bold">Activation Functions:</Typography>
                Applied to the output of the convolution to introduce non-linearity, such as ReLU (Rectified Linear Unit).
              </li>
            </ul>
             <Box sx={{ mt: 2, mb: 2 }}>
                <MathJax>
                  {`\\[O = \\sigma(I * K + b)\\]`}
                </MathJax>
                 <Typography variant="caption" display="block" align="center">
                    Output of a convolutional layer with activation function \(\sigma\) and bias \(b\).
                  </Typography>
              </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Pooling Layer
            </Typography>
            <Typography paragraph>
              Pooling layers reduce the spatial dimensions (width and height) of the feature maps.
              This reduces the number of parameters and computation in the network, and helps in making the
              detected features invariant to small translations in the input. Common types include:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2" component="span" fontWeight="bold">Max Pooling:</Typography>
                Selects the maximum value from each window in the feature map.
              </li>
              <li>
                <Typography variant="body2" component="span" fontWeight="bold">Average Pooling:</Typography>
                Calculates the average value from each window.
              </li>
              <li>
                <Typography variant="body2" component="span" fontWeight="bold">Pool Size:</Typography>
                The dimensions of the window that slides over the input.
              </li>
              <li>
                <Typography variant="body2" component="span" fontWeight="bold">Stride:</Typography>
                Similar to convolutional layers, the stride determines the step size of the pooling window.
              </li>
            </ul>
          </Grid>
           <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Fully Connected Layer
            </Typography>
            <Typography paragraph>
              After several convolutional and pooling layers, the high-level features learned by the network are
              flattened into a single vector and passed to one or more fully connected (Dense) layers. These layers
              perform classification or regression based on the extracted features.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CNN; 