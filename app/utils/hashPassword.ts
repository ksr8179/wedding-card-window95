const encoder = new TextEncoder()

export const hashPassword = async (plain: string): Promise<string> => {
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(plain))
  return Array.from(new Uint8Array(buffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}
