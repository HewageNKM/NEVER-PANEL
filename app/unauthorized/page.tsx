import React from 'react';

const Page = () => {
    return (
        <main style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f4f7f6"
        }}>
            <div style={{
                textAlign: "center",
                padding: "2rem",
            }}>
                <h1 style={{
                    color: "#ff0000",
                    fontSize: "2rem",
                    fontWeight: "bold"
                }}>Unauthorized</h1>
                <p style={{
                    color: "#333",
                    fontSize: "1.2rem",
                    fontWeight: "bold"
                }}>
                    You don&apos;t have permission to access this page.
                </p>
                <a href="/"
                   style={{
                          color: "#fff",
                          backgroundColor: "#333",
                          padding: "0.5rem 1rem",
                          borderRadius: "0.5rem",
                          textDecoration: "none",
                          display: "inline-block",
                          marginTop: "1rem"
                   }}
                >
                    Go to Login
                </a>
            </div>
        </main>
    );
};

export default Page;