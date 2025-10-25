"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Autocomplete,
  Button,
  Box,
  Typography,
  FormHelperText,
  Paper,
  IconButton,
  CircularProgress,
  Switch, // <-- Import Switch
  FormControlLabel, // <-- Import FormControlLabel
} from "@mui/material";
import { ProductVariant } from "@/model/ProductVariant";
import { DropdownOption } from "../page";
import { Img } from "@/model/Img";
import { IconPhotoPlus, IconX } from "@tabler/icons-react";
import { useSnackbar } from "@/contexts/SnackBarContext";
import { getToken } from "@/firebase/firebaseClient";
import axios from "axios";

// ... (validation constants) ...
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface VariantFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (variant: ProductVariant) => void;
  variant: ProductVariant | null;
  sizes: DropdownOption[];
  productId: string;
}

// --- Update emptyVariant ---
const emptyVariant: ProductVariant = {
  variantId: "",
  variantName: "",
  images: [],
  sizes: [],
  status: true, // <-- Default status to active
};

const VariantFormModal: React.FC<VariantFormModalProps> = ({
  open,
  onClose,
  onSave,
  variant,
  sizes,
  productId,
}) => {
  const [formData, setFormData] = useState<ProductVariant>(emptyVariant);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { showNotification } = useSnackbar();
  const isEditing = !!variant;
  const isNewVariant = !isEditing || (variant && variant.variantId.startsWith("var_"));

  useEffect(() => {
    if (open) {
      if (variant) {
        // Ensure status defaults to true if missing on existing variant
        setFormData({ status: true, ...variant });
      } else {
        setFormData({ ...emptyVariant, variantId: `var_${Date.now()}` });
      }
      setNewImageFiles([]);
      setImageErrors([]);
      setIsSaving(false);
    }
  }, [variant, open]);

  // --- Update handleChange to handle Switch ---
  const handleChange = (name: string, value: any, type?: string, checked?: boolean) => {
    setFormData((prev) => ({
      ...prev,
      // Handle Switch component value
      [name]: type === 'checkbox' || type === 'switch' ? checked : value,
    }));
  };

  const handleSizeChange = (newSizeOptions: DropdownOption[]) => {
    const sizeLabels = newSizeOptions.map((s) => s.label);
    handleChange("sizes", sizeLabels);
  };

  // ... (Image Handling Logic - no changes needed) ...
  // --- Image Handling Logic ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageErrors([]);
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Validate type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type (use PNG, JPEG, WEBP).`);
        return;
      }
      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File is too large (max 1MB).`);
        return;
      }
      validFiles.push(file);
    });

    setNewImageFiles((prev) => [...prev, ...validFiles]);
    setImageErrors(errors);
  };

  const removeNewFile = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    // Just updates local state. Backend handles final list on save.
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
     showNotification("Image marked for removal. Save variant to confirm.", "info");
  };

  // --- End Image Handling ---

  const validateVariantForm = (): boolean => {
    if (!formData.variantName.trim()) {
      showNotification("Variant Name is required.", "warning");
      return false;
    }
    // Add other variant-specific validations if needed
    return true;
  };

  const handleSubmit = async () => {
    if (!validateVariantForm()) return;

    setIsSaving(true);
    try {
      // 1. Create FormData
      const formDataPayload = new FormData();

      // 2. Append variant data (stringifying complex types)
      formDataPayload.append("variantId", formData.variantId);
      formDataPayload.append("variantName", formData.variantName);
      formDataPayload.append("sizes", JSON.stringify(formData.sizes || []));
      formDataPayload.append("images", JSON.stringify(formData.images || []));
      // --- Append status ---
      formDataPayload.append("status", String(formData.status ?? true)); // Send as string 'true' or 'false'

      // 3. Append *new* image files
      newImageFiles.forEach((file) => {
        formDataPayload.append("newImages", file, file.name);
      });

      // 4. Determine API endpoint and method
      const token = await getToken();
      const method = isNewVariant ? "POST" : "PUT";
      const url = isNewVariant
        ? `/api/v2/master/products/${productId}/variants`
        : `/api/v2/master/products/${productId}/variants/${formData.variantId}`;

      // 5. Make the API call
      const response = await axios({
        method: method,
        url: url,
        data: formDataPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 6. API returns the complete, saved variant data
      const savedVariant: ProductVariant = response.data;

      // 7. Update parent state with the final data & close
      onSave(savedVariant);
      showNotification(
        `Variant ${isNewVariant ? "added" : "updated"} successfully. Remember to save the product.`,
        "success"
      );
      onClose();
    } catch (error: any) {
      console.error("Failed to save variant:", error);
      const message =
        error.response?.data?.message ||
        "Failed to save variant. Please try again.";
      showNotification(message, "error");
      setImageErrors([
        "An error occurred during save. Please check details and try again.",
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? "Edit Variant" : "Add New Variant"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Variant Name"
              value={formData.variantName}
              onChange={(e) => handleChange("variantName", e.target.value)}
              fullWidth
              required
              disabled={isSaving}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={sizes}
              getOptionLabel={(option) => option.label}
              value={sizes.filter((s) => (formData.sizes || []).includes(s.label))}
              onChange={(_, newValue) => handleSizeChange(newValue)}
              disabled={isSaving}
              renderInput={(params) => (
                <TextField {...params} label="Available Sizes" />
              )}
            />
          </Grid>

          {/* --- Add Status Switch --- */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="status" // Add name attribute
                  checked={formData.status ?? true} // Default checked to true if undefined
                  onChange={(e) => handleChange('status', '', 'switch', e.target.checked)} // Pass type and checked
                  disabled={isSaving}
                />
              }
              label="Active Status"
            />
          </Grid>
          {/* --- End Status Switch --- */}


          {/* --- Image Upload Component (No changes below this line) --- */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Variant Images (Max 1MB each)
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<IconPhotoPlus />}
              disabled={isSaving}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/webp, image/png, image/jpeg"
                onChange={handleFileChange}
              />
            </Button>
            {imageErrors.length > 0 && (
              <Box mt={1}>
                {imageErrors.map((err, i) => (
                  <FormHelperText key={i} error> {err} </FormHelperText>
                ))}
              </Box>
            )}
            <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
              {(formData.images || []).map((img, index) => (
                <Paper key={img.url || `existing-${index}`} sx={{ width: 80, height: 80, position: "relative" }}>
                  <img src={img.url} alt="variant" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <IconButton size="small" onClick={() => removeExistingImage(index)} disabled={isSaving} sx={{ position: "absolute", top: 0, right: 0, bgcolor: "rgba(255,255,255,0.7)" }}> <IconX size={16} /> </IconButton>
                </Paper>
              ))}
              {newImageFiles.map((file, index) => (
                <Paper key={file.name + index} sx={{ width: 80, height: 80, position: "relative" }}>
                  <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} />
                  <IconButton size="small" onClick={() => removeNewFile(index)} disabled={isSaving} sx={{ position: "absolute", top: 0, right: 0, bgcolor: "rgba(255,255,255,0.7)" }}> <IconX size={16} /> </IconButton>
                </Paper>
              ))}
            </Box>
          </Grid>
          {/* --- End Image Upload --- */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isSaving}> Cancel </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSaving}>
          {isSaving ? (<CircularProgress size={24} color="inherit" />) : ("Save Variant")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VariantFormModal;