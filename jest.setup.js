// jest.setup.js

// Mock `dbConnect` to prevent errors during testing
jest.mock('@/lib/dbConnect', () => ({
    __esModule: true,
    default: jest.fn(() => ({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValueOnce({
        data: [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }],
        error: null,
      }),
    })),
  }));
  