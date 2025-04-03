export class CreateSpecieDto {
  constructor(public readonly name: string) {}

  static execute(object: { [key: string]: any }): [string?, CreateSpecieDto?] {
    const { name } = object;

    if (!name) return ['Name is required'];
    if (name.length > 20) return ['Name is too long'];
    if (name.length < 3) return ['Name is too short'];

    return [undefined, new CreateSpecieDto(name.trim().toLowerCase())];
  }
}
