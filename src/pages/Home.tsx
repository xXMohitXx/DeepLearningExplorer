import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  const sections = [
    {
      title: 'Neuron Basics',
      description: 'Learn about the fundamental building blocks of neural networks - neurons, their structure, and how they process information.',
      path: '/neuron-basics'
    },
    {
      title: 'Artificial Neural Networks (ANN)',
      description: 'Explore the architecture and functioning of basic neural networks, including layers, weights, and activation functions.',
      path: '/ann'
    },
    {
      title: 'Convolutional Neural Networks (CNN)',
      description: 'Discover how CNNs process visual data through convolutional layers, pooling, and feature extraction.',
      path: '/cnn'
    },
    {
      title: 'Recurrent Neural Networks (RNN)',
      description: 'Understand how RNNs handle sequential data and maintain memory of previous inputs.',
      path: '/rnn'
    },
    {
      title: 'Long Short-Term Memory (LSTM)',
      description: 'Learn about LSTM networks and their ability to learn long-term dependencies in sequential data.',
      path: '/lstm'
    },
    {
      title: 'Backpropagation',
      description: 'Master the algorithm that enables neural networks to learn from their mistakes and improve over time.',
      path: '/backpropagation'
    },
    {
      title: 'Math Fundamentals',
      description: 'Dive into the mathematical concepts that power deep learning, including calculus, linear algebra, and probability.',
      path: '/math-fundamentals'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Deep Learning Explorer
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
        Interactive Learning Platform for Deep Learning Concepts
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {sections.map((section) => (
          <Grid item xs={12} md={6} key={section.title}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {section.title}
                </Typography>
                <Typography>
                  {section.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={RouterLink}
                  to={section.path}
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 