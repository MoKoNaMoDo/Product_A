/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    // i18n configuration could go here for pages router, 
    // but for App Router we typically use middleware which we will set up separately if needed.
}

module.exports = nextConfig
