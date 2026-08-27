// utils/deviceIdentifier.ts

function getBrowserDetect(): string {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Chrome') && !userAgent.includes('Edg') && !userAgent.includes('OPR'))
    return 'Chrome';

  if (userAgent.includes('Safari') && !userAgent.includes('Chrome'))
    return 'Safari';

  if (userAgent.includes('Firefox'))
    return 'Firefox';

  if (userAgent.includes('Edg'))
    return 'Edge';

  if (userAgent.includes('OPR') || userAgent.includes('Opera'))
    return 'Opera';

  if (userAgent.includes('MSIE') || userAgent.includes('Trident'))
    return 'Internet Explorer';

  return 'Unknown';
}

export async function generateAdvancedDeviceIdentifier() {
  const deviceProperties = {
    userAgent: getBrowserDetect(),
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
    deviceMemory: (navigator as any).deviceMemory || 'Unknown',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    touchSupport: navigator.maxTouchPoints || 0,
    plugins: Array.from(navigator.plugins)
      .map((p) => p.name)
      .join(','),
  };

  const combinedProperties = Object.values(deviceProperties).join('||');

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(combinedProperties)
  );

  const deviceId = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return {
    deviceId,
    properties: deviceProperties,
  };
}