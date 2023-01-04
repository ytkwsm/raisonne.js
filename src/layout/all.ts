
import * as gui from '../gui/global'


export default function (settings: any, data: any){
    document.querySelector<HTMLDivElement>(`${settings.wrapper}`)!.innerHTML = `
    <div data-raisonne-elem="container" data-raisonne-mode="${settings.mode}" data-raisonne-type="${settings.type}" data-raisonne-unique-name="${settings.uniqueName}" data-raisonne-today-full="${settings.date.todayFull}" data-raisonne-this-year="${settings.date.thisYear}" data-raisonne-this-month="${settings.date.thisMonth}" data-raisonne-today="${settings.date.today}" class="raisonne-contents" lang="${settings.txt.lang}">
    ${gui.header(settings, data)}
    <div data-raisonne-elem="body">
    <div data-raisonne-elem="contents" class="raisonne-contents">
    <ul data-raisonne-elem="details">
    </ul>
    </div>
    </div>
    ${gui.footer()}
    </div>
  `

  gui.navDay(settings, data);
}
