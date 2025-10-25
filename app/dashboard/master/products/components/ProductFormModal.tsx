"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Switch,
  FormControlLabel,
  Autocomplete,
  Button,
  Box,
  Typography,
  Chip,
  FormHelperText,
  CircularProgress, // 1. Import CircularProgress
} from "@mui/material";
import { Product } from "@/model/Product";
import { DropdownOption } from "../page";
import { ProductVariant } from "@/model/ProductVariant";
import VariantList from "./VariantList";
import VariantFormModal from "./VariantFormModal";

const emptyProduct: Omit<Product, "itemId"> & { itemId: string | null } = {
  itemId: null,
  name: "",
  category: "",
  brand: "",
  description: "",
  thumbnail: { order: 0, url: "", file: "" },
  variants: [],
  weight: 0,
  buyingPrice: 0,
  sellingPrice: 0,
  marketPrice: 0,
  discount: 0,
  listing: true,
  status: true,
  tags: [],
};

type ProductErrors = Partial<Record<keyof Product, string>> & {
  thumbnail?: string;
};

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product, file: File | null) => void;
  product: Product | null;
  brands: DropdownOption[];
  categories: DropdownOption[];
  sizes: DropdownOption[];
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  onClose,
  onSave,
  product,
  brands,
  categories,
  sizes,
}) => {
  const [formData, setFormData] = useState<Product | typeof emptyProduct>(
    emptyProduct
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(
    null
  );
  const [errors, setErrors] = useState<ProductErrors>({});
  const [saving, setSaving] = useState(false);

  const isEditing = !!product; // This determines if we are editing or creating

  useEffect(() => {
    if (open) {
      // Use spread operator for initial state to avoid mutation issues
      setFormData(product ? { ...product } : { ...emptyProduct });
      setThumbnailFile(null);
      setErrors({});
    }
  }, [product, open]);

  // --- General Form Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (errors[name as keyof ProductErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" || type === "switch" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: DropdownOption | null) => {
    if (errors[name as keyof ProductErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value ? value.label : "",
    }));
  };

  // --- Thumbnail File Handler ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) {
      setThumbnailFile(null); // Clear if no file selected
      setErrors((prev) => ({ ...prev, thumbnail: undefined })); // Clear error
      return;
    }

    let error = "";
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      error = "Invalid file type. Please use WEBP, PNG, or JPEG.";
    } else if (file.size > MAX_FILE_SIZE) {
      error = "File is too large. Max size is 1MB.";
    }

    if (error) {
      setErrors((prev) => ({ ...prev, thumbnail: error }));
      setThumbnailFile(null);
    } else {
      setErrors((prev) => ({ ...prev, thumbnail: undefined }));
      setThumbnailFile(file);
    }
  };

  // --- Variant Modal Handlers ---
  const handleOpenAddVariant = () => {
    setEditingVariantIndex(null);
    setIsVariantModalOpen(true);
  };

  const handleOpenEditVariant = (index: number) => {
    setEditingVariantIndex(index);
    setIsVariantModalOpen(true);
  };

  const handleCloseVariantModal = () => {
    setIsVariantModalOpen(false);
    setEditingVariantIndex(null);
  };

  const handleDeleteVariant = async (index: number) => {
    // Note: This only removes locally. Actual delete happens on Product Save.
    // If you need immediate delete, call the DELETE variant API here.
    if (
      window.confirm(
        "Are you sure you want to remove this variant locally? It will be permanently deleted when you save the product."
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSaveVariant = (variantData: ProductVariant) => {
    // This function updates the local state of the main form
    setFormData((prev) => {
      const newVariants = [...(prev.variants || [])]; // Handle initial undefined/null
      const variantIdToUpdate = variantData.variantId;

      // Find if variant already exists locally by ID
      const existingIndex = newVariants.findIndex(
        (v) => v.variantId === variantIdToUpdate
      );

      if (existingIndex !== -1) {
        // Update existing variant in local state
        newVariants[existingIndex] = variantData;
      } else if (
        editingVariantIndex !== null &&
        editingVariantIndex < newVariants.length
      ) {
        // Fallback using index if ID match failed (e.g., during creation before API returns ID)
        newVariants[editingVariantIndex] = variantData;
      } else {
        // Add new variant to local state
        newVariants.push(variantData);
      }
      return { ...prev, variants: newVariants };
    });
    // handleCloseVariantModal(); // Keep modal open handling within VariantFormModal
  };

  // --- Validation & Main Save Handler ---
  const validateForm = (): boolean => {
    const newErrors: ProductErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (Number(formData.weight) <= 0)
      newErrors.weight = "Weight must be greater than 0";
    if (Number(formData.sellingPrice) <= 0)
      newErrors.sellingPrice = "Selling price must be greater than 0";
    if (Number(formData.buyingPrice) < 0)
      newErrors.buyingPrice = "Buying price cannot be negative";
    if (Number(formData.marketPrice) < 0)
      newErrors.marketPrice = "Market price cannot be negative";
    if (Number(formData.discount) < 0)
      newErrors.discount = "Discount cannot be negative";
    if (!isEditing && !thumbnailFile)
      newErrors.thumbnail = "Thumbnail image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    try {
      setSaving(true);
      if (validateForm()) {
        // Ensure variants is always an array before saving
        const finalProductData = {
          ...formData,
          variants: formData.variants || [], // Default to empty array if null/undefined
        };
        onSave(finalProductData as Product, thumbnailFile);
      }
    } catch (error) {
      console.error("Save failed in modal:", error);
    } finally {
      setSaving(false);
    }
  };

  // Determine the variant being edited *only* if variants exist
  const editingVariant =
    isEditing &&
    editingVariantIndex !== null &&
    formData.variants &&
    editingVariantIndex < formData.variants.length
      ? formData.variants[editingVariantIndex]
      : null;

  return (
    <>
      {/* 4. Disable modal close on backdrop click while saving */}
      <Dialog
        open={open}
        onClose={saving ? () => {} : onClose} // Prevent close while saving
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEditing ? "Edit Product" : "Create New Product"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* --- Form Fields (Name, Weight, Desc, Thumbnail, etc.) --- */}
            <Grid item xs={12} sm={8}>
              <TextField
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
                disabled={saving} // Add disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="weight"
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.weight}
                helperText={errors.weight}
                disabled={saving} // Add disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                fullWidth
                disabled={saving} // Add disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                disabled={saving} // Add disabled
              >
                Upload Thumbnail
                <input
                  type="file"
                  hidden
                  accept="image/webp, image/png, image/jpeg"
                  onChange={handleFileChange}
                />
              </Button>
              <Box component="span" sx={{ ml: 2 }}>
                {thumbnailFile
                  ? thumbnailFile.name
                  : isEditing && formData.thumbnail?.url
                  ? "Current image will be kept"
                  : "No file selected"}
              </Box>
              {errors.thumbnail && (
                <FormHelperText error>{errors.thumbnail}</FormHelperText>
              )}
              {isEditing && formData.thumbnail?.url && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption">Current Image:</Typography>
                  <img
                    src={formData.thumbnail.url}
                    alt="Thumbnail"
                    height="60"
                    style={{ borderRadius: "4px", marginLeft: "8px" }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.label}
                value={
                  categories.find((c) => c.label === formData.category) || null
                }
                onChange={(_, newValue) =>
                  handleSelectChange("category", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    required
                    error={!!errors.category}
                    helperText={errors.category}
                  />
                )}
                disabled={saving} // Add disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={brands}
                getOptionLabel={(option) => option.label}
                value={brands.find((b) => b.label === formData.brand) || null}
                onChange={(_, newValue) =>
                  handleSelectChange("brand", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Brand"
                    required
                    error={!!errors.brand}
                    helperText={errors.brand}
                  />
                )}
                disabled={saving} // Add disabled
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                name="sellingPrice"
                label="Selling Price"
                type="number"
                value={formData.sellingPrice}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.sellingPrice}
                helperText={errors.sellingPrice}
                disabled={saving} // Add disabled
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                name="marketPrice"
                label="Market Price"
                type="number"
                value={formData.marketPrice}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.marketPrice}
                helperText={errors.marketPrice}
                disabled={saving} // Add disabled
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                name="buyingPrice"
                label="Buying Price"
                type="number"
                value={formData.buyingPrice}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.buyingPrice}
                helperText={errors.buyingPrice}
                disabled={saving} // Add disabled
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                name="discount"
                label="Discount %"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.discount}
                helperText={errors.discount}
                disabled={saving} // Add disabled
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="listing"
                    checked={formData.listing}
                    onChange={handleChange}
                  />
                }
                label="Listing"
                disabled={saving} // Add disabled
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />
                }
                label="Status (Active)"
                disabled={saving} // Add disabled
              />
            </Grid>

            {/* --- TAGS (KEYWORDS) DISPLAY --- */}
            {isEditing && formData.tags && formData.tags.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Generated Keywords (Read-Only)
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    p: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    maxHeight: 100,
                    overflowY: "auto",
                  }}
                >
                  {formData.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              </Grid>
            )}

            {/* --- VARIANT SECTION --- */}
            {isEditing && ( // Only show VariantList when editing
              <Grid item xs={12}>
                <VariantList
                  variants={formData.variants || []} // Pass empty array if undefined
                  onAddVariant={handleOpenAddVariant}
                  onEditVariant={handleOpenEditVariant}
                  onDeleteVariant={handleDeleteVariant}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        {/* 6. Update DialogActions */}
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={saving}
          >
            {saving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Product"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- RENDER THE SECOND MODAL (CONDITIONALLY) --- */}
      {isEditing && product && (
        <VariantFormModal
          open={isVariantModalOpen}
          onClose={handleCloseVariantModal}
          onSave={handleSaveVariant}
          variant={editingVariant}
          sizes={sizes}
          productId={product.productId} // Now safe to access itemId
        />
      )}
    </>
  );
};

export default ProductFormModal;
