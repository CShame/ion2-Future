import { Component, ViewChild, ViewChildren, QueryList, NgZone, Renderer2 } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  @ViewChild('card') card: any;
  @ViewChild('scrollDiv') scrollDiv: any;
  @ViewChildren('item') items: QueryList<any>;
  @ViewChild('cardContent') cardContent: any;
  @ViewChild(Content) content: Content;

  selectedIndex = 0;
  topArr = [];
  navHeight = 40;   // 导航本身的高度
  topHeight = 200;  // 该导航的起始高度



  navList = [
    { title: '便民生活', id: '001' },
    { title: '财富管理', id: '002' },
    { title: '资金往来', id: '003' },
    { title: '购物娱乐', id: '004' },
    { title: '教育公益', id: '005' },
    { title: '第三方娱乐', id: '006' },
  ];


  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    private zone: NgZone,
    private renderer: Renderer2
  ) {


  }

  ionViewDidEnter() {
    //1. 得到每个锚点在文档中的高度
    for (let i = 0; i < this.navList.length; i++) {
      let obj; obj = {};
      obj.id = this.navList[i].id;
      obj.offsetTop = document.getElementById(obj.id).offsetTop;
      this.topArr.push(obj);
    }
    console.log(this.content);
    //2. 给最后一个锚点增加高度，确保最后一个能滚动到顶部
    const lastEle = document.getElementById(this.navList[this.navList.length - 1].id)
    const lastOneHeight = lastEle.getBoundingClientRect().height;
    const contentHeight = this.content._fixedContent.nativeElement.clientHeight;
    const needHeight = contentHeight - lastOneHeight - this.navHeight + 'px';
    this.renderer.setStyle(
      lastEle,
      'margin-bottom',
      needHeight
    );
  }

  ionScroll() {
    // console.log(this.content.scrollTop);
    let contentScrollTop = this.content.scrollTop;
    if (contentScrollTop >= this.topHeight) {
      this.scrollDiv.nativeElement.style.position = 'fixed';
    } else {
      this.scrollDiv.nativeElement.style.position = 'static';
    }

    // 计算每个锚点距离顶部的距离
    // 判断默认选中第一个
    if (this.topArr[0].offsetTop - contentScrollTop - this.navHeight >= 0) {
      this.zone.run(() => {
        this.selectedIndex = 0;
        let element = this.items.toArray()[0];
        this.card._scrollContent.nativeElement.scrollLeft = element.nativeElement.offsetLeft;
      })
    } else { // 判断默认选中第一个
      for (let i = 0; i < this.topArr.length; i++) {
        console.log(this.topArr[i].offsetTop - contentScrollTop);
        if (this.topArr[i].offsetTop - contentScrollTop < 2*this.navHeight && this.topArr[i + 1] && this.topArr[i + 1].offsetTop - contentScrollTop > 2*this.navHeight) {
          this.zone.run(() => {
            this.selectedIndex = i;
            let element = this.items.toArray()[i];
            this.card._scrollContent.nativeElement.scrollLeft = element.nativeElement.offsetLeft;
          })
          break;
        } else if(this.topArr[i].offsetTop - contentScrollTop >= 2*this.navHeight){ // 判断选中最后一个
          this.zone.run(() => {
            this.selectedIndex = i;
            let element = this.items.toArray()[i];
            this.card._scrollContent.nativeElement.scrollLeft = element.nativeElement.offsetLeft;
          })
          break;
        }
      }
    }
  }

  onTap(item, index) {
    this.selectedIndex = index;
    this.scrollDiv.nativeElement.style.position = 'fixed';
    let element = this.items.toArray()[index];
    this.card._scrollContent.nativeElement.scrollLeft = element.nativeElement.offsetLeft;
    this.scrollIntoView(item.id, index);
  }

  scrollIntoView(id, index) {
    let element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
      if (index !== this.navList.length - 1) {
        this.content._scrollContent.nativeElement.scrollTop = this.content._scrollContent.nativeElement.scrollTop - this.navHeight;
      }
    }
  }

}
