const genai = require('@google/genai');
console.log('Package exports:', JSON.stringify(Object.keys(genai), null, 2));
try {
    const { Client } = genai;
    if (Client) {
        console.log('Found Client class');
        const client = new Client({ apiKey: 'test' });
        console.log('Client methods:', JSON.stringify(Object.getOwnPropertyNames(Object.getPrototypeOf(client)), null, 2));
    } else {
        console.log('Client class NOT found');
    }
} catch (e) {
    console.error('Error:', e.message);
}
