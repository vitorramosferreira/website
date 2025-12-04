module.exports = {
    apps: [
        {
            name: "backend",
            cwd: "./server",
            script: "index.js",
            env: {
                NODE_ENV: "production",
                PORT: 3000
            }
        },
        {
            name: "webhook",
            script: "./deploy/webhook.cjs",
            env: {
                PORT: 9000
            }
        }
    ]
};
