/**
 * Mock AI Engine Unit Test
 */

import { MockAI } from '../src/core/mock-ai.js';

console.log('--- Running Mock AI Engine Test ---');

async function testStreaming() {
    console.log('Testing "Expert" persona stream...');
    let tokenCount = 0;
    let fullResponse = '';
    
    const startTime = Date.now();
    for await (const token of MockAI.generateResponse('test prompt', 'expert')) {
        tokenCount++;
        fullResponse += token;
        process.stdout.write(token); // Visual feedback
    }
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('\n');
    
    // 1. Verify we got tokens
    if (tokenCount > 0) {
        console.log(`[PASS] Yielded ${tokenCount} tokens.`);
    } else {
        console.error('[FAIL] No tokens yielded.');
        process.exit(1);
    }

    // 2. Verify persona content (experts usually talk about architecture or performance)
    if (fullResponse.toLowerCase().includes('accuracy') || fullResponse.toLowerCase().includes('performance') || fullResponse.toLowerCase().includes('latency')) {
        console.log('[PASS] Content aligns with Expert persona.');
    } else {
        console.error('[FAIL] Unexpected content for Expert persona:', fullResponse);
        process.exit(1);
    }

    // 3. Verify timing (should be at least tokenCount * 50ms)
    const minExpected = tokenCount * 50;
    if (duration >= minExpected) {
        console.log(`[PASS] Stream duration (${duration}ms) consistent with simulated latency.`);
    } else {
        console.error(`[FAIL] Stream was too fast (${duration}ms). Expected at least ${minExpected}ms.`);
        process.exit(1);
    }

    console.log('--- All Mock AI Tests Passed ---');
}

testStreaming();
