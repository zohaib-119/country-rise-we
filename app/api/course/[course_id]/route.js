import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(req, { params }) {
    try {
        const client = await dbConnect();

        // Get the course ID from the dynamic URL params
        const { course_id } = await params;

        if (!course_id) {
            return new Response(
                JSON.stringify({ error: "Course ID is required" }),
                { status: 400 }
            );
        }

        // Get the session
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log("Unauthorized");
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        // Fetch the course
        const { data: course, error: courseError } = await client
            .from("courses")
            .select(`
                 id, title, description, fee, start_date, end_date, thumbnail_url, category, creator_id
            `)
            .eq("id", course_id)
            .is("deleted_at", null)
            .single(); // Ensure only one course is fetched

        if (courseError) {
            console.error(courseError);
            return new Response(
                JSON.stringify({ error: "Error fetching course" }),
                { status: 500 }
            );
        }

        if (!course) {
            return new Response(
                JSON.stringify({ error: "Course not found or does not belong to the user" }),
                { status: 404 }
            );
        }

        // Format response
        const formattedCourse = {
            id: course.id,
            title: course.title,
            description: course.description,
            fee: course.fee,
            startDate: course.start_date,
            endDate: course.end_date,
            thumbnail: course.thumbnail_url,
            category: course.category,
            creator_id: course.creator_id
        };

        return new Response(
            JSON.stringify({ course: formattedCourse, message: "Course fetched successfully" }),
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
