import {
	ComponentRef,
	Directive,
	inject,
	Input,
	OnChanges,
	signal,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';

import { TooltipWrapperComponent } from '@app/shared/modules/tooltip/components/tooltip-wrapper/tooltip-wrapper.component';

import { ActionRuleI18nDirective } from '../action-rule-i18n/action-rule-i18n.directive';

import { ActionRule } from '../../interfaces/action-rule.interface';

import { CanBeDisabled, DISABLE_ITEM } from '../../tokens/disable-item.token';

/**
 * Used to show a tooltip and disable element if rule is not allowed in other cases render the element as normal
 *
 * NOTE: hides element when the code is null (Can be discussed, maybe we need just to disable the element, not hide)
 *
 * @example
 * 	// passing i18n directly
 * 	<button *actionRule="rules.can_update; i18n: codeI18n" i18n type="button" (click)="onEditClick()">
 * 		Edit
 * 	</button>
 *
 * 	// passing i18n via parent directive
 * 	<ng-container [actionRuleI18n]="codeI18n">
 * 		<button *actionRule="rules.can_update" i18n type="button" (click)="onEditClick()">
 * 			Edit
 * 		</button>
 * 	</ng-container>
 */
@Directive({
	standalone: true,
	selector: '[actionRule]',
	providers: [{ provide: DISABLE_ITEM, useExisting: ActionRuleDirective }],
})
export class ActionRuleDirective<Code extends string> implements OnChanges, CanBeDisabled {
	@Input({ required: true, alias: 'actionRule' }) public rule!: Nullable<ActionRule<Code>>;
	@Input({ alias: 'actionRuleI18n' }) public i18n?: Record<Code, string>;
	@Input({ alias: 'actionRuleDirection' })
	public direction?: Position;

	public disabled$ = signal(false);

	private wrapperRef!: ComponentRef<TooltipWrapperComponent>;

	private isRendered = false;

	private readonly actionRuleI18nDirective = inject<ActionRuleI18nDirective<Code>>(ActionRuleI18nDirective, {
		optional: true,
	});

	constructor(
		private readonly templateRef: TemplateRef<unknown>,
		private readonly viewContainerRef: ViewContainerRef
	) {}

	public ngOnChanges(): void {
		if (this.isRendered) {
			this.isRender(this.rule) ? this.update() : this.clear();
		}

		if (!this.isRendered) {
			this.isRender(this.rule) ? this.render() : this.clear();
		}
	}

	private render(): void {
		const tooltip = this.getTooltip(this.rule);
		const isDisabled = this.isDisabled(this.rule);

		// this.viewContainerRef.createEmbeddedView(this.templateRef, this);
		this.wrapperRef = this.viewContainerRef.createComponent(TooltipWrapperComponent);
		this.wrapperRef.instance.templateRef = this.templateRef;
		this.wrapperRef.instance.tooltip = tooltip;
		this.wrapperRef.instance.tooltipDisabled = !tooltip;
		this.wrapperRef.instance.elementDisable = isDisabled;
		this.direction && (this.wrapperRef.instance.tooltipDirection = this.direction);

		// this.disabled$.set(isDisabled);
		this.isRendered = true;
	}

	private clear(): void {
		this.viewContainerRef.clear();
		this.isRendered = false;
	}

	private update(): void {
		const tooltip = this.getTooltip(this.rule);
		const isDisabled = this.isDisabled(this.rule);

		this.wrapperRef.instance.tooltip = tooltip;
		this.direction && (this.wrapperRef.instance.tooltipDirection = this.direction);
		this.wrapperRef.instance.updateTooltipDisabled(!tooltip, isDisabled);

		// this.disabled$.set(isDisabled);
	}

	private getTooltip(rule: Nullable<ActionRule<Code>>): string {
		// if no rule => no tooltip
		if (!rule || rule.allowed || !rule.code) {
			return '';
		}

		const i18n = this.getI18n();

		if (!i18n[rule.code]) {
			console.error(
				`[ActionRuleTooltipDirective] cant find translation for code "${rule.code}". Please, check your i18n object and add the code there.`
			);
		}

		return i18n[rule.code] || '';
	}

	private isDisabled(rule: Nullable<ActionRule<Code>>): boolean {
		// if no rule => not disable
		if (!rule) {
			return false;
		}

		return !rule.allowed;
	}

	private isRender(rule: Nullable<ActionRule<Code>>): boolean {
		// if no rule => render
		if (!rule) {
			return true;
		}

		// if not allowed and there is no code => not render
		if (!rule.allowed) {
			return !!rule.code;
		}

		return true;
	}

	private getI18n(): Record<Code, string> {
		if (this.i18n || this.actionRuleI18nDirective?.i18n) {
			return {
				...this.actionRuleI18nDirective?.i18n,
				...this.i18n,
			} as Record<Code, string>;
		}

		throw new Error(
			`[ActionRuleTooltipDirective] cant find translation object. Please, provide i18n with wrapper [actionRuleI18n]="transactionCodeI18n" or directly to *actionRule="rule; i18n: transactionCodeI18n".`
		);
	}
}
