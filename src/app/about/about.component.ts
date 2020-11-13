import {AfterViewInit, Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import {ToggleService} from '../services/toggle.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit, AfterViewInit {

  constructor(private ToggleService: ToggleService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ToggleService.switch.next(true);
    })

  }


}
