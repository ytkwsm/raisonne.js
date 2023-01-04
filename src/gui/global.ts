import * as date from '../tools/date'

export function header(settings: any, data: any){ 
    return `<header data-raisonne-elem="header" class="raisonne-header">
            ${navController()}
            <div data-raisonne-header-nav-elem="years">
            ${navDay(settings, data)}
            </div>
            </header>`;
}

function navController()   { return `<div data-raisonne-header-nav-elem="controller"></div>`; }

export function navDay(settings: any, data: any)   {
    // let fragment: DocumentFragment = new DocumentFragment();
    let html: string = "";
    let dateNum: any = {};
    // let dayNavElem: any = {};
    dateNum.yearCnt = 1;
    dateNum.year = settings.date.term.start.year;
    if(settings.mode === "timeline" && settings.type === "event") {
        // let target = document.querySelector<HTMLDivElement>(`[data-raisonne-elem="header"]`);
        for(let i = 0; i < settings.date.term.diff.year; i++) {//年数分のループ

            html += `<div data-raisonne-header-nav-elem="year">`;

            if(dateNum.yearCnt == 1) {// 1年目

                for(let m = settings.date.term.start.month; m <= 12; m++) {//月のループ

                    html += `<div data-raisonne-header-nav-elem="month">
                    <h3 data-raisonne-header-nav-elem="month-label">${dateNum.year} / ${m}</h3>
                    <div data-raisonne-header-nav-elem="days">
                    `;

                    let monthDaysStr: string = String(dateNum.year + "-" + String(m).padStart(2, '0') + "-01");//日付分のループ用の数値抽出用の文字列を生成
                    let monthDaysNum: number = Number(date.getDetails(monthDaysStr).monthDays);//ループ用の数値に変換
                    for(let d = 1; d <= monthDaysNum; d++) {//日にちのループ
                        console.log(d);
                        let thisDate: string = String(dateNum.year + "-" + String(m).padStart(2, '0') + "-" + String(d).padStart(2, '0'));
                        html += `<span data-raisonne-header-nav-elem="day" 
                            data-raisonne-elem="timeline-event-nav-day"
                            data-raisonne-header-date-full="${monthDaysStr}"
                            data-raisonne-header-date-y="${dateNum.year}" 
                            data-raisonne-header-date-m="${m}" 
                            data-raisonne-header-date-d="${d}" 
                            data-raisonne-header-date-dw="${date.getDetails(thisDate).dayWeek}" >
                            
                            <span data-raisonne-header-nav-elem="day-num">${d}</span>
                            <span data-raisonne-header-nav-elem="day-week">${settings.txt.dayWeek[date.getDetails(thisDate).dayWeek]}</span>
                        
                        </span>`;
                    }

                    html += `</div></div>`;
                    console.log(html)

                }
                dateNum.year++
                dateNum.yearCnt++;
            }
            else if (dateNum.yearCnt == settings.date.term.diff.year) {//最終年
                for(let m = 1; m <= 12 - settings.date.term.end.monthNega; m++) {//月のループ
                    console.log(dateNum.year + "年" + m + "月");
                }
                return html;
            }
            else {//初年・最終年を除いた年
                for(let m = 1; m <= 12; m++) {//月のループ
                    console.log(dateNum.year + "年" + m + "月");
                }
                dateNum.year++
                dateNum.yearCnt++;
                return html;
            }


            html += `</div>`;
            console.log(html)
            return html;

        }
        return html;
    }
console.log(html)
return html;
}

export function footer(){ return `<footer data-raisonne-elem="footer" class="raisonne-footer">footer</footer>`; }