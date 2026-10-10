export async function onRequestPost(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: { message: 'Method not allowed' } }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }
  const key = env.DEEPSEEK_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: { message: 'DEEPSEEK_KEY 未配置' } }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: { message: 'messages 字段缺失' } }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const resp = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model: 'deepseek-chat', messages, stream: false, max_tokens: 600 })
    });
    const data = await resp.json();
    if (!resp.ok) {
      return new Response(JSON.stringify(data), { status: resp.status, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message } }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
