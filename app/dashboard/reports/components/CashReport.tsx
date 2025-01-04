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
import {Stack} from "@mui/material";

const CashReport = ({ setShow, cash, show, date}: { setShow: () => void, cash: CashFlowReport[], show: boolean, date:()=> string }) => {
    const totalCash = cash?.reduce((sum, report) => sum + report.total, 0);

    return (
        <Dialog open={show}>
            <DialogContent>
                <Stack>
                    <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#3f51b5", fontSize: "1.8rem" }}>
                        Cash Report
                    </h2>
                    <h4 style={{ textAlign: "center", marginBottom: "20px", color: "#3f51b5", fontSize: "1rem" }}>
                        Date: {date()}
                    </h4>
                </Stack>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Method</strong></TableCell>
                            <TableCell align="right"><strong>Fee</strong></TableCell>
                            <TableCell align="right"><strong>Total</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cash?.map((report, index) => (
                            <TableRow key={index}>
                                <TableCell style={{textTransform:"capitalize", fontSize:".9rem"}}>{report.method}</TableCell>
                                <TableCell align="right">{report.fee.toFixed(2)}</TableCell>
                                <TableCell align="right">{report.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        {/* Row for total cash */}
                        <TableRow>
                            <TableCell colSpan={2} align="right" style={{ fontWeight: 'bold' }}>
                                Total Cash
                            </TableCell>
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>
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
                    style={{ fontWeight: "bold", fontSize: "1.1em" }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CashReport;
