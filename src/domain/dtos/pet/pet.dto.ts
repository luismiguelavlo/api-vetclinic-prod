export class CreatePetDto {
  constructor(
    public readonly weight: number,
    public readonly name: string,
    public readonly breed: string,
    public readonly specieId: string
  ) {}

  static execute(object: { [key: string]: any }): [string?, CreatePetDto?] {
    const { weight, name, breed, specieId } = object;

    if (!weight) return ['Weight is required'];
    if (typeof weight !== 'number') return ['Weight must be a number'];
    if (weight <= 0) return ['Weight must be a positive number'];
    if (!name) return ['Name is required'];
    if (!breed) return ['Breed is required'];
    if (!specieId) return ['SpecieId is required'];

    return [
      undefined,
      new CreatePetDto(
        weight,
        name.trim().toLowerCase(),
        breed.trim().toLowerCase(),
        specieId.trim().toLowerCase()
      ),
    ];
  }
}
