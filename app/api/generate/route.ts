import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { subject } = await request.json();

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a professional LinkedIn content creator. Generate engaging, professional LinkedIn posts that:
- Are 150-250 words long
- Include relevant hashtags (3-5)
- Have a hook in the first line
- Provide value to the reader
- Use line breaks for readability
- Include a call-to-action
- Sound authentic and conversational
- Are optimized for LinkedIn's algorithm`
        },
        {
          role: 'user',
          content: `Create a LinkedIn post about: ${subject}`
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const post = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('Error generating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate post' },
      { status: 500 }
    );
  }
}
