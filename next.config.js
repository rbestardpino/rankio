/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["image.tmdb.org"],
  },
  pwa: {
    dest: "public",
    runtimeCaching,
    disable: process && process.env.NODE_ENV === "development",
  },
});
