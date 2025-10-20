"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import { Order } from "@/interfaces";
import Image from "next/image";
import axios from "axios";
import { getToken } from "@/firebase/firebaseClient";

const OrderInvoice = ({ orderId }: { orderId: string }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
        fetchOrderById();
    }
  }, [orderId]);

  const fetchOrderById = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(`/api/v1/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const subtotal =
    order?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ||
    0;
  const totalItemDiscount =
    order?.items.reduce(
      (sum, item) => sum + item.discount * item.quantity,
      0
    ) || 0;
  const totalDiscount = (order?.discount || 0) + totalItemDiscount;
  const grandTotal =
    subtotal - totalDiscount + (order?.shippingFee || 0) + (order?.fee || 0);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Invoice...</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Order not found or still loading.
      </Typography>
    );
  }

  return (
    <>
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #printable-area, #printable-area * { visibility: visible; }
            #printable-area { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none; }
          }
        `}
      </style>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          backgroundColor: "grey.50",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ maxWidth: "800px", mx: "auto" }}>
          <Box
            className="no-print"
            sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
          >
            <Button
              variant="contained"
              startIcon={
                <Image alt="logo" src={"/logo.png"} width={20} height={20} />
              }
              onClick={handlePrint}
            >
              Print Invoice
            </Button>
          </Box>
          <Paper id="printable-area" sx={{ p: { xs: 3, sm: 6 } }}>
            {/* Header */}
            <Grid
              container
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={4}
            >
              <Grid item xs={12} sm={6}>
                <img
                  src={
                    "https://placehold.co/150x150/000000/FFFFFF?text=NEVERBE"
                  }
                  alt="Store Logo"
                  style={{
                    width: "120px",
                    height: "120px",
                    marginBottom: "1rem",
                    borderRadius: "50%",
                  }}
                />
                <Typography variant="h6" gutterBottom>
                  NEVERBE
                </Typography>
                <Typography variant="body2">
                  330/4/10 New Kandy Road, Delgoda
                </Typography>
                <Typography variant="body2">support@neverbe.lk</Typography>
                <Typography variant="body2">+94 70 520 8999</Typography>
                <Typography variant="body2">+94 72 924 9999</Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { sm: "right" } }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  INVOICE
                </Typography>
                <Typography variant="body1">
                  <strong>Order ID:</strong> #{order.orderId}
                </Typography>
                <Typography variant="body1">
                  <strong>Date:</strong> {formatDate(order.createdAt)}
                </Typography>
                <Typography variant="body1">
                  <strong>Payment:</strong> {order.paymentMethod}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong> {order.paymentStatus}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 4 }} />
            {/* Billing Details */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Bill To:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {order.customer?.name || "N/A"}
                </Typography>
                <Typography variant="body2">
                  {order.customer?.address || ""}, {order.customer?.city || ""}
                </Typography>
                <Typography variant="body2">
                  Postal Code: {order.customer?.zip || ""}
                </Typography>
                <Typography variant="body2">
                  Phone: {order.customer?.phone || ""}
                </Typography>
                <Typography variant="body2">
                  Email: {order.customer?.email || ""}
                </Typography>
              </Grid>
            </Grid>
            {/* Items Table */}
            <TableContainer
              sx={{
                mt: 4,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 1,
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "grey.100" }}>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Variant</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.variantName}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        Rs. {item.price.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        Rs. {item.discount.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        Rs.{" "}
                        {(
                          item.price * item.quantity -
                          item.discount * item.quantity
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Summary */}
            <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
              <Grid item xs={12} sm={5} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Subtotal:</Typography>
                  <Typography>Rs. {subtotal.toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Total Discount:</Typography>
                  <Typography>Rs. {totalDiscount.toFixed(2)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Shipping Fee:</Typography>
                  <Typography>
                    Rs. {(order.shippingFee || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Fee:</Typography>
                  <Typography>Rs. {(order.fee || 0).toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Grand Total:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    Rs. {grandTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {/* Footer */}
            <Box sx={{ mt: 6, textAlign: "center" }}>
              <Typography variant="body1" gutterBottom>
                Thank you for shopping with NEVERBE!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                www.neverbe.lk
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};
export default OrderInvoice;
