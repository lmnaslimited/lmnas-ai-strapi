export interface RuntimeConfig {
  webhookUrl?: string;
  webhookAuthToken?: string;
  webhookTimeoutMs: number;
}

const DEFAULT_WEBHOOK_TIMEOUT_MS = 5000;

const parseTimeout = (value?: string): number => {
  if (!value) {
    return DEFAULT_WEBHOOK_TIMEOUT_MS;
  }

  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return DEFAULT_WEBHOOK_TIMEOUT_MS;
  }

  return parsedValue;
};

export const loadRuntimeConfig = (): RuntimeConfig => ({
  webhookUrl: process.env.QUESTION_WEBHOOK_URL,
  webhookAuthToken: process.env.QUESTION_WEBHOOK_AUTH_TOKEN,
  webhookTimeoutMs: parseTimeout(process.env.QUESTION_WEBHOOK_TIMEOUT_MS),
});
