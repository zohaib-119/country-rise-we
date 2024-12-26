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

        // Fetch sales overview stats for the user
        const { data: stats, error: statsError } = await client
            .from("sales_overview")
            .select(
                `
                number_of_customers,
                number_of_products_sold,
                most_sold_product,
                revenue_generated,
                total_reviews,
                average_rating
                `
            )
            .eq("user_id", user_id)
            .single(); // Fetch a single row

        if (statsError) {
            throw new Error(statsError.message);
        }

        // Format the response
        const formattedStats = {
            numberOfCustomers: stats.number_of_customers || 0,
            numberOfProductsSold: stats.number_of_products_sold || 0,
            mostSoldProduct: stats.most_sold_product || "N/A",
            revenueGenerated: stats.revenue_generated || 0,
            totalReviews: stats.total_reviews || 0,
            averageRating: parseFloat(stats.average_rating || 5).toFixed(1),
        };

        return new Response(
            JSON.stringify({ stats: formattedStats, message: "Stats fetched successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching sales overview:", error.message);
        return new Response(
            JSON.stringify({ error: error.message || "Something went wrong" }),
            { status: 500 }
        );
    }
}
