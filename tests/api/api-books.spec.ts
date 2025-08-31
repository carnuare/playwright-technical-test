import { test, expect } from '@playwright/test';

interface Book {
    isbn: string;
    title: string;
    subTitle: string;
    author: string;
    publish_date: string;
    publisher: string;
    pages: number;
    description: string;
    website: string;
}

interface AuthResponse {
    token: string;
    expires: string;
    status: string;
    result: string;
}

test.describe('DemoQA Books API Tests', () => {
    let authToken: string;

    const generateTokenUrl = 'https://demoqa.com/Account/v1/GenerateToken';
    const booksUrl = 'https://demoqa.com/BookStore/v1/Books';

    test.beforeAll(async ({ request }) => {
        // Generate authentication token
        const authResponse = await request.post(generateTokenUrl, {
            data: {
                userName: 'testuser',
                password: 'Test123!'
            }
        });

        expect(authResponse.status()).toBe(200);
        const authData: AuthResponse = await authResponse.json();
        expect(authData.token).toBeDefined();
        authToken = authData.token;
    });

    test('should get all books and validate response structure', async ({ request }) => {
        // Get all books
        const response = await request.get(booksUrl, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Validate status code
        expect(response.status()).toBe(200);

        // Validate response structure
        const responseData = await response.json();
        expect(responseData).toHaveProperty('books');
        expect(Array.isArray(responseData.books)).toBeTruthy();

        // Validate book structure
        const books: Book[] = responseData.books;
        for (const book of books) {
            expect.soft(book).toHaveProperty('isbn');
            expect.soft(book).toHaveProperty('title');
            expect.soft(book).toHaveProperty('subTitle');
            expect.soft(book).toHaveProperty('author');
            expect.soft(book).toHaveProperty('publish_date');
            expect.soft(book).toHaveProperty('publisher');
            expect.soft(book).toHaveProperty('pages');
            expect.soft(book).toHaveProperty('description');
            expect.soft(book).toHaveProperty('website');
            expect.soft(typeof book.isbn).toBe('string');
            expect.soft(typeof book.title).toBe('string');
            expect.soft(typeof book.subTitle).toBe('string');
            expect.soft(typeof book.author).toBe('string');
            expect.soft(typeof book.publish_date).toBe('string');
            // See if date can be parsed and has format YYYY-MM-DDTHH:mm:ss.xxxZ
            const date = new Date(book.publish_date);
            expect.soft(!isNaN(date.getTime())).toBeTruthy();
            expect.soft(typeof book.publisher).toBe('string');
            expect.soft(typeof book.pages).toBe('number');
            expect.soft(typeof book.description).toBe('string');
            expect.soft(typeof book.website).toBe('string');
        }
    });
});