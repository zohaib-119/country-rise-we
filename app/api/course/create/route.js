import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';

export async function POST(req) {
    try {
        // Connect to the database
        const client = await dbConnect();

        // Parse the request body
        const { title, description, fee, start_date, end_date, category, thumbnail_url } = await req.json();

        // Validate the input
        if (!title || !description || !fee || !start_date || !end_date || !category || !thumbnail_url) {
            return new Response(
                JSON.stringify({ error: 'Missing fields in request body' }),
                { status: 400 }
            );
        }

        // Get the authenticated session
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            console.log('Unauthorized request to create course');
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401 }
            );
        }

        const creator_id = session.user.id;

        // Insert the course into the courses table
        const { data: course, error: courseError } = await client
            .from('courses')
            .insert({
                title,
                description,
                fee,
                start_date,
                end_date,
                category,
                thumbnail_url,
                creator_id,
            })
            .select();

        if (courseError) {
            console.error(courseError);
            return new Response(
                JSON.stringify({ error: 'Failed to create course' }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({ message: 'Course created successfully', course }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating course:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
    }
}
