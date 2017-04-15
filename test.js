const axios = require('axios');
const messageText = "starbucks";
axios('https://api.pennlabs.org/dining/venues')
      .then(({ data }) => {
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
                console.log(`match for ${name}`);
                const current_date = new Date(); 
                if(hours === undefined) {
                  console.log(`${name} does not have any listed hours.`);
                }
                else {
                  let match = false;
                  for(let l = 0; l < hours.length; l++) {
                    const date = hours[l].date;
                    console.log(`date: ${date}`);
                    const full_date = date.split("-");
                    const year = (current_date.getFullYear()).toString() === full_date[0];
                    const month = ("0" + (current_date.getMonth() + 1).toString()) === full_date[1];
                    console.log("current date month: " + "0" + (current_date.getMonth() + 1).toString());
                    console.log("data month: " + full_date[1]);
                    const day = (current_date.getDate()).toString() === full_date[2];
                    console.log("current date day: " + (current_date.getDate()).toString());
                    console.log("data day: " + full_date[2]);
                    console.log(`${year} ${month} ${day}`);
                    if((current_date.getFullYear()).toString() === full_date[0] && ("0" + (current_date.getMonth() + 1).toString()) === full_date[1] && 
                    (current_date.getDate()).toString() === full_date[2]) {
                      console.log(`date match!`);
                      match = true;
                      let found = false;
                      for(let n = 0; n < hours[l].meal.length; n++) {
                        const openTime = hours[l].meal[n].open;
                        console.log(`open time: ${openTime}`);
                        const openArray = openTime.split(":");
                        const closeTime = hours[l].meal[n].close;
                        console.log(`close time: ${closeTime}`);
                        const closeArray = closeTime.split(":");
                        const currTime = current_date.getHours() + ":" + current_date.getMinutes();
                        console.log(`current time: ${currTime}`);
                        if((current_date.getHours() > openArray[0] || (current_date.getHours() === openArray[0] && current_date.getMinutes() >= openArray[1])) &&
                        (current_date.getHours() < closeArray[0] || (current_date.getHours() === closeArray[0] && current_date.getMinutes() <= closeArray[1]))) {
                          found = true;
                        }
                      }
                      if(found === true) {
                        console.log(`${name} is open! :)`);
                      }
                      else {
                        console.log(`${name} is closed. :(`);
                      }
                    }
                  }
                  if(match === false) {
                    console.log(`${name} is closed. :(`);
                  }
                }
              }
            }
          }
        }
      })
      .catch(err => {
        console.log(err);
      });