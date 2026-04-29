export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): Email {
    if (!this.isValid(value)) {
      throw new Error('Invalid email format');
    }

    return new Email(value.toLowerCase());
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return this._value === other._value;
  }

  private static isValid(email: string): boolean {
    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
  }
}