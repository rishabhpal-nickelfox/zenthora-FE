export class EnumHelper {
  static sort<E>(enumType, enumArray: any): E[] {
    return enumArray ? enumArray
        .sort((a, b) => Object.keys(enumType).indexOf(a) - Object.keys(enumType).indexOf(b)) :
      null;
  }

}
