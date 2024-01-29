import { StaticProvider, TemplateRef, Type } from '@angular/core';

export type TooltipComponent<C> = Type<C>;

/**
 * Represents the different types of content that can be used for tooltips.
 * This type accepts a TemplateRef, a string, a set of component options,
 * or a component type, allowing for a variety of tooltip content configurations.
 *
 * @typeParam C - The component type that will be used as content for the tooltip.
 * @typeParam D - The type of data that can be passed to the component.
 *
 * @example
 * // Using a string as tooltip content
 * <div [tooltip]="'Hello, World!'"></div>
 *
 * @example
 * // Using a TemplateRef as tooltip content
 * <ng-template #tooltipTemplate>...</ng-template>
 * <div [tooltip]="tooltipTemplate"></div>
 *
 * @example
 * // Using a component type as tooltip content
 * <div [tooltip]="MyComponent"></div>
 *
 * @example
 * // Using component options as tooltip content
 * <div [tooltip]="{ component: MyComponent, data: { ... }, providers: [ ... ] }"></div>
 */
export type TooltipType<C, D> = TemplateRef<unknown> | string | TooltipComponentConfig<C, D> | TooltipComponent<C>;

/**
 * Configuration interface for passing data to a tooltip component.
 *
 * @typeParam D - The type of data being passed to the component.
 * @typeParam D - The type of data being passed to the component.
 */
export interface TooltipComponentConfig<C = unknown, D = unknown> {
	/* Specifies the component to be used for the tooltip. */
	component: TooltipComponent<C>;
	data?: D;
	providers?: StaticProvider[];
}
