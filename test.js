const axios = require('axios');

axios('https://api.pennlabs.org/laundry/halls')
      .then(({ data }) => {
        const response = data;
        const hallsArray = response['halls'];
        for (let i = 0; i < hallsArray.length; i++) {
          const dryers_available = hallsArray[i]['dryers_available'];
          const name = hallsArray[i]['name'];
          const washers_available = hallsArray[i]['washers_available'];
          const ret =`${name}: There are ${dryers_available} available dryers and ${washers_available} washers available!`;

          console.log(ret);
        }
      }).catch(err => {
        console.log(err);
      });