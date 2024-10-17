export interface User {
  login: string,
  password?: string,
  isLogined?: boolean;

}

export interface Message {
  id?: string,
  from?: string,
  to?: string | undefined,
  text?: string,
  datetime?: number,
  status?: {
    isDelivered?: boolean,
    isReaded?: boolean,
    isEdited?: boolean,
  }
}

export interface RequestData {
  id: string;
  type: string;
  payload: {
    user?: User
    error?: string
    users?: User[]
    message?: Message
    messages?: Message[]
  } | null;
}
export interface DialogStructure {
  idPage: string,
  className: string,
  login?: string,
  text?: string,
  date?: number,
  status?: boolean,
}

export interface Route {
  path: string;
  component: () => void;
}

export interface CheckInfo {
  login?: string,
  status?: string,
}
