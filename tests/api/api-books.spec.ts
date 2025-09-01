import { test, expect } from "@playwright/test";

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

interface UserResponse {
  userID: string;
  username: string;
  books: Book[];
}

test.describe("DemoQA Books API Tests", () => {
  const baseUrl = "https://demoqa.com";
  const generateTokenUrl = `${baseUrl}/Account/v1/GenerateToken`;
  const userUrl = `${baseUrl}/Account/v1/User`;
  const booksUrl = `${baseUrl}/BookStore/v1/Books`;

  // Generate unique test data
  const randomSuffix = Math.random().toString(36).slice(2, 8);

  const userBooksInfo = {
    username: `testuser_${randomSuffix}`,
    password: "Test123!",
    isbn: "9781449337711",
  };

  test("Should get all books and validate response structure", async ({
    request,
  }) => {
    const response = await request.get(booksUrl);

    expect(response.status(), 'Status code should be successful (200)').toBe(200);

    const responseData = await response.json();
    expect(responseData, 'The response data should have a books property').toHaveProperty("books");
    expect(Array.isArray(responseData.books), 'The books property should be an array').toBe(true);

    // Validate each book's structure
    for (const book of responseData.books) {
      expect.soft(book, 'The structure of the books should be validated').toMatchObject({
        isbn: expect.any(String),
        title: expect.any(String),
        subTitle: expect.any(String),
        author: expect.any(String),
        publish_date: expect.any(String),
        publisher: expect.any(String),
        pages: expect.any(Number),
        description: expect.any(String),
        website: expect.any(String),
      });

      // Validate date format
      expect.soft(new Date(book.publish_date).toString(), 'The publish date should be valid').not.toBe("Invalid Date");
    }
  });

  test("Should create user and add book", async ({ request }) => {
    let userId: string;
    let authToken: string;

    // Create new user
    await test.step("Create new user", async () => {
      const response = await request.post(userUrl, {
        data: {
          userName: userBooksInfo.username,
          password: userBooksInfo.password,
        },
      });

      expect(response.status(), 'Status code should be successful (201 - created)').toBe(201);
      const userData: UserResponse = await response.json();
      userId = userData.userID;
      expect(userId, 'The response should have a userID property').toBeDefined();
    });

    // Generate authentication token
    await test.step("Generate auth token", async () => {
      const response = await request.post(generateTokenUrl, {
        data: {
          userName: userBooksInfo.username,
          password: userBooksInfo.password,
        },
      });

      expect(response.status(), 'Status code should be successful (200)').toBe(200);
      const authData: AuthResponse = await response.json();
      authToken = authData.token;
      expect(authToken, 'The response should have a token property').toBeDefined();
    });

    // Add book to collection
    await test.step("Add book to collection", async () => {
      const response = await request.post(`${booksUrl}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          userId: userId,
          collectionOfIsbns: [{ isbn: userBooksInfo.isbn }],
        },
      });

      expect(response.status(), 'Status code should be successful (201 - created)').toBe(201);
      const responseBody = await response.json();
      expect.soft(responseBody.books[0].isbn, 'The isbn of the response should match with the one in the request').toBe(userBooksInfo.isbn);
    });

    // Verify book was added
    await test.step("Verify book addition by calling USER API", async () => {
      const response = await request.get(`${userUrl}/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.status(), "Status code should be successful (200)").toBe(200);
      const userData: UserResponse = await response.json();
      expect(
        userData.books.some((book) => book.isbn === userBooksInfo.isbn), 'The isbn of the response should match with the one in the request'
      ).toBe(true);
    });
  });
});
