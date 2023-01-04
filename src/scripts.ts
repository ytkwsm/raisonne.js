import './scss/style.scss'
import './scss/raisonne.scss'
import Raisonne from './main'
let calendar = new Raisonne({
    lang: "ja"
   ,mode: "timeline"
   ,type: "event" // history or event
   ,uniqueName: "myTimeline"
   ,dayWeekStart: "sun"
   ,dateStart : "2023-01-01"
   ,dateRangeMonth: 1 
   ,schedules: {
        event: "/assets/json/events/toc.json"
       ,close: "/assets/json/utils/close.json"
       ,holiday: "/assets/json/utils/holiday.json"
       ,special: "/assets/json/utils/special.json"
   }
});