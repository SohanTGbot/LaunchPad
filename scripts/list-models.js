
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    const apiKey = 'AIzaSyB2_OYHwV_X4dMHmDqy0hG07xhmX5eAmyg';
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // There isn't a direct "listModels" in the SDK usually, but we can try to access one and see the error or use the base client if available
        // Actually, usually you'd use the REST API for listing.
        // Let's try a simple fetch within node.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
