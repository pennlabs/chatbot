'use strict';
const FuzzySet = require('fuzzyset.js');

const dining_keywords = [
  'dining', 'houston', 'commons', 'kings court', '1920', 'hill', 'english',
  'falk', 'kosher', 'marks', 'accenture' , 'e-cafe', 'ecafe', 'joes', 'nch',
  'new college house', 'beefsteak', 'gourmet grocer', 'frontera', 'starbucks'
];

const laundry_keywords = [
  'laundry', 'harnwell', 'harrison', 'rodin', 'quad', 'craig', 'bishop white',
  'kings court', 'english house', 'gregory' , 'class of 1925', 'DuBois', 'mayer',
  'morgan', 'butcher', 'hill', 'norteastern', 'stouffer', 'northwest', 'magee',
  'sansom place' ,'east', 'west', 'van pelt manor', 'southeast', 'class of 1928',
  'southwest'
];

const set = FuzzySet();

//adding all keywords to set

function init() {
  for (let i = 0; i < dining_keywords.length; i++) {
    set.add(dining_keywords[i]);
  }

  for (let i = 0; i < laundry_keywords.length; i++) {
    set.add(laundry_keywords[i]);
  }
}


function closestMatch(input) {
  return set.get(input)[0][1];
}

module.exports = {
  init: init,
  closestMatch: closestMatch,
};
