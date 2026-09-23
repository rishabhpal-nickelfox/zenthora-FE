export function checkDuplicateInObject(propertyName, inputArray) {
  let seenDuplicate = false;
  const testObject = {};

  inputArray.map(function (item) {
    const itemPropertyName = item[propertyName];
    if (itemPropertyName in testObject) {
      testObject[itemPropertyName].duplicate = true;
      item.duplicate = true;
      seenDuplicate = true;
    } else {
      testObject[itemPropertyName] = item;
    }
  });
  return seenDuplicate;
}
