import fs from 'fs';
import path from 'path';

const docsDir = '/home/haris/workspace/mcp-wl-loop/docs';
const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));

for (const file of files) {
  const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');
  if (content.includes('| Field | Type |') || content.includes('**Response:**\nReturns') || content.includes('**Response:** Array') || content.includes('**Response:** `true` or `false`') || content.includes('**Response:** Created') || content.includes('**Response:**\n{')) {
    console.log(file + " has missing JSON schemas or uses tables.");
  }
}
