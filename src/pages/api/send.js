export const prerender = false;

import fs from 'fs/promises';
import path from 'path';

const chatFile = path.join(process.cwd(), 'data', 'chat-messages.json');

export async function POST({ request }) {
  try {
    const { username, message } = await request.json();
    
    if (!username || !message) {
      return new Response(JSON.stringify({ error: 'Username and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await fs.mkdir(path.dirname(chatFile), { recursive: true });
    
    const data = await fs.readFile(chatFile, 'utf-8').catch(() => '[]');
    const messages = JSON.parse(data);
    
    const newMessage = {
      id: Date.now(),
      username: username.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    messages.push(newMessage);
    
    const recentMessages = messages.slice(-100);
    
    await fs.writeFile(chatFile, JSON.stringify(recentMessages, null, 2));
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error saving message:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
