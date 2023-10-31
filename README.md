# alwaystime

关于定时器的封装
`alwaysTime` 方法为只执行一次 参数为 `particle` 多少秒后执行 `callback`回调函数

`alwaysTimeMult`为定时器方法 参数为`particle` 多少秒后执行 `callback`回调函数

`removeAlwaysHook`删除定时方法 将 定时任务 id 传入例: `removeAlwaysHook(xxx)`

两个方法将会返回当前任务销毁方法, 调用将销毁

`demo `

```javascript
const clearTime = alwaysTimeMult(1, () => {
  console.log("第一个定时器");
});

alwaysTime(10, (item, key) => {
  console.log("第二个定时器, 将在10秒后被调用", item, key);
});
alwaysHookSize(); // 查看任务数量
clearTime(); // 将任务删除
alwaysHookSize(); // 查看任务数量
```
