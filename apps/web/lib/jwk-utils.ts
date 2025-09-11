import { privateKeyToAccount } from 'viem/accounts';
import { keccak256, stringToHex } from 'viem';

/**
 * Generate secp256k1 public key JWK from EOA private key
 */
export function generatePublicKeyJwkFromPrivateKey(privateKey: `0x${string}`): {
  x: string;
  y: string;
  jwk: {
    kty: string;
    crv: string;
    x: string;
    y: string;
  };
} {
  console.log('🔍 generatePublicKeyJwkFromPrivateKey called with:', privateKey.slice(0, 10) + '...');
  
  // Create account from private key
  const account = privateKeyToAccount(privateKey);
  
  // Get the public key (this is the uncompressed public key)
  const publicKey = account.publicKey;
  
  console.log('🔍 Generated public key from private key:', publicKey);
  
  // Remove the 0x04 prefix and split into x and y coordinates
  const publicKeyHex = publicKey.slice(2); // Remove 0x
  const xHex = publicKeyHex.slice(0, 64); // First 32 bytes
  const yHex = publicKeyHex.slice(64, 128); // Next 32 bytes
  
  console.log('🔍 Extracted coordinates:', { xHex, yHex });
  
  // Convert hex to base64url encoding
  const x = hexToBase64Url(xHex);
  const y = hexToBase64Url(yHex);
  
  console.log('🔍 Base64URL coordinates:', { x, y });
  
  return {
    x,
    y,
    jwk: {
      kty: 'EC',
      crv: 'secp256k1',
      x,
      y
    }
  };
}

/**
 * Generate a deterministic JWK from EOA address (for demonstration purposes)
 * This creates a deterministic but not cryptographically secure key
 */
export function generateDeterministicJwkFromAddress(address: string): {
  x: string;
  y: string;
  jwk: {
    kty: string;
    crv: string;
    x: string;
    y: string;
  };
} {
  console.log('🔍 generateDeterministicJwkFromAddress called with:', address);
  
  // Create a deterministic "private key" based on the address
  // This is for demonstration only - not cryptographically secure
  const addressHash = keccak256(stringToHex(address));
  const mockPrivateKey = `0x${addressHash.slice(2)}` as `0x${string}`;
  
  console.log('🔍 Generated deterministic private key:', mockPrivateKey.slice(0, 10) + '...');
  
  return generatePublicKeyJwkFromPrivateKey(mockPrivateKey);
}

/**
 * Generate JWK from wallet connection using signature-based key derivation
 * This works with MetaMask, Web3Auth, and other providers that support personal_sign
 */
export async function generateJwkFromMetaMask(
  provider: any,
  address: string
): Promise<{
  x: string;
  y: string;
  jwk: {
    kty: string;
    crv: string;
    x: string;
    y: string;
  };
} | null> {
  try {
    console.log('🔍 Generating JWK from wallet signature...', {
      provider: !!provider,
      address,
      hasRequest: typeof provider?.request === 'function',
      isMetaMask: provider?.isMetaMask,
      providerType: provider?.constructor?.name
    });
    
    // Create a deterministic message to sign
    const message = `DID:Web JWK Generation for ${address}`;
    const messageHash = keccak256(stringToHex(message));
    
    console.log('📝 Requesting signature from wallet...', { 
      message, 
      messageHash,
      address,
      messageLength: message.length
    });
    
    // Request signature from wallet - this will pop up the wallet for user approval
    const signature = await provider.request({
      method: 'personal_sign',
      params: [message, address]
    });
    
    console.log('✅ Wallet signature received:', {
      signature,
      address,
      message,
      signatureLength: signature.length
    });
    
    // Extract r, s, v from signature
    const sig = signature.slice(2); // Remove 0x
    const r = `0x${sig.slice(0, 64)}`;
    const s = `0x${sig.slice(64, 128)}`;
    const v = parseInt(sig.slice(128, 130), 16);
    
    console.log('🔍 Signature components:', { r, s, v });
    
    // Recover public key from signature using viem's recoverPublicKey
    const publicKey = await recoverPublicKey({
      hash: messageHash as `0x${string}`,
      signature: { 
        r: r as `0x${string}`, 
        s: s as `0x${string}`, 
        v: BigInt(v) 
      }
    });
    
    console.log('✅ Public key recovered:', publicKey);
    
    // Extract X and Y coordinates (first 32 bytes each after 0x04 prefix)
    const xHex = publicKey.slice(4, 68);  // Skip 0x04 prefix (4 chars), take next 64 chars
    const yHex = publicKey.slice(68, 132); // Take next 64 chars
    
    // Convert to Base64URL encoding
    const x = hexToBase64Url(xHex);
    const y = hexToBase64Url(yHex);
    
    console.log('✅ JWK coordinates generated:', { x, y });
    
    return {
      x,
      y,
      jwk: {
        kty: 'EC',
        crv: 'secp256k1',
        x,
        y
      }
    };
  } catch (error) {
    console.error('❌ Error generating JWK from MetaMask:', error);
    return null;
  }
}

/**
 * Recover public key from signature using viem
 */
async function recoverPublicKey({ hash, signature }: { hash: `0x${string}`, signature: { r: `0x${string}`, s: `0x${string}`, v: bigint } }): Promise<`0x${string}`> {
  // Import viem's recoverPublicKey function
  const { recoverPublicKey } = await import('viem');
  
  // Recover the public key
  const publicKey = await recoverPublicKey({
    hash,
    signature: {
      r: signature.r,
      s: signature.s,
      v: signature.v
    }
  });
  
  return publicKey;
}

/**
 * Convert hex string to base64url encoding
 */
function hexToBase64Url(hex: string): string {
  // Convert hex to bytes
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  
  // Convert to base64
  const base64 = btoa(String.fromCharCode(...bytes));
  
  // Convert to base64url (replace + with -, / with _, remove padding)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Verify a signature using the public key JWK
 */
export async function verifyJwkSignature(
  message: string,
  signature: string,
  publicKeyJwk: { x: string; y: string }
): Promise<boolean> {
  try {
    console.log('🔍 Verifying JWK signature:', { 
      message, 
      signature, 
      publicKeyJwk,
      xLength: publicKeyJwk.x.length,
      yLength: publicKeyJwk.y.length
    });
    
    // Convert base64url back to hex
    const xHex = base64UrlToHex(publicKeyJwk.x);
    const yHex = base64UrlToHex(publicKeyJwk.y);
    
    console.log('🔍 Converted coordinates:', { 
      xHex, 
      yHex,
      xHexLength: xHex.length,
      yHexLength: yHex.length,
      expectedLength: 64 // 32 bytes = 64 hex chars
    });
    
    // Reconstruct the uncompressed public key (0x04 prefix + x + y)
    const expectedPublicKey = `0x04${xHex}${yHex}` as `0x${string}`;
    
    console.log('🔍 Expected public key from JWK:', {
      publicKey: expectedPublicKey,
      length: expectedPublicKey.length,
      expectedLength: 131, // 0x04 + 64 + 64 = 131 chars
      xHexLength: xHex.length,
      yHexLength: yHex.length,
      totalHexLength: xHex.length + yHex.length
    });
    
    // Import viem's recoverPublicKey function
    const { recoverPublicKey } = await import('viem');
    
    // Create message hash for recovery
    const messageHash = keccak256(stringToHex(message));
    
    // Extract signature components
    const sig = signature.slice(2); // Remove 0x
    const r = `0x${sig.slice(0, 64)}`;
    const s = `0x${sig.slice(64, 128)}`;
    const v = parseInt(sig.slice(128, 130), 16);
    
    console.log('🔍 Signature components:', { r, s, v });
    
    // Recover the public key from the signature
    const recoveredPublicKey = await recoverPublicKey({
      hash: messageHash as `0x${string}`,
      signature: { 
        r: r as `0x${string}`, 
        s: s as `0x${string}`, 
        v: BigInt(v) 
      }
    });
    
    console.log('🔍 Recovered public key from signature:', {
      publicKey: recoveredPublicKey,
      length: recoveredPublicKey.length,
      expectedLength: 131
    });
    
    // Compare the recovered public key with our expected JWK public key
    const isValid = recoveredPublicKey.toLowerCase() === expectedPublicKey.toLowerCase();
    
    console.log('✅ JWK signature verification result:', isValid);
    console.log('🔍 Detailed Comparison:', {
      recovered: recoveredPublicKey.toLowerCase(),
      expected: expectedPublicKey.toLowerCase(),
      recoveredLength: recoveredPublicKey.length,
      expectedLength: expectedPublicKey.length,
      exactMatch: recoveredPublicKey.toLowerCase() === expectedPublicKey.toLowerCase(),
      recoveredStartsWith: recoveredPublicKey.startsWith('0x04'),
      expectedStartsWith: expectedPublicKey.startsWith('0x04')
    });
    
    // If they don't match, let's see if it's a format issue
    if (!isValid) {
      console.log('❌ Public keys don\'t match! Let\'s debug further...');
      console.log('🔍 Recovered public key format:', {
        prefix: recoveredPublicKey.slice(0, 4),
        xCoord: recoveredPublicKey.slice(4, 68),
        yCoord: recoveredPublicKey.slice(68, 132)
      });
      console.log('🔍 Expected public key format:', {
        prefix: expectedPublicKey.slice(0, 4),
        xCoord: expectedPublicKey.slice(4, 68),
        yCoord: expectedPublicKey.slice(68, 132)
      });
    }
    
    return isValid;
  } catch (error) {
    console.error('❌ Error verifying JWK signature:', error);
    return false;
  }
}

/**
 * Convert base64url string back to hex
 */
function base64UrlToHex(base64url: string): string {
  // Convert base64url to base64
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }
  
  // Convert to bytes
  const bytes = new Uint8Array(
    atob(base64)
      .split('')
      .map(char => char.charCodeAt(0))
  );
  
  // Convert to hex
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Extract private key from connected wallet (MetaMask/Web3Auth)
 * Note: This only works with certain wallet implementations
 */
export async function extractPrivateKeyFromWallet(provider: any, address: string): Promise<`0x${string}` | null> {
  try {
    console.log('🔍 Extracting private key from wallet:', { 
      provider: !!provider, 
      address,
      providerKeys: provider ? Object.keys(provider) : 'no provider'
    });
    
    // For Web3Auth, try to get the private key from the provider
    if (provider && provider.privateKey) {
      console.log('✅ Found private key in provider.privateKey');
      return provider.privateKey as `0x${string}`;
    }
    
    // If Web3Auth is available globally
    if (typeof window !== 'undefined' && (window as any).web3auth) {
      const web3auth = (window as any).web3auth;
      console.log('🔍 Checking global web3auth:', { 
        hasProvider: !!web3auth.provider,
        providerKeys: web3auth.provider ? Object.keys(web3auth.provider) : 'no provider'
      });
      if (web3auth.provider && web3auth.provider.privateKey) {
        console.log('✅ Found private key in global web3auth.provider.privateKey');
        return web3auth.provider.privateKey as `0x${string}`;
      }
    }
    
    // Try to get from provider's internal state
    if (provider && provider._privateKey) {
      console.log('✅ Found private key in provider._privateKey');
      return provider._privateKey as `0x${string}`;
    }
    
    // For MetaMask and similar wallets, private keys are not accessible
    // due to security restrictions - we'll use signature-based approach instead
    
    console.warn('❌ No private key found in any of the checked locations');
    return null;
  } catch (error) {
    console.error('❌ Error extracting private key from wallet:', error);
    return null;
  }
}

/**
 * Generate JWK from connected wallet's private key or MetaMask signature
 */
export async function generateJwkFromConnectedWallet(
  provider: any,
  address: string
): Promise<{
  x: string;
  y: string;
  jwk: {
    kty: string;
    crv: string;
    x: string;
    y: string;
  };
} | null> {
  try {
    console.log('🔍 generateJwkFromConnectedWallet called:', { 
      hasProvider: !!provider, 
      address,
      providerType: provider?.constructor?.name,
      isMetaMask: provider?.isMetaMask,
      providerKeys: provider ? Object.keys(provider) : 'no provider'
    });
    
    // First, try to extract private key (works for Web3Auth)
    const privateKey = await extractPrivateKeyFromWallet(provider, address);
    
    if (privateKey) {
      console.log('✅ Using private key from Web3Auth:', privateKey.slice(0, 10) + '...');
      const result = generatePublicKeyJwkFromPrivateKey(privateKey);
      console.log('✅ Generated JWK from private key:', result.jwk);
      return result;
    }
    
    // If no private key available, try signature-based approach for any provider with request method
    if (provider && provider.request && typeof provider.request === 'function') {
      console.log('🔍 Provider has request method, attempting signature-based approach');
      try {
        const result = await generateJwkFromMetaMask(provider, address);
        console.log('✅ Generated JWK from signature:', result?.jwk);
        return result;
      } catch (signatureError) {
        console.warn('❌ Signature-based approach failed:', signatureError);
        // Fall through to deterministic fallback
      }
    }
    
    // If neither method works, fall back to deterministic generation
    console.log('⚠️ No private key or signature method available, using deterministic fallback');
    const result = generateDeterministicJwkFromAddress(address);
    console.log('✅ Generated deterministic JWK:', result.jwk);
    return result;
  } catch (error) {
    console.error('❌ Error generating JWK from wallet:', error);
    return null;
  }
}

/**
 * Sign a message using the EOA private key and return signature
 */
export async function signMessageWithEoa(
  message: string,
  privateKey: `0x${string}`,
  walletClient: any
): Promise<string> {
  const account = privateKeyToAccount(privateKey);
  
  // Sign the message
  const signature = await walletClient.signMessage({
    account: account.address as `0x${string}`,
    message
  });
  
  return signature;
}
