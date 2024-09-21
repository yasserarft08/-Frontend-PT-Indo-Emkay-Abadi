import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { fetchProducts } from "../features/productsSlice";
import { Box, Button, TextField } from "@mui/material";
import { apiUrl } from "../util/api";

const productSchema = z.object({
    product_name: z.string().min(1, 'Product name is required'),
    category: z.string().min(1, 'Category is required'),
    price: z.number().positive('Price must be a positive number'),
    discount: z.number().nonnegative('Discount cannot be negative').max(100).optional(),
});

interface errorInterface {
    product_name?: string;
    category?: string;
    price?: string;
    discount?: string;
    error?: string;
}

interface AddProductFormInterface {
    onClose: () => void;
}

const AddProductForm: React.FC<AddProductFormInterface> = ({onClose}) => {
    const [product, setProduct] = useState({ product_name: '', category: '', price: '', discount: '' });
    const [errors, setErrors] = useState<errorInterface>({});
    const dispatch = useDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("Submit")
        e.preventDefault();
        try {
            // Validate the data using Zod
            productSchema.parse({
                product_name: product.product_name,
                category: product.category,
                price: parseFloat(product.price),
                discount: product.discount ? parseFloat(product.discount) : undefined,
            });

            await axios.post(`${apiUrl}/products`, product);
            dispatch(fetchProducts()); // Refresh the product list
            setProduct({ product_name: '', category: '', price: '', discount: '' }); // Reset form
            onClose();
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.reduce((acc:Record<string, string | number>, curr) => {
                    acc[curr.path[0]] = curr.message;
                    return acc;
                }, {});
                setErrors(formattedErrors);
            }
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ padding: '20px' }}>
            <TextField
                label="Product Name"
                name="product_name"
                value={product.product_name}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                error={!!errors.product_name}
                helperText={errors.product_name}
            />
            <TextField
                label="Category"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                error={!!errors.category}
                helperText={errors.category}
            />
            <TextField
                label="Price"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.price}
                helperText={errors.price}
            />
            <TextField
                label="Discount"
                name="discount"
                value={product.discount}
                onChange={handleChange}
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.discount}
                helperText={errors.discount}
            />
            <Button type="submit" variant="contained" color="primary">
                Add Product
            </Button>
        </Box>
    );
};

export default AddProductForm;