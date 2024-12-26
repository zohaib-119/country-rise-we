import dbConnect from '@/lib/dbConnect'; // Adjust the path to your dbConnect utility
import { saveCode } from '@/utils/codeUtils'

// function to generate a six digit code
function generateSixDigitCode() {
    return Math.floor(100000 + Math.random() * 900000);
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;

        // Input validation
        if (!email) {
            return new Response(
                JSON.stringify({ error: 'Email is required' }),
                { status: 400 }
            );
        }

        // Connect to the database
        const client = await dbConnect();

        // Check if the email already exists
        const { data: existingUser, error: checkError } = await client
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return new Response(
                JSON.stringify({ error: 'Email already exists' }),
                { status: 409 }
            );
        }

        // generate a six digit code
        const code = generateSixDigitCode();

        await saveCode(email, code);

        // send code via email
        console.log(`verification code for ${email} is ${code}`)

        // Send success response
        return new Response(
            JSON.stringify({ message: 'Verification code sent. Check your email' }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error sending code: ', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
}
