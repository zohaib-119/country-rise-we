// working fine for now

import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(req, { params }) {
    try {
        const client = await dbConnect();

        // Get the course ID from the dynamic URL params
        const { course_id } = params;

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

        // Fetch the course details
        const { data: course, error: courseError } = await client
            .from("courses")
            .select("id, title, description, creator_id")
            .eq("id", course_id)
            .is("deleted_at", null)
            .single();

        if (courseError) {
            console.error(courseError);
            return new Response(
                JSON.stringify({ error: "Error fetching course" }),
                { status: 500 }
            );
        }

        if (!course) {
            return new Response(
                JSON.stringify({ error: "Course not found" }),
                { status: 404 }
            );
        }

        // Fetch the course materials
        const { data: courseMaterials, error: materialsError } = await client
            .from("course_materials")
            .select("id, title, url, created_at")
            .eq("course_id", course_id)

        if (materialsError) {
            console.error(materialsError);
            return new Response(
                JSON.stringify({ error: "Error fetching course materials" }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({
                course: course,
                course_materials: courseMaterials,
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
