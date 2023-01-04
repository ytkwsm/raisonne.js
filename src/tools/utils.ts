
export function getJson(json: any) {
    fetch(json)
        .then( response => response.json())
        .then( data => formatSetting(data));

    function formatSetting(json: any) {
        const obj = JSON.parse(json);
        console.log(obj.libName);
    }
    
}