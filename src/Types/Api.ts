export type ResponseParserWrapper<T> = {
  data: T;
  status: number;
};

export interface Message {
  code: string;
  message: string;
  values: string[];
}

export type DefaultErrorResponse = ResponseParserWrapper<Message[]>;

export type FormErrorResponse = ResponseParserWrapper<Record<string, { code: string; values: string[] }[]>>;

export type CombinedErrorResponse = DefaultErrorResponse | FormErrorResponse;