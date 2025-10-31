import fs from 'fs/promises';
import path from 'path';

const chatFile = path.join(process.cwd(), 'data', 'chat-messages.json');

export async function GET() {
  try {
    await fs.mkdir(path.dirname(chatFile), { recursive: true });
    
    const data = await fs.readFile(chatFile, 'utf-8').catch(() => '[]');
    const messages = JSON.parse(data);
    
    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error reading messages:', error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
