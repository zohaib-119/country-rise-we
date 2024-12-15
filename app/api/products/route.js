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
                id, name, description, price, stock_quantity, category_id,
                product_images (url),
                categories (name)
            `)
            .eq("user_id", user_id);

        if (productsError) {
            throw new Error(productsError.message);
        }

        console.log(products);

        // Format response
        const formattedProducts = products.map(product => ({
            id: product.id,
            title: product.name,
            description: product.description,
            images: product.product_images.map(image => image.url),
            price: product.price,
            category: product.categories?.name || "Uncategorized",
            stock_quantity: product.stock_quantity,
        }));

        console.log(formattedProducts)

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
