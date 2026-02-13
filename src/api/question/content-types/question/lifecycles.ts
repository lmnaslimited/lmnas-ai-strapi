import { webhookService } from '../../../../services/webhook-service';

export default {
  async afterCreate(event) {
    const questionId = event?.result?.id;

    if (!questionId) {
      strapi.log.warn('Question created event had no id. Skipping webhook dispatch.');
      return;
    }

    await webhookService.sendQuestionCreated({ questionId });
  },
};
