declare module "oatmeal-cookie" {
  type Converter<T> = (decoded: string) => T;

  type CookieOptions = {
    expires?: Date | number | string;
    path?: string;
    domain?: string;
  };

  function get<T = string>(
    name: string,
    converter?: Converter<T>
  ): T | undefined;

  function fetch<T = string>(
    name: string,
    defaultValue: T,
    converter?: Converter<T>
  ): T;

  function contains(name: string): boolean;

  function set<T>(name: string, value: T, options?: CookieOptions): void;

  function expire(name: string, options?: CookieOptions): void;

  function withoutEncode<T>(block: () => T): T;

  function noConflict(): Cookie;

  type Cookie = {
    get: typeof get;
    fetch: typeof fetch;
    contains: typeof contains;
    set: typeof set;
    expire: typeof expire;
    withoutEncode: typeof withoutEncode;
    noConflict: typeof noConflict;
  };

  const cookies: Cookie;

  export default cookies;
}
