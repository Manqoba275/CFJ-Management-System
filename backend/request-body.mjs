// Reads a small UTF-8 request body and rejects malformed text before the API tries to parse JSON.
export async function readProfileBody(stream) {
  const chunks = [];
  let size = 0;
  for await (const chunk of stream) {
    size += chunk.length;
    // Profiles are small; stop oversized requests before they consume more memory.
    if (size > 4096) throw Object.assign(new Error('body_too_large'), { status: 413 });
    chunks.push(chunk);
  }
  // Decode once: a multi-byte name character can span network chunks.
  try { return new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)); }
  catch { throw Object.assign(new Error('invalid_utf8'), { status: 400 }); }
}
