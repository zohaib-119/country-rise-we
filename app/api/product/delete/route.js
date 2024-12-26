// code review 1.0 passed

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';

export async function DELETE(req) {
    try {
        // Connect to Supabase
        const client = await dbConnect();

        // Parse the request body
        const { product_id } = await req.json();

        // Validate the input
        if (!product_id) {
            return new Response(JSON.stringify({ error: 'product_id is required' }), { status: 400 });
        }

        // Get the session
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log('Unauthorized access attempt');
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const user_id = session.user.id;

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

        if (!product) {
            return new Response(JSON.stringify({ error: 'Product Not Found' }), { status: 403 });
        }

        if (product.user_id !== user_id) {
            return new Response(JSON.stringify({ error: 'You are not authorized to delete this product' }), { status: 403 });
        }

        const { error: deleteError } = await client
            .from('products')
            .update({ deleted_at: new Date() })
            .eq('id', product_id)

        if (deleteError) {
            console.error('Failed to delete product:', error);
            return new Response(JSON.stringify({ error: 'Failed to delete product' }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: 'Product deleted successfully' }), { status: 200 });

    } catch (error) {
        console.error('Internal server error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
