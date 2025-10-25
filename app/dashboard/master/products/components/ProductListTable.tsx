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
} from "@mui/material";
import { IconEdit, IconTrash, IconEye } from "@tabler/icons-react";
import { Product } from "@/model/Product";

interface ProductListTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (itemId: string) => void;
  brandMap: Map<string, string>;
  categoryMap: Map<string, string>;
}

const ProductListTable: React.FC<ProductListTableProps> = ({
  products,
  onEdit,
  onDelete,
  brandMap,
  categoryMap,
}) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Listing</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.productId}>
              <TableCell className="uppercase">
                {product.productId.toUpperCase()}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {categoryMap.get(product.category) || product.category}
              </TableCell>
              <TableCell>
                {brandMap.get(product.brand) || product.brand}
              </TableCell>
              <TableCell>
                {product.inStock ? (
                  <Chip
                    label={`${product.totalStock} In Stock`}
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip label="Out of Stock" color="error" size="small" />
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={product.status ? "Active" : "Inactive"}
                  color={product.status ? "primary" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={product.listing ? "Listed" : "Unlisted"}
                  color={product.listing ? "primary" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(product)} color="primary">
                  <IconEdit />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(product.productId)}
                  color="error"
                >
                  <IconTrash />
                </IconButton>
                <IconButton href={`/dashboard/master/products/${product.id}/view`}>
                  <IconEye />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductListTable;
