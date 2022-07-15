import moment from "moment";

const formatMessage = (username: string, text: string) => {
  const message = {
    username,
    text,
    time: moment().format("h:mm a"),
  }
  return message;
}

export default formatMessage;