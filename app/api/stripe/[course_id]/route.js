import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req, { params }) {
  // Get the course ID from the dynamic URL params
  const { course_id } = await params;

  if (!course_id) {
    console.log("Course ID is missing in the request");
    return new Response(
      JSON.stringify({ error: "Course ID is required" }),
      { status: 400 }
    );
  }

  // Get the session
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("Unauthorized access attempt");
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    );
  }

  const userId = session.user.id;

  const client = await dbConnect();

  // Fetch IDs of courses the user is not enrolled in
  const { data: possibleEnrollments, error: possibleEnrollmentsError } = await client
    .from("user_course_possible_enrollments")
    .select("course_id")
    .eq("user_id", userId)
    .eq("course_id", course_id)
    .single();

  if (possibleEnrollmentsError) {
    console.error("Error fetching possible enrollments:", possibleEnrollmentsError);
    return new Response(
      JSON.stringify({ error: "Error fetching possible enrollments" }),
      { status: 500 }
    );
  }

  if (!possibleEnrollments) {
    console.log("Course enrollment not allowed for user", { userId, course_id });
    return new Response(
      JSON.stringify({ error: "Cannot enroll in this course" }),
      { status: 404 }
    );
  }

  // Fetch the course
  const { data: course, error: courseError } = await client
    .from("courses")
    .select(`
       id, title, description, fee, start_date, end_date
    `)
    .eq("id", course_id)
    .is("deleted_at", null)
    .single();

  if (courseError) {
    console.error("Error fetching course:", courseError);
    return new Response(
      JSON.stringify({ error: "Error fetching course" }),
      { status: 500 }
    );
  }

  if (!course) {
    console.log("Course not found", { course_id });
    return new Response(
      JSON.stringify({ error: "Course not found" }),
      { status: 404 }
    );
  }

  if (course.end_date && new Date(course.end_date) < new Date()) {
    console.log("Attempt to enroll in an expired course", { course_id, end_date: course.end_date });
    return new Response(
      JSON.stringify({ error: "This course has ended, and you can no longer enroll." }),
      { status: 400 }
    );
  }

  try {
    // Create a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: Math.ceil(course.fee * 100), 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/course/enrollment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/course/get-enroll/${course_id}`,
      metadata: {
        user_id: userId,
        course_id: course_id,
        fee_paid: course.fee,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: checkoutSession.id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
