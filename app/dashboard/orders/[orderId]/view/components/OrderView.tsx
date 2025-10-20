"use client";

import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  CircularProgress,
  Box,
} from "@mui/material";
import { Order } from "@/interfaces";
import { useSnackbar } from "@/contexts/SnackBarContext";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { getToken } from "@/firebase/firebaseClient";

const OrderView = ({ orderId }: { orderId: string }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const { showNotification } = useSnackbar();
  const { currentUser } = useAppSelector((state) => state.authSlice);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) fetchOrder();
  }, [currentUser]);

  const fetchOrder = async () => {
    try {
      setLoadingOrder(true);
      const token = await getToken();
      const res = await axios.get(`/api/v1/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (error: any) {
      console.error(error);
      showNotification(error.message, "error");
    } finally {
      setLoadingOrder(false);
    }
  };

  // --- 💰 Derived Calculations ---
  const subtotal =
    order?.items.reduce(
      (sum, item) => sum + item.quantity * (item.price - item.discount),
      0
    ) || 0;
  const discount = order?.discount || 0;
  const fee = order?.fee || 0;
  const shippingFee = order?.shippingFee || 0;
  const total = subtotal - discount + fee + shippingFee;

  if (loadingOrder) {
    return (
      <Box className="flex justify-center items-center w-full h-64">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        className="mb-4"
      >
        <Link
          underline="hover"
          color="inherit"
          onClick={() => router.push("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => router.push("/dashboard/orders")}
          style={{ cursor: "pointer" }}
        >
          Orders
        </Link>
        <Typography color="text.primary">#{order?.orderId}</Typography>
        <Typography color="text.primary">View</Typography>
      </Breadcrumbs>

      <Stack spacing={3} marginTop={3}>
        {/* Header */}
        <Stack direction={"row"} spacing={1}>
          <Typography variant="h5" className="font-semibold text-gray-800">
            Order #{order?.orderId}
          </Typography>
          <Chip
            label={order?.status?.toUpperCase() || "UNKNOWN"}
            color={
              order?.status?.toLowerCase() === "complete"
                ? "success"
                : order?.status?.toLowerCase() === "processing"
                ? "warning"
                : "default"
            }
          />
        </Stack>

        {/* 🧾 Order Summary */}
        <Card variant="outlined" className="shadow-sm border border-gray-100">
          <CardContent>
            <Typography variant="h6" className="font-medium text-gray-800 mb-4">
              Order Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <span className="font-semibold">Payment Method:</span>{" "}
                  {order?.paymentMethod || "—"}
                </Typography>
                <Typography>
                  <span className="font-semibold">Payment Status:</span>{" "}
                  <Chip
                    size="small"
                    label={order?.paymentStatus?.toUpperCase() || "UNKNOWN"}
                    color={
                      order?.paymentStatus?.toLowerCase() === "paid"
                        ? "success"
                        : order?.paymentStatus?.toLowerCase() === "pending"
                        ? "warning"
                        : order?.paymentStatus?.toLowerCase() === "failed"
                        ? "error"
                        : order?.paymentStatus?.toLowerCase() === "refunded"
                        ? "warning"
                        : "default"
                    }
                  />
                </Typography>
                <Typography>
                  <span className="font-semibold">From:</span>{" "}
                  {order?.from || "—"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <span className="font-semibold">Created:</span>{" "}
                  {order?.createdAt}
                </Typography>
                <Typography>
                  <span className="font-semibold">Updated:</span>{" "}
                  {order?.updatedAt}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 👤 Billing & Shipping */}
        <Grid container spacing={2}>
          {order?.customer && (
            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                className="shadow-sm border border-gray-100"
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    className="font-medium text-gray-800 mb-3"
                  >
                    Billing Details
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Name:</span>{" "}
                    {order?.customer.name}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Phone:</span>{" "}
                    {order?.customer.phone}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Address:</span>{" "}
                    {order?.customer.address}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">City:</span>{" "}
                    {order?.customer.city}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Postal Code:</span>{" "}
                    {order?.customer.zip}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {order?.customer && (
            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                className="shadow-sm border border-gray-100"
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    className="font-medium text-gray-800 mb-3"
                  >
                    Shipping Details
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Name:</span>{" "}
                    {order?.customer.shippingName}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Phone:</span>{" "}
                    {order?.customer.shippingPhone}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Address:</span>{" "}
                    {order?.customer.shippingAddress}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">City:</span>{" "}
                    {order?.customer.shippingCity}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">Postal Code:</span>{" "}
                    {order?.customer.shippingZip}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* 🧮 Items */}
        <Card variant="outlined" className="shadow-sm border border-gray-100">
          <CardContent>
            <Typography variant="h6" className="font-medium text-gray-800 mb-3">
              Items
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Variant</TableCell>
                    <TableCell align="right">Size</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order?.items.map((item, i) => (
                    <TableRow key={i} hover>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.variantName}</TableCell>
                      <TableCell align="right">{item.size}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        Rs.{item.price.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        Rs.{item.discount.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        Rs.
                        {(item.quantity * (item.price - item.discount)).toFixed(
                          2
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Totals */}
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="right"
                      className="font-semibold"
                    >
                      Subtotal
                    </TableCell>
                    <TableCell align="right">
                      Rs.{subtotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} align="right">
                      Discount
                    </TableCell>
                    <TableCell align="right">
                      - Rs.{discount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} align="right">
                      Shipping Fee
                    </TableCell>
                    <TableCell align="right">
                      Rs.{shippingFee.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} align="right">
                      Other Fee
                    </TableCell>
                    <TableCell align="right">Rs.{fee.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} align="right" className="font-bold">
                      Grand Total
                    </TableCell>
                    <TableCell
                      align="right"
                      className="font-bold text-primary-600"
                    >
                      Rs.{total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* 💳 Payments */}
        {order?.paymentReceived && order.paymentReceived.length > 0 && (
          <Card variant="outlined" className="shadow-sm border border-gray-100">
            <CardContent>
              <Typography
                variant="h6"
                className="font-medium text-gray-800 mb-3"
              >
                Payments
              </Typography>
              <Divider className="mb-3" />
              <TableContainer component={Paper} variant="outlined">
                <Table
                  size="small"
                  sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  <TableHead className="bg-gray-50">
                    <TableRow>
                      <TableCell
                        sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
                      >
                        Payment ID
                      </TableCell>
                      <TableCell
                        sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
                      >
                        Method
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
                      >
                        Amount
                      </TableCell>
                      <TableCell>Card</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.paymentReceived.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell
                          sx={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {p.id}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {p.paymentMethod}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderRight: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Rs.{p.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{p.cardNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Stack>
    </motion.div>
  );
};

export default OrderView;
