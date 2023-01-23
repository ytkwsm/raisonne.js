// import config from './data/config.json'
import { config } from './config/config-values';
import l10n from './config/config-l10n'
import * as debug from './tools/debug'
import * as date from './tools/date'
import EventManager from './tools/EventManager'
import IntersectionObserverManager from './tools/IntersectionObserverManager';
import layoutAll from './layout/all'
import layoutContents from './layout/contents'

export default class {
  settings: any;
  data: any;
  private eventManager: EventManager;
  // observerManager: IntersectionObserverManager;

  constructor(settings: any) {

    console.log(config);
    this.eventManager = new EventManager();
      (async () => {
        await this.setup(config, settings, l10n);
        await this.renderAll(this.settings, this.data);
      })();
  }

  async setup(config: any, settings: any, l10n: any) {
    this.settings = {};
    this.settings.libName               = config.libName;
    this.settings.debug                 = config.debug;
    this.settings.lang                  = settings.lang || config.default.lang;
    this.settings.l10n                  = l10n;
    this.settings.txt                   = {};
    this.settings.txt.lang              = l10n.lang[this.settings.lang];
    this.settings.txt.dayWeek           = l10n.dayWeek[this.settings.lang];
    this.settings.txt.today             = l10n.today[this.settings.lang]
    this.settings.txt.thisMonth         = l10n.thisMonth[this.settings.lang]
    this.settings.txt.nextMonth         = l10n.nextMonth[this.settings.lang]
    this.settings.txt.prevMonth         = l10n.prevMonth[this.settings.lang]
    this.settings.txt.errorJson         = l10n.errorJson[this.settings.lang]
    this.settings.txt.errorMode         = l10n.errorMode[this.settings.lang]
    this.settings.date                  = {};
    this.settings.date.start            = settings.dateStart  || config.default.dateStart;
    this.settings.date.todayFull        = date.getThis("todayFull");
    this.settings.date.thisYear         = date.getThis("thisYear");
    this.settings.date.thisMonth        = date.getThis("thisMonth");
    this.settings.date.today            = date.getThis("today");
    this.settings.date.term             = {};
    this.settings.date.term.start       = {};
    this.settings.date.term.end         = {};
    this.settings.date.term.diff        = {};
    this.settings.wrapper               = settings.wrapper    || config.default.wrapper;
    this.settings.uniqueName            = settings.uniqueName || config.default.uniqueName;
    this.settings.mode                  = settings.mode       || config.default.mode;
    this.settings.type                  = settings.type       || config.default.type;
    this.settings.schedules             = settings.schedules  || config.default.schedules;
    this.settings.obIntersection        = {};
    if(this.settings.mode == "timeline" && this.settings.type == "event") {
      this.settings.obIntersection.param = config.default.observe.event;
    };

    this.data = {};
    this.data.path                      = {};
    this.data.path.all                  = {};
    this.data.path.close                = this.settings.schedules.close;
    this.data.path.holiday              = this.settings.schedules.holiday;
    this.data.path.special              = this.settings.schedules.special;
    this.data.things                    = {};
    this.data.things.num                = {};
    this.data.things.main               = {};
    this.data.things.main.all           = {};
    this.data.things.main.year          = {};
    this.data.things.other              = {};
    this.data.things.other.all          = {};
    this.data.closeDay                  = {};
    this.data.holiday                   = {};
    this.data.specialDay                = {};
    this.data.things.gui                = {};
    this.data.things.gui.rangeDisplayDate = {};

    // if(this.settings.mode == "timeline" && this.settings.mode == "event) {
    //   this.settings.obIntersection = {};
    // };
    // this.
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
      // console.log(dataObj);
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

  async setDragScroll() {
    const board: any = document.querySelector('[data-raisonne-elem="contents"]');
    let target: any = document.querySelector('[data-raisonne-header-nav-elem="years"]');
    // let targetValue: any = "";

    let lastX: any = null;
    let lastY: any = null;

    let copyX: any = null;

    const down: any = event => {
      if (event.target !== board) return;
      console.log("test down");
      lastX = event.clientX;
      lastY = event.clientY;
      copyX = board.scrollLeft;
      target.style.setProperty('--libRaisonnePosTimelineScrollX', -1 * copyX + "px");
      
      board.addEventListener('mouseup', up)
      board.addEventListener('mousemove', move)
    }

    const up: any = event => {  
      console.log("test up");
      lastX = null;
      lastY = null;
      copyX = null;
      
      board.removeEventListener('mouseup', up)
      board.removeEventListener('mousemove', move)
    }

    const scroll: any = event => {
      if (event.target !== board) return;
      console.log("test scroll");

      lastX = event.clientX;
      lastY = event.clientY;
      copyX = board.scrollLeft;
      target.style.setProperty('--libRaisonnePosTimelineScrollX', -1 * copyX + "px");
    }

    const move: any = event => {
      if (!lastX || !lastY) return;
      console.log("test move");
      
      board.scrollLeft -= event.clientX - lastX;
      board.scrollTop -= event.clientY - lastY;
      target.style.setProperty('--libRaisonnePosTimelineScrollX', -1 * board.scrollLeft + "px");
      lastX = event.clientX;
      lastY = event.clientY;
      copyX = event.clientX;

    }

    board.addEventListener('mousedown', down)
    board.addEventListener('scroll', scroll)
  }

  async monitorVisibleThings() {
    // console.log(this.settings.obIntersection);
    // const elems = document.querySelectorAll(this.settings.obIntersection.param.monitorElem);
    // const options = {
    //   root: document.querySelector(this.settings.obIntersection.param.arg.root),
    //   rootMargin: this.settings.obIntersection.param.arg.rootMargin,
    //   threshold: this.settings.obIntersection.param.arg.threshold
    // }

    // const observer = new IntersectionObserverManager(options, this.settings.obIntersection.param.cb);
  
    // elems.forEach(elem => {
    //   observer.observe(elem);
    // });

    // function test() {

    // }

// 今回の交差を監視する要素
const boxes = document.querySelectorAll("[data-raisonne-header-nav-elem='day']");
let dataArray: Array<String> = [];

const options = {
    root: document.querySelector("[data-raisonne-elem='header']"),
    rootMargin: "0px 0px 0px -336px",
    threshold: [0, 0.5, 1]
};
const observer = new IntersectionObserver(doWhenIntersect, options);
// それぞれのboxを監視する
boxes.forEach(box => {
  observer.observe(box);
});

  /**
   * 交差したときに呼び出す関数
   * @param entries:
   */
  function doWhenIntersect(entries:any) {
    // 交差検知をしたもののなかで、isIntersectingがtrueのDOMを色を変える関数に渡す
    entries.forEach((entry: {
      intersectionRect(intersectionRect: any): unknown;
      intersectionRatio: number; isIntersecting: any; target: any; 
  }) => {

      if (entry.isIntersecting) {//交差時
        // activateIndex(entry.target);
        dataArray.push(entry.target.dataset.raisonneHeaderDateFull);
        dataArray = Array.from(new Set(dataArray));// 重複を削除
        dataArray = dataArray.sort(function(a, b){// 配列をソート
          return (a > b ? 1 : -1);
        });
        // console.log(dataArray)
      }
      if (!entry.isIntersecting) {//非交差時
        const deleteMonth = entry.target.dataset.raisonneHeaderDateFull
        dataArray = dataArray.filter(function(a) {// 重複を削除
          return a !== deleteMonth;
        });
        dataArray = dataArray.sort(function(a, b){// 配列をソート
          return (a > b ? 1 : -1);
        });
        // console.log(dataArray)
      }
      // console.log("current result");
      // console.log(dataArray);
    });
    hiddenEvents(dataArray);
    return dataArray;
  }

  function hiddenEvents(dates: Array<String>) {
    const eventDetails = document.querySelectorAll("[data-raisonne-elem='timeline-event-detail']");
    // console.log(target);
    const displayDates: any = {};
    displayDates.start = dates[0];
    displayDates.end   = dates.slice(-1)[0];

    eventDetails.forEach(detail => {
      const detailDates: any = {};
      // console.log(detail);
      // console.log(detail.getAttribute("data-raisonne-elem-event-date-start"));
      // console.log(detail.getAttribute("data-raisonne-elem-event-date-last"));
      detailDates.start = detail.getAttribute("data-raisonne-elem-event-date-start");
      detailDates.end   = detail.getAttribute("data-raisonne-elem-event-date-last");

      if(displayDates.start <= detailDates.end && displayDates.end >= detailDates.start){
        // $('#now6').text('今日は開始日〜終了日の間です。');
        detail.setAttribute("data-raisonne-elem-status-display", "true");
        detail.setAttribute("aria-hidden", "false");
      } else {
        // $('#now6').text('今日は開始日〜終了日外です。');
        detail.setAttribute("data-raisonne-elem-status-display", "false");
        detail.setAttribute("aria-hidden", "true");
      }
    });
  }

/**
 * 目次の色を変える関数
 * @param element
 */
function activateIndex(element: any) {
  let tempArray = [];
  // console.log(element.dataset);
  tempArray = element.dataset;
  // console.log("tempArray");
  // console.log(tempArray);
  return element.dataset;
  // // すでにアクティブになっている目次を選択
  // const currentActiveIndex = document.querySelector("#indexList .active");
  // // すでにアクティブになっているものが0個の時（=null）以外は、activeクラスを除去
  // if (currentActiveIndex !== null) {
  //   currentActiveIndex.classList.remove("active");
  // }
  // // 引数で渡されたDOMが飛び先のaタグを選択し、activeクラスを付与
  // const newActiveIndex = document.querySelector(`a[href='#${element.id}']`);
  // newActiveIndex.classList.add("active");
}


  }

  async renderAll(settings: any, data:any) {
    debug.trace("start renderAll");
    if(settings.schedules !== false) {
      await this.getJson(settings.schedules.event);
      await this.getThingsAll(this.data.path.all);
      await this.getThingsMain(this.data.path.main);
      // await this.jointDataThingsMain(this.data.things.main.year);
      await this.renderUi(settings, data);
      await this.renderContents(settings, data);

      await this.setDragScroll();
      await this.monitorVisibleThings();

      await this.destroy();
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

  async destroy() {
    this.eventManager.removeAllEventListeners();
  }
}



