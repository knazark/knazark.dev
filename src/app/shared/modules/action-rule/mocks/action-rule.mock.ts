import { faker } from '@faker-js/faker';

import { EnumHelper } from '@app/shared/helpers';

import { DataMock } from '@app/test-module/mocks/data/data.mock';

import { ActionRule } from '../interfaces/action-rule.interface';

export class ActionRuleMock<Code extends string = string> extends DataMock implements ActionRule<Code> {
	public allowed = faker.datatype.boolean();
	public code = this.allowed ? null : this.randomCode();
	public message = this.randomNull(faker.lorem.word());

	/** codes - Array of errors or error enum */
	constructor(
		private readonly codes?: Code[] | Record<string, Code>,
		data?: Partial<ActionRule>
	) {
		super();

		if (data?.allowed === false) {
			data.code = data.code || this.randomCode();
		}

		this.updateSelf(data);
	}

	public setAsAllowed(): this {
		this.allowed = true;
		this.code = null;

		return this;
	}

	public setAsDisallowed(code: Nullable<Code> = this.randomCode()): this {
		this.allowed = false;
		this.code = code;

		return this;
	}

	public setTo(allowed: boolean, code: Nullable<Code> = this.randomCode()): this {
		return allowed ? this.setAsAllowed() : this.setAsDisallowed(code);
	}

	private randomCode(): Code {
		if (!this.codes) {
			return faker.random.word() as Code;
		}

		const errorCodes = Array.isArray(this.codes) ? this.codes : EnumHelper.getEnumValues(this.codes);

		return faker.helpers.arrayElement(errorCodes);
	}
}
