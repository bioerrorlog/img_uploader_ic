import type { Principal } from '@dfinity/principal';
export type Error = { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'AlreadyExists' : null };
export interface Image {
  'data' : Array<number>,
  'fileName' : string,
  'filetype' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : Image } |
  { 'err' : Error };
export interface _SERVICE {
  'download' : () => Promise<Result_1>,
  'greet' : (arg_0: string) => Promise<string>,
  'upload' : (arg_0: Image) => Promise<Result>,
}
