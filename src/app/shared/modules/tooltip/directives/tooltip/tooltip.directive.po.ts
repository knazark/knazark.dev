import { Spectator, SpectatorDirective } from '@ngneat/spectator';

export class TooltipDirectivePO {
	constructor(private readonly spectator: SpectatorDirective<unknown> | Spectator<unknown>) {}

	public get element(): HTMLElement {
		return this.spectator.query('.tippy-box', { root: true }) as HTMLElement;
	}

	public get content(): HTMLElement {
		return this.spectator.query('.tippy-content', { root: true }) as HTMLElement;
	}

	public get direction(): string {
		return this.element.getAttribute('data-placement') as string;
	}

	public async show(element: Element = this.spectator.element): Promise<void> {
		this.spectator.dispatchMouseEvent(element, 'mouseenter');
		await new Promise(resolve => setTimeout(resolve, 10));
	}

	public async hide(element: Element = this.spectator.element): Promise<void> {
		this.spectator.dispatchMouseEvent(element, 'mouseleave');
		await new Promise(resolve => setTimeout(resolve, 10));
	}
}
