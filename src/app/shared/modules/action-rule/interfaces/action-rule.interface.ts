export interface ActionRule<Code extends string = string> {
	allowed: boolean;
	code?: Nullable<Code>; // exist when allowed: false
	message?: Nullable<string>;
}
