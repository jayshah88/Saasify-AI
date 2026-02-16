/**
 * Mock AI Streaming Engine
 * 
 * Simulates token-by-token text generation to provide a tactile AI feel.
 */

export const MockAI = {
    responses: {
        expert: [
            "Based on the architectural analysis, the system performance can be optimized by 15% through more efficient indexing.",
            "Our proprietary reasoning engine achieves 99.9% accuracy across complex logical tasks in high-density data environments.",
            "The integration of hyper-latency cycles ensures real-time human interaction under 10ms."
        ],
        creative: [
            "Imagine a world where data isn't just numbers, but gold. We're building the future, one intelligent block at a time.",
            "The vision is clear: build the next era with generative intelligence that feels like magic.",
            "Your journey to a premium AI product starts here. Join the elite 1% of builders worldwide."
        ]
    },

    /**
     * Simulates an AI response stream.
     * @param {string} prompt - The user prompt (ignored in mock)
     * @param {string} persona - 'expert' or 'creative'
     * @yields {string} - Individual tokens (words or chunks)
     */
    async *generateResponse(prompt, persona = 'expert') {
        const p = persona.toLowerCase();
        const responseList = this.responses[p] || this.responses.expert;
        const text = responseList[Math.floor(Math.random() * responseList.length)];
        
        // Split text into tokens (words with their following space)
        const tokens = text.match(/\S+\s*/g) || [text];

        for (const token of tokens) {
            // Simulate variable latency (50ms - 150ms)
            const ms = Math.floor(Math.random() * 100) + 50;
            await new Promise(resolve => setTimeout(resolve, ms));
            yield token;
        }
    }
};
