// import NodeCache from 'node-cache';

// const memoryCache = new NodeCache();

// // Function to save Code in memory cache
// export const saveCode = async (email, code) => {
//     try {
//         memoryCache.set(email, code, 3600);
//         console.log('email in save code', email);
//         console.log('Cache size:', memoryCache.keys());
//         console.log(memoryCache.get(email));
//     } catch (err) {
//         console.error('Error saving code to memory cache:', err);
//         throw err;
//     }
// };

// // Function to verify Code from memory cache
// export const verifyCode = async (email, code) => {
//     try {
//         console.log('email in verify code', email);
//         console.log('Cache size:', memoryCache.keys());
//         const storedCode = memoryCache.get(email);
//         console.log(storedCode)
//         if (!storedCode) {
//             return { success: false, message: 'Code expired or invalid' };
//         }

//         if (storedCode == code) {
//             return { success: true, message: 'Code validated successfully' };
//         } else {
//             return { success: false, message: 'Incorrect Code' };
//         }
//     } catch (err) {
//         console.error('Error validating Code in memory cache:', err);
//         throw err;
//     }
// };

// Function to delete Code from memory cache
// export const deleteCode = async (email) => {
//     try {
//         memoryCache.del(email);
//     } catch (err) {
//         console.error('Error deleting code from memory cache:', err);
//         throw err;
//     }
// };


const memoryCache = {}; // Simple object to store email-code pairs

// Function to save Code in memory cache
export const saveCode = async (email, code) => {
    try {
        memoryCache[email] = code; // Store the code
        console.log('Email saved:', email);
        console.log('Cache contents:', memoryCache);
    } catch (err) {
        console.error('Error saving code to memory cache:', err);
        throw err;
    }
};

// Function to verify Code from memory cache
export const verifyCode = async (email, code) => {
    try {
        console.log('Email for verification:', email);
        console.log('Cache contents:', memoryCache);

        const storedCode = memoryCache[email]; // Retrieve the stored code
        if (!storedCode) {
            return { success: false, message: 'Code expired or invalid' };
        }

        if (storedCode === code) {
            return { success: true, message: 'Code validated successfully' };
        } else {
            return { success: false, message: 'Incorrect Code' };
        }
    } catch (err) {
        console.error('Error validating code in memory cache:', err);
        throw err;
    }
};

// Function to delete Code from memory cache
export const deleteCode = async (email) => {
    try {
        delete memoryCache[email]; // Delete the code
        console.log('Deleted email from cache:', email);
        console.log('Cache contents after deletion:', memoryCache);
    } catch (err) {
        console.error('Error deleting code from memory cache:', err);
        throw err;
    }
};
