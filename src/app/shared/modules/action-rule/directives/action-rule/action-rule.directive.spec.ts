import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import { ActionRuleI18nDirective } from '../action-rule-i18n/action-rule-i18n.directive';
import { ActionRuleDirective } from './action-rule.directive';

import { ActionRuleMock } from '../../mocks/action-rule.mock';

describe('ActionRuleDirective', () => {
	let spectator: SpectatorDirective<ActionRuleDirective<string>>;
	const createDirective = createDirectiveFactory({
		imports: [ActionRuleI18nDirective],
		directive: ActionRuleDirective,
	});

	let rule: Nullable<ActionRuleMock>;
	let i18n: Record<string, string>;

	beforeEach(() => {
		rule = new ActionRuleMock<string>(['1', '2']).setAsAllowed();
		i18n = { '1': 'First error', '2': 'Second error' };
	});

	beforeEach(() => {
		spyOn(console, 'error');
	});

	it('should handle rule changes when rule is empty at the start', () => {
		spectator = createDirective(`<div id="target" *actionRule="rule; i18n: i18n"></div>`, {
			hostProps: { rule: null, i18n },
		});

		expect(spectator.query('#target'))
			.withContext('should create and not disable if rule is null')
			.not.toHaveClass('disabled');

		spectator.setInput('rule', new ActionRuleMock<string>(['1', '2']).setAsAllowed());
		expect(spectator.query('#target'))
			.withContext('should update and not disable if rule is allowed')
			.not.toHaveClass('disabled');

		spectator.setInput('rule', new ActionRuleMock<string>(['1', '2']).setAsDisallowed(null));
		expect(spectator.query('#target')).withContext('should destroy if not allowed and empty code').not.toExist();

		spectator.setInput('rule', new ActionRuleMock<string>(['1', '2']).setAsDisallowed('1'));
		expect(spectator.query('#target'))
			.withContext('should recreate and disable if rule is not allowed with existing code')
			.toHaveClass('disabled');

		spectator.setInput('rule', new ActionRuleMock<string>(['1', '2']).setAsDisallowed('not_exist'));
		expect(console.error)
			.withContext('should error about missing key')
			.toHaveBeenCalledOnceWith(jasmine.any(String));
		expect(spectator.query('#target'))
			.withContext('should remain disable if rule is not allowed with non existing code')
			.toHaveClass('disabled');
	});

	it('should handle rule changes when rule exists at the start', () => {
		spectator = createDirective(`<div id="target" *actionRule="rule; i18n: i18n"></div>`, {
			hostProps: { rule, i18n },
		});

		expect(spectator.query('#target'))
			.withContext('should create and not disable if allowed rule')
			.not.toHaveClass('disabled');

		spectator.setInput('rule', new ActionRuleMock<string>(['1', '2']).setAsDisallowed('1'));
		expect(spectator.query('#target'))
			.withContext('should recreate and disable if rule is not allowed with existing code')
			.toHaveClass('disabled');

		spectator.setInput('rule', new ActionRuleMock<string>(['1', '2']).setAsDisallowed(null));
		expect(spectator.query('#target')).withContext('should destroy if not allowed and empty code').not.toExist();

		spectator.setInput('rule', new ActionRuleMock<string>(['1', '2']).setAsDisallowed('1'));
		expect(spectator.query('#target'))
			.withContext('should recreate and disable if rule is not allowed with existing code')
			.toHaveClass('disabled');

		spectator.setInput('rule', null);
		expect(spectator.query('#target')).withContext('should update if rule is null').not.toHaveClass('disabled');

		spectator.setInput('rule', new ActionRuleMock<string>(['1', '2']).setAsDisallowed('not_exist'));
		expect(console.error)
			.withContext('should error about missing key')
			.toHaveBeenCalledOnceWith(jasmine.any(String));
		expect(spectator.query('#target'))
			.withContext('should recreate and disable if rule is not allowed with non existing code')
			.toHaveClass('disabled');
	});

	it('should get i18n from parent [actionRuleI18n] directive', () => {
		spectator = createDirective(
			`
				<ng-container [actionRuleI18n]="i18n">
					<div id="target" *actionRule="rule"></div>
				</ng-container>
			`,
			{ hostProps: { rule, i18n } }
		);

		spectator.setInput('rule', new ActionRuleMock<string>(['1', '2']).setAsDisallowed('1'));
		expect(spectator.query('#target'))
			.withContext('should recreate and disable if rule is not allowed with existing code')
			.toHaveClass('disabled');
	});
});
