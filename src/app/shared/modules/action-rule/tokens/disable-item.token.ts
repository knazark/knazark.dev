import { InjectionToken, Signal } from '@angular/core';

export interface CanBeDisabled {
	readonly disabled$: Signal<boolean>;
}

export const DISABLE_ITEM = new InjectionToken<CanBeDisabled>('DISABLE_ITEM');
