import { promises as fs } from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', async () => {
            const buffer = Buffer.concat(chunks);
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

            // Ensure uploads directory exists
            await fs.mkdir(uploadsDir, { recursive: true });

            const fileName = `${Date.now()}-certificate.png`;
            const filePath = path.join(uploadsDir, fileName);

            // Save the file
            await fs.writeFile(filePath, buffer);

            // Return the URL path to the saved image
            res.status(200).json({ success: true, imageUrl: `/uploads/${fileName}` });
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
