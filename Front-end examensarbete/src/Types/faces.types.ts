export interface Message {
  sender: boolean,
  message: string,
  username: string,
  dateTime: string,
  date: any
}

export interface Props {
  messages?: Message[];
  sendMessage: Function;
}
