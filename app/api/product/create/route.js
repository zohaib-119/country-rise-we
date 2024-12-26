// code review 1.0 passed

import { getServerSession } from 'next-auth/next'; 
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';

export async function POST(req) {
    try {
        // Connect to Supabase
        const client = await dbConnect();

        // Parse the request body
        const { name, description, price, stock_quantity, category_id, user_id, images } = await req.json();

        // Validate the input
        if (!name || !description || !price || !stock_quantity || !category_id || !images || !user_id) {
            return new Response(JSON.stringify({ error: 'Missing Fields in request body' }), { status: 400 });
        }

        // Get the session (no `res` required for App Router)
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log('unauthentic')
            return new Response(JSON.stringify({ error: 'unauthenticated' }), { status: 401 });
        }

        const user = session.user;

        if (user.id !== user_id) {
            console.log('unauthorized')
            return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
        }

        // Insert the product into the Supabase products table
        const { data: product, error: productError } = await client.from('products').insert({
            name,
            description,
            price,
            stock_quantity,
            category_id,
            user_id
        }).select();

        if (productError) {
            console.error(productError);
            return new Response(JSON.stringify({ error: 'Failed to add product' }), { status: 500 });
        }

        console.log(product);

        const product_id = product[0].id;

        // Insert product images into the Supabase product_images table
        for (const image of images) {
            const { error: imageError } = await client.from('product_images').insert({
                url: image.url,
                public_id: image.public_id,
                product_id
            });

            if (imageError) {
                console.error(imageError);
                return new Response(JSON.stringify({ error: 'Failed to add images' }), { status: 500 });
            }
        }

        return new Response(JSON.stringify({ message: 'Product added successfully', product_id }), { status: 201 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
