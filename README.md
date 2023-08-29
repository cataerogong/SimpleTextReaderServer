# SimpleTextReaderServer

## 【写在前面】本人电脑重度用户，所以只针对“界面版”做修改

本来是想用 Python 给 SimpleTextReader 写个服务，然后提供 HTTP 服务、文件下载和记录进度的功能，写得都差不多了，结果写着写着脑子一抽，想 javascript 可以直接访问 WebDAV 的吧？因为我日常家里就开着一个简易的 WebDAV 服务，可以的话，这样就不用多跑一个服务了，WebDAV 既当 HTTP 服务器又当文件服务器。试了试，还真有戏 :wink: 

不过这样一改，就需要有另外的 WebDAV 服务器，我自己用的是 https://github.com/hacdias/webdav ，很简单很好用 :+1: :+1: :+1:

## 【改动】

* [v0.3.0]

  * 将服务端进度文件从小说目录移到单独的 `/progress` 目录，给这个目录设置 WebDAV 写入权限，`/books` 目录无需写入权限。

    ```
    webroot                    （WebDAV 文件根目录）
      - index.html             （外层主页面）
      - /books                 （小说目录）
        - 小说.txt
        ...
      - /progress              （阅读进度目录，需要写入权限）
        - 小说.txt.progress    （小说阅读进度记录文件，每个小说一个）
        ...
      - /scripts               （增强脚本目录）
        - mod.js
        - webdav.js
      - /SimpleTextReader      （STR 原始目录）
        ...
    ```

  * `/progress` 目录可以没有，只为 SimpleTextReader 增加“调整界面参数”和“服务端小说文件”的功能，阅读进度仍保存在浏览器本地。

    这样就可以部署在普通 HTTP 服务上，不用 WebDAV 服务（不需要写入操作）。

  * 优化获取服务端小说文件时的缓存刷新机制。
  
    小说文件一般不会变动，没必要强制每次都刷新。

  * 暂时取消“打开 txt 链接”功能。
  
    能否成功打开要看链接网站的 CORS 策略，实际使用中比较麻烦，鸡肋，先取消。

* [v0.2]

  * 配合 SimpleTextReader **`v1.2.2`** 版本，弃用 icons.woff2，改用 svg 显示图标。

  * 把 mod.js 按功能封装进匿名函数，尽量避免全局命名冲突。

* [v0.1]
  * 对原来的 SimpleTextReader 完全不改动，直接在外面套了个页面，然后从外层网页 hack :sunglasses:

  * 需要把 SimpleTextReader 、增强脚本和小说都放在 WevDAV 服务器上，books 目录要有写入权限，阅读进度文件和小说文件是放在一起的。
    ```
    webroot    （WebDAV 根目录）
      - index.html （外层主页面）
      - books  （小说目录）
        - 小说.txt
        - 小说.txt.progress    （小说阅读进度记录文件，每个小说一个）
        ...
      - scripts    （增强脚本目录）
        - mod.js
        - webdav.js
      - SimpleTextReader    （STR 原始目录）
        ...
    ```

  * 可以列出 WebDAV 服务器特定目录下的 txt 小说。

  * 可以读取 WebDAV 服务器上 txt 小说。

  * 服务器上小说的阅读进度也存放在服务器上，换浏览器、换电脑也可以保持进度。

  * 如果是读服务器上小说的话，下次打开页面会自动打开小说，不需要再手动打开。

  * 顺便做了打开外部 txt 链接的功能，不过这个就和本机 txt 的功能基本一样了。

  * 分页条还是太碍事，增加了透明度参数 :smile:

  * 【bugfix】

    *  ui.js 里有一个地方把 parent 给误修改了，我没直接改源代码，在外层页面里打了补丁
        ```js
        // SimpleTextReader/scripts/ui.js (line:20)
        // window.parent 被误修改了
        // 应该 let emInPx = getSizePrecise('1em', contentContainer);
        let emInPx = getSizePrecise('1em', parent=contentContainer);
        ```

## 【感谢】

* SimpleTextReader：https://github.com/henryxrl/SimpleTextReader

* WebDAV 功能使用了 webdavjs 库： https://github.com/aslakhellesoy/webdavjs
