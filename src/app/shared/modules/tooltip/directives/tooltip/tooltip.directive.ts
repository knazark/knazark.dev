import {
	AfterViewInit,
	ApplicationRef,
	Directive,
	ElementRef,
	inject,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import tippy, { Instance, sticky } from 'tippy.js';

import { environment } from '@env/environment';

import { TooltipOptionsDirective } from '../tooltip-options/tooltip-options.directive';

import { TooltipRef } from '../../classes/tooltip-ref.class';
import { TooltipType } from '../../interfaces/tooltip.interface';

@Directive({
	selector: '[tooltip]',
	standalone: true,
	hostDirectives: [],
})
export class TooltipDirective<D = unknown, C = unknown> implements OnChanges, AfterViewInit, OnDestroy {
	@Input() public tooltip!: TooltipType<D, C>;
	@Input() public tooltipDisabled = false;
	@Input() public tooltipDirection?: Position;
	@Input() public tooltipMinWidth?: number | `${number}`; // should be less or equal 260

	private inst?: Instance;

	private readonly tooltipOptions = inject(TooltipOptionsDirective, { optional: true });

	constructor(
		private readonly applicationRef: ApplicationRef,
		private readonly elementRef: ElementRef,
		private readonly viewContainerRef: ViewContainerRef
	) {}

	public ngOnChanges({ tooltip, tooltipDisabled, tooltipDirection }: SimpleChanges): void {
		if (!this.inst) {
			return;
		}

		if (tooltipDisabled) {
			this.toggleDisable(this.tooltipDisabled);
		}

		if (tooltipDirection) {
			this.inst.setProps({ placement: this.tooltipDirection });
		}

		if (tooltip) {
			this.inst.setContent(this.getTooltipContent(this.tooltip));

			if (!environment?.production) {
				console.warn(
					'[tooltip]: If you have some dynamic tooltip content its more performant to use <ng-template and update content inside ng-template as it not rerenders tippyjs.'
				);
			}
		}
	}

	public ngAfterViewInit(): void {
		this.inst = this.createTippy();
		this.toggleDisable(this.tooltipDisabled);
	}

	public ngOnDestroy(): void {
		this.inst?.destroy();
	}

	private toggleDisable(disable: boolean): void {
		const method = disable ? 'disable' : 'enable';
		this.inst?.[method]();
	}

	private createTippy(): Instance {
		if (!environment?.production) {
			this.validate();
		}

		return tippy(this.elementRef.nativeElement as HTMLElement, {
			zIndex: 2000,
			maxWidth: 280,
			arrow: true,
			sticky: true,
			allowHTML: true,
			interactive: true,
			hideOnClick: false,
			animation: 'scale-subtle',
			placement: this.tooltipDirection || this.tooltipOptions?.options?.direction || 'top',
			content: this.getTooltipContent(this.tooltip),
			plugins: [sticky],
			appendTo: document.body,
		});
	}

	private getTooltipContent(tooltip: TooltipType<D, C>): HTMLElement {
		const content = document.createElement('div');
		const minWidth = this.tooltipMinWidth || this.tooltipOptions?.options?.minWidth;
		minWidth && (content.style.minWidth = `${minWidth}px`);

		if (typeof tooltip === 'string' || !tooltip) {
			content.textContent = tooltip;

			return content;
		}

		if (tooltip instanceof TemplateRef) {
			const templateView = tooltip.createEmbeddedView({});
			this.applicationRef.attachView(templateView);

			content.append(...templateView.rootNodes);

			return content;
		}

		if ('component' in tooltip) {
			const component = this.viewContainerRef.createComponent(tooltip.component, {
				injector: Injector.create({
					providers: [
						{ provide: TooltipRef, useValue: new TooltipRef<D>(tooltip.data as D) },
						[...(tooltip.providers || [])],
					],
				}),
			});

			return component.location.nativeElement;
		}

		return this.viewContainerRef.createComponent(tooltip).location.nativeElement;
	}

	private validate(): void {
		const disabledAttr = this.elementRef.nativeElement.getAttribute('disabled');

		if (disabledAttr != null) {
			console.warn(
				'[tooltip]: If you are using the [disabled] attribute with the tooltip directive you will disable the tooltip directive as well, because directive events are now blocked. To work around you should wrap your component with an extra div/span and place a tooltip directive there instead. More info on official docs: https://atomiks.github.io/tippyjs/v6/constructor/#disabled-elements'
			);
		}
	}
}
