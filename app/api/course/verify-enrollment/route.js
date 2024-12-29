import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { authOptions } from '../../auth/[...nextauth]/route';
import Stripe from '@stripe/stripe-js';



export async function POST(req) {
  const { sessionId } = await req.json();  // Get the sessionId from the request body

  // Initialize Stripe with your secret key
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Missing Session Id' }), { status: 400 });
  }

  try {
    // Get the session details from Stripe using the sessionId
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the payment was successful
    if (session.payment_status === 'paid') {
      // Get the user session details from next-auth (to validate user identity)
      const userSession = await getServerSession(authOptions);

      if (!userSession) {
        return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
      }

      // Assuming the session metadata contains user_id, course_id, and fee_paid
      const { user_id, course_id, fee_paid } = session.metadata;

      if (userSession.user.id !== user_id) {
        return new Response(JSON.stringify({ error: 'User mismatch' }), { status: 403 });
      }

      // Connect to the database
      const client = await dbConnect();

      // // Fetch IDs of courses the user is not enrolled in
      // const { data: possibleEnrollments, error: possibleEnrollmentsError } = await client
      //   .from("user_course_possible_enrollments")
      //   .select("course_id")
      //   .eq("user_id", user_id)
      //   .eq("course_id", course_id)

      // if (possibleEnrollmentsError) {
      //   console.error("Error fetching possible enrollments:", possibleEnrollmentsError);
      //   return new Response(
      //     JSON.stringify({ error: "Error fetching possible enrollments" }),
      //     { status: 500 }
      //   );
      // }

      // if (!possibleEnrollments || possibleEnrollments.length === 0) {
      //   console.log("Course enrollment not allowed for user", { user_id, course_id });
      //   return new Response(
      //     JSON.stringify({ error: "Cannot enroll in this course" }),
      //     { status: 404 }
      //   );
      // }

      const { data: existingEnrollment } = await client
        .from("enrollments")
        .select("*")
        .eq("user_id", user_id)
        .eq("course_id", course_id)
        .is('unenrollment_date', null)
        .single();

      if (existingEnrollment) {
        console.log('enrollment exists');
        return new Response(
          JSON.stringify({ success: true, message: 'Already enrolled' }),
          { status: 200 }
        );
      }

      console.log('enrollment not exist adding one');

      // Proceed to insert if no existing enrollment is found
      const { error: enrollmentError } = await client
        .from("enrollments")
        .insert({
          user_id,
          course_id,
          fee_paid,
        })
        .select();

      if (enrollmentError) {
        console.error(enrollmentError);
        return new Response(
          JSON.stringify({ error: 'Failed to Enroll in course' }),
          { status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Enrollment successful' }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ error: 'Payment not successful' }), { status: 400 });
    }
  } catch (err) {
    console.error('Error verifying Stripe session:', err);
    return new Response(JSON.stringify({ error: 'Failed to verify payment session' }), { status: 500 });
  }
}
