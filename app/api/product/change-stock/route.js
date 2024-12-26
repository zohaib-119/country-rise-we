// code review 1.0 passed

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';

export async function PATCH(req) {
    try {
        // Connect to Supabase
        const client = await dbConnect();

        // Get the session
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log('Unauthorized')
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const user_id = session.user.id;

        // Parse the request body
        const { product_id, stock_quantity } = await req.json();

        // Validate the input
        if (!product_id || !stock_quantity) {
            return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
        }

        // Verify the ownership of the product
        const { data: product, error: productError } = await client
            .from('products')
            .select('user_id')
            .eq('id', product_id)
            .is('deleted_at', null)
            .single();

        if (productError) {
            console.error('Failed to fetch product:', productError);
            return new Response(JSON.stringify({ error: 'Failed to fetch product details' }), { status: 500 });
        }

        if(!product) {
            return new Response(JSON.stringify({ error: 'Product not found' }), { status: 403 });
        }

        if (product.user_id !== user_id) {
            return new Response(JSON.stringify({ error: 'You are not authorized to update this product' }), { status: 403 });
        }

        // Update the stock
        const { error } = await client
            .from('products')
            .update({ stock_quantity: stock_quantity })
            .eq('id', product_id);

        if (error) {
            console.error('Failed to update stock:', error);
            return new Response(JSON.stringify({ error: 'Failed to update stock' }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: 'Stock updated successfully', product_id, stock_quantity }), { status: 200 });

    } catch (error) {
        console.error('Internal server error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
