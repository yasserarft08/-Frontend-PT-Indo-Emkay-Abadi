import { Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogTitle, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/productsSlice';
import { RootState } from '../store/store';
import { productInterface } from '../types/product';
import { apiUrl } from '../util/api';

interface ProductListInterface {
    onEdit: (id: number) => void
}

const ProductList: React.FC<ProductListInterface> = ({ onEdit }) => {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.products.items);
    const loading = useSelector((state: any) => state.products.loading);
    const error = useSelector((state: any) => state.products.error);
    const [open, setOpen] = React.useState(false);

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${apiUrl}/products/${id}`);
            dispatch(fetchProducts()); // Refresh the product list
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <CircularProgress />;
    if (error) return <p>Error: {error}</p>;

    const handleClickOpen = () => {
        setOpen(true);
      };

    const handleClose = () => {
        setOpen(false);
      };

      

    return (
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
            {products.map((product: productInterface) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">{product.product_name}</Typography>
                            <Typography color="textSecondary">{product.category}</Typography>
                            <Typography variant="body2">{Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</Typography>
                            {product.discount && (
                                <Typography variant="body2" color="error">
                                    Discount: {product.discount}%
                                </Typography>
                            )}
                            <Button
                                variant='contained'
                                onClick={() => onEdit(product.id)}
                                color="success"
                            >
                                Edit
                            </Button>
                            <Button
                                variant='contained'
                                sx={{ marginLeft: '10px' }}
                                onClick={() => handleClickOpen()}
                                color="error"
                            >
                                Delete
                            </Button>
                        </CardContent>
                    </Card>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Apakah kamu yakin ingin mengapus ini?"}
                        </DialogTitle>
                    
                        
                        <DialogActions>
                            <Button onClick={handleClose}>Tidak</Button>
                            <Button onClick={() => handleDelete(product.id)} autoFocus>
                                Ya
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductList;