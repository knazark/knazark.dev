import { Directive, Input } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[tooltipOptions]',
})
export class TooltipOptionsDirective {
	@Input({ required: true, alias: 'tooltipOptions' }) public options!: {
		direction?: Position;
		minWidth?: number;
	};
}
