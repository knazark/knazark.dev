import { faker } from '@faker-js/faker';
import { isArray, isNil, isObject, keyBy, map, mapValues, toNumber } from 'lodash';

import { EnumHelper } from '@app/shared/helpers';

import { RandomArrayOfOptions } from '@app/test-module/interfaces/mock-data.interafce';

export class DataMockHelpers {
	public static readonly defaultNumberOfElements = 5;

	/**
	 * With random chance set data for field OR set field to null.
	 * Can be used in case of optional field
	 *
	 * @example
	 * public name = faker.name.fullName(); // name is required
	 * public age = this.randomNull(faker.datatype.number()); // age is optional. Randomly can be null
	 *
	 * @param data - Data that will be applied to field
	 */
	public static randomNull<T>(data: T): T | undefined {
		return faker.datatype.boolean() ? data : undefined;
	}

	/** Return true or false */
	public static randomBoolean(): boolean {
		return faker.datatype.boolean();
	}

	public static randomOsFamily(): string {
		return DataMockHelpers.randomArrayElement(['Windows', 'Mac OS X', 'Linux']);
	}

	public static randomUaFamily(): string {
		return DataMockHelpers.randomArrayElement(['Chrome', 'Mozilla', 'Opera']);
	}

	public static randomArrayElement<T>(array: T[]): T {
		return faker.helpers.arrayElement(array);
	}

	public static randomArrayElements<T>(array: T[]): T[] {
		return faker.helpers.arrayElements(array);
	}

	public static randomEnumElements<T extends Record<string, number | string>>(
		anEnum: Readonly<T>
	): Array<T[keyof T]> {
		const allItems = EnumHelper.getEnumValues(anEnum);
		return DataMockHelpers.randomArrayElements(allItems);
	}

	/**
	 * Generate array of elements
	 *
	 * Will throw MockDataArrayGenerationError
	 * in case while loop tries to generate 1 element more than 500 times
	 *
	 * @example
	 * this.randomArrayOf(() => this.randomEnum(Currency)); // ['USD', 'UAH'] ([Currency.USA, Currency.Ukraine])
	 *
	 * @param func - Function that will return new item
	 * @param options - Settings for generated array
	 */
	public static randomArrayOf<T>(func: (index: number) => T, options: RandomArrayOfOptions = {}): T[] {
		const isValidNumber = !isNaN(Number(options.number));
		const validNumber = Number(options.number) < 0 ? 0 : Number(options.number); // if number negative => set 0

		const number = isValidNumber ? validNumber : faker.datatype.number(DataMockHelpers.defaultNumberOfElements);
		const isUnique = options.isUnique ?? false;

		// Safer is a number of maximum while iteration for 1 item
		const safer = 500;
		let saferCount = 0;

		const result: T[] = [];

		while (result.length < number) {
			if (saferCount >= safer) {
				throw new Error(`Array generation function reach maximum of ${safer} iteration for 1 item`);
			}

			const item = func(result.length);

			if (isUnique && !result.includes(item)) {
				result.push(item);
				saferCount = 0;
			}

			if (!isUnique) {
				result.push(item);
				saferCount = 0;
			}

			saferCount++;
		}

		return result;
	}

	public static randomArrayClasses<T>(
		ClassRef: new (...args: any[]) => T,
		number: number = faker.datatype.number({ min: 1, max: DataMockHelpers.defaultNumberOfElements }),
		props: any[] = []
	): T[] {
		return Array.from({ length: number }, () => new ClassRef(...props));
	}

	/**
	 * Return random enum value
	 *
	 * @example
	 * public status = this.randomEnum(LeaseStatus); // Randomly return 0 or 1 or 2 etc
	 * public status = this.randomEnum(StripeStatus); // Randomly return 'active' or 'pending' or 'canceled' or 'incomplete'
	 *
	 * @param anEnum - TypeScript enum object
	 * @param exclude - value or list of values from enum object to exclude
	 */
	public static randomEnum<T extends Record<string, number | string>>(
		anEnum: Readonly<T>,
		exclude?: T[keyof T] | Array<T[keyof T]>
	): T[keyof T] {
		const allEnumValues = EnumHelper.getEnumValues(anEnum);

		const excludeArr = isArray(exclude) ? exclude : !isNil(exclude) ? [exclude] : [];

		return faker.helpers.arrayElement(allEnumValues.filter(value => !excludeArr.includes(value)));
	}

	public static randomValue<Enum extends Record<string, number | string>>(
		enumRef?: Readonly<Enum>
	): Enum[keyof Enum] | string | number {
		if (enumRef) {
			return faker.helpers.arrayElement([
				faker.random.word(),
				faker.datatype.number(),
				DataMockHelpers.randomEnum(enumRef),
			]);
		}

		return faker.helpers.arrayElement([faker.random.word(), faker.datatype.number()]);
	}
}

export class DataMock {
	public getRawObject<T extends object>(deep = true): T {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return DataMockHelpers.getRawObject(this, deep);
	}

	/**
	 * Update current class data from param data
	 *
	 * @param data - all class data
	 */
	protected updateSelf<T>(data?: Readonly<T> | null): void {
		if (!data) {
			return;
		}

		for (const optionKey in data) {
			if (Object.prototype.hasOwnProperty.call(data, optionKey)) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				this[optionKey] = data[optionKey];
			}
		}
	}

	protected getName(firstName: string, lastName: string): string {
		return `${firstName} ${lastName}`;
	}

	protected randomNull<T>(data: T): T | undefined {
		return DataMockHelpers.randomNull(data);
	}
}
