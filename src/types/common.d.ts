declare type BooleanNumber = 0 | 1;

declare type Nullable<T> = T | null | undefined;

declare type HTMLString = Opaque<'HTMLString', string>;

declare type JSONString = Opaque<'JSONString', string>;

declare type DeepPartial<T> = {
	[P in keyof T]?: Nullable<DeepPartial<T[P]>>;
};

declare type NullablePartial<T> = {
	[P in keyof T]?: Nullable<T[P]>;
};

declare type Position = 'left' | 'right' | 'top' | 'bottom';
