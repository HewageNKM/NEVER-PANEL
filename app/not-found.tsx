import React from 'react';

const NotFound = () => {
    return (
        <main className="flex flex-col items-center justify-center w-full min-h-screen gap-4 text-center">
            <h1 className="text-4xl">404</h1>
            <h1 className="text-2xl">Page Not Found</h1>
            <p>Sorry, but the page you were trying to view does not exist.</p>
        </main>
    );
};

export default NotFound;