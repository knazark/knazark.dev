import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ToggleService {
	public switch = new BehaviorSubject(false);

	constructor() {}
}
