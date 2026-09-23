export class SendgridSettingsModel {
  id: number;
  name: string;
  azureKeyVaultApiKeySecretName: string;
  azureKeyVaultWebhookVerificationKeySecretName: string;
  disabled = false;
  isDefault = false;

  static fromJSON(json: any): SendgridSettingsModel {
    const settings = new SendgridSettingsModel();

    settings.id = json.id ?? null;
    settings.name = json.name ?? null;
    settings.azureKeyVaultApiKeySecretName = json.azureKeyVaultApiKeySecretName ?? null;
    settings.azureKeyVaultWebhookVerificationKeySecretName = json.azureKeyVaultWebhookVerificationKeySecretName ?? null;
    settings.isDefault = json.isDefault;
    settings.disabled = json.disabled;
    return settings;
  }
}
