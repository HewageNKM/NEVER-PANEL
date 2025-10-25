"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Autocomplete,
  Button,
  CircularProgress,
} from "@mui/material";
import { DropdownOption } from "@/app/dashboard/master/products/page"; // Reusing types
import { getToken } from "@/firebase/firebaseClient";
import axios from "axios";
// Assuming InventoryItem uses productId
import { InventoryItem } from "@/model/InventoryItem";

interface StockLocationOption extends DropdownOption {}

interface VariantDropdownOption {
  id: string; // variantId
  label: string; // variantName
  sizes: string[];
}

interface StockFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  item: InventoryItem | null;
  products: DropdownOption[];
  sizes: DropdownOption[];
  stockLocations: StockLocationOption[];
}

// --- Updated emptyItem to use productId ---
const emptyItem: Omit<InventoryItem, "id"> = {
  productId: "", // Use productId
  variantId: "",
  size: "",
  stockId: "",
  quantity: 0,
};

const InventoryFormModal: React.FC<StockFormModalProps> = ({
  open,
  onClose,
  onSave,
  item,
  products,
  stockLocations,
}) => {
  const [formData, setFormData] = useState(emptyItem);
  const [variants, setVariants] = useState<VariantDropdownOption[]>([]);
  const [selectedVariant, setSelectedVariant] =
    useState<VariantDropdownOption | null>(null);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditing = !!item;

  useEffect(() => {
    if (open) {
      if (item) {
        setFormData({
          productId: item.productId, // Use productId
          variantId: item.variantId,
          size: item.size,
          stockId: item.stockId,
          quantity: item.quantity,
        });
        if (item.productId) { // Use productId
          fetchVariants(item.productId, item.variantId);
        }
      } else {
        setFormData(emptyItem);
        setVariants([]);
        setSelectedVariant(null);
      }
      setSaving(false);
    }
  }, [item, open]);

  const fetchVariants = async (
    productId: string | null,
    preselectVariantId?: string
  ) => {
    if (!productId) {
      setVariants([]);
      setSelectedVariant(null);
      setFormData((prev) => ({ ...prev, variantId: "", size: "" }));
      return;
    }
    setLoadingVariants(true);
    setSelectedVariant(null);
    setFormData((prev) => ({ ...prev, variantId: "", size: "" }));
    try {
      const token = await getToken();
      const response = await axios.get(
        `/api/v2/master/products/${productId}/variants/dropdown`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const fetchedVariants: VariantDropdownOption[] = response.data || [];
      setVariants(fetchedVariants);
      if (preselectVariantId) {
        const initialVariant = fetchedVariants.find(
          (v) => v.id === preselectVariantId
        );
        if (initialVariant) {
          setSelectedVariant(initialVariant);
        }
      }
    } catch (error) {
      console.error("Failed to fetch variants:", error);
      setVariants([]);
    } finally {
      setLoadingVariants(false);
    }
  };

  // --- Updated handleChange for quantity ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Specifically handle quantity as a number
    if (name === 'quantity') {
      const numValue = parseInt(value, 10);
      setFormData((prev) => ({
         ...prev,
         [name]: isNaN(numValue) ? 0 : Math.max(0, numValue) // Ensure it's a non-negative number, default to 0 if invalid
      }));
    } else {
       setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAutocompleteChange = (
    name: string,
    newValue: DropdownOption | null
  ) => {
    const value = newValue ? newValue.id : null;
    // Update formData for the selected field (productId or stockId)
    setFormData((prev) => ({ ...prev, [name]: value ?? "" }));

    if (name === "productId") { // Use productId
      fetchVariants(value);
    }
  };

  const handleVariantAutocompleteChange = (
    newValue: VariantDropdownOption | null
  ) => {
    setSelectedVariant(newValue);
    setFormData((prev) => ({
      ...prev,
      variantId: newValue ? newValue.id : "",
      size: "", // Reset size
    }));
  };

  const availableSizes = useMemo(() => {
    if (!selectedVariant || !selectedVariant.sizes) return [];
    return selectedVariant.sizes.map(
      (sizeLabel): DropdownOption => ({ id: sizeLabel, label: sizeLabel })
    );
  }, [selectedVariant]);

  const handleSizeAutocompleteChange = (newValue: DropdownOption | null) => {
    const value = newValue ? newValue.label : "";
    setFormData((prev) => ({ ...prev, size: value }));
  };

  const handleSubmit = async () => {
    // Basic Validation (using productId)
    if (
      !formData.productId ||
      !formData.variantId ||
      !formData.size ||
      !formData.stockId ||
      formData.quantity < 0
    ) {
      alert(
        "Please select Product, Variant, Size, Location and ensure quantity is not negative."
      );
      return;
    }
    if (!selectedVariant?.sizes?.includes(formData.size)) {
      alert("The selected size is not available for the chosen variant.");
      return;
    }

    setSaving(true);
    try {
      // Ensure quantity is sent as a number
      const saveData = {
        ...(item || {}),
        ...formData,
        quantity: Number(formData.quantity) // Explicitly cast/ensure it's a number
      };
      await onSave(saveData);
    } catch (error) {
      console.error("Save failed in modal:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? "Edit Stock Quantity" : "Add Stock Entry"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.label}
              value={products.find((p) => p.id === formData.productId) || null} // Use productId
              onChange={(_, newValue) =>
                handleAutocompleteChange("productId", newValue) // Use productId
              }
              disabled={saving || isEditing}
              renderInput={(params) => (
                <TextField {...params} label="Product" required />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={variants}
              getOptionLabel={(option) => option.label || ""}
              value={selectedVariant}
              onChange={(_, newValue) =>
                handleVariantAutocompleteChange(newValue)
              }
              loading={loadingVariants}
              disabled={saving || !formData.productId || isEditing} // Use productId
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Variant"
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingVariants ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={availableSizes}
              getOptionLabel={(option) => option.label}
              value={
                availableSizes.find((s) => s.label === formData.size) || null
              }
              onChange={(_, newValue) =>
                handleSizeAutocompleteChange(newValue)
              }
              disabled={saving || isEditing || !selectedVariant}
              renderInput={(params) => (
                <TextField {...params} label="Size" required />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={stockLocations}
              getOptionLabel={(option) => option.label}
              value={
                stockLocations.find((loc) => loc.id === formData.stockId) || null
              }
              onChange={(_, newValue) =>
                handleAutocompleteChange("stockId", newValue)
              }
              disabled={saving || isEditing}
              renderInput={(params) => (
                <TextField {...params} label="Stock Location" required />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="quantity"
              label="Quantity"
              type="number" // Keep type as number for input validation
              value={formData.quantity} // Value is already a number in state
              onChange={handleChange} // Use updated handleChange
              fullWidth
              required
              disabled={saving}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>
          {saving ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventoryFormModal;