const circleRadius = 100 //in meters

//get distance between 2 coordinate locations, aerial distance
function getDist(lat1, lon1, lat2, lon2) 
{
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
}

//degree to radian
function toRad(value) 
{
    return value * Math.PI / 180;
}

//check if inside the perimeter or not, send boolean values
function insidePrimeter(lat1, lon1, lat2, lon2){
    let dist = getDist(lat1, lon1, lat2, lon2);
    if(dist <= circleRadius)
        return true
    return false;
}

module.exports = {insidePrimeter}