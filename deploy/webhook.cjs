const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 9000;
const SECRET = 'kCDYSsyb0IjVizKYDto2NHOguHEAvIDOPuaguF4LicBjD91oGWo15eIUiNPEP4CC';
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

    // Respond immediately to GitHub to avoid timeout
    res.status(200).send('Deployment started successfully');

    // Execute deployment commands in background
    // 1. Pull latest code
    // 2. Install dependencies (root & server)
    // 3. Build frontend
    // 4. Reload PM2 processes
    const commands = [
        'git pull',
        'npm install',
        'cd server && npm install && cd ..',
        'npm run build',
        'pm2 reload all'
    ];

    const deployScript = commands.join(' && ');

    exec(deployScript, { cwd: path.join(__dirname, '..') }, (err, stdout, stderr) => {
        if (err) {
            console.error('Deployment failed:', err);
            console.error(stderr);
            // We can't send a response here anymore, just log it
            return;
        }
        console.log('Deployment success:', stdout);
    });
});

app.listen(PORT, () => {
    console.log(`Webhook listener running on port ${PORT}`);
});
