import fs from 'fs';
import path from 'path';

const docsDir = '/home/haris/workspace/mcp-wl-loop/docs';
const file = 'loop_wl_middleware_api.md';
const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');

if (content.includes('| Field | Type |')) console.log('Matched Table');
if (content.includes('**Response:**\nReturns')) console.log('Matched Returns');
if (content.includes('**Response:** Array')) console.log('Matched Array');
if (content.includes('**Response:** `true` or `false`')) console.log('Matched boolean');
if (content.includes('**Response:** Created')) console.log('Matched Created');
if (content.includes('**Response:**\n{')) console.log('Matched Bracket');
