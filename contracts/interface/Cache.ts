export default interface Cache {
  get(key: string): Promise<string | null>,
  set(key: string, value: any, expire?: number): Promise<'OK' | null>,
  eval(arg1: string, arg2: number, arg3: any[]): Promise<any>
}