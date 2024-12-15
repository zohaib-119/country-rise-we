import dbConnect from '@/lib/dbConnect'; 
import { GET } from '@/app/api/categories/route'; 

jest.mock('@/lib/dbConnect'); 

describe('GET /categories API', () => {
    it('should fetch categories successfully', async () => {
        // Mock the database client and its methods
        const mockClient = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue({
                data: [{ id: 1, name: 'Category 1'}, { id: 2, name: 'Category 2'}],
                error: null,
            }),
        };

        dbConnect.mockResolvedValue(mockClient); // Mock the dbConnect function

        // Call the GET handler
        const req = {}; // Mock request (not used in this example)
        const res = await GET(req);

        // Verify the response
        expect(res.status).toBe(200); // Check for success status
        const jsonResponse = await res.json(); // Parse the response
        expect(jsonResponse).toEqual({
            categories: [
                { id: 1, name: 'Category 1' },
                { id: 2, name: 'Category 2' },
            ],
            message: 'Categories fetched successfully',
        });
    });

    it('should handle database errors gracefully', async () => {
        // Mock the database client to return an error
        const mockClient = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue({
                data: [],
                error: 'Connection issue: request timed out',
            }),
        };

        dbConnect.mockResolvedValue(mockClient); // Mock the dbConnect function

        // Call the GET handler
        const req = {}; // Mock request
        const res = await GET(req);

        // Verify the response
        expect(res.status).toBe(500); // Check for server error status
        const jsonResponse = await res.json(); // Parse the response
        expect(jsonResponse).toEqual({
            error: 'Internal server error',
        });
    });
});
