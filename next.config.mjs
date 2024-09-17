/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
        remotePatterns:[
            {
                hostname: 'firebasestorage.googleapis.com',
                protocol: 'https',
            }
        ]
    }
};

export default nextConfig;
