import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home-chitietbaitap',
  templateUrl: './home-chitietbaitap.component.html',
  styleUrls: ['./home-chitietbaitap.component.scss'],
})
export class HomeChitietbaitapComponent {
  constructor(private titleService: Title) {}

  async ngOnInit() {
    this.titleService.setTitle('Chi tiết bài tập');
  }
}
