import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home-kehoach',
  templateUrl: './home-kehoach.component.html',
})
export class HomeKehoachComponent {
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Kế hoạch');
  }
}
