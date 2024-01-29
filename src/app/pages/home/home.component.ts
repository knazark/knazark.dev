import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Code } from '@app/pages/home/enums/code.enum';
import { codeI18n } from '@app/pages/home/i18n/code.i18n';
import { Rules } from '@app/pages/home/interfaces/rules.interface';

import { ActionRuleI18nDirective } from '@app/shared/modules/action-rule/directives/action-rule-i18n/action-rule-i18n.directive';
import { ActionRuleDirective } from '@app/shared/modules/action-rule/directives/action-rule/action-rule.directive';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	standalone: true,
	imports: [CommonModule, ActionRuleDirective, ActionRuleI18nDirective],
})
export class HomeComponent {
	public readonly codeI18n = codeI18n;
	public readonly rules: Rules = {
		canUpdate: {
			allowed: false,
			code: Code.Update,
		},
		canEdit: {
			allowed: true,
			code: Code.Edit,
		},
	};

	public onEditClick(): void {
		console.log('edit');
	}

	public onUpdateClick(): void {
		console.log('update');
	}
}
