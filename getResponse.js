
// splitIntoWords takes text and splits it by non-alphanumeric
// characters (e.g. spaces, tabs, punctuation), into an array
function splitIntoWords(text) {
  return text.toLowerCase().split(/[^a-z0-9]/).filter(e => e);
}

// isWithinOperatingHours takes two strings representing opening
// & closing times, each formatted as `hh:mm`, and returns true
// if the current time is between those, false otherwise.
function isWithinOperatingHours(openTime, closeTime) {
  const currentDate = new Date();

  // HACK: shifting current hours by 4 to account for time difference
  const [currentHour, currentMinute] = [currentDate().getHours() - 4, currentDate.getMinutes()];
  const [openHour, openMinute] = openTime.split(':');
  const [closeHour, closeMinute] = closeTime.split(':');

  return (
    (currentHour >= openHour && currentMinute >= openMinute) &&
    (currentHour <= closeHour && currentMinute <= closeMinute)
  );
}

function getResponse(messageText, info) {
  const responses = [];
  const currentDate = new Date();

  // create an array from our message text
  const keywords = splitIntoWords(messageText);

  // Iterate through each venue
  for (let i = 0; i < info.document.venue.length; i++) {
    const { name, dateHours: hours} = info.document.venue[i];

    // create an array from the venue name, filtering out common words
    const venueNameArray = splitIntoWords(name)
    .filter(e => e !== "dining" && e !== "at" && e !== "the");

    // only proceed if one of the searched keywords matches something in the venueNameArray
    if (!venueNameArray.includes(...keywords)) {
      continue;
    }
    // if the venue does not contain any hours, we cannot check
    // if it is open, so continue to next loop iteration.
    if (!hours) {
      responses.push(`${name} does not have any listed hours.`);
      continue;
    }

    let venueIsOpenOnCurrentDate = false;
    // iterate through the hours
    for (let l = 0; l < hours.length; l++) {

      // check to see if the venue is open on the current date
      const fullDate = hours[l].date.split("-");
      if ((currentDate.getFullYear()).toString() === fullDate[0] && ("0" + (currentDate.getMonth() + 1).toString()) === fullDate[1] &&
        (currentDate.getDate()).toString() === fullDate[2]) {

        // Once we know that the venue is open on the current date, we have to check
        // whether the current time is valid
        venueIsOpenOnCurrentDate = true;
        let venueIsOpenOnCurrentTime = false;

        // iterate through the meals
        for (let n = 0; n < hours[l].meal.length; n++) {
          const { open: openTime, close: closeTime } = hours[l].meal[n];
          responses.push(openTime, closeTime);
          responses.push(`${currentDate.getHours() - 4}:${currentDate.getMinutes()}`);
          responses.push(isWithinOperatingHours(openTime, closeTime));

          if (isWithinOperatingHours(openTime, closeTime)) {
            venueIsOpenOnCurrentTime = true;
          }
        }
        responses.push(venueIsOpenOnCurrentTime ? `${name} is open! :)` : `${name} is closed. :(`);
      }
    }
    if (!venueIsOpenOnCurrentDate) {
      responses.push(`${name} is closed. :(`);
    }
  }
  return responses;
}

module.exports = {
  getResponse
};
