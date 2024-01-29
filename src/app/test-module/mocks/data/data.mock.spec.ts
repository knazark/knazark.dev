import { FormControl } from '@angular/forms';
import { phoneNumberValidator } from '@app/shared/modules/phone/validators/phone-number/phone-number.validator';
import { faker } from '@faker-js/faker';

import { EnumHelper } from '@app/shared/helpers';

import { DataMock, DataMockHelpers } from './data.mock';

import { SelectOption } from '@app/shared/interfaces/select-option.interface';
import { Country } from '@app/shared/modules/address/enums/country.enum';
import { UserRole } from '@app/shared/modules/user/enums/user-role.enum';

enum TestEnumStatus {
	Active,
	Pending,
	Deleted,
}

enum TestEnumType {
	Type1 = 'some_type_1',
	Type2 = 'some_type_2',
}

enum TestEnumMixed {
	Type1 = 'some_type_1',
	Type2 = 1,
}

const fixedArrayAmount = 5;

type RawDataTestMockObject = Omit<
	DataTestMock,
	'getRawObject' | 'someMethod' | 'getJsonApiSerialized' | 'getJsonApiSerializedList'
>;

class DataTestMock extends DataMock {
	public title = faker.random.word();

	public firstName = faker.name.firstName();
	public lastName = faker.name.lastName();
	public role = this.randomSimpleUserRole();
	public name = this.getName(this.firstName, this.lastName);

	public status = this.randomEnum(TestEnumStatus);
	public age? = this.randomNull(faker.datatype.number());

	/** Property to check getRawObject method */
	private _privateProp = 10;

	constructor(data?: Partial<DataTestMock>) {
		super();

		this.updateSelf(data);
	}

	/** Method to check getRawObject method */
	public someMethod(): number {
		return this._privateProp;
	}
}

describe('DataMock', () => {
	describe('check update self', () => {
		it('should set data from constructor', () => {
			const age = 1;
			const title = 'title';
			const status = TestEnumStatus.Active;

			const dataTest = new DataTestMock({ title, status, age });

			expect(dataTest.age).toEqual(age);
			expect(dataTest.title).toEqual(title);
			expect(dataTest.status).toEqual(status);
		});
	});

	it('should return full name', () => {
		const dataTest = new DataTestMock();

		expect(dataTest.name).toEqual(`${dataTest.firstName} ${dataTest.lastName}`);
	});

	describe('should return random data with MM/DD/YYYY format', () => {
		const randomDate = DataMockHelpers.randomDate();
		const [month, date, year] = randomDate.split('/');

		it('should return valid month', () => {
			const monthInYear = 12;
			const monthNumber = Number(month);
			const isValidMonth = monthNumber >= 1 && monthNumber <= monthInYear;

			expect(isValidMonth).toEqual(true);
		});

		it('should return valid date', () => {
			const maxMonthDate = 31;
			const dateNumber = Number(date);

			const isValidDate = dateNumber >= 1 && dateNumber <= maxMonthDate;

			expect(isValidDate).toEqual(true);
		});

		it('should return valid year', () => {
			const yearNumber = Number(year);

			expect(yearNumber).toBeGreaterThanOrEqual(1);
		});
	});

	it('should return random boolean', () => {
		const booleanNumber = DataMockHelpers.randomBooleanNumber();

		expect([0, 1].includes(booleanNumber)).toEqual(true);
	});

	it('should return one of UserRole', () => {
		const userRole = DataMockHelpers.randomUserRole();
		const allUserRoles = EnumHelper.getEnumValues(UserRole);

		expect(allUserRoles).toContain(userRole);
	});

	it('should return one of UserRole, but exclude single role', () => {
		const userRole = DataMockHelpers.randomUserRole({ exclude: UserRole.Tenant });

		expect(userRole).not.toEqual(UserRole.Tenant);
	});

	it('should return one of UserRole, but exclude multiple roles', () => {
		const userRole = DataMockHelpers.randomUserRole({ exclude: [UserRole.Tenant, UserRole.Owner] });

		expect(userRole).not.toEqual(UserRole.Owner);
		expect(userRole).not.toEqual(UserRole.Tenant);
	});

	it('should return one of [tenant, landlord, landlordAdmin, professional, owner]', () => {
		const userRole = DataMockHelpers.randomSimpleUserRole();

		expect([
			UserRole.Tenant,
			UserRole.Landlord,
			UserRole.LandlordAdmin,
			UserRole.Professional,
			UserRole.Owner,
		]).toContain(userRole);
	});

	it('should return one of admins user role', () => {
		const userRole = DataMockHelpers.randomAdminUserRole();

		expect([
			UserRole.Super,
			UserRole.Support,
			UserRole.Developer,
			UserRole.Devops,
			UserRole.Sale,
			UserRole.Marketing,
			UserRole.QA,
			UserRole.Legal,
		]).toContain(userRole);
	});

	describe('check randomEnum function', () => {
		it('should get random value from number enum', () => {
			const { Active, Pending, Deleted } = TestEnumStatus;
			const enumValues = [Active, Pending, Deleted];

			const enumValue = DataMockHelpers.randomEnum(TestEnumStatus);

			expect(enumValues.includes(enumValue)).toEqual(true);
		});

		it('should get random value from string enum', () => {
			const { Type1, Type2 } = TestEnumType;
			const enumValues = [Type1, Type2];

			const enumValue = DataMockHelpers.randomEnum(TestEnumType);

			expect(enumValues.includes(enumValue)).toEqual(true);
		});

		it('should get random value from mixed enum', () => {
			const { Type1, Type2 } = TestEnumMixed;
			const enumValues = [Type1, Type2];

			const enumValue = DataMockHelpers.randomEnum(TestEnumMixed);

			expect(enumValues.includes(enumValue)).toEqual(true);
		});

		it('should not return excluded value', () => {
			const { Active } = TestEnumStatus;

			const enumValue = DataMockHelpers.randomEnum(TestEnumStatus, Active);

			expect(enumValue).not.toEqual(Active);
		});

		it('should not return excluded values', () => {
			const { Active, Pending, Deleted } = TestEnumStatus;

			const enumValue = DataMockHelpers.randomEnum(TestEnumStatus, [Active, Deleted]);

			expect(enumValue).toEqual(Pending);
		});
	});

	describe('check select option/obj transformation', () => {
		const obg = {
			1: 'value1',
			some: 'value2',
		};

		const options: Array<SelectOption<1 | 'some'>> = [
			{ key: 1, value: 'value1' },
			{ key: 'some', value: 'value2' },
		];

		it('should transform object to select options', () => {
			expect(DataMockHelpers.transformObjToSelectOption(obg)).toEqual(options);
		});

		it('should transform select options to object', () => {
			expect(DataMockHelpers.transformSelectOptionToObj(options)).toEqual(obg);
		});
	});

	describe('check randomArrayOf function', () => {
		const fixedArray = DataMockHelpers.randomArrayOf(() => faker.datatype.number({ min: 0, max: 10 }), {
			number: fixedArrayAmount,
		});

		const uniqueArray = DataMockHelpers.randomArrayOf(() => faker.datatype.number({ min: 0, max: 10 }), {
			isUnique: true,
		});

		it('should return array', () => {
			expect(fixedArray.length).not.toBeNaN();
		});

		it('should return fixed number of elements', () => {
			expect(fixedArray.length).toEqual(fixedArrayAmount);
		});

		it('should return unique elements', () => {
			const set = new Set(uniqueArray);

			expect(uniqueArray.length).toEqual(set.size);
		});

		it('should handle infinity loop', () => {
			try {
				/*
				 * Due to boolean can be only true OR false there is only 2 unique values in array
				 * So if we set number of elements to 5, this will cause infinity loop as
				 * function will try to generate 3-rd unique element again and again
				 * to point where while reach 500 tries for 1 element to generate, and after that will
				 * throw MockDataArrayGenerationError to break infinity loop
				 */
				DataMockHelpers.randomArrayOf(() => faker.datatype.boolean(), { number: 5, isUnique: true });
			} catch (e) {
				return expect(e instanceof Error).toEqual(true);
			}

			throw new Error('Should be MockDataArrayGenerationError error thrown');
		});
	});

	describe('check getRawObject function', () => {
		it('should handle empty object', () => {
			expect(DataMockHelpers.getRawObject<object, object>({})).toEqual({});
		});

		it('should handle empty object in class', () => {
			class TestRawObjectClass extends DataMock {}
			const testRawObjectInstance = new TestRawObjectClass();

			expect(testRawObjectInstance.getRawObject<object>()).toEqual({});
		});

		it('should return only public properties from class', () => {
			class TestRawObjectClass extends DataMock {
				public prop1 = 20;
				public prop2 = { some: 1 };

				private _privateProp = 10;
				private _privateObject = { some: 10 };

				public someMethod(): number {
					return this._privateProp + this._privateObject.some;
				}
			}

			const testRawObjectInstance = new TestRawObjectClass();

			expect(testRawObjectInstance.getRawObject<object>()).toEqual({ prop1: 20, prop2: { some: 1 } });
		});

		it('should handle arrays of mock objects', () => {
			class TestRawObjectChildClass extends DataMock {
				public child = { some: 1 };
			}

			class TestRawObjectClass extends DataMock {
				public prop1 = [new TestRawObjectChildClass()];

				private _privateProp = 10;

				public someMethod(): number {
					return this._privateProp;
				}
			}

			const testRawObjectInstance = new TestRawObjectClass();

			expect(testRawObjectInstance.getRawObject<object>()).toEqual({ prop1: [{ child: { some: 1 } }] });
		});

		it('should handle array with primitives', () => {
			class TestRawPrimitiveArrayClass extends DataMock {
				public prop1 = [1, 2, 3];
				public prop2 = ['1', '2', '3'];
				public prop3 = 1;
				public prop4 = '1';

				private _privateProp = 10;

				public someMethod(): number {
					return this._privateProp;
				}
			}

			const testRawObjectInstance = new TestRawPrimitiveArrayClass();

			expect(testRawObjectInstance.getRawObject<object>()).toEqual({
				prop1: [1, 2, 3],
				prop2: ['1', '2', '3'],
				prop3: 1,
				prop4: '1',
			});
		});

		it('should handle nested objects', () => {
			class TestRawObjectChildClass extends DataMock {
				public child = { some: 1 };
			}

			class TestRawObjectClass extends DataMock {
				public prop1 = new TestRawObjectChildClass();

				private _privateProp = 10;

				public someMethod(): number {
					return this._privateProp;
				}
			}

			const testRawObjectInstance = new TestRawObjectClass();

			expect(testRawObjectInstance.getRawObject<object>()).toEqual({ prop1: { child: { some: 1 } } });
		});

		it('should not handle nested objects', () => {
			class TestRawObjectChildClass extends DataMock {
				public child = { some: 1 };
			}

			class TestRawObjectClass extends DataMock {
				public prop1 = new TestRawObjectChildClass();

				private _privateProp = 10;

				public someMethod(): number {
					return this._privateProp;
				}
			}

			const testRawObjectInstance = new TestRawObjectClass();

			expect(testRawObjectInstance.getRawObject<object>(false)).toEqual({
				prop1: new TestRawObjectChildClass(),
			});
		});

		it('should return only public properties from DataTestMock class', () => {
			const dataTest = new DataTestMock();
			const result: RawDataTestMockObject = {
				title: dataTest.title,

				firstName: dataTest.firstName,
				lastName: dataTest.lastName,
				role: dataTest.role,
				name: dataTest.name,

				status: dataTest.status,
				age: dataTest.age,
			};

			expect(dataTest.getRawObject<object>()).toEqual(result);
		});
	});

	describe('getJsonApiSerialized', () => {
		it('should serialized item', () => {
			class TestRawPrimitiveArrayClass extends DataMock {
				public id = '123';
				public prop1 = [1, 2, 3];

				private _privateProp = 10;

				public someMethod(): number {
					return this._privateProp;
				}
			}

			const testRawObjectInstance = new TestRawPrimitiveArrayClass();

			expect(DataMock.getJsonApiSerialized(testRawObjectInstance, 'test')).toEqual({
				data: {
					id: '123',
					type: 'test',
					attributes: { prop1: [1, 2, 3] },
				},
			});
		});
	});

	describe('getJsonApiSerializedList', () => {
		it('should serialized list', () => {
			class TestRawPrimitiveArrayClass extends DataMock {
				private _privateProp = 10;

				constructor(
					public id: string,
					public prop1: number[]
				) {
					super();
				}

				public someMethod(): number {
					return this._privateProp;
				}
			}

			const testRawObjectInstance1 = new TestRawPrimitiveArrayClass('17', [1, 2, 3]);
			const testRawObjectInstance2 = new TestRawPrimitiveArrayClass('22', [3, 4, 5]);

			expect(DataMock.getJsonApiSerialized([testRawObjectInstance1, testRawObjectInstance2], 'test')).toEqual({
				data: [
					{ type: 'test', id: '17', attributes: { prop1: [1, 2, 3] } },
					{ type: 'test', id: '22', attributes: { prop1: [3, 4, 5] } },
				],
			});
		});
	});

	describe('check hexToRgb', () => {
		it('should throw error if wrong format', () => {
			try {
				DataMockHelpers.hexToRgb('some_wrong_format');
				fail('Should throw error about wrong format.');
			} catch (e) {
				expect(e).toBeInstanceOf(Error);
			}
		});

		it('should transform 1', () => {
			expect(DataMockHelpers.hexToRgb('#bac3d2')).toEqual('rgb(186, 195, 210)');
		});

		it('should transform 2', () => {
			expect(DataMockHelpers.hexToRgb('#18b8d2')).toEqual('rgb(24, 184, 210)');
		});

		it('should transform 3', () => {
			expect(DataMockHelpers.hexToRgb('#41a541')).toEqual('rgb(65, 165, 65)');
		});

		it('should transform with custom format', () => {
			expect(DataMockHelpers.hexToRgb('#41a541', (r, g, b) => `${r}, ${g}, ${b}`)).toEqual('65, 165, 65');
		});
	});

	describe('check getExample', () => {
		it('should get example of the USA phone number', () => {
			expect(DataMockHelpers.randomPhone().charAt(0)).toEqual('1');
		});

		it('should get example of the Ukraine phone number', () => {
			expect(DataMockHelpers.randomPhone(Country.Ukraine)).toContain('380');
		});

		it('should be valid phone number from example', () => {
			const phoneNumber = DataMockHelpers.randomPhone(Country.Ukraine);
			const control = new FormControl(phoneNumber);

			expect(phoneNumberValidator()(control)).toBeNull();
		});
	});
});
