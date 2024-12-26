// code review 1.0 passed

// Get Product for Edit Page and Update the Product APIs

import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(req, { params }) {
    try {
        const client = await dbConnect();

        // Get the product ID from the dynamic URL params
        const { product_id } = params;

        if (!product_id) {
            return new Response(
                JSON.stringify({ error: "Product ID is required" }),
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

        // Fetch product with categories and images
        const { data: product, error: productError } = await client
            .from("products")
            .select(`
                id, name, description, price, stock_quantity, category_id,
                product_images (url, public_id),
                categories (id)
            `)
            .eq("id", product_id)
            .eq("user_id", user_id)
            .is("deleted_at", null)
            .single(); // Ensure only one product is fetched

        if (productError) {
            console.error(productError);
            return new Response(
                JSON.stringify({ error: "Error fetching product" }),
                { status: 500 }
            );
        }

        if (!product) {
            return new Response(
                JSON.stringify({ error: "Product not found or does not belong to the user" }),
                { status: 404 }
            );
        }

        // Format response
        const formattedProduct = {
            id: product.id,
            title: product.name,
            description: product.description,
            images: product.product_images,
            price: product.price,
            category: product.categories?.id || null,
            stock_quantity: product.stock_quantity,
        };

        return new Response(
            JSON.stringify({ product: formattedProduct, message: "Product fetched successfully" }),
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

export async function PUT(req, { params }) {
    try {
        const client = await dbConnect();

        // Get the product ID from the dynamic URL params
        const { product_id } = params;

        if (!product_id) {
            return new Response(
                JSON.stringify({ error: "Product ID is required" }),
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

        // Parse the request body
        const body = await req.json();
        const { name, description, price, stock_quantity, category_id, images } = body;

        // Validate input
        if (!name || !description || !price || !stock_quantity || !category_id || !Array.isArray(images)) {
            return new Response(
                JSON.stringify({ error: "All fields are required and images must be an array" }),
                { status: 400 }
            );
        }

        // Ensure the product belongs to the user
        const { data: product, error: productError } = await client
            .from("products")
            .select("id, user_id")
            .eq("id", product_id)
            .eq("user_id", user_id)
            .is('deleted_at', null)
            .single();

        if (productError) {
            console.error(productError);
            return new Response(
                JSON.stringify({ error: "Error fetching product" }),
                { status: 500 }
            );
        }

        if (!product) {
            return new Response(
                JSON.stringify({ error: "Product not found or does not belong to the user" }),
                { status: 404 }
            );
        }

        // Update the product
        const { error: updateError } = await client
            .from("products")
            .update({
                name,
                description,
                price,
                stock_quantity,
                category_id,
            })
            .eq("id", product_id);

        if (updateError) {
            console.error(updateError);
            return new Response(
                JSON.stringify({ error: "Error updating product" }),
                { status: 500 }
            );
        }

        // Update product images
        // Clear old images first -> This does not delete the images from cloudinary. In future this would be handled
        const { error: deleteImagesError } = await client
            .from("product_images")
            .delete()
            .eq("product_id", product_id);

        if (deleteImagesError) {
            console.error(deleteImagesError);
            return new Response(
                JSON.stringify({ error: "Error clearing old images" }),
                { status: 500 }
            );
        }

        // Insert product images into the Supabase product_images table
        for (const image of images) {
            const { error: imageError } = await client.from('product_images').insert({
                url: image.url,
                public_id: image.public_id,
                product_id
            });

            if (imageError) {
                console.error(imageError);
                return new Response(JSON.stringify({ error: 'Failed to add images' }), { status: 500 });
            }
        }

        return new Response(
            JSON.stringify({ message: "Product updated successfully" }),
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
