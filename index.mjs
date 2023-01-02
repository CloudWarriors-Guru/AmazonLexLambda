import axios from "axios";

const respond = (event, answer) => ({
    sessionState: {
      dialogAction: {
        type: "Close"
      },
      intent: {
        name: event.sessionState.intent.name,
        state: "Fulfilled"
      }
    },
    messages: [{
      contentType: "PlainText",
      content: answer
    }]
  });


export const handler = async (event) => {
  console.log(JSON.stringify(event));
  if (event.sessionState.intent.name === "WeatherIntent") {
    const city = event.sessionState.intent.slots.city.value.interpretedValue;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WeatherApiKey}`;
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
    const answer = `The temperature is ${data.main.temp/10} 'C, humidity is ${data.main.humidity} and forecast is ${data.weather[0].description}`;
    return respond(event, answer);
  } else if (event.sessionState.intent.name === "NewsIntent") {
    const keyword = event.sessionState.intent.slots.keyword.value.interpretedValue;
    const url = `http://api.mediastack.com/v1/news?access_key=${process.env.NewsApiKey}&languages=en&keywords=${keyword}&limit=1&countries=us`;
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
    const answer = `${data.data[0].published_at}\n\n${data.data[0].title}\n\nFor details, check: ${data.data[0].url} `;
    return respond(event, answer);
  }
};
