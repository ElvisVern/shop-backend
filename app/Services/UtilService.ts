export default class UtilService {

  /**
   * 10为的当前时间戳，精度秒
   * 本地时区时间
   */
  public static getUnixTimeNow(): number {
    return Math.round(new Date().getTime() / 1000);
  }

  /**
  * 获取当前时间 格式：yyyy-MM-dd HH:MM:SS
  */
  public static getCurrentTime() {
    const date = new Date();
    const month = zeroFill(date.getMonth() + 1);
    const day = zeroFill(date.getDate());
    const hour = zeroFill(date.getHours());
    const minute = zeroFill(date.getMinutes());
    const second = zeroFill(date.getSeconds());
    //当前时间
    const curTime = date.getFullYear() + "-" + month + "-" + day
      + " " + hour + ":" + minute + ":" + second;

    return curTime;

    /**
     * 补零
     * @param i 
     */
    function zeroFill(i: number) {
      if (i >= 0 && i <= 9) {
        return "0" + i;
      } else {
        return i;
      }
    }
  }

  public static jsonString(obj: Object): string {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      return '';
    }
  }

  /**
   * 暂停函数
   * @param seconds 暂停的毫秒数
   * @returns 
   */
  public static sleep(seconds: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, seconds);
    })
  }
}