export class WebhookEventModel {
  name: string;
  event: string;

  constructor(name: string, event: string) {
    this.name = name;
    this.event = event;
  }
}
