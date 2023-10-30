/*
 * @Description: 
 * @Author: 李大玄
 * @Date: 2023-10-30 11:17:25
 * @FilePath: /alwaystime/alwaystime.js
 * @LastEditors: 李大玄
 * @LastEditTime: 2023-10-30 11:46:49
 */

"use strict";


const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


let timeKey;
let Hook = new Map();

let app = function () {
  clearInterval(timeKey);
  timeKey = setInterval(function () {
    // 如果任务列表为空则关闭定时器
    if (Hook.size === 0) {
      clearInterval(timeKey);
    }
    else {
      let time = Date.now();
      const values = [...Hook.values()];
      for (let _i = 0, values_1 = values; _i < values_1.length; _i++) {
        let callback = values_1[_i];
        callback(time);
      }
    }
  }, 1000);
};
/**
 * 删除定时方法
 */
export const removeAlwaysHook = function (key) {
  Hook["delete"](key);
};


export const alwaysHookSize = function (key) {
  console.log(Hook.size)
  return Hook.size;
};

let createHook = function (particle, callback, type) {
  if (type === void 0) { type = 'plus'; }
  if (Hook.size < 1) {
    app();
  }
  let key = guid();
  let futureTime = Date.now() + particle * 1000;
  let value = function (time) {
    // 每秒执行的任务不需要判断时间间隔
    if (particle === 1) {
      callback(time, key);
    }
    else if (time >= futureTime) {
      if (type === 'plus') {
        removeAlwaysHook(key);
      }
      else if (type === 'mult') {
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
export const alwaysTime = function (particle, callback) {
  if (particle === void 0) { particle = 1; }
  let temp = function (time, key) {
    removeAlwaysHook(key);
    callback(time);
  };
  let key = createHook(particle, temp, 'plus');
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
export const alwaysTimeMult = function (particle, callback) {
  if (particle === void 0) { particle = 1; }
  let key = createHook(particle, callback, 'mult');
  return function () {
    removeAlwaysHook(key);
  };
};
