/*
 * @Description: 
 * @Author: 李大玄
 * @Date: 2020-11-27 14:04:55
 * @FilePath: /alwaystime/alwaystime.ts
 * @LastEditors: 李大玄
 * @LastEditTime: 2023-10-30 11:46:42
 */


const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let timeKey: any;
const Hook = new Map<string, any>();

const app = function (): void {
  clearInterval(timeKey);
  timeKey = setInterval(() => {
    // 如果任务列表为空则关闭定时器
    if (Hook.size === 0) {
      clearInterval(timeKey);
    } else {
      const time = Date.now();
      const values = [...Hook.values()];
      for (const callback of values) {
        callback(time);
      }
    }
  }, 1000);
};

/**
 * 删除定时方法
 */
export const removeAlwaysHook = function (key: string): void {
  Hook.delete(key);
};

/**
 * 创建定时任务
 */
type Task = 'plus' | 'mult';
// eslint-disable-next-line
const createHook = function (particle: number, callback: Function, type: Task = 'plus'): string {
  if (Hook.size < 1) {
    app();
  }
  const key = guid();
  let futureTime = Date.now() + particle * 1000;
  const value = function (time: number) {
    // 每秒执行的任务不需要判断时间间隔
    if (particle === 1) {
      callback(time, key);
    }
    else if (time >= futureTime) {
      if (type === 'plus') {
        removeAlwaysHook(key);
      } else if (type === 'mult') {
        // 设置下一次触发时间
        futureTime += particle * 1000;
      }
      callback(time, key);
    }
  };
  Hook.set(key, value);
  return key;
};

/**
 * 定时器, 只执行1次
 * @param particle 间隔时间
 * @param callback 回调函数
 */
// eslint-disable-next-line
export const alwaysTime = function (particle = 1, callback: Function): Function {
  const temp = function (time: number, key: string): void {
    removeAlwaysHook(key);
    callback(time);
  };
  const key = createHook(particle, temp, 'plus');
  return function () {
    removeAlwaysHook(key);
  };
};

/**
 * 定时器，重复执行
 * @param particle 间隔时间
 * @param callback 回调函数
 */
// eslint-disable-next-line
export const alwaysTimeMult = function (particle = 1, callback: Function): Function {
  const key = createHook(particle, callback, 'mult');
  return function () {
    removeAlwaysHook(key);
  };
};
