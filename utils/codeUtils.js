import NodeCache from 'node-cache';

const memoryCache = new NodeCache({ stdTTL: 3600 });

// Function to save Code in memory cache
export const saveCode = async (email, code) => {
    try {
        memoryCache.set(email, code); // expirationTime in seconds
        console.log(memoryCache.get(email))
    } catch (err) {
        console.error('Error saving code to memory cache:', err);
        throw err;
    }
};

// Function to verify Code from memory cache
export const verifyCode = async (email, code) => {
    try {
        const storedCode = memoryCache.get(email);
        console.log(storedCode)
        if (!storedCode) {
            return { success: false, message: 'Code expired or invalid' };
        }

        if (storedCode == code) {
            return { success: true, message: 'Code validated successfully' };
        } else {
            return { success: false, message: 'Incorrect Code' };
        }
    } catch (err) {
        console.error('Error validating Code in memory cache:', err);
        throw err;
    }
};

// Function to delete Code from memory cache
export const deleteCode = async (email) => {
    try {
        memoryCache.del(email);
    } catch (err) {
        console.error('Error deleting code from memory cache:', err);
        throw err;
    }
};
