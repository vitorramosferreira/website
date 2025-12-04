const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const prisma = new PrismaClient();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Helper to download external images
async function downloadImage(url, req) {
    if (!url || !url.startsWith('http')) return url;

    // Check if it's already a local image (served by this server)
    const host = req.get('host');
    if (url.includes(host)) return url;

    try {
        console.log(`Downloading external image: ${url}`);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const extension = path.extname(url).split('?')[0] || '.jpg'; // Default to .jpg if no extension
        const filename = Date.now() + Math.floor(Math.random() * 1000) + extension;
        const uploadDir = 'uploads/';

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const filePath = path.join(uploadDir, filename);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                const fileUrl = `${req.protocol}://${host}/uploads/${filename}`;
                console.log(`Image saved to: ${fileUrl}`);
                resolve(fileUrl);
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Failed to download image ${url}:`, error.message);
        return url; // Return original URL if download fails
    }
}

// Helper to delete local image file
function deleteLocalImage(url) {
    if (!url) return;
    try {
        // Extract filename from URL
        // Format: http://host/uploads/filename.ext
        if (url.includes('/uploads/')) {
            const filename = url.split('/uploads/')[1];
            if (filename) {
                const filePath = path.join('uploads', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted local file: ${filePath}`);
                }
            }
        }
    } catch (error) {
        console.error(`Error deleting file for url ${url}:`, error);
    }
}

// POST /upload - Upload a single file
app.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the URL to access the file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// GET /projects - List all projects
app.get('/projects', async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        });
        // Parse images JSON string back to array
        const formattedProjects = projects.map(p => ({
            ...p,
            images: JSON.parse(p.images)
        }));
        res.json(formattedProjects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

// GET /projects/:id - Get one project
app.get('/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const project = await prisma.project.findUnique({
            where: { id: parseInt(id) }
        });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        res.json({
            ...project,
            images: JSON.parse(project.images)
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Error fetching project' });
    }
});

// POST /projects - Create new project
app.post('/projects', async (req, res) => {
    const { title, thumbnail, description, fullDescription, images } = req.body;

    // Basic validation
    if (!title || !thumbnail || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Process thumbnail
        const processedThumbnail = await downloadImage(thumbnail, req);

        // Process images array
        let processedImages = [];
        if (images && Array.isArray(images)) {
            processedImages = await Promise.all(images.map(img => downloadImage(img, req)));
        }

        const newProject = await prisma.project.create({
            data: {
                title,
                thumbnail: processedThumbnail,
                description,
                fullDescription: fullDescription || '',
                images: JSON.stringify(processedImages)
            }
        });
        res.status(201).json({
            ...newProject,
            images: JSON.parse(newProject.images)
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Error creating project', details: error.message });
    }
});

// PUT /projects/:id - Update project
app.put('/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { title, thumbnail, description, fullDescription, images } = req.body;
    try {
        // Process thumbnail
        const processedThumbnail = await downloadImage(thumbnail, req);

        // Process images array
        let processedImages = [];
        if (images && Array.isArray(images)) {
            processedImages = await Promise.all(images.map(img => downloadImage(img, req)));
        }

        const updatedProject = await prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                title,
                thumbnail: processedThumbnail,
                description,
                fullDescription,
                images: JSON.stringify(processedImages)
            }
        });
        res.json({
            ...updatedProject,
            images: JSON.parse(updatedProject.images)
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Error updating project' });
    }
});

// DELETE /projects/:id - Delete project
app.delete('/projects/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Received DELETE request for ID: ${id}`);
    try {
        // First, fetch the project to get image paths
        const project = await prisma.project.findUnique({
            where: { id: parseInt(id) }
        });

        if (project) {
            // Delete thumbnail
            deleteLocalImage(project.thumbnail);

            // Delete additional images
            const images = JSON.parse(project.images);
            if (Array.isArray(images)) {
                images.forEach(img => deleteLocalImage(img));
            }
        }

        const deleted = await prisma.project.delete({
            where: { id: parseInt(id) }
        });
        console.log('Deleted project:', deleted);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Error deleting project', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
