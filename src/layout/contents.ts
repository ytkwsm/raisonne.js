
import * as debug from '../tools/debug'
import * as date from '../tools/date'


export default function (settings: any, data:any){
    let target:any = {};
    // let htmlStr:String = "";
    let thingElem: any = {};
    let fragment: any = new DocumentFragment();

    debug.trace(data.things.main.all);
    if(settings.mode === "timeline" && settings.type === "event") {
        // let fragment = document.createDocumentFragment();
        target.all = document.querySelector<HTMLDivElement>(`[data-raisonne-elem="details"]`);
        // 各イベントレイアウトのためのstyleタグ生成
        target.style = document.createElement("style");
        target.style.textContent = `
            [data-raisonne-elem="timeline-event-detail"] {
                width: calc(${settings.date.term.diff.days } * var(--RaisonneGridUnitBase));
            }
        `;
        target.all.append(target.style);

        for(let i = 0; i < Object.keys(data.things.main.all).length; i++) {



            thingElem.wrapperAll = document.createElement("li");
            thingElem.wrapperAll.dataset.raisonneElem = "timeline-event-detail";

            // 各イベントレイアウトのためのstyleタグ生成
            thingElem.wrapperStyle = document.createElement("style");
            thingElem.wrapperStyle.textContent = `
                [data-raisonne-elem="timeline-event-detail-body"][data-raisonne-date-diff-start-all="${date.getTermDiffDay(settings.date.term.start.monthFirst.fullStrDay, data.things.main.all[i].dateTermStart)}"] {
                    margin-left: calc(${date.getTermDiffDay(settings.date.term.start.monthFirst.fullStrDay, data.things.main.all[i].dateTermStart)} * var(--RaisonneGridUnitBase));
                }

                [data-raisonne-date-diff-term-days="${date.getTermDiffDay(data.things.main.all[i].dateTermStart, data.things.main.all[i].dateTermEnd) + 1}"] [data-raisonne-elem="timeline-event-detail-duration-body"] ,
                [data-raisonne-date-diff-term-days="${date.getTermDiffDay(data.things.main.all[i].dateTermStart, data.things.main.all[i].dateTermEnd) + 1}"] [data-raisonne-elem="timeline-event-detail-duration-detail"] {
                    width: calc(var(--RaisonneGridUnitBase) * ${date.getTermDiffDay(data.things.main.all[i].dateTermStart, data.things.main.all[i].dateTermEnd) + 1});
                    height: var(--RaisonneGridUnitBase);
                    fill: var(--RaisonneColorTimelineEventDetailDuration);
                }
            `;
            thingElem.wrapperAll.append(thingElem.wrapperStyle);


            thingElem.wrapperHeader = document.createElement("header");
            thingElem.wrapperHeader.dataset.raisonneElem = "timeline-event-detail-header";
            thingElem.wrapperAll.append(thingElem.wrapperHeader);

            thingElem.wrapperBody = document.createElement("div");

            thingElem.duration = document.createElement("div");
            thingElem.duration.dataset.raisonneElem = "timeline-event-detail-duration";
            thingElem.duration.innerHTML = `
                <svg data-raisonne-elem="timeline-event-detail-duration-body" width="16" height="16" viewport="0, 0, 16, 16"  xmlns="http://www.w3.org/2000/svg">
                    <rect data-raisonne-elem="timeline-event-detail-duration-detail" x="0" y="0" width="16" height="16" rx="0" ry="0" fill="#0000ff" />
                </svg>`;
            thingElem.wrapperBody.append(thingElem.duration);

            thingElem.wrapperBody.dataset.raisonneElem = "timeline-event-detail-body";
            // このイベントの期間の日数
            thingElem.wrapperBody.dataset.raisonneDateDiffStartAll = `${date.getTermDiffDay(settings.date.term.start.monthFirst.fullStrDay, data.things.main.all[i].dateTermStart)}`;
            // json全体の開始日とこのイベントの開始日の間の日数
            thingElem.wrapperBody.dataset.raisonneDateDiffTermDays = `${date.getTermDiffDay(data.things.main.all[i].dateTermStart, data.things.main.all[i].dateTermEnd) + 1}`;
            thingElem.wrapperAll.append(thingElem.wrapperBody);


            thingElem.titleAll = document.createElement("h2");
            thingElem.titleAll.dataset.raisonneElem = "timeline-event-detail-title-wrapper";

            // titleCrown
            if(data.things.main.all[i].titleCrown) {
                thingElem.titleCrown = document.createElement("span");
                thingElem.titleCrown.dataset.raisonneElem = "timeline-event-detail-title-crown";
                thingElem.titleCrown.append(document.createTextNode(data.things.main.all[i].titleCrown));
                thingElem.titleAll.append(thingElem.titleCrown);
            }

            // titleMain
            thingElem.titleMain = document.createElement("span");
            thingElem.titleMain.dataset.raisonneElem = "timeline-event-detail-title-main";
            thingElem.titleMain.append(document.createTextNode(data.things.main.all[i].titleMain));
            thingElem.titleAll.append(thingElem.titleMain);

            // titleSub
            if(data.things.main.all[i].titleSub) {
                thingElem.titleSub = document.createElement("span");
                thingElem.titleSub.dataset.raisonneElem = "timeline-event-detail-title-sub";
                thingElem.titleSub.append(document.createTextNode(data.things.main.all[i].titleSub));
                thingElem.titleAll.append(thingElem.titleSub);
            }
            
            // titleSub
            if(data.things.main.all[i].dateTermStart && data.things.main.all[i].dateTermEnd) {
                thingElem.dateTerm = document.createElement("span");
                thingElem.dateTerm.dataset.raisonneElem = "timeline-event-detail-date-term";

                thingElem.dateTermStart = document.createElement("time");
                thingElem.dateTermStart.append(document.createTextNode(`${date.getDetails(data.things.main.all[i].dateTermStart).fullStrDaySlash}`));
                thingElem.dateTermStart.setAttribute("datetime", data.things.main.all[i].dateTermStart);
                thingElem.dateTermStart.setAttribute("class", "dateStart");
                thingElem.dateTermStart.dataset.raisonneElem = "timeline-event-detail-date-term-day";

                thingElem.dateTermEnd = document.createElement("time");
                thingElem.dateTermEnd.append(document.createTextNode(` – ${date.getDetails(data.things.main.all[i].dateTermEnd).fullStrDaySlash}`));
                thingElem.dateTermEnd.setAttribute("datetime", data.things.main.all[i].dateTermEnd);
                thingElem.dateTermEnd.setAttribute("class", "dateEnd");
                thingElem.dateTermEnd.dataset.raisonneElem = "timeline-event-detail-date-term-day";

                thingElem.dateTerm.append(thingElem.dateTermStart);
                thingElem.dateTerm.append(thingElem.dateTermEnd);

                // thingElem.dateTerm.append(document.createTextNode(`${data.things.main.all[i].dateTermStart} - ${data.things.main.all[i].dateTermEnd}`));
                thingElem.wrapperBody.append(thingElem.dateTerm);
            }
            thingElem.wrapperHeader.append(thingElem.titleAll);


            fragment.append(thingElem.wrapperAll);
            console.log(i);
            console.log(fragment);
        }
        target.all.append(fragment);

    } else if(settings.mode === "monthly") {
        debug.trace("monthly!");
    } else if(settings.mode === "daily") {
        debug.trace("daily!");
    } else {
        console.error(settings.txt.errorMode);
    }
    // target.detail = document.querySelector<HTMLDivElement>(`[data-raisonne-elem="details"]`);

    // for(let i = 0; i < Object.keys(settings.things.data).length; i++) {
    //     let wrapper = document.createElement('div');
    //     let title   = document.createElement('h2');
    //     title.append(document.createTextNode(settings.things.data[i].));
    //     fragment.append(child1);
    // }
}