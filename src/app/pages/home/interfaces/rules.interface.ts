import { Code } from '@app/pages/home/enums/code.enum';

import { ActionRule } from '@app/shared/modules/action-rule/interfaces/action-rule.interface';

export interface Rules {
	canEdit: ActionRule<Code>;
	canUpdate: ActionRule<Code>;
}
