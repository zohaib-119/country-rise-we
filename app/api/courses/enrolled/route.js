import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(req) {
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

        const userId = session.user.id; // Assuming session contains the user's ID

        // Fetch IDs of courses the user is not enrolled in
        const { data: enrollments, error: enrollmentsError } = await client
            .from("enrollments")
            .select("course_id")
            .eq("user_id", userId)
            .is("unenrollment_date", null);

        if (enrollmentsError) {
            console.error(enrollmentsError);
            return new Response(
                JSON.stringify({ error: "Error fetching enrollments" }),
                { status: 500 }
            );
        }

        if (!enrollments || enrollments.length === 0) {
            return new Response(
                JSON.stringify({ courses: [], message: "No enrollments found" }),
                { status: 200 }
            );
        }

        const courseIds = enrollments.map(possibleEnrollment => possibleEnrollment.course_id);

        // Fetch courses in which the user is NOT enrolled and NOT the creator
        const { data: courses, error: coursesError } = await client
            .from("courses")
            .select(`
                id,
                title,
                description,
                fee,
                thumbnail_url,
                start_date,
                end_date,
                category
            `)
            .is("deleted_at", null) 
            .neq("creator_id", userId) 
            .in("id", courseIds);

        if (coursesError) {
            console.error(coursesError);
            return new Response(
                JSON.stringify({ error: "Error fetching courses" }),
                { status: 500 }
            );
        }

        if (!courses || courses.length === 0) {
            return new Response(
                JSON.stringify({ courses: [], message: "No courses enrolled in" }),
                { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({ courses, message: "Courses fetched successfully" }),
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
