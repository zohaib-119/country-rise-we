// code review 1.0 passed

import dbConnect from '@/lib/dbConnect'; 

export async function GET(req) {
    try {
        // Connect to the database
        const client = await dbConnect();

        // Fetch categories from the database
        const { data: categories, error } = await client
            .from('categories')
            .select('id, name');

        if (error) {
            // Log the error for debugging
            console.error('Error fetching categories: ', error);
            throw new Error('Error fetching categories');
        }

        // Send success response
        return new Response(
            JSON.stringify({ categories, message: 'Categories fetched successfully' }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
}
