import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/route";
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

        const { data: products, error: productsError } = await client
            .from("product_overview")
            .select("*")
            .eq("user_id", user_id)

        if (productsError) {
            throw new Error(productsError.message);
        }

        // Format the products
        const formattedProducts = products.map(product => ({
            id: product.product_id,
            name: product.product_name,
            image: product.image_url || null,
            totalSales: product.total_sales || 0,
            totalReviews: parseInt(product.total_reviews, 10) || 0,
            avgRating: parseFloat(product.avg_rating || 5).toFixed(1),
            price: parseFloat(product.price),
        }));

        return new Response(
            JSON.stringify({ products: formattedProducts, message: "Products fetched successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.log('pran bhen yawa')
        return new Response(
            JSON.stringify({ error: error.message || "Something went wrong" }),
            { status: 500 }
        );
    }
}
