import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import {Transparentstatusbar } from 'cordova-plugin-transparent-status-bar';
import { CodePush } from '@ionic-native/code-push';
import { DEBUG, CODE_PUSH_DEPLOYMENT_KEY } from './constants';

import { TabsPage } from '../pages/tabs/tabs';
declare var window;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public codePush: CodePush
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.overlaysWebView(true);
      splashScreen.hide();
      if (window.cordova) {
        window.Transparentstatusbar.init(function (result) {
          // alert(result);
          // ....
        });
      }
      this.sync();
    });
  }

  sync() {
    //如果不是真机环境return
    if (!this.isMobile()) return;
    //发布的key
    let deploymentKey = '';
    //如果是Android环境 并且是 debug模式
    if (this.isAndroid() && DEBUG.IS_DEBUG) {
      deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.ANDROID.Staging;
    }
    if (this.isAndroid() && !DEBUG.IS_DEBUG) {
      deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.ANDROID.Production;
    }
    if (this.isIos() && DEBUG.IS_DEBUG) {
      deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.IOS.Staging;
    }
    if (this.isIos() && !DEBUG.IS_DEBUG) {
      deploymentKey = CODE_PUSH_DEPLOYMENT_KEY.IOS.Production;
    }

    // const downloadProgress = (progress) => { console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`); }
    // this.codePush.sync({}, downloadProgress).subscribe((syncStatus) => console.log(syncStatus));

    //热更新同步
    this.codePush.sync({
      deploymentKey: deploymentKey,
      updateDialog: true
    }).subscribe((syncStatus) => {
      console.log('调用sync后', syncStatus);
      if( syncStatus === 1){
        this.codePush.restartApplication();
      }
    });
  }

  /**
 * 是否是真机环境
 * @returns {boolean}
 * @memberof NativeService
 */
  isMobile(): boolean {
    return this.platform.is("mobile") && !this.platform.is("mobileweb");
  }

  /**
   * 是否android真机环境
   * @returns {boolean}
   * @memberof NativeService
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is("android");
  }

  /**
   * 是否是ios真机环境
   * @returns {boolean}
   * @memberof NativeService
   */
  isIos(): boolean {
    return this.isMobile && (this.platform.is("ios") || this.platform.is("ipad") || this.platform.is("iphone"));
  }


}
