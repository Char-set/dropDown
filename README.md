# dropDown
Vue-dropDown 组件兼容 ios8 <br/>
注意：
  一个页面目前只支持一个 ui-drop-down 组件，请在页面上避免使用 drop-loading 类名
```
 * Vue Drop Down
 * 
 *
 * @param dropDown 下拉 刷新过程中需要执行的函数
 * @param stop 下拉刷新停止的标识，组件会watch
 * @param top 组件的style margin-top值 可以为负数
 *
 * 例子:
 * <ui-drop-down :on-pull-down="dropDown" :stop.sync="stopDropDown" :top="'0'">
 * 
 *
 ```
