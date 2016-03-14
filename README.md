# angular-czmobile
内置了
  form校验，调用方法跟jquery-formValidate 一样，基于angular 自带的form校验扩展，由于angular自带的form，每次都要写template错误信息模版，到最后页面上会有一对的错误信息模版。
  
  history重写了浏览器的历史纪录，由于浏览器的历史纪录回退的时候判断他的length略坑，导致会离开当前的网页，而且来回切换的话超过25次就会死循环，所以本人重写了回退，里面包括权限的校验。
  
  bottomScroll 滚动加载。
  
  cache  封装了angular的cache。
  
  confirm 弹出选项框。
  
  contentFor �一些在每个页面出现的元素，放在index，只需要改变内容或者元素就可以。类似于h5的头部，每次跳转页面都在，只需要改变内容或者改变里面的小结构，避免页面多次重写，提高了统一性。内置了设置，隐藏。
  
  cookie  这个没什么好说的。
  
  mask  遮罩层禁止浏览器滚动条滚动，适用于原生的webview 滚动条，不适合于模拟滚动。
  
  message  消息提示框。
  
  openApp  各个端的兼容，在微信里面也可以唤醒app到指定的页面，在其他浏览器里面采用iframe那种方式。
  
  scrollDomHide 滚动的时候，移除不必要的元素，滚回去的话 渲染回去，避免h5 卡顿。
  
  sideslipLoad 左右侧滑加载下一页，或者加载下一个tab。
  
  backTop 回退到顶部。
  
  countdown  倒计时
