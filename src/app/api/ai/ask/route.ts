import { NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { z } from 'zod';

const Body = z.object({
  question: z.string().min(1).max(2000),
  contextTitle: z.string().optional(),
});

function guardrail(question: string) {
  const lower = question.toLowerCase();
  const blocked = [
    'access key', 'secret key', 'password', 'api key', 'ssh key',
    'credit card', 'ssn', 'social security',
  ];
  if (blocked.some((b) => lower.includes(b))) {
    return 'I can’t help with requests for secrets or sensitive data. Ask about concepts or troubleshooting steps without including credentials.';
  }
  return null;
}

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const g = guardrail(parsed.data.question);
  if (g) return NextResponse.json({ answer: g });

  const region = process.env.AWS_REGION || 'us-west-2';
  const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';

  const system = [
    'You are BayLearn AI Tutor.',
    'Be concise and correct.',
    'Do not provide credentials or secrets.',
    'If asked for destructive cloud actions, provide safe guidance and warnings.',
  ].join(' ');

  const prompt = `Context: ${parsed.data.contextTitle ?? 'BayLearn Course'}\nUser question: ${parsed.data.question}\nAnswer:`;

  const client = new BedrockRuntimeClient({ region });

  // This request format works for Anthropic models hosted on Bedrock (messages format).
  const body = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 600,
    system,
    messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
  };

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(JSON.stringify(body)),
  });

  try {
    const resp = await client.send(command);
    const text = new TextDecoder().decode(resp.body);
    const json = JSON.parse(text);
    const answer = json?.content?.[0]?.text ?? json?.completion ?? text;
    return NextResponse.json({ answer });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Bedrock invocation failed' }, { status: 500 });
  }
}
