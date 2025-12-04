module.exports = {
    apps: [
        {
            name: "backend",
            script: "./server/index.js",
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
