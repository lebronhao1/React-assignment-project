import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Add TextEncoder/TextDecoder polyfills for Jest
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
