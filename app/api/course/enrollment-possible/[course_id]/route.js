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
        const { data: enrollment, error: enrollmentError } = await client
            .from("user_course_possible_enrollments")
            .select("course_id")
            .eq("course_id", course_id)
            .eq("user_id", user_id)

        if (enrollmentError) {
            console.error(enrollmentError);
            return new Response(
                JSON.stringify({ error: "Error fetching enrollment status" }),
                { status: 500 }
            );
        }

        if (!enrollment || enrollment.length === 0) {
            return new Response(
                JSON.stringify({ enrollment_possible: false, message: "Enrollment not possible" }),
                { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({
                enrollment_possible: true,
                message: "Enrollment possible",
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
