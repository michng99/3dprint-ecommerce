/** @type {import('next').NextConfig} */
const nextConfig = {
    staticPageGenerationTimeout: 100,
    reactStrictMode: true,
    images: {
        domains: ['res.cloudinary.com']
    },
    async rewrites() {
        return [
            {
                source: '/api/:storeId/billboards/:billboardId',
                destination: '/api/billboards/:billboardId?store=:storeId',
            },
        ]
    },
}

module.exports = nextConfig
