import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  daysConfig: DayConfig[] = [];
  dateMulti: string[];
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi',
    daysConfig: this.daysConfig
  };

  constructor(public navCtrl: NavController) {
    this.daysConfig.push({cssClass:'calendar-style', date: new Date(),subTitle:'22'});
    console.log(this.daysConfig);
  }


  onChange($event) {
    console.log($event);
  }

}
