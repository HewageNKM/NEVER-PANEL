import React from "react";
import Link from "next/link";
import { Box } from "@mui/material";

const SettingCard = ({ title, link }: { title: string; link: string }) => {
    return (
        <Link href={link} passHref>
            <Box
                component="a"
                sx={{
                    width: "100px",
                    height: "100px",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    padding: "16px",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s",
                    textAlign: "center",
                    fontWeight: 600,
                    "&:hover": {
                        backgroundColor: "#f5f5f5",
                        transform: "scale(1.05)",
                    },
                }}
                className="text-gray-800"
            >
                {title}
            </Box>
        </Link>
    );
};

export default SettingCard;
