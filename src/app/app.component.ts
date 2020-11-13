import {Component, ViewEncapsulation, ElementRef, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {ToggleService} from './services/toggle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('wrapper') myDiv: ElementRef;

  constructor(public ToggleService: ToggleService) {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // @ts-ignore
    const pattern = Trianglify({
      cell_size: 20,
      x_colors: ["#001733", "#00364a", "#006464", "#d1b17e", "#eaddcc"]
    });

    this.myDiv.nativeElement.append(pattern.canvas())
  }

  public toggleClick(isActive: boolean) {
    this.ToggleService.switch.next(isActive);
  }
}
