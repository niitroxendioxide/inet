import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

interface BaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'FLIGHT' | 'HOTEL' | 'TRANSPORT' | 'EXCURSION';
}

interface FlightProduct extends BaseProduct {
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  class?: string;
  stops?: string;
  airline?: string;
  flightNumber?: string;
}

interface HotelProduct extends BaseProduct {
  location: string;
  amenities: string[];
  rating?: number;
  reviews?: number;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  stars?: number;
}

interface TransportProduct extends BaseProduct {
  vehicleType: string;
  capacity?: number;
  pickupLocation?: string;
  dropoffLocation?: string;
  duration?: string;
  includes?: string[];
}

interface ExcursionProduct extends BaseProduct {
  location: string;
  category?: string;
  duration?: string;
  maxGroupSize?: number;
  difficulty?: string;
  includes?: string[];
  requirements?: string[];
}

type Product = FlightProduct | HotelProduct | TransportProduct | ExcursionProduct;

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const productType = searchParams.get('type')?.toUpperCase() === 'EXPERIENCE' ? 'EXCURSION' : searchParams.get('type')?.toUpperCase() || 'FLIGHT';
  const queryClient = useQueryClient();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // State for array fields
  const [amenities, setAmenities] = useState<string[]>([]);
  const [includes, setIncludes] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ['products', productType],
    queryFn: async () => {
      const token = localStorage.getItem('travelToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`http://localhost:3000/api/products?product_type=${productType.toLowerCase()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch products: ${error}`);
      }
      const result = await response.json();
      return result.data;
    }
  });

  // Create/Update product mutation
  const mutation = useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const token = localStorage.getItem('travelToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const method = product.id ? 'PUT' : 'POST';
      const url = product.id ? `http://localhost:3000/api/products/${product.id}` : 'http://localhost:3000/api/products';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to save product: ${error}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', productType] });
      setOpenDialog(false);
      setSnackbar({ open: true, message: 'Product saved successfully', severity: 'success' });
    },
    onError: (error) => {
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : 'Failed to save product', 
        severity: 'error' 
      });
    }
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('travelToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete product: ${error}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', productType] });
      setSnackbar({ open: true, message: 'Product deleted successfully', severity: 'success' });
    },
    onError: (error) => {
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : 'Failed to delete product', 
        severity: 'error' 
      });
    }
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const baseProduct = {
      id: editingProduct?.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      type: productType as 'FLIGHT' | 'HOTEL' | 'TRANSPORT' | 'EXCURSION'
    };

    let specificFields = {};
    
    switch (productType) {
      case 'FLIGHT':
        const flightProduct = editingProduct as FlightProduct;
        specificFields = {
          from: formData.get('from'),
          to: formData.get('to'),
          departure: formData.get('departure'),
          arrival: formData.get('arrival'),
          duration: formData.get('duration'),
          class: formData.get('class') || 'Económica',
          stops: formData.get('stops') || 'Directo',
          airline: formData.get('airline'),
          flightNumber: formData.get('flightNumber')
        };
        break;
      case 'HOTEL':
        const hotelProduct = editingProduct as HotelProduct;
        specificFields = {
          location: formData.get('location'),
          amenities,
          rating: formData.get('rating') ? parseFloat(formData.get('rating') as string) : undefined,
          reviews: formData.get('reviews') ? parseInt(formData.get('reviews') as string) : undefined,
          checkIn: formData.get('checkIn'),
          checkOut: formData.get('checkOut'),
          rooms: formData.get('rooms') ? parseInt(formData.get('rooms') as string) : undefined,
          stars: formData.get('stars') ? parseInt(formData.get('stars') as string) : undefined
        };
        break;
      case 'TRANSPORT':
        const transportProduct = editingProduct as TransportProduct;
        specificFields = {
          vehicleType: formData.get('vehicleType'),
          capacity: formData.get('capacity') ? parseInt(formData.get('capacity') as string) : undefined,
          pickupLocation: formData.get('pickupLocation'),
          dropoffLocation: formData.get('dropoffLocation'),
          duration: formData.get('duration'),
          includes
        };
        break;
      case 'EXCURSION':
        const excursionProduct = editingProduct as ExcursionProduct;
        specificFields = {
          location: formData.get('location'),
          category: formData.get('category') || 'Excursión',
          duration: formData.get('duration'),
          maxGroupSize: formData.get('maxGroupSize') ? parseInt(formData.get('maxGroupSize') as string) : undefined,
          difficulty: formData.get('difficulty'),
          includes,
          requirements
        };
        break;
    }

    const product = {
      ...baseProduct,
      ...specificFields
    };

    mutation.mutate(product);
  };

  const handleAddTag = (type: 'amenities' | 'includes' | 'requirements') => {
    if (!newTag.trim()) return;
    
    switch (type) {
      case 'amenities':
        setAmenities([...amenities, newTag.trim()]);
        break;
      case 'includes':
        setIncludes([...includes, newTag.trim()]);
        break;
      case 'requirements':
        setRequirements([...requirements, newTag.trim()]);
        break;
    }
    setNewTag('');
  };

  const handleRemoveTag = (type: 'amenities' | 'includes' | 'requirements', index: number) => {
    switch (type) {
      case 'amenities':
        setAmenities(amenities.filter((_, i) => i !== index));
        break;
      case 'includes':
        setIncludes(includes.filter((_, i) => i !== index));
        break;
      case 'requirements':
        setRequirements(requirements.filter((_, i) => i !== index));
        break;
    }
  };

  const renderTypeSpecificFields = () => {
    switch (productType) {
      case 'FLIGHT':
        const flightProduct = editingProduct as FlightProduct;
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Origin"
              name="from"
              defaultValue={flightProduct?.from}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Destination"
              name="to"
              defaultValue={flightProduct?.to}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Departure Time"
              name="departure"
              type="time"
              defaultValue={flightProduct?.departure}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Arrival Time"
              name="arrival"
              type="time"
              defaultValue={flightProduct?.arrival}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Duration"
              name="duration"
              defaultValue={flightProduct?.duration}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Class"
              name="class"
              defaultValue={flightProduct?.class || 'Económica'}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Stops"
              name="stops"
              defaultValue={flightProduct?.stops || 'Directo'}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Airline"
              name="airline"
              defaultValue={flightProduct?.airline}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Flight Number"
              name="flightNumber"
              defaultValue={flightProduct?.flightNumber}
            />
          </>
        );
      
      case 'HOTEL':
        const hotelProduct = editingProduct as HotelProduct;
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Location"
              name="location"
              defaultValue={hotelProduct?.location}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Amenities</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label="Add Amenity"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button onClick={() => handleAddTag('amenities')}>Add</Button>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {amenities.map((amenity, index) => (
                  <Chip
                    key={index}
                    label={amenity}
                    onDelete={() => handleRemoveTag('amenities', index)}
                  />
                ))}
              </Stack>
            </Box>
            <TextField
              margin="normal"
              fullWidth
              label="Rating"
              name="rating"
              type="number"
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              defaultValue={hotelProduct?.rating}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Reviews Count"
              name="reviews"
              type="number"
              inputProps={{ min: 0 }}
              defaultValue={hotelProduct?.reviews}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Check-in Time"
              name="checkIn"
              type="time"
              defaultValue={hotelProduct?.checkIn}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Check-out Time"
              name="checkOut"
              type="time"
              defaultValue={hotelProduct?.checkOut}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Number of Rooms"
              name="rooms"
              type="number"
              inputProps={{ min: 1 }}
              defaultValue={hotelProduct?.rooms}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Stars"
              name="stars"
              type="number"
              inputProps={{ min: 1, max: 5 }}
              defaultValue={hotelProduct?.stars}
            />
          </>
        );
      
      case 'TRANSPORT':
        const transportProduct = editingProduct as TransportProduct;
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Vehicle Type"
              name="vehicleType"
              defaultValue={transportProduct?.vehicleType}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              inputProps={{ min: 1 }}
              defaultValue={transportProduct?.capacity}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Pickup Location"
              name="pickupLocation"
              defaultValue={transportProduct?.pickupLocation}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Dropoff Location"
              name="dropoffLocation"
              defaultValue={transportProduct?.dropoffLocation}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Duration"
              name="duration"
              defaultValue={transportProduct?.duration}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Includes</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label="Add Item"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button onClick={() => handleAddTag('includes')}>Add</Button>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {includes.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onDelete={() => handleRemoveTag('includes', index)}
                  />
                ))}
              </Stack>
            </Box>
          </>
        );
      
      case 'EXCURSION':
        const excursionProduct = editingProduct as ExcursionProduct;
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Location"
              name="location"
              defaultValue={excursionProduct?.location}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Category"
              name="category"
              defaultValue={excursionProduct?.category || 'Excursión'}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Duration"
              name="duration"
              defaultValue={excursionProduct?.duration}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Max Group Size"
              name="maxGroupSize"
              type="number"
              inputProps={{ min: 1 }}
              defaultValue={excursionProduct?.maxGroupSize}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Difficulty"
              name="difficulty"
              defaultValue={excursionProduct?.difficulty}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Includes</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label="Add Item"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button onClick={() => handleAddTag('includes')}>Add</Button>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {includes.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onDelete={() => handleRemoveTag('includes', index)}
                  />
                ))}
              </Stack>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Requirements</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label="Add Requirement"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <Button onClick={() => handleAddTag('requirements')}>Add</Button>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {requirements.map((req, index) => (
                  <Chip
                    key={index}
                    label={req}
                    onDelete={() => handleRemoveTag('requirements', index)}
                  />
                ))}
              </Stack>
            </Box>
          </>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {productType.charAt(0) + productType.slice(1).toLowerCase()}s Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add New
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(product)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingProduct ? 'Edit Product' : 'Create New Product'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              name="name"
              defaultValue={editingProduct?.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              defaultValue={editingProduct?.description}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Price"
              name="price"
              type="number"
              defaultValue={editingProduct?.price}
              inputProps={{ min: 0, step: 0.01 }}
            />
            {renderTypeSpecificFields()}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Products; 