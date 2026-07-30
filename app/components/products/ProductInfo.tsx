import { Box, Button, Chip, Divider, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { IProduct } from "~/interfaces/IProduct";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface Props {
  product: IProduct;
}

export default function ProductInfo({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const subtotal = quantity * product.unitPrice;
  const navigate = useNavigate();

  const formatPrice = (price: number) =>
    price?.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Category */}
      {product.category && (
        <Box sx={{ mb: 2.5 }}>
          <Chip
            label={product.category}
            size="small"
            sx={{
              bgcolor: "primary.light",
              color: "default",
              fontWeight: 600,
              borderRadius: 999,
              px: 1,
            }}
          />
        </Box>
      )}

      {/* Name */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          lineHeight: 1.2,
          color: "text.primary",
        }}
      >
        {product.name}
      </Typography>

      {/* SKU */}
      <Box sx={{ mt: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography variant="body2" color="text.secondary">SKU</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }} color="text.primary">
          {product.sku}
        </Typography>
      </Box>

      {/* Price */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">Price</Typography>
        <Typography
          variant="h3"
          sx={{ mt: 1, fontWeight: 900, color: "secondary.main" }}
        >
          {formatPrice(product.unitPrice)}
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Quantity */}
      <Box>
        <Typography
          variant="body2"
          sx={{ mb: 2, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Quantity
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: "fit-content",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            overflow: "hidden",
            boxShadow: 1,
          }}
        >
          <IconButton
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            sx={{ borderRadius: 0, width: 48, height: 48 }}
          >
            <RemoveIcon />
          </IconButton>
          <Box
            sx={{
              width: 56,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: "1px solid",
              borderRight: "1px solid",
              borderColor: "divider",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            {quantity}
          </Box>
          <IconButton
            onClick={() => setQuantity(quantity + 1)}
            sx={{ borderRadius: 0, width: 48, height: 48 }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Subtotal */}
      <Paper
        variant="outlined"
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 4,
          bgcolor: "background.paper",
          borderColor: "primary.main",
          color: "primary.dark",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Total Price</Typography>
            <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 800, color: "text.primary" }}>
              {formatPrice(subtotal)}
            </Typography>
          </Box>
          <Chip
            label={`${quantity} Item`}
            size="small"
            sx={{ fontWeight: 600, bgcolor: "background.paper" }}
          />
        </Box>
      </Paper>

      {/* Actions */}

      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 4, py: 1.5, fontWeight: 700, borderRadius: 3 }}
        onClick={() => navigate("/dashboard")}
      >
        Login to Buy
      </Button>

      {/* Additional info */}
      <Paper
        variant="outlined"
        sx={{
          mt: 4,
          p: 2.5,
          borderRadius: 3,
          bgcolor: "grey.50",
          borderColor: "grey.200",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">Availability</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }} color="success.main">In Stock</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">Shipping</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Ready to ship</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
