export function generateRandomTestData() {
    const randomString = Math.random().toString(36).substring(7);
    const testData = {
        name: `TestUser_${randomString}`,
        username: `testuser_${randomString}`,
        email: `testuser_${randomString}@example.com`,
        password: 'password123',
    };
    return testData;
}