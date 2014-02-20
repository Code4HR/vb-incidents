// now we have an array of ever date between now and 'firstDate' input, e.g. 1/1/2011
var date1 = new Date();
var day;
var between = [date1];

exports.allDays = function(firstDate) {
    console.log("firstDate " + firstDate);
  while(firstDate < date1) {
    day = date1.getDate();
    date1 = new Date(date1.setDate(--day));
    between.push(date1);
    console.log(date1);
  }
  console.log('number of days were importing: ' + between.length);
  return between;
};

