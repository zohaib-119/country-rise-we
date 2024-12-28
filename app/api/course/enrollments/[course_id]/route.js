import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../../auth/[...nextauth]/route";
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

        const user_id = session.user.id;

        // First, check if the course exists and if the creator_id matches the user_id
        const { data: course, error: courseError } = await client
            .from("courses")
            .select("title, start_date, end_date, creator_id")
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
                JSON.stringify({ error: "You are not authorized see enrollments for this course" }),
                { status: 403 }
            );
        }

        const { data: activeEnrollments, error: activeEnrollmentsError } = await client
            .from("active_enrollments")
            .select("*")
            .eq("course_id", course_id)

        if (activeEnrollmentsError) {
            return new Response(
                JSON.stringify({ error: "Error Fetching Enrollments" }),
                { status: 500 }
            );
        }

        const formattedActiveEnrollments = activeEnrollments.map(enrollment => ({
            id: enrollment.user_id,
            profile_pic: enrollment.profile_pic,
            name: enrollment.name,
            email: enrollment.email,
            phone: enrollment.phone,
            address: enrollment.address,
            fee_paid: enrollment.fee_paid,
            enrollment_date: enrollment.enrollment_date,
        }));

        return new Response(
            JSON.stringify({
                course: { title: course.title, start_date: course.start_date, end_date: course.end_date },
                active_enrollments: formattedActiveEnrollments,
                message: "Course and materials fetched successfully",
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
