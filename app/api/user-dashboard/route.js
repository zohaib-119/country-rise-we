import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

// {
//     name: "John Doe",
//     totalProducts: 10,
//     totalCustomers: 25,
//     totalCourses: 5,
//     enrollments: 100,
//     totalRevenue: 15000,
//     totalSales: 120,
//     totalStock: 300,
//     products: [
//       { name: "Product A", stock: 30, sales: 50 },
//       { name: "Product B", stock: 20, sales: 40 },
//       { name: "Product C", stock: 15, sales: 25 },
//     ],
//     courses: [
//       { title: "Course 1", enrollments: 30 },
//       { title: "Course 2", enrollments: 25 },
//       { title: "Course 3", enrollments: 45 },
//     ],
// }

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
        
        // Fetch course details
        const { data: courses, error: coursesError } = await client
            .from("course_enrollment_summary")
            .select("course_name, number_of_enrollment, revenue_generated")
            .eq("user_id", user_id);

        if (coursesError) {
            throw new Error(coursesError.message);
        }

        // Fetch product details
        const { data: products, error: productsError } = await client
            .from("product_overview")
            .select("product_name, stock_quantity, total_sales")
            .eq("user_id", user_id);

        if (productsError) {
            throw new Error(productsError.message);
        }

        // Fetch sales overview stats for the user
        const { data: stats, error: statsError } = await client
            .from("sales_overview")
            .select(
                `
                user_name,
                number_of_customers,
                number_of_products_sold,
                revenue_generated,
                average_rating
                `
            )
            .eq("user_id", user_id)
            .single(); // Fetch a single row

        if (statsError) {
            throw new Error(statsError.message);
        }

        // Calculate total revenue from courses
        const totalCoursesRevenue = courses.reduce((acc, course) => {
            return acc + course.revenue_generated; // Sum revenue from all courses
        }, 0);

        // Calculate the total revenue by combining product and course revenue
        const totalRevenue = stats.revenue_generated + totalCoursesRevenue;

        // Format the user dashboard response
        const user_dashboard = {
            name: stats.user_name,
            totalProducts: products.length,
            totalCustomers: stats.number_of_customers,
            totalCourses: courses.length,
            enrollments: courses.reduce((acc, course) => acc + course.number_of_enrollment, 0), // Total enrollments
            totalRevenue: totalRevenue, // Total revenue from both products and courses
            totalSales: stats.number_of_products_sold, // Total sales of products
            totalStock: products.reduce((acc, product) => acc + product.stock_quantity, 0), // Total stock quantity
            products: products.map((product) => ({
                name: product.product_name,
                stock: product.stock_quantity,
                sales: product.total_sales,
            })),
            courses: courses.map((course) => ({
                title: course.course_name,
                enrollments: course.number_of_enrollment,
            })),
        };

        return new Response(
            JSON.stringify({ user_dashboard, message: "Stats fetched successfully" }),
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
