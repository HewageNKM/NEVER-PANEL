"use client";
import React from "react";
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TableContainer,
  Chip,
} from "@mui/material";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { ProductVariant } from "@/model/ProductVariant";

interface VariantListProps {
  variants: ProductVariant[];
  onAddVariant: () => void;
  onEditVariant: (index: number) => void;
  onDeleteVariant: (index: number) => void;
}

const VariantList: React.FC<VariantListProps> = ({
  variants,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6">Variants</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<IconPlus />}
          onClick={onAddVariant}
        >
          Add Variant
        </Button>
      </Box>
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Sizes</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variants.map((variant, index) => (
                <TableRow key={variant.variantId}>
                  <TableCell>{variant.variantName}</TableCell>
                  <TableCell>{variant.sizes.join(", ")}</TableCell>
                  <TableCell>
                    <Chip
                      label={variant.status ? "Active" : "Inactive"}
                      color={variant.status ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => onEditVariant(index)}
                      color="primary"
                    >
                      <IconEdit size={18} />
                    </IconButton>
                    <IconButton
                      onClick={() => onDeleteVariant(index)}
                      color="error"
                    >
                      <IconTrash size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {variants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No variants added. Click 'Add Variant' to begin.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default VariantList;