import { loadRuntimeConfig } from '../config/runtime';

export interface QuestionCreatedPayload {
  questionId: number | string;
}

const withTimeout = async (url: string, options: RequestInit, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

export const webhookService = {
  async sendQuestionCreated(payload: QuestionCreatedPayload): Promise<void> {
    const runtimeConfig = loadRuntimeConfig();

    if (!runtimeConfig.webhookUrl) {
      strapi.log.warn('QUESTION_WEBHOOK_URL is not configured. Skipping question webhook dispatch.');
      return;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (runtimeConfig.webhookAuthToken) {
      headers.Authorization = `Bearer ${runtimeConfig.webhookAuthToken}`;
    }

    const response = await withTimeout(
      runtimeConfig.webhookUrl,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      },
      runtimeConfig.webhookTimeoutMs
    );

    if (!response.ok) {
      throw new Error(`Question webhook failed with status ${response.status}`);
    }
  },
};
