module.exports = {
  apps: [
    {
      name: 'vinhomes.phuoctri.com',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: '/Users/lephuocthanh/development/vinhomes.phuoctri',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_SITE_URL: 'https://vinhomes.phuoctri.com',
      },
    },
  ],
};
