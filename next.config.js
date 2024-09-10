module.exports = {
  basePath: "/campaign",
  assetPrefix: "/campaign/",
  reactStrictMode: true,
  env: {
    LIFF_ID: process.env.LIFF_ID,
  },
  pageExtensions: ["mdx", "md", "jsx", "js", "tsx", "ts"],
};
