export const prerender = false;

import fs from 'fs/promises';
import path from 'path';

const emailsFile = path.join(process.cwd(), 'data', 'newsletter-emails.json');

export async function POST({ request }) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await fs.mkdir(path.dirname(emailsFile), { recursive: true });
    
    let emails = [];
    try {
      const data = await fs.readFile(emailsFile, 'utf-8');
      emails = JSON.parse(data);
    } catch (error) {
      emails = [];
    }
    
    if (emails.some(entry => entry.email.toLowerCase() === email.toLowerCase())) {
      return new Response(JSON.stringify({ error: 'Email already subscribed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const newEntry = {
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      id: Date.now()
    };
    
    emails.push(newEntry);
    
    await fs.writeFile(emailsFile, JSON.stringify(emails, null, 2));
    
    console.log(`New subscription: ${email}`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Successfully subscribed to newsletter' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error saving email:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
