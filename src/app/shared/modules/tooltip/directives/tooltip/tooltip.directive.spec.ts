import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import { TooltipDirective } from './tooltip.directive';
import { TooltipDirectivePO } from './tooltip.directive.po';

/**
 * TODO: move to components and refactor this tests with e2e
 *
 * NOTE: tippy has some props unique to test environment in order to remove animations and positioning
 * @see frontend/angular/src/test.ts
 */
xdescribe('TooltipDirective', () => {
	let tooltipDirectivePO: TooltipDirectivePO;
	let spectator: SpectatorDirective<TooltipDirective>;
	const createDirective = createDirectiveFactory(TooltipDirective);

	beforeEach(() => {
		spyOn(console, 'warn');
	});

	it('should show/hide tooltip', async () => {
		spectator = createDirective(`<button tooltip="Some text">Hover me</button>`);
		tooltipDirectivePO = new TooltipDirectivePO(spectator);

		await tooltipDirectivePO.show();
		expect(tooltipDirectivePO.element.textContent).toEqual('Some text');

		await tooltipDirectivePO.hide();
		expect(tooltipDirectivePO.element).toBeFalsy();
	});

	it('should render tooltip from template', async () => {
		spectator = createDirective(
			`
				<ng-template #tooltip><b>Bold {{ templateText }}</b></ng-template>
				<button [tooltip]="tooltip">Hover me</button>
			`,
			{ hostProps: { templateText: 'text' } }
		);
		tooltipDirectivePO = new TooltipDirectivePO(spectator);

		await tooltipDirectivePO.show();
		expect(tooltipDirectivePO.content.innerHTML).toEqual('<div><b>Bold text</b></div>');

		spectator.setHostInput({ templateText: 'dynamic text' });
		expect(tooltipDirectivePO.content.innerHTML).toEqual('<div><b>Bold dynamic text</b></div>');
	});

	it('should update direction', async () => {
		spectator = createDirective(`<button tooltip="Some text" tooltipDirection="bottom">Hover me</button>`);
		tooltipDirectivePO = new TooltipDirectivePO(spectator);

		await tooltipDirectivePO.show();
		expect(tooltipDirectivePO.direction).toEqual('bottom');

		spectator.setInput({ tooltipDirection: 'right' });
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(tooltipDirectivePO.direction).toEqual('right');
	});

	it('should update tooltip', async () => {
		spectator = createDirective(`<button tooltip="Some text">Hover me</button>`);
		tooltipDirectivePO = new TooltipDirectivePO(spectator);

		await tooltipDirectivePO.show();
		expect(tooltipDirectivePO.element.textContent).toEqual('Some text');
		expect(console.warn).not.toHaveBeenCalled();

		spectator.setInput({ tooltip: 'Other tooltip' });
		expect(tooltipDirectivePO.element.textContent).toEqual('Other tooltip');
		expect(console.warn).toHaveBeenCalledOnceWith(jasmine.any(String));
	});

	it('should not disable tooltip', async () => {
		spectator = createDirective(`<button tooltip="C S C" [tooltipDisabled]="true">Hover me</button>`);
		tooltipDirectivePO = new TooltipDirectivePO(spectator);

		await tooltipDirectivePO.show();
		expect(tooltipDirectivePO.element).toBeFalsy();

		spectator.setInput({ tooltipDisabled: false });

		await tooltipDirectivePO.show();
		expect(tooltipDirectivePO.element).toExist();
	});

	it('should warn about disabled attribute', () => {
		spectator = createDirective(`<button tooltip="Text" disabled>Hover me</button>`);

		expect(console.warn).toHaveBeenCalledOnceWith(jasmine.any(String));
	});
});
