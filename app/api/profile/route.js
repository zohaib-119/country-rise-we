// working as expected

import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(req) {
    try {
        const client = await dbConnect();

        // Get the session
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(
                JSON.stringify({ error: "unauthorized" }),
                { status: 401 }
            );
        }

        const user_id = session.user.id;

        // Fetch user profile
        const { data: profile, error: profileError } = await client
            .from("users")
            .select(
                `
                name, 
                email,
                phone,
                address,
                profile_pic,
                city,
                state
                `
            )
            .eq("id", user_id)
            .single();

        if (profileError) {
            throw new Error(profileError.message);
        }

        return new Response(
            JSON.stringify({ profile: profile, message: "Profile fetched successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        return new Response(
            JSON.stringify({ error: error.message || "Something went wrong" }),
            { status: 500 }
        );
    }
}

export async function PATCH(req) {
    try {
        const client = await dbConnect();

        // Get the session
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(
                JSON.stringify({ error: "unauthorized" }),
                { status: 401 }
            );
        }

        const user_id = session.user.id;

        // Parse the request body to get the updated profile data
        const { name, phone, address, profile_pic, city, state } = await req.json();

        // Update the user's profile in the database
        const { data: updatedProfile, error: updateError } = await client
            .from("users")
            .update({
                name,
                phone,
                address,
                profile_pic,
                city,
                state
            })
            .eq("id", user_id)
            .select()
            .single();

        if (updateError) {
            throw new Error(updateError.message);
        }

        return new Response(
            JSON.stringify({ profile: updatedProfile, message: "Profile updated successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating profile:", error.message);
        return new Response(
            JSON.stringify({ error: error.message || "Something went wrong" }),
            { status: 500 }
        );
    }
}