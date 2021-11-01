import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from "@ioc:Adonis/Core/Logger";
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execP = promisify(exec);
let overloadTimes = 0;
let isOverload = false;
let currentCpuPercentage = 0;
let currentProbability = 0;
let removeCount = 0;
const maxValue = +(10 * Math.exp(10)).toFixed(4);

export default class CpuOverload {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if (this.isAvailable(request.url())) {
      await next()
    }
  }

  private maxOverloadNum: number = 10;  // 最大持续超出负载次数
  private maxCpuPercentage: number = 80;  // 单次 最大CPU 使用率
  private baseProbability: number = 0.8;  // 负载最大时的丢弃概率
  private whiteList: string[] = [];  // 白名单列表不做校验

  /**
   * @description 判断服务器当前是否可用
   * @param {string} path 
   */
  private isAvailable(path: string) {
    if (path && this.whiteList.includes(path)) { // 判断是否在白名单内
      return true;
    }

    if (isOverload) {
      if (this.getRandomNum() <= currentProbability) {
        removeCount += 1;
        return false;
      }
    }
    return true;
  }

  /**
   * 定时校验服务器是否过载
   */
  public async check() {
    /// 定时处理逻辑
    setInterval(async () => {
      try {
        const cpuInfo = await this.getProcessInfo();
        Logger.info(`cpu load: ${cpuInfo}`);
        if (!cpuInfo) { // 异常不处理
          return;
        }
        currentCpuPercentage = cpuInfo;

        if (cpuInfo > this.maxCpuPercentage) { // 当 cpu 持续过高时，将当前的 overloadTimes 计数+1
          overloadTimes++;
        } else { // 当低于 cpu 设定值时，则认为服务负载恢复，因此将 overloadTimes 设置为 0
          overloadTimes = 0;
          return isOverload = false;
        }

        if (overloadTimes > this.maxOverloadNum) { //当持续出现 cpu 过载时，并且达到了设置上线，则需要进行请求丢弃
          isOverload = true;
        }
        this.setProbability();
      } catch (err) {
        console.log(err);
        return;
      }
    }, 3000);
  }

  /**
   * 获取一个概率值
   */
  private getRandomNum() {
    return +Math.random().toFixed(4);
  }

  /**
   * 获取丢弃概率
   */
  private setProbability() {
    let o = overloadTimes >= 100 ? 100 : overloadTimes;
    let c = currentCpuPercentage >= 100 ? 10 : currentCpuPercentage / 10;
    currentProbability = +((0.1 * o) * Math.exp(c) / maxValue * this.baseProbability).toFixed(4);
  }

  /**
   * @description 获取进程信息
   */
  private async getProcessInfo() {
    let pidInfo: string, cpuInfo: string;

    // 其他平台 linux & mac
    pidInfo = await this.getPs();
    cpuInfo = await this.parseInOs(pidInfo);
    if (!cpuInfo) { // 异常处理
      return false;
    }
    /// 命令行数据，字段解析处理
    return +parseFloat(cpuInfo).toFixed(4);
  }

  /**
   * 使用 ps 命令获取进程信息
   */
  private async getPs() {
    // 命令行
    const cmd = `ps -p ${process.pid} -o pcpu`;
    // 获取执行结果
    const { stdout, stderr } = await execP(cmd);
    if (stderr) { // 异常情况
      console.log(stderr);
      return '';
    }
    return stdout;
  }

  private async parseInOs(pidInfo: string) {
    let lines = pidInfo.trim().split(os.EOL);
    if (!lines || lines.length < 2) {
      return '';
    }
    let cpuStr = lines[1];
    return cpuStr.trim();
  }
}
