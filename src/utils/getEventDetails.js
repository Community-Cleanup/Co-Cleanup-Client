// Axios Interceptor to add the ID token to the 'createEvent' POST request header.
import axios from "../utils/AxiosInterceptor";

// getEventDetails() calls the backend server events API
// the event parameter takes in the event Id which is saved from params and used to get the data for the individual event
// try/catch is used to catch any errors and log to the console
// the callback function is normally a setter function that will save the response in state
export async function getEventDetails(event, callback) {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/api/events/${event}`
    );
    callback(res.data);
  } catch (e) {
    console.log(e);
  }
}
