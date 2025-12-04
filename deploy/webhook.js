const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 9000;
const SECRET = 'MY_SUPER_SECRET_KEY'; // Change this to match your GitHub Webhook Secret

app.use(express.json());

app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        return res.status(401).send('No signature found');
    }

    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

    if (signature !== digest) {
        return res.status(403).send('Invalid signature');
    }

    console.log('Webhook received. Starting deployment...');

    // Execute deployment commands
    // 1. Pull latest code
    // 2. Install dependencies (root & server)
    // 3. Build frontend
    // 4. Reload PM2 processes
    const commands = [
        'git pull',
        'npm install',
        'cd server && npm install',
        'npm run build',
        'pm2 reload all'
    ];

    const deployScript = commands.join(' && ');

    exec(deployScript, { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
        if (err) {
            console.error('Deployment failed:', err);
            console.error(stderr);
            return res.status(500).send('Deployment failed');
        }
        console.log('Deployment success:', stdout);
        res.status(200).send('Deployed successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Webhook listener running on port ${PORT}`);
});
