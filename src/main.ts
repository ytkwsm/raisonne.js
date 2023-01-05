import config from './data/config.json'
import * as debug from './tools/debug'
import * as date from './tools/date'
import l10n from './data/l10n'
import layoutAll from './layout/all'
import layoutContents from './layout/contents'

export default class {
  settings: any;
  data: any;

  constructor(settings: any) {
      (async () => {
        await this.setup(config, settings, l10n);
        await this.renderAll(this.settings, this.data);
      })();
  }

  async setup(config: any, settings: any, l10n: any) {
    this.settings = {};
    this.settings.libName         = config.libName;
    this.settings.debug           = config.debug;
    this.settings.lang            = settings.lang || config.default.lang;
    this.settings.l10n            = l10n;
    this.settings.txt             = {};
    this.settings.txt.lang        = l10n.lang[this.settings.lang];
    this.settings.txt.dayWeek     = l10n.dayWeek[this.settings.lang];
    this.settings.txt.today       = l10n.today[this.settings.lang]
    this.settings.txt.thisMonth   = l10n.thisMonth[this.settings.lang]
    this.settings.txt.nextMonth   = l10n.nextMonth[this.settings.lang]
    this.settings.txt.prevMonth   = l10n.prevMonth[this.settings.lang]
    this.settings.txt.errorJson   = l10n.errorJson[this.settings.lang]
    this.settings.txt.errorMode   = l10n.errorMode[this.settings.lang]
    this.settings.date            = {};
    this.settings.date.start      = settings.dateStart  || config.default.dateStart;
    this.settings.date.todayFull  = date.getThis("todayFull");
    this.settings.date.thisYear   = date.getThis("thisYear");
    this.settings.date.thisMonth  = date.getThis("thisMonth");
    this.settings.date.today      = date.getThis("today");
    this.settings.date.term       = {};
    this.settings.date.term.start = {};
    this.settings.date.term.end   = {};
    this.settings.date.term.diff  = {};
    this.settings.wrapper         = settings.wrapper    || config.default.wrapper;
    this.settings.uniqueName      = settings.uniqueName || config.default.uniqueName;
    this.settings.mode            = settings.mode       || config.default.mode;
    this.settings.type            = settings.type       || config.default.type;
    this.settings.schedules       = settings.schedules  || config.default.schedules;
    this.data = {};
    this.data.path                = {};
    this.data.path.all            = {};
    this.data.path.close          = this.settings.schedules.close;
    this.data.path.holiday        = this.settings.schedules.holiday;
    this.data.path.special        = this.settings.schedules.special;
    this.data.things              = {};
    this.data.things.num          = {};
    this.data.things.main         = {};
    this.data.things.main.all     = {};
    this.data.things.main.year    = {};
    this.data.things.other        = {};
    this.data.things.other.all    = {};
    this.data.closeDay            = {};
    this.data.holiday             = {};
    this.data.specialDay          = {};
    return this.settings;
  }

  async getJson(jsonPath: string) {// toc.jsonの内容を取得
    debug.trace("start getJson");
    debug.trace(jsonPath);
    await fetch(jsonPath)
    .then(response => response.json())
    .then(data => {
      debug.trace(data);
      debug.trace("toc.json loaded");
      debug.trace(Object.keys([data]).length);
      this.data.things.num.year = data.year;
      this.data.path.main = data.path;
      this.data.path.all  = data.all;
    });
    debug.trace("end getJson");
  }

  async getThingsAll(jsonPath: string) {//toc.json記載のpathからjsonデータを取得
    debug.trace("start getThings");
    console.log(jsonPath);

    // allを取得して格納
    await fetch(jsonPath)
    .then(response => response.json())
    .then(data => {
      debug.trace(data);
      debug.trace("toc.json loaded");
      debug.trace(Object.keys([data]).length);
      this.data.things.main.all = data;
      this.data.things.num.mainAll = this.data.things.main.all.length;

      //UI描画用の日付関連を設定
      this.settings.date.term.start = date.getDetails(data[0].dateTermStart);
      this.settings.date.term.end = date.getDetails(data.slice(-1)[0].dateTermEnd);
      this.settings.date.term.diff = date.getTermDetails(this.settings.date.term.start, this.settings.date.term.end);
      this.settings.date.term.diff.days = date.getTermDiffDay(this.settings.date.term.start.fullStrDay, this.settings.date.term.end.fullStrDay);
    });
  }

  async getThingsMain(jsonPath: string) {//toc.json記載のpathからjsonデータを取得
    debug.trace("start getThings");
    debug.trace(this.data.path.main);
    debug.trace(Object.keys(this.data.path.main).length);
    console.log(jsonPath);

    //年ごとのjsonを取得して、ファイル名（20xx）の連想配列に格納
    for await(let i of jsonPath) {
      debug.trace(i);
      let dataObj: any;
      let responseData: any = {};
      await fetch(i)
      .then(response => response.json())
      .then(data => {
        debug.trace(data);
        debug.trace(i + " loaded");
        const fileName: string = i.match(/([^/]*)\./)[1];
        this.data.things.main.year[fileName] = data;
        responseData = data;
        return responseData;
      });
      dataObj = {...dataObj, ...responseData};
      console.log(dataObj);
      console.log("代入した！");
    }
    debug.trace("end getThings");
    return;
  }

  // async jointDataThingsMain(data: any) {
  //   debug.trace(Object.keys(data).length);
  //   debug.trace(data);
  //   debug.trace(Object.values(data));
  //   // debug.trace(Object.values(data).map());
  //   debug.trace(Object.values(data).length);


  //   // for(let i = 0; i < Object.values(data).length; i++) {
  //   //   console.log(i);
  //   //   // this.data.things.main.all = {...Object.values(data[i])};
  //   // }

  //   // const iterator = data.values();
  //   // console.log(iterator)
  //   // for(const value of iterator) {

  //   // }

  //   debug.trace(this.data.things.main.all);

  // }

  async renderAll(settings: any, data:any) {
    debug.trace("start renderAll");
    if(settings.schedules !== false) {
      await this.getJson(settings.schedules.event);
      await this.getThingsAll(this.data.path.all);
      await this.getThingsMain(this.data.path.main);
      // await this.jointDataThingsMain(this.data.things.main.year);
      await this.renderUi(settings, data);
      await this.renderContents(settings, data);
      debug.trace("testです。");
    } else {
      console.error(this.settings.txt.errorJson);
      return false;
    }
    debug.trace("end renderAll");
    debug.trace(settings);
    debug.trace(data);
  }

  async renderUi(settings: any, data: any) {
    debug.trace("start renderUi");
    await layoutAll(settings, data);
    debug.trace(this.data.things.num.year);
    debug.trace("end renderUi");
  }

  async renderContents(settings: any, data: any) {
    debug.trace("start renderContent");
    await layoutContents(settings, data);
    debug.trace("end renderContent");
  }
}



