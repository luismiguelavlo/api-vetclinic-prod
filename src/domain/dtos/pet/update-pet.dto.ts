export class UpdatePetDto {
  constructor(
    public readonly weight: number,
    public readonly name: string,
    public readonly breed: string
  ) {}

  static execute(object: { [key: string]: any }): [string?, UpdatePetDto?] {
    const { weight, name, breed } = object;

    if (!weight) return ['Weight is required'];
    if (typeof weight !== 'number') return ['Weight must be a number'];
    if (weight <= 0) return ['Weight must be a positive number'];
    if (!name) return ['Name is required'];
    if (!breed) return ['Breed is required'];

    return [
      undefined,
      new UpdatePetDto(
        weight,
        name.trim().toLowerCase(),
        breed.trim().toLowerCase()
      ),
    ];
  }
}
