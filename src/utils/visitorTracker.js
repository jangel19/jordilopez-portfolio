const DEFAULT_DISCORD_WEBHOOK_URL =
  'https://discord.com/api/webhooks/1484213536334020629/I94qZsefLKQm3-X0P-Jvvqjt6K57nSPdHxiAUZm5h8QatJJTnq_Tz6V8X1_ESqH5EZZt';

const DISCORD_WEBHOOK_URL =
  import.meta.env.VITE_DISCORD_WEBHOOK_URL || DEFAULT_DISCORD_WEBHOOK_URL;

const TRACKING_SENT_KEY = 'jordisworld:visitor-tracker:sent';
const TRACKING_ERROR_LOG_KEY = 'jordisworld:visitor-tracker:errors';
const TRACKING_DEBUG_KEY = '__JORDISWORLD_VISITOR_TRACKER__';
const MAX_ERROR_HISTORY = 10;
const MAX_FIELD_LENGTH = 480;
const MAX_MESSAGE_LENGTH = 1900;

const truncate = (value, maxLength = MAX_FIELD_LENGTH) => {
  const normalized = String(value ?? 'Unknown').trim();

  if (!normalized) {
    return 'Unknown';
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1)}…`;
};

const safeStorageGet = (storage, key) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const safeStorageSet = (storage, key, value) => {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage failures in private browsing modes.
  }
};

const safeStorageRemove = (storage, key) => {
  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage failures in private browsing modes.
  }
};

const setDebugState = (state) => {
  window[TRACKING_DEBUG_KEY] = {
    ...state,
    updatedAt: new Date().toISOString(),
  };
};

const readErrorHistory = () => {
  try {
    const raw = window.localStorage.getItem(TRACKING_ERROR_LOG_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const recordTrackingError = (stage, error, details = {}) => {
  const entry = {
    stage,
    message: truncate(error instanceof Error ? error.message : error, 600),
    details,
    timestamp: new Date().toISOString(),
  };

  const history = [entry, ...readErrorHistory()].slice(0, MAX_ERROR_HISTORY);
  safeStorageSet(window.localStorage, TRACKING_ERROR_LOG_KEY, JSON.stringify(history));
  setDebugState({
    status: 'error',
    lastError: entry,
    recentErrors: history,
  });

  console.error(`[visitor-tracker] ${stage}`, error, details);
};

const fetchWithTimeout = async (resource, options = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(resource, {
      ...options,
      signal: controller.signal,
      cache: 'no-store',
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const fetchIpContext = async () => {
  const geoResponse = await fetchWithTimeout('https://ipwho.is/', {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!geoResponse.ok) {
    throw new Error(`ipwho.is responded with ${geoResponse.status}`);
  }

  const geoData = await geoResponse.json();

  if (!geoData.success) {
    throw new Error(geoData.message || 'ipwho.is did not return a successful lookup');
  }

  return {
    ip: truncate(geoData.ip),
    city: truncate(geoData.city),
    country: truncate(geoData.country),
    region: truncate(geoData.region),
    isp: truncate(geoData.connection?.isp),
  };
};

const fetchIpFallback = async () => {
  const ipResponse = await fetchWithTimeout('https://api.ipify.org?format=json', {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!ipResponse.ok) {
    throw new Error(`api.ipify.org responded with ${ipResponse.status}`);
  }

  const ipData = await ipResponse.json();

  if (!ipData.ip) {
    throw new Error('api.ipify.org did not return an IP address');
  }

  return {
    ip: truncate(ipData.ip),
    city: 'Unknown',
    country: 'Unknown',
    region: 'Unknown',
    isp: 'Unknown',
  };
};

const buildVisitorMessage = (payload) => {
  const lines = [
    'New visitor logged:',
    `IP: ${payload.ip}`,
    `City: ${payload.city}`,
    `Country: ${payload.country}`,
    `Region: ${payload.region}`,
    `ISP: ${payload.isp}`,
    `UA: ${payload.userAgent}`,
    `Timestamp: ${payload.timestamp}`,
    `Page: ${payload.page}`,
    `Referrer: ${payload.referrer}`,
  ];

  if (payload.warnings.length > 0) {
    lines.push(`Warnings: ${payload.warnings.join(' | ')}`);
  }

  return truncate(lines.join('\n'), MAX_MESSAGE_LENGTH);
};

const postToDiscordWebhook = async (content) => {
  const response = await fetchWithTimeout(
    DISCORD_WEBHOOK_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
      keepalive: true,
    },
    8000,
  );

  if (!response.ok) {
    throw new Error(`Discord webhook responded with ${response.status}`);
  }
};

export const startVisitorTracking = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  if (safeStorageGet(window.sessionStorage, TRACKING_SENT_KEY) === 'true') {
    return;
  }

  if (!DISCORD_WEBHOOK_URL) {
    recordTrackingError('config', new Error('Missing Discord webhook URL'));
    return;
  }

  safeStorageSet(window.sessionStorage, TRACKING_SENT_KEY, 'pending');

  const warnings = [];
  let visitorContext;

  try {
    try {
      visitorContext = await fetchIpContext();
    } catch (geoError) {
      warnings.push(`Geolocation fallback used: ${truncate(geoError instanceof Error ? geoError.message : geoError, 200)}`);
      visitorContext = await fetchIpFallback();
    }

    const payload = {
      ...visitorContext,
      page: truncate(window.location.href),
      referrer: truncate(document.referrer || 'Direct'),
      timestamp: new Date().toISOString(),
      userAgent: truncate(window.navigator.userAgent, 700),
      warnings,
    };

    const content = buildVisitorMessage(payload);
    await postToDiscordWebhook(content);

    safeStorageSet(window.sessionStorage, TRACKING_SENT_KEY, 'true');
    setDebugState({
      status: 'sent',
      payload,
      recentErrors: readErrorHistory(),
    });
  } catch (error) {
    safeStorageRemove(window.sessionStorage, TRACKING_SENT_KEY);
    recordTrackingError('track-visitor', error, {
      page: window.location.href,
      warnings,
    });
  }
};
