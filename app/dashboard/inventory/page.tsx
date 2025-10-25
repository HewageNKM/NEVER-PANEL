"use client";

import React, { useState, useEffect } from "react";
import PageContainer from "../components/container/PageContainer";
import DashboardCard from "../components/shared/DashboardCard";
import {
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Pagination,
  Autocomplete,
} from "@mui/material";
// --- 1. Import the clear icon ---
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { getToken } from "@/firebase/firebaseClient";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { DropdownOption } from "../master/products/page";
import { InventoryItem } from "@/model/InventoryItem";
import InventoryListTable from "./components/InventoryListTable";
import InventoryFormModal from "./components/InventoryFormModal";

// --- Define Interfaces ---
interface StockLocationOption extends DropdownOption {}

// --- Initial State for Filters ---
const initialFilterState = {
  productId: null as string | null,
  variantId: "all",
  size: "all",
  stockId: "all",
};

// --- MAIN PAGE COMPONENT ---
const InventoryPage = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<DropdownOption[]>([]);
  const [variants, setVariants] = useState<DropdownOption[]>([]);
  const [sizes, setSizes] = useState<DropdownOption[]>([]);
  const [stockLocations, setStockLocations] = useState<StockLocationOption[]>(
    []
  );
  const { currentUser, loading: authLoading } = useAppSelector(
    (state) => state.authSlice
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [loading, setLoading] = useState(false);
  const [variantLoading, setVariantLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const [filters, setFilters] = useState(initialFilterState); // Use initial state

  // --- Data Fetching ---
  useEffect(() => {
    if (currentUser && !authLoading) {
      fetchInventory(); // Initial fetch
      fetchDropdown("/api/v2/master/products/dropdown", setProducts);
      fetchDropdown("/api/v2/master/sizes/dropdown", setSizes);
      fetchDropdown("/api/v2/master/stocks/dropdown", setStockLocations);
    }
  }, [currentUser, authLoading]);

  // Re-fetch when page or filters change (filters are now handled by buttons)
  useEffect(() => {
    if (currentUser) {
      fetchInventory();
    }
  }, [pagination.page]);

  const fetchInventory = async (isClearing: boolean = false) => {
    setLoading(true);
    // Use the correct filters for the request
    const activeFilters = isClearing ? initialFilterState : filters;

    try {
      const token = await getToken();
      const params: any = {
        page: isClearing ? 1 : pagination.page, // Reset page if clearing
        size: pagination.size,
      };

      // --- Add all active filters to params ---
      if (activeFilters.productId) params.productId = activeFilters.productId;
      if (activeFilters.variantId !== "all")
        params.variantId = activeFilters.variantId;
      if (activeFilters.size !== "all") params.variantSize = activeFilters.size; // Use 'variantSize'
      if (activeFilters.stockId !== "all")
        params.stockId = activeFilters.stockId;

      const response = await axios.get("/api/v2/inventory", {
        headers: { Authorization: `Bearer ${token}` },
        params: params,
      });

      setInventoryItems(response.data.dataList || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.rowCount || 0,
        page: isClearing ? 1 : prev.page, // Reset page if clearing
      }));
    } catch (e: any) {
      console.error("Failed to fetch inventory", e);
      // TODO: Show error notification
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdown = async (
    url: string,
    setData: (data: any[]) => void
  ) => {
    try {
      const token = await getToken();
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data || []);
    } catch (e) {
      console.error(`Failed to fetch dropdown data from ${url}`, e);
    }
  };

  const fetchVariantsDropdown = async (productId: string) => {
    setVariantLoading(true);
    setVariants([]);
    try {
      const url = `/api/v2/master/products/${productId}/variants/dropdown`;
      const token = await getToken();
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVariants(response.data || []);
    } catch (e) {
      console.error(`Failed to fetch variants for product ${productId}`, e);
    } finally {
      setVariantLoading(false);
    }
  };

  // --- Handlers ---
  const handleFilter = () => {
    // Reset page on filter, then fetch
    setPagination((prev) => ({ ...prev, page: 1 }));
    // useEffect for pagination.page will trigger fetchInventory
    // But to be explicit, we call it directly:
    fetchInventory();
  };

  // --- 2. Add Clear Filters Handler ---
  const handleClearFilters = () => {
    setFilters(initialFilterState);
    setVariants([]); // Clear variants dropdown
    // Reset page and fetch with cleared filters
    if (pagination.page === 1) {
      fetchInventory(true); // Pass flag to fetch with initial state
    } else {
      setPagination((prev) => ({ ...prev, page: 1 })); // Triggers fetch via useEffect
    }
  };

  const handleFilterChange = (
    name: string,
    value: string | DropdownOption | null
  ) => {
    if (name === "productId") {
      const newProductId = value ? (value as DropdownOption).id : null;
      setFilters((prev) => ({
        ...prev,
        productId: newProductId,
        variantId: "all",
      }));

      if (newProductId) {
        fetchVariantsDropdown(newProductId);
      } else {
        setVariants([]);
      }
    } else {
      setFilters((prev) => ({
        ...prev,
        [name!]: value as string,
      }));
    }
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveStock = async (itemData: InventoryItem) => {
    const { productId, variantId, size, stockId, quantity } = itemData;
    const payload = { productId, variantId, size, stockId, quantity };

    const isEditing = !!editingItem;
    const url = isEditing
      ? `/api/v2/inventory/${editingItem!.id}`
      : "/api/v2/inventory";
    const method = isEditing ? "PUT" : "POST";

    try {
      const token = await getToken();
      await axios({
        method: method,
        url: url,
        data: payload,
        headers: { Authorization: `Bearer ${token}` },
      });
      handleCloseModal();
    } catch (error) {
      console.error("Error saving stock item:", error);
    }
  };

  // --- 3. Check if any filters are active ---
  const isFilterActive =
    filters.productId !== null ||
    filters.variantId !== "all" ||
    filters.size !== "all" ||
    filters.stockId !== "all";

  return (
    <PageContainer title="Stocks" description="Stock Management">
      <DashboardCard
        title="Manage Stock"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconPlus />}
            onClick={handleOpenCreateModal}
          >
            Add Stock Entry
          </Button>
        }
      >
        {/* --- FILTER BAR --- */}
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mb={2}>
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.label}
            value={products.find((p) => p.id === filters.productId) || null}
            onChange={(_, newValue) => handleFilterChange("productId", newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Product"
                size="small"
                sx={{ minWidth: 200 }}
              />
            )}
            sx={{ minWidth: 200 }}
          />

          <FormControl
            size="small"
            sx={{ minWidth: 150 }}
            disabled={!filters.productId || variantLoading}
          >
            <InputLabel>Variant</InputLabel>
            <Select
              name="variantId"
              value={filters.variantId}
              label="Variant"
              onChange={(e) => handleFilterChange("variantId", e.target.value)}
              startAdornment={
                variantLoading ? (
                  <CircularProgress
                    size={20}
                    sx={{ marginRight: 1, marginLeft: 0.5 }}
                  />
                ) : null
              }
            >
              <MenuItem value="all">All Variants</MenuItem>
              {variants.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {" "}
                  {v.label.toUpperCase()}{" "}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Size</InputLabel>
            <Select
              name="size"
              value={filters.size}
              label="Size"
              onChange={(e) => handleFilterChange("size", e.target.value)}
            >
              <MenuItem value="all">All Sizes</MenuItem>
              {sizes.map((s) => (
                <MenuItem key={s.id} value={s.label}>
                  {" "}
                  {s.label}{" "}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Stock Location</InputLabel>
            <Select
              name="stockId"
              value={filters.stockId}
              label="Stock Location"
              onChange={(e) => handleFilterChange("stockId", e.target.value)}
            >
              <MenuItem value="all">All Locations</MenuItem>
              {stockLocations.map((loc) => (
                <MenuItem key={loc.id} value={loc.id}>
                  {" "}
                  {loc.label}{" "}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={
              loading ? <CircularProgress size={16} /> : <IconSearch />
            }
            onClick={handleFilter}
            disabled={loading || variantLoading}
          >
            {loading ? "Filtering..." : "Filter"}
          </Button>

          {/* --- 4. Add the Clear Button --- */}
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<IconX />}
            onClick={handleClearFilters}
            disabled={loading || variantLoading || !isFilterActive} // Disable if loading or no filters
          >
            Clear
          </Button>
        </Box>

        {/* --- TABLE & PAGINATION --- */}
        <InventoryListTable
          items={inventoryItems}
          loading={loading}
          onEdit={handleOpenEditModal}
          // onDelete={handleDelete}
          products={products}
          sizes={sizes}
          stockLocations={stockLocations}
        />
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(pagination.total / pagination.size)}
            page={pagination.page}
            onChange={(_, value) =>
              setPagination((prev) => ({ ...prev, page: value }))
            }
            color="primary"
            disabled={loading}
          />
        </Box>
      </DashboardCard>

      {/* --- MODAL --- */}
      <InventoryFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveStock}
        item={editingItem}
        products={products}
        sizes={sizes}
        stockLocations={stockLocations}
      />
    </PageContainer>
  );
};

export default InventoryPage;