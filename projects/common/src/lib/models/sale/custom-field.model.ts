export class CustomFieldModel {
  name: string;
  value: string;

  static fromJSON(json): CustomFieldModel {
    const customField = new CustomFieldModel();
    customField.name = json.name;
    customField.value = json.value;
    return customField;
  }
}
