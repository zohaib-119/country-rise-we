import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function POST(req) {
    try {
        const client = await dbConnect();

        // Get the session
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log("Unauthorized");
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const user_id = session.user.id;

        // Parse the request body for course material data and course_id
        const { course_id, title, url, public_id } = await req.json();

        if (!course_id || !title || !url || !public_id) {
            return new Response(
                JSON.stringify({ error: "Course ID, title, URL, and public ID are required" }),
                { status: 400 }
            );
        }

        // First, check if the course exists and if the creator_id matches the user_id
        const { data: course, error: courseError } = await client
            .from("courses")
            .select("creator_id")
            .eq("id", course_id)
            .single(); // Fetch single course to check the creator_id

        if (courseError) {
            console.error(courseError);
            return new Response(
                JSON.stringify({ error: "Error fetching course details" }),
                { status: 500 }
            );
        }

        if (!course) {
            return new Response(
                JSON.stringify({ error: "Course not found" }),
                { status: 404 }
            );
        }

        // Check if the user is the creator of the course
        if (course.creator_id !== user_id) {
            return new Response(
                JSON.stringify({ error: "You are not authorized to add materials to this course" }),
                { status: 403 }
            );
        }

        // Insert the course material into the course_materials table
        const { error: insertError } = await client
            .from("course_materials")
            .insert([
                {
                    course_id,
                    title,
                    url,
                    public_id, // Assuming public_id is part of the material
                },
            ])

        if (insertError) {
            console.error(insertError);
            return new Response(
                JSON.stringify({ error: "Error inserting course material" }),
                { status: 500 }
            );
        }

        // Return the inserted material
        return new Response(
            JSON.stringify({
                message: "Course material added successfully",
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: error.message || "Something went wrong" }),
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const client = await dbConnect();

        // Get the session
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log("Unauthorized");
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const user_id = session.user.id;

        // Parse the request body for course material data
        const { course_material_id } = await req.json();

        if (!course_material_id) {
            return new Response(
                JSON.stringify({ error: "Course Material ID is required" }),
                { status: 400 }
            );
        }

        // First, check if the course material exists and get the associated course_id
        const { data: material, error: materialError } = await client
            .from("course_materials")
            .select("course_id")
            .eq("id", course_material_id)
            .single();

        if (materialError) {
            console.error(materialError);
            return new Response(
                JSON.stringify({ error: "Error fetching course material" }),
                { status: 500 }
            );
        }

        if (!material) {
            return new Response(
                JSON.stringify({ error: "Course material not found" }),
                { status: 404 }
            );
        }

        // Check if the user is the creator of the course associated with this material
        const { data: course, error: courseError } = await client
            .from("courses")
            .select("creator_id")
            .eq("id", material.course_id)
            .single(); // Fetch single course to check the creator_id

        if (courseError) {
            console.error(courseError);
            return new Response(
                JSON.stringify({ error: "Error fetching course details" }),
                { status: 500 }
            );
        }

        if (!course) {
            return new Response(
                JSON.stringify({ error: "Course not found" }),
                { status: 404 }
            );
        }

        // Check if the user is the creator of the course
        if (course.creator_id !== user_id) {
            return new Response(
                JSON.stringify({ error: "You are not authorized to delete this material" }),
                { status: 403 }
            );
        }

        // Delete the course material
        const { derror: deleteError } = await client
            .from("course_materials")
            .delete()
            .eq("id", course_material_id)

        if (deleteError) {
            console.error(deleteError);
            return new Response(
                JSON.stringify({ error: "Error deleting course material" }),
                { status: 500 }
            );
        }

        // Return a success response
        return new Response(
            JSON.stringify({
                message: "Course material deleted successfully"
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: error.message || "Something went wrong" }),
            { status: 500 }
        );
    }
}
