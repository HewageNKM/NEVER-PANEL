import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { SalesReport } from "@/interfaces";
import { Stack } from "@mui/material";

const SaleReport = ({
                        show,
                        setShow,
                        sales,
                        date,
                    }: {
    show: boolean;
    setShow: () => void;
    sales: {
        data: SalesReport[];
        totalDiscount: number;
        totalOrders: number;
    };
    date: () => string;
}) => {
    let totalSales = 0;
    let totalProfit = 0;
    let totalQuantity = 0;
    let totalCost = 0;

    return (
        <Dialog open={show} fullScreen>
            <DialogContent>
                <Stack>
                    <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#3f51b5", fontSize: "1.8rem" }}>
                        Sales Report
                    </h2>
                    <h4 style={{ textAlign: "center", marginBottom: "20px", color: "#3f51b5", fontSize: "1rem" }}>
                        Date: {date()}
                    </h4>
                </Stack>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3f51b5", fontSize: "1.1em" }}>
                                Item ID
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3f51b5", fontSize: "1.1em" }}>
                                Variant ID
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3f51b5", fontSize: "1.1em" }}>
                                Variant
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3f51b5", fontSize: "1.1em" }}>
                                Size
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3f51b5", fontSize: "1.1em" }}>
                                Manufacturer
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3f51b5", fontSize: "1.1em" }}>
                                Bought Price
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3f51b5", fontSize: "1.1em" }}>
                                Sold Price
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3f51b5", fontSize: "1.1em" }}>
                                Quantity Sold
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3f51b5", fontSize: "1.1em" }}>
                                Total Sold
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3f51b5", fontSize: "1.1em" }}>
                                Total Cost
                            </TableCell>
                            <TableCell style={{ fontWeight: "bold", textTransform: "uppercase", color: "#3f51b5", fontSize: "1.1em" }}>
                                Total Profit
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sales?.data?.map((category, categoryIndex) => {
                            let categorySales = 0;
                            let categoryProfit = 0;
                            let categoryQuantity = 0;
                            let categoryCost = 0;

                            return (
                                <React.Fragment key={categoryIndex}>
                                    <TableRow style={{ backgroundColor: "#e3f2fd" }}>
                                        <TableCell colSpan={11} style={{ fontWeight: "bold", fontSize: "1.2em", textTransform: "uppercase", color: "#0d47a1" }}>
                                            {category.type}
                                        </TableCell>
                                    </TableRow>
                                    {category.data.map((item, itemIndex) => {
                                        let itemSales = 0;
                                        let itemProfit = 0;
                                        let itemQuantity = 0;
                                        let itemCost = 0;

                                        return (
                                            <React.Fragment key={itemIndex}>
                                                <TableRow>
                                                    <TableCell colSpan={11} style={{ fontWeight: "bold", fontSize: "1.1em", paddingLeft: "20px", backgroundColor: "#f1f8e9", color: "#388e3c", textTransform: "capitalize" }}>
                                                        {item.itemName}
                                                    </TableCell>
                                                </TableRow>
                                                {item.data.map((variant) =>
                                                    variant.data.map((sizeDetail, index) => {
                                                        const salesAmount = sizeDetail.soldPrice * sizeDetail.quantity;
                                                        const profitAmount = (sizeDetail.soldPrice - sizeDetail.boughtPrice) * sizeDetail.quantity;
                                                        const costAmount = sizeDetail.boughtPrice * sizeDetail.quantity;

                                                        totalSales += salesAmount;
                                                        totalProfit += profitAmount;
                                                        totalQuantity += sizeDetail.quantity;
                                                        totalCost += costAmount;

                                                        itemSales += salesAmount;
                                                        itemProfit += profitAmount;
                                                        itemQuantity += sizeDetail.quantity;
                                                        itemCost += costAmount;

                                                        categorySales += salesAmount;
                                                        categoryProfit += profitAmount;
                                                        categoryQuantity += sizeDetail.quantity;
                                                        categoryCost += costAmount;

                                                        return (
                                                            <TableRow key={index} style={{ textTransform: "capitalize" }}>
                                                                <TableCell style={{ textTransform: "uppercase" }}>{item.itemId}</TableCell>
                                                                <TableCell style={{ textTransform: "uppercase" }}>{variant.variantId}</TableCell>
                                                                <TableCell>{variant.variantName}</TableCell>
                                                                <TableCell>{sizeDetail.size}</TableCell>
                                                                <TableCell>{item.manufacturer}</TableCell>
                                                                <TableCell>{sizeDetail.boughtPrice.toFixed(2)}</TableCell>
                                                                <TableCell>{sizeDetail.soldPrice.toFixed(2)}</TableCell>
                                                                <TableCell>{sizeDetail.quantity}</TableCell>
                                                                <TableCell>{salesAmount.toFixed(2)}</TableCell>
                                                                <TableCell>{costAmount.toFixed(2)}</TableCell>
                                                                <TableCell>{profitAmount.toFixed(2)}</TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                )}
                                                <TableRow style={{ backgroundColor: "#e8f5e9", fontWeight: "bold" }}>
                                                    <TableCell colSpan={7} align="right" style={{ color: "#388e3c" }}>
                                                        {item.itemName} Totals
                                                    </TableCell>
                                                    <TableCell>{itemQuantity}</TableCell>
                                                    <TableCell>{itemSales.toFixed(2)}</TableCell>
                                                    <TableCell>{itemCost.toFixed(2)}</TableCell>
                                                    <TableCell>{itemProfit.toFixed(2)}</TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        );
                                    })}
                                    <TableRow style={{ backgroundColor: "#bbdefb", fontWeight: "bold" }}>
                                        <TableCell colSpan={7} align="right" style={{ color: "#0d47a1" }}>
                                            {category.type.toLocaleUpperCase()} Totals
                                        </TableCell>
                                        <TableCell>{categoryQuantity}</TableCell>
                                        <TableCell>{categorySales.toFixed(2)}</TableCell>
                                        <TableCell>{categoryCost.toFixed(2)}</TableCell>
                                        <TableCell>{categoryProfit.toFixed(2)}</TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                        <TableRow style={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
                            <TableCell colSpan={7} align="right" style={{ textTransform: "uppercase", color: "#d32f2f", fontSize: "1.1em" }}>
                                Totals
                            </TableCell>
                            <TableCell>{totalQuantity}</TableCell>
                            <TableCell>{totalSales.toFixed(2)}</TableCell>
                            <TableCell>{totalCost.toFixed(2)}</TableCell>
                            <TableCell>{(totalProfit - sales?.totalDiscount).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                            <TableCell colSpan={7} align="right" style={{ color: "#3f51b5", fontSize: "1.1em" }}>
                                Total Orders
                            </TableCell>
                            <TableCell colSpan={4} style={{ textAlign: "center", color: "#3f51b5", fontSize: "1.1em" }}>
                                {sales?.totalOrders}
                            </TableCell>
                        </TableRow>
                        <TableRow style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                            <TableCell colSpan={7} align="right" style={{ color: "#3f51b5", fontSize: "1.1em" }}>
                                Total Discount
                            </TableCell>
                            <TableCell colSpan={4} style={{ textAlign: "center", color: "#3f51b5", fontSize: "1.1em" }}>
                                {sales?.totalDiscount.toFixed(2)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" type="button" color="primary" onClick={setShow} style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SaleReport;
