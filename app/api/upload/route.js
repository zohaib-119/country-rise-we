import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Ensure the request is multipart/form-data
    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'No files provided.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Process files
    const uploadResults = await Promise.all(
      files.map(async (file, index) => {
        const fileBuffer = Buffer.from(await file.arrayBuffer()); // Convert Blob to Buffer
        
        const uploadDir = path.join(__dirname, 'public', 'upload'); // Directory to save the file
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const tempPath = path.join(uploadDir, `temp-${index}-${file.name}`);
        
        // Write buffer to local file
        await fs.promises.writeFile(tempPath, fileBuffer);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(tempPath, { resource_type: 'auto' });

        // Delete the local file after upload
        await fs.promises.unlink(tempPath);

        return result;
      })
    );

    // Extract secure URLs
    const result = uploadResults.map((result) => {
        return {url: result.secure_url, public_id: result.public_id}
     });

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(req) {
    try {
      const { public_id } = await req.json(); // Get public ID from request body
  
      if (!public_id) {
        return new Response(
          JSON.stringify({ success: false, message: 'Public ID is required for deletion.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Delete from Cloudinary
      const result = await cloudinary.uploader.destroy(public_id);
  
      return new Response(
        JSON.stringify({ success: true, result }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Delete error:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
