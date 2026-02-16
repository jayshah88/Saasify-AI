/**
 * Event Bus Integration Test
 * 
 * Verifies that events emitted via EventBus are correctly received by listeners.
 */

// Mock window and CustomEvent for Node environment
const target = new EventTarget();
global.window = {
    dispatchEvent: target.dispatchEvent.bind(target),
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target)
};

import { EventBus } from '../src/core/events.js';

console.log('--- Running Event Bus Integration Test ---');

let testPassed = false;
const testPayload = { message: 'Hello World', value: 42 };

// 1. Subscribe to a test event
EventBus.on('saasify:test-event', (e) => {
    console.log('[PASS] Listener received event.');
    
    // 2. Verify payload
    if (e.detail.message === testPayload.message && e.detail.value === testPayload.value) {
        console.log('[PASS] Payload matches.');
        testPassed = true;
    } else {
        console.error('[FAIL] Payload mismatch:', e.detail);
    }
});

// 3. Emit the event
console.log('Emitting event...');
EventBus.emit('saasify:test-event', testPayload);

// 4. Verify completion
setTimeout(() => {
    if (testPassed) {
        console.log('--- All Event Bus Tests Passed ---');
        process.exit(0);
    } else {
        console.error('--- Event Bus Tests Failed ---');
        process.exit(1);
    }
}, 100);