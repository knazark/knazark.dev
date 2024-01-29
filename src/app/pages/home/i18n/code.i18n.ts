import { Code } from '@app/pages/home/enums/code.enum';

export const codeI18n: Record<Code, string> = {
	[Code.Update]: $localize`You can't update.`,
	[Code.Edit]: $localize`You can't edit.`,
};
