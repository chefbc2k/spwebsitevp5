export function sanitizeInput(input: string): string {
  // Remove any potentially harmful characters
  return input.replace(/[<>{}]/g, '');
}

export function validateAddress(address: string): boolean {
  // Basic Ethereum address validation
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function sanitizeAndValidateAddress(address: string): string {
  const sanitized = sanitizeInput(address);
  if (!validateAddress(sanitized)) {
    throw new Error('Invalid Ethereum address');
  }
  return sanitized;
}
