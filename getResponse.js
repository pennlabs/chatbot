const axios = require('axios');

function getResponse(messageText, data) {
    const responses = [];
    const info = data;
    const keywords = messageText.toLowerCase().split(/[^a-z0-9]/).filter(e => e);
    for (let i = 0; i < info.document.venue.length; i++) {
        const name = info.document.venue[i].name;
        const hours = info.document.venue[i].dateHours;
        const name_words = name.toLowerCase().split(/[^a-z0-9]/).filter(e => e);
        for(let j = 0; j < keywords.length; j++) {
        const word = keywords[j];
        for(let k = 0; k < name_words.length; k++) {
            const name_word = name_words[k];
            if(name_word != "dining" && name_word != "at" && name_word != "the" && name_word === word) {
            const current_date = new Date(); 
            if(hours === undefined) {
                const response = `${name} does not have any listed hours.`;
                responses.push(response);
            }
            else {
                let match = false;
                for(let l = 0; l < hours.length; l++) {
                const date = hours[l].date;
                const full_date = date.split("-");
                if((current_date.getFullYear()).toString() === full_date[0] && ("0" + (current_date.getMonth() + 1).toString()) === full_date[1] && 
                (current_date.getDate()).toString() === full_date[2]) {
                    match = true;
                    let found = false;
                    for(let n = 0; n < hours[l].meal.length; n++) {
                    const openTime = hours[l].meal[n].open;
                    responses.push(openTime);
                    const openArray = openTime.split(":");
                    const closeTime = hours[l].meal[n].close;
                    responses.push(closeTime);
                    const closeArray = closeTime.split(":");
                    responses.push(current_date.getHours() - 4 + ":" + current_date.getMinutes());
                    responses.push((current_date.getHours() - 4 > openArray[0] || (current_date.getHours() - 4 === openArray[0] && current_date.getMinutes() >= openArray[1])) &&
                    (current_date.getHours() - 4 < closeArray[0] || (current_date.getHours() - 4 === closeArray[0] && current_date.getMinutes() <= closeArray[1])));
                    if((current_date.getHours() - 4 > openArray[0] || (current_date.getHours() - 4 === openArray[0] && current_date.getMinutes() >= openArray[1])) &&
                    (current_date.getHours() - 4 < closeArray[0] || (current_date.getHours() - 4 === closeArray[0] && current_date.getMinutes() <= closeArray[1]))) {
                        found = true;
                    }
                    }
                    if(found === true) {
                        const response = `${name} is open! :)`;
                        responses.push(response);
                    }
                    else {
                        const response = `${name} is closed. :(`;
                        responses.push(response);
                    }
                }
                }
                if(match === false) {
                    const response = `${name} is closed. :(`;
                    responses.push(response);
                }
            }
            }
        }
        }
    }
    return responses;
}

module.exports = {
  getResponse: getResponse
};