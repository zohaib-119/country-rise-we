import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect.js"
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // Connect to the database using the dbConnect utility
          const client = await dbConnect();

          // Query the 'users' table for the user with the provided email
          const { data: user, error } = await client
            .from('users')
            .select('*')
            .eq('email', email)
            .single(); // Use `.single()` since we expect only one user

          // Handle any errors that occur during the query
          if (error) {
            console.error('Error fetching user:', error);
            return null; // Authentication fails if there's an error
          }

          // Check if the user exists
          if (!user) {
            console.error('User not found');
            return null;
          }

          // Verify the provided password with the hashed password stored in the database
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.error('Invalid password');
            return null; // Return null if the password is incorrect
          }

          console.log('succesfully loggedIn')
          // Return the user object (excluding sensitive data like the password)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            profile_picture: user.profile_picture,
            phone_number: user.phone_number,
            address: user.address,
            city: user.city,
            state: user.state,
          };
        } catch (error) {
          console.error('Error authorizing user:', error);
          return null; // Return null if there's a server-side error
        }
      },
    }),
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt', // Use JWT for session
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
      }
      return session;
    }
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };