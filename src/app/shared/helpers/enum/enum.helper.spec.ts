import { EnumHelper } from './enum.helper';

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

describe('EnumHelperClass', () => {
	describe('check getEnumValues function', () => {
		it('should get all values of number enum', () => {
			const { Active, Pending, Deleted } = TestEnumStatus;
			const enumValues = [Active, Pending, Deleted].sort();

			expect(EnumHelper.getEnumValues(TestEnumStatus).sort()).toEqual(enumValues);
		});

		it('should get all values of string enum', () => {
			const { Type1, Type2 } = TestEnumType;
			const enumValues = [Type1, Type2].sort();

			expect(EnumHelper.getEnumValues(TestEnumType).sort()).toEqual(enumValues);
		});

		it('should get all values of mixed enum', () => {
			const { Type1, Type2 } = TestEnumMixed;
			const enumValues = [Type1, Type2].sort();

			expect(EnumHelper.getEnumValues(TestEnumMixed).sort()).toEqual(enumValues);
		});
	});
});
