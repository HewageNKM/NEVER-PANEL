import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Stack, Typography } from "@mui/material";
import { ExpensesReport } from '@/interfaces';

const ExpenseReport = ({ setShow, expenseReport, show, date }: {
    setShow: () => void,
    expenseReport: ExpensesReport[],
    show: boolean,
    date: () => string
}) => {

    return (
        <Dialog open={show} fullWidth>
            <DialogContent>
                <Stack>
                    <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#3f51b5", fontSize: "2rem" }}>
                        Expense Report
                    </h2>
                    <Typography variant={"h6"} style={{ textAlign: "center", marginBottom: "20px", color: "#3f51b5" }}>
                        Date: {date()}
                    </Typography>
                </Stack>
                {expenseReport?.length === 0 ? (
                    <Typography variant="body1" style={{ textAlign: "center", color: "#f44336", marginTop: "20px" }}>
                        No expenses available for the selected date range.
                    </Typography>
                ) : (
                    expenseReport?.map((report) => (
                        <div key={report.type} style={{ marginBottom: "30px" }}>
                            <Typography
                                variant="h6"
                                style={{ textTransform: "capitalize", marginBottom: "10px", color: "#3f51b5" }}
                            >
                                {report.type}
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: "bold" }}>Category</TableCell>
                                        <TableCell style={{ fontWeight: "bold" }}>Total Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {report.data.length > 0 ? (
                                        <>
                                            {report.data.map((item) => (
                                                <TableRow key={item.for}>
                                                    <TableCell
                                                        sx={{
                                                            textTransform: "capitalize"
                                                        }}
                                                    >
                                                        {item.for}
                                                    </TableCell>
                                                    <TableCell>{item.amount.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "1.2em",
                                                        textAlign: "right"
                                                    }}
                                                >
                                                    Total:
                                                </TableCell>
                                                <TableCell
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "1.2em"
                                                    }}
                                                >
                                                    {report.data.reduce((total, item) => total + item.amount, 0).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2} style={{ textAlign: "center" }}>
                                                No data available.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    ))
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    onClick={() => setShow()}
                    style={{ fontWeight: "bold", fontSize: "1.2em" }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExpenseReport;
