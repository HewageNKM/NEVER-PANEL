import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { CashFlowReport } from "@/interfaces";
import {Stack, Typography} from "@mui/material";

const CashReport = ({ setShow, cash, show, date }: { setShow: () => void, cash: CashFlowReport[], show: boolean, date: () => string }) => {
    const totalCash = cash?.reduce((sum, report) => sum + report.total, 0);

    return (
        <Dialog open={show} fullWidth={{xs: true, sm: true, md: true, lg: true, xl: true}}>
            <DialogContent>
                <Stack>
                    <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#3f51b5", fontSize: "2rem" }}>
                        Cash Report
                    </h2>
                    <Typography variant={"h6"} style={{ textAlign: "center", marginBottom: "20px", color: "#3f51b5" }}>
                        Date: {date()}
                    </Typography>
                </Stack>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Method</TableCell>
                            <TableCell align="right" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Fee</TableCell>
                            <TableCell align="right" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cash?.map((report, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ textTransform: "capitalize", fontSize: "1rem" }}>{report.method}</TableCell>
                                <TableCell align="right" style={{ fontSize: "1rem" }}>{report.fee.toFixed(2)}</TableCell>
                                <TableCell align="right" style={{ fontSize: "1rem" }}>{report.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        {/* Row for total cash */}
                        <TableRow>
                            <TableCell colSpan={2} align="right" style={{ fontWeight: 'bold', fontSize: "1.1rem" }}>
                                Total Cash
                            </TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold', fontSize: "1.1rem" }}>
                                {totalCash?.toFixed(2)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
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

export default CashReport;
