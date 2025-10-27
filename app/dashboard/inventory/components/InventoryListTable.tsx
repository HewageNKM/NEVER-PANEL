"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Chip,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { IconEdit } from "@tabler/icons-react";
import { DropdownOption } from "@/app/dashboard/master/products/page"; // Reusing types
import { InventoryItem } from "@/model/InventoryItem";

interface StockLocationOption extends DropdownOption {}

interface StockListTableProps {
  items: InventoryItem[];
  loading: boolean;
  onEdit: (item: InventoryItem) => void;
  onDelete?: (id: string) => void; // Optional delete handler
  products: DropdownOption[];
  sizes: DropdownOption[];
  stockLocations: StockLocationOption[];
}

const InventoryListTable: React.FC<StockListTableProps> = ({
  items,
  loading,
  onEdit,
  products,
  sizes,
  stockLocations,
}) => {
  // Create maps for efficient lookups
  const productMap = new Map(products.map(p => [p.id, p.label]));
  const sizeMap = new Map(sizes.map(s => [s.label, s.label])); // Assuming size is stored as label
  const locationMap = new Map(stockLocations.map(loc => [loc.id, loc.label]));

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Typography textAlign="center" color="text.secondary" py={4}>
        No stock items found.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product ID</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Variant ID</TableCell>
            <TableCell>Variant</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Location</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.productId.toUpperCase() || "N/A"}</TableCell>
              <TableCell>{item.productName?.toUpperCase() || "N/A"}</TableCell>
              <TableCell>{item.variantId.toUpperCase() || "N/A"}</TableCell>
              <TableCell>{item.variantName?.toUpperCase() || "N/A"}</TableCell> {/* Display variant ID for now */}
              <TableCell>{item.size}</TableCell>
              <TableCell>{item.stockName?.toUpperCase() || "N/A"}</TableCell>
              <TableCell align="right">
                 <Chip label={item.quantity} color={item.quantity > 0 ? "success" : "default"} size="small" />
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(item)} color="primary" size="small">
                  <IconEdit />
                </IconButton>
                {/* Optional Delete Button */}
                {/* {onDelete && (
                  <IconButton onClick={() => onDelete(item.id!)} color="error" size="small">
                    <IconTrash />
                  </IconButton>
                )} */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryListTable;