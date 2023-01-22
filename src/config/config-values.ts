import callbackObserveEvent from './func-config-cb-iso-event';

export const config = {
  libName: "Raisonne.js",
  debug: true,
  default: {
      lang: "ja",
      wrapper: "[data-raisonne-elem='wrapper']",
      uniqueName: false,
      mode: "timeline",
      type: "event",
      dateStart: "2022-12-27",
      dayWeekStart: "sun",
      dateRangeMonth: 1,
      schedules: false,
      observe: {
        event: {
          monitorElem: "[data-raisonne-header-nav-elem='month']",
          arg: {
            root: "[data-raisonne-elem='body']",
            rootMargin: "0px",
            threshold: [0, 0.5, 1]
          },
          cb: callbackObserveEvent
        }
      }
  }
};

// function callback(entries: IntersectionObserverEntry[]) {
//   entries.forEach(entry => {
//       if (entry.isIntersecting) {
//           // do something when the element is intersecting
//       }
//   });
// }