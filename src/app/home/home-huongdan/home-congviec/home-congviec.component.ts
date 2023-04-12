import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home-congviec',
  templateUrl: './home-congviec.component.html',
  styleUrls: ['./home-congviec.component.scss'],
})
export class HomeCongviecComponent {
  public static maDT: string = '';

  constructor(private titleService: Title) {}

  async ngOnInit() {
    this.titleService.setTitle('Dach sách bài tập');
  }
}
