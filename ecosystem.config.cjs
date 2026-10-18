module.exports = {
  apps: [
    {
      name: "tabchurch",
      script: "npm",
      args: "start",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "800M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
