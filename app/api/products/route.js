// code review 1.0 passed

import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(req) {
    try {
        const client = await dbConnect();

        // Get the session
        const session = await getServerSession(authOptions);

        if (!session) {
            console.log('unauthorized')
            return new Response(JSON.stringify({ error: 'unauthrorized' }), { status: 401 });
        }

        const user_id = session.user.id;

        // Fetch products with categories and images
        const { data: products, error: productsError } = await client
            .from("products")
            .select(`
                id, name, description, price, stock_quantity,
                product_images (public_id),
                categories (name)
            `)
            .eq("user_id", user_id)
            .is('deleted_at', null);

        if (productsError) {
            throw new Error(productsError.message);
        }

        // Format response
        const formattedProducts = products.map(product => ({
            id: product.id,
            title: product.name,
            description: product.description,
            images: product.product_images.map(image => image.public_id),
            price: product.price,
            category: product.categories?.name || "Uncategorized",
            stock_quantity: product.stock_quantity,
        }));
        
        return new Response(
            JSON.stringify({ products: formattedProducts, message: "Products fetched successfully" }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message || "Something went wrong" }),
            { status: 500 }
        );
    }
}
