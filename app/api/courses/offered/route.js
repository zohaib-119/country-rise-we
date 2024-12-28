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

        const user_id = session.user.id;

        // Fetch all courses created by the user
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
            .eq("creator_id", user_id)
            .is("deleted_at", null); // Exclude deleted courses

        if (coursesError) {
            console.error(coursesError);
            return new Response(
                JSON.stringify({ error: "Error fetching courses" }),
                { status: 500 }
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
