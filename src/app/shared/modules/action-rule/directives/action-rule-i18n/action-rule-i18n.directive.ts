import { Directive, Input } from '@angular/core';

/**
 * Used to provide i18n for children *actionRule
 *
 * @example
 * 	<ng-container [actionRuleI18n]="codeI18n">
 * 		<button *actionRule="rules.can_update" i18n type="button" (click)="onEditClick()">
 * 			Edit
 * 		</button>
 * 	</ng-container>
 */
@Directive({
	standalone: true,
	selector: '[actionRuleI18n]',
})
export class ActionRuleI18nDirective<Code extends string> {
	@Input({ required: true, alias: 'actionRuleI18n' }) public i18n!: Record<Code, string>;
}
