import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	Renderer2,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { TooltipDirective } from '../../directives/tooltip/tooltip.directive';

@Component({
	selector: 'tooltip-wrapper',
	template: `
		<span
			#wrapperRef
			[tooltip]="tooltipRef"
			[tooltipDirection]="tooltipDirection"
			[tooltipDisabled]="tooltipDisabled"
			[tooltipMinWidth]="260"
			data-test="tooltip"
		>
			<ng-container *ngTemplateOutlet="templateRef"></ng-container>
		</span>

		<ng-template #tooltipRef>{{ tooltip }}</ng-template>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [NgTemplateOutlet, TooltipDirective],
	host: { class: 'tooltip-wrapper' },
})
export class TooltipWrapperComponent implements AfterViewInit {
	@Input({ required: true }) public tooltip!: TemplateRef<unknown> | string;
	@Input({ required: true }) public templateRef!: TemplateRef<unknown>;
	@Input() public tooltipDirection: Position = 'top';

	@ViewChild('wrapperRef', { static: true }) private readonly wrapperElementRef!: ElementRef;

	public elementDisable?: boolean;
	public tooltipDisabled = true;

	constructor(
		private readonly cdr: ChangeDetectorRef,
		public readonly renderer: Renderer2
	) {}

	public ngAfterViewInit(): void {
		this.updateTooltipDisabled(this.tooltipDisabled, this.elementDisable ?? !this.tooltipDisabled);
	}

	public updateTooltipDisabled(tooltipDisabled: boolean, elementDisable = !tooltipDisabled): void {
		const element = this.wrapperElementRef.nativeElement.firstChild as HTMLElement;
		elementDisable
			? this.renderer.setAttribute(element, 'disabled', 'true')
			: this.renderer.removeAttribute(element, 'disabled');

		this.tooltipDisabled = tooltipDisabled;
		this.cdr.detectChanges();
	}
}
