// code review 1.0 passed

import dbConnect from '@/lib/dbConnect'; // Adjust the path to your dbConnect utility
import { verifyCode } from '@/utils/codeUtils';
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password, code } = body;

        // Input validation
        if (!name || !email || !password || !code) {
            return new Response(
                JSON.stringify({ error: 'Name, email, password and code are required' }),
                { status: 400 }
            );
        }

        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

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

        // const verification = await verifyCode(email, code);

        // console.log(verification)
        // if(!verification.success){
        //     return new Response(
        //         JSON.stringify({ error: 'Verification fails.' }),
        //         { status: 400 }
        //     );
        // }

        // Insert the new user into the database
        const { error: insertError } = await client.from('users').insert([
            {
                name,
                email,
                password: hashedPassword,
            },
        ]);

        if (insertError) {
            console.error('Error inserting user:', insertError);
            return new Response(
                JSON.stringify({ error: 'Error creating user' }),
                { status: 500 }
            );
        }

        // Send success response
        return new Response(
            JSON.stringify({ message: 'User created successfully' }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
}
