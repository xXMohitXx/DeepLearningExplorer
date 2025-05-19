import { useEffect, useRef, useState } from 'react';
import { Container, Typography, Paper, Box, Grid, Tabs, Tab } from '@mui/material';
import * as d3 from 'd3';
import { MathJax } from 'better-react-mathjax';

const MathFundamentals = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 400;
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

    // Plot different functions based on selected tab
    switch (currentTab) {
      case 0: // Linear Algebra
        // Plot vectors
        const vectors = [
          { x: 0, y: 0, dx: 1, dy: 0.5, color: '#90caf9' },
          { x: 0, y: 0, dx: 0.5, dy: 1, color: '#f48fb1' }
        ];

        vectors.forEach(vector => {
          svg.append('line')
            .attr('x1', x(vector.x))
            .attr('y1', y(vector.y))
            .attr('x2', x(vector.x + vector.dx))
            .attr('y2', y(vector.y + vector.dy))
            .attr('stroke', vector.color)
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrow)');
        });
        break;

      case 1: // Calculus
        // Plot function and its derivative
        const line = d3.line<number>()
          .x(d => x(d))
          .y(d => y(Math.sin(d)));

        const derivativeLine = d3.line<number>()
          .x(d => x(d))
          .y(d => y(Math.cos(d)));

        const data = d3.range(-2, 2, 0.1);
        svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', '#90caf9')
          .attr('stroke-width', 2)
          .attr('d', line);

        svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', '#f48fb1')
          .attr('stroke-width', 2)
          .attr('d', derivativeLine);
        break;

      case 2: // Probability
        // Plot normal distribution
        const normal = d3.line<number>()
          .x(d => x(d))
          .y(d => y(Math.exp(-d * d / 2) / Math.sqrt(2 * Math.PI)));

        const probData = d3.range(-2, 2, 0.1);
        svg.append('path')
          .datum(probData)
          .attr('fill', 'none')
          .attr('stroke', '#90caf9')
          .attr('stroke-width', 2)
          .attr('d', normal);
        break;
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

  }, [currentTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mathematical Fundamentals
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Essential Mathematics for Deep Learning
        </Typography>
        <Typography paragraph>
          Deep learning relies heavily on several mathematical concepts. Understanding these fundamentals
          is crucial for developing and implementing neural networks effectively.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Tabs value={currentTab} onChange={handleTabChange} centered>
          <Tab label="Linear Algebra" />
          <Tab label="Calculus" />
          <Tab label="Probability" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {currentTab === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Linear Algebra
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography paragraph>
                    Linear algebra is fundamental to deep learning, providing the mathematical framework
                    for representing and manipulating data.
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <MathJax>
                      {`\\[\\begin{align*}
                      \\text{Matrix Multiplication: } & C = AB \\\\
                      \\text{where } & C_{ij} = \\sum_k A_{ik}B_{kj}
                      \\end{align*}\\]`}
                    </MathJax>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <svg
                    ref={svgRef}
                    width={400}
                    height={400}
                    style={{ border: '1px solid #ccc' }}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {currentTab === 1 && (
            <>
              <Typography variant="h6" gutterBottom>
                Calculus
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography paragraph>
                    Calculus, particularly derivatives and the chain rule, is essential for understanding
                    how neural networks learn through backpropagation.
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <MathJax>
                      {`\\[\\begin{align*}
                      \\text{Chain Rule: } & \\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx} \\\\
                      \\text{Gradient: } & \\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}\\right)
                      \\end{align*}\\]`}
                    </MathJax>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <svg
                    ref={svgRef}
                    width={400}
                    height={400}
                    style={{ border: '1px solid #ccc' }}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {currentTab === 2 && (
            <>
              <Typography variant="h6" gutterBottom>
                Probability and Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography paragraph>
                    Probability theory and statistics are crucial for understanding uncertainty in data
                    and making predictions.
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <MathJax>
                      {`\\[\\begin{align*}
                      \\text{Normal Distribution: } & f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}} \\\\
                      \\text{Expected Value: } & E[X] = \\sum_x x P(x)
                      \\end{align*}\\]`}
                    </MathJax>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <svg
                    ref={svgRef}
                    width={400}
                    height={400}
                    style={{ border: '1px solid #ccc' }}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Key Concepts in Deep Learning Mathematics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Linear Algebra
            </Typography>
            <ul>
              <li>Vectors and Matrices</li>
              <li>Eigenvalues and Eigenvectors</li>
              <li>Matrix Decomposition</li>
              <li>Dot Products and Projections</li>
            </ul>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Calculus
            </Typography>
            <ul>
              <li>Derivatives and Gradients</li>
              <li>Chain Rule</li>
              <li>Partial Derivatives</li>
              <li>Optimization</li>
            </ul>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Probability
            </Typography>
            <ul>
              <li>Probability Distributions</li>
              <li>Bayes' Theorem</li>
              <li>Maximum Likelihood</li>
              <li>Information Theory</li>
            </ul>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MathFundamentals; 