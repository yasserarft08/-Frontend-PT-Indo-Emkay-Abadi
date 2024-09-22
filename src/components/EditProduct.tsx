import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UnknownAction } from "redux";
import { z } from "zod";
import { fetchProducts } from "../features/productsSlice";
import { RootState } from "../store/store";
import { productInterface } from "../types/product";
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

interface EditProductInterface {
    onClose: () => void;
    id?: number
}

const EditProduct: React.FC<EditProductInterface> = ({ onClose, id }) => {
    const dispatch = useDispatch();
    const dataProduct = useSelector((state: RootState) => state.products.items).find((item: productInterface) => id === item.id) as productInterface;
    const [product, setProduct] = useState<productInterface>({
        id: id,
        product_name: dataProduct.product_name ?? "",
        category: dataProduct?.category ?? "",
        price: dataProduct?.price ?? 0,
        discount: dataProduct?.discount
    });
    const [errors, setErrors] = useState<errorInterface>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Validate the data using Zod
            productSchema.parse({
                product_name: product.product_name,
                category: product.category,
                price: product.price,
                discount: product.discount,
            });

            await axios.put(`${apiUrl}/products/${id}`, product);
            dispatch(fetchProducts() as unknown as UnknownAction); // Refresh the product list
            setProduct({ product_name: '', category: '', price: 0, discount: undefined }); // Reset form
            onClose();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.reduce((acc: Record<string, string | number>, curr) => {
                    acc[curr.path[0]] = curr.message;
                    return acc;
                }, {});
                setErrors(formattedErrors);
            }
        }
    };

    return dataProduct && (
        <Box component="form" onSubmit={handleSubmit} noValidate >
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
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
                Save
            </Button>
        </Box>
    );
};

export default EditProduct;