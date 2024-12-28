import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';

export async function PATCH(req) {
    try {
        // Connect to the database
        const client = await dbConnect();

        // Parse the request body
        const { title, description, fee, start_date, end_date, category, thumbnail_url, course_id } = await req.json();

        // Validate the input
        if (!course_id || !title || !description || !fee || !start_date || !end_date || !category || !thumbnail_url) {
            return new Response(
                JSON.stringify({ error: 'Missing fields in request body' }),
                { status: 400 }
            );
        }

        // Get the authenticated session
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            console.log('Unauthorized request to update course');
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401 }
            );
        }

        const creator_id = session.user.id;

        // Check if the user owns the course
        const { data: courseData, error: courseFetchError } = await client
            .from('courses')
            .select('id, creator_id')
            .eq('id', course_id)
            .single();

        if (courseFetchError || !courseData) {
            console.error('Course not found or fetch error:', courseFetchError);
            return new Response(
                JSON.stringify({ error: 'Course not found' }),
                { status: 404 }
            );
        }

        if (courseData.creator_id !== creator_id) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized to update this course' }),
                { status: 403 }
            );
        }

        // Update the course in the courses table
        const { data: updatedCourse, error: updateError } = await client
            .from('courses')
            .update({
                title,
                description,
                fee,
                start_date,
                end_date,
                category,
                thumbnail_url,
                updated_at: new Date().toISOString(),
            })
            .eq('id', course_id)
            .select();

        if (updateError) {
            console.error('Error updating course:', updateError);
            return new Response(
                JSON.stringify({ error: 'Failed to update course' }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({ message: 'Course updated successfully', course: updatedCourse }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating course:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
    }
}
export async function DELETE(req) {
    try {
        // Connect to the database
        const client = await dbConnect();

        // Parse the request body
        const { course_id } = await req.json();

        // Validate input
        if (!course_id) {
            return new Response(
                JSON.stringify({ error: 'Missing course_id in request body' }),
                { status: 400 }
            );
        }

        // Get the authenticated session
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            console.log('Unauthorized request to delete course');
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401 }
            );
        }

        const creator_id = session.user.id;

        // Check if the user owns the course and if it's not already soft-deleted
        const { data: courseData, error: courseFetchError } = await client
            .from('courses')
            .select('id, creator_id, deleted_at')
            .eq('id', course_id)
            .single();

        if (courseFetchError || !courseData) {
            console.error('Course not found or fetch error:', courseFetchError);
            return new Response(
                JSON.stringify({ error: 'Course not found' }),
                { status: 404 }
            );
        }

        if (courseData.creator_id !== creator_id) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized to delete this course' }),
                { status: 403 }
            );
        }

        if (courseData.deleted_at !== null) {
            return new Response(
                JSON.stringify({ error: 'Course is already deleted' }),
                { status: 400 }
            );
        }

        // Perform soft delete by setting the deleted_at timestamp
        const { error: softDeleteError } = await client
            .from('courses')
            .update({
                deleted_at: new Date().toISOString(),
            })
            .eq('id', course_id);

        if (softDeleteError) {
            console.error('Error performing soft delete:', softDeleteError);
            return new Response(
                JSON.stringify({ error: 'Failed to delete course' }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({ message: 'Course soft-deleted successfully' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error soft-deleting course:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
    }
}
