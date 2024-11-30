/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    output:"standalone",
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
