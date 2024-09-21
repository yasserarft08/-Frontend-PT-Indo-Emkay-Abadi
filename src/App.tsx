import { Button, Dialog, Typography } from "@mui/material";
import AddProductForm from "./components/ProductForm";
import ProductList from './components/ProductList';
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditProduct from "./components/EditProduct";

const App = () => {
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"add" | "edit" | null>(null);
  const [productId, setProductId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setDialogType("edit");
    setProductId(id);
    setOpen(true);
  }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" component="h1">
          Product Management
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)} startIcon={<AddIcon />}>Add Product</Button>
      </div>
      <ProductList onEdit={(id) => handleEdit(id)} />
      <Dialog open={open} onClose={() => setOpen(false)} >
        {dialogType === "add" && <AddProductForm onClose={() => setOpen(false)} />}
        {dialogType === "edit" && <EditProduct id={productId} onClose={() => setOpen(false)}  />}
      </Dialog>
    </div>
  );
};

export default App;