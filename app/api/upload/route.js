import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
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

    // Process files using upload_stream
    const uploadResults = await Promise.all(
      files.map(async (file) => { // Add async here
        return new Promise(async (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          // Stream the file data to Cloudinary
          const fileBuffer = Buffer.from(await file.arrayBuffer()); // await is now valid
          const stream = require('stream');
          const bufferStream = new stream.PassThrough();
          bufferStream.end(fileBuffer);
          bufferStream.pipe(uploadStream);
        });
      })
    );

    // Extract secure URLs
    const result = uploadResults.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));

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
