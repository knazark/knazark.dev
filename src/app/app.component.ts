import {Component, ViewEncapsulation, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @ViewChild('wrapper') myDiv: ElementRef;

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

  public toggleClick() {

  }
}
