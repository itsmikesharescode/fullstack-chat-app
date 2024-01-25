

export const dateConvert = (dateVal: string) =>
{
    const date = new Date(dateVal);
    
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const month = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October"];

    return `${weekday[date.getDay()]}, ${date.getDate()} ${month[date.getMonth()]} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`

}