// now we have an array of ever date between now and 1/1/2011
var date1 = new Date();
//var date2 = new Date(2011, 0, 1);
var day;
var between = [date1];

exports.allDays = function(firstDate) {
  while(firstDate < date1) {
    day = date1.getDate();
    console.log('day: ' + day);
    console.log('date1 before subtract: ' + date1);
    date1 = new Date(date1.setDate(--day));
    console.log('date1: ' + date1 + 'added to array');
    between.push(date1);
  }
  console.log('number of days were importing: ' + between.length);
  return between;
};

