interface Cache {
    get(key: string): Promise<string | null>,
    set(key: string, value: any, expire?: number): Promise<'OK' | undefined>
}