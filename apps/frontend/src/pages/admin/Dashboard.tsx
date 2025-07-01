import React from 'react';
import { Card, Grid, Typography, Box, Container } from '@mui/material';
import { Flight, Hotel, DirectionsBus, Explore } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

interface DashboardStats {
  products: {
    total: number;
    byType: {
      flight: number;
      hotel: number;
      transport: number;
      excursion: number;
    };
  };
}

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  link: string;
}

const Dashboard: React.FC = () => {
  // Fetch statistics from the backend
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const token = localStorage.getItem('travelToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch('http://localhost:3000/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch stats: ${error}`);
      }
      return response.json();
    }
  });

  const statCards: StatCard[] = [
    { 
      title: 'Flights', 
      value: stats?.products.byType.flight || 0, 
      icon: <Flight />, 
      link: '/admin/products?type=flight' 
    },
    { 
      title: 'Hotels', 
      value: stats?.products.byType.hotel || 0, 
      icon: <Hotel />, 
      link: '/admin/products?type=hotel' 
    },
    { 
      title: 'Transport', 
      value: stats?.products.byType.transport || 0, 
      icon: <DirectionsBus />, 
      link: '/admin/products?type=transport' 
    },
    { 
      title: 'Experiences', 
      value: stats?.products.byType.excursion || 0, 
      icon: <Explore />, 
      link: '/admin/products?type=experience' 
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid key={card.title} item xs={12} sm={6} md={3}>
            <Link to={card.link} style={{ textDecoration: 'none' }}>
              <Card sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  cursor: 'pointer'
                }
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  {React.cloneElement(card.icon as React.ReactElement, { 
                    sx: { fontSize: 40, color: 'primary.main', mr: 1 } 
                  })}
                </Box>
                <Typography variant="h5" component="div">
                  {card.value}
                </Typography>
                <Typography color="text.secondary">
                  {card.title}
                </Typography>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard; 