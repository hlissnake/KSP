KSP
=======

Kissy Simple Pie

又一个KISSY模块打包工具，特点：
 * 使用JSON文件进行灵活的包配置.
 * 完全灵活，没有文件目录的要求.
 * 使用`UglifyJS`进行代码压缩.
 * 基于`[moduleCompiler](https://github.com/czy88840616/tbuild/blob/master/lib/util/moduleComplier.js)`,非常感谢@紫英.

`KSP`非常适合将现有的项目从`ant`繁琐的配置中解脱出来。

另外，作为`nodeJS`的用户，要将`KSP`结合其他工具或者命令一同使用，推荐一个基于`nodeJS`的类似`Make`或者`Rake`的`build tool`：[Jake](https://github.com/mde/jake).

## 安装

```
npm install ksp -g
```

## 使用

### 基本

`ksp`的使用是基于配置文件`ksp.json`，且理论上配置文件与需要打包的文件没有强制的路径位置关系。

OK!直接看下例子，现在我们有目录`KSP/example/package_one`,该目录下文件如下：

`main_a.js`:

```js
KISSY.add(function(){

    console.log( 'index');
},{requires: [ './mod' ]});
```

`mod.js`:

```js
KISSY.add(function(){
    console.log( 'mod' );
});
```

要将两个模块打包，我们需要在`KSP/example/package_one`目录下添加配置文件`ksp.json`, 内容如下:

```js
{
    "name": "example",
    "charset": "gbk",
    "pub": 20120820,
    "main": "main_a.js",
    "output": "publish/main_a.combo.js"
}
```

好的，你需要的配置工作到此为止.接下来你只需要在终端(win下cmd)下进入目录`KSP/example/package_one`，然后执行：

```
ksp
```

OK!打包完毕,打包后的文件会输出到路径`KSP/example/package_one/publish/20120820/main_a.combo.js`。

打包过的文件的模块名称为`example/package_one/mod`和`example/package_one/main_a`。

注意到`ksp`自动为`output`添加了`put`值作为时间戳目录，如果没有给出`put`则直接使用`output`.

### Path? KSP自动帮你找到它

注意到，在`ksp.json`中，只给定了包名，`KSP`自动根据当前路径向上找到包名对应的路径，不需要手动配置。

### 批量打包多个文件

如果有多个文件需要打包，只需要在`ksp.json`中将所有的入口文件以数组的形式设置给`main`：

```js
{
    "name": "example",
    "charset": "gbk",
    "pub": 20120820,
    "main": ["package_one/main_a.js", "package_two/main_b.js"],
    "output": "publish/{{filename}}.combo.js"
}
```

其中`output`值使用`mustache`作为模板构造文件输出路径，除了`filename`外，还有以下几个变量可以使用:

 * pub 如果给出了pub
 * path 入口文件所在路径
 * basePath 入口文件的父目录名称，比如入口文件`package_one/main_a.js`，其`basePath`为`package_one`

通过以上参数，我们可以构建很灵活的输出路径，比如下面的配置(将该配置文件放在目录`KSP/example`目录下)：

```js
{
    "name": "example",
    "charset": "gbk",
    "pub": 20120820,
    "main": ["package_one/main_a.js", "package_two/main_b.js"],
    "output": "publish/{{pub}}/{{basePath}}/{{filename}}.combo.js"
}
```

将输出目录:

```
KSP
 - example
    - publish
       - 20120820
          - package_one
             - main_a.combo.js
          - package_two
             - main_a.combo.js
```

### 压缩

`KSP`使用[UglifyJS](https://github.com/mishoo/UglifyJS)进行代码的压缩.

使用`ksp -c`，将对输出的文件进行压缩，如果希望生成额外的压缩文件，可以在`ksp.json`中进行配置

```js
{
    "name": "example",
    "charset": "gbk",
    "pub": 20120820,
    "main": ["package_one/main_a.js", "package_two/main_b.js"],
    "output": "publish/{{filename}}.combo.js",
    "compress": "-min"
}
```
之后执行`ksp`命令将生成一个额外的`-min`压缩过的文件.

注意，如果已经在配置文件中指定了`compress`字段，`ksp`命令的`-c`字段将不起作用，它将不对源文件进行压缩.

### (小众功能）将KISSY 配置和入口执行以及模块定义合并，All in one.

要使用该小众功能，只需要在执行`ksp`命令式添加使用参数`-w`：`ksp -w`，将会输出如下文件:

```js
(function(S){

    // 包名
    var PACKAGE_NAME = 'example';
    // 当前文件页面引用地址中报名到文件名部分
    var OUTPUT_PACKAGE_PATH = 'example/publish/package_one/20120820/main_a.combo.js';
    // 包Tag
    var PACKAGE_TAG = '';
    // 包的编码
    var PACKAGE_CHARSET = 'gbk';

    // 获取KISSY package 配置需要用到的 `path` 值.
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[ scripts.length -1 ].src;
    var packagePath;

    // 若为IE，则会取相对地址...因此根据当前页面构造
    if( S.UA.ie <= 7 && currentScriptPath.indexOf( 'http://' ) < 0 ){
        var pageUrl = location.href;
        var pageUrlArr = pageUrl.split( '/');
        var packagePathArr = currentScriptPath.split( '/' );
        pageUrlArr.pop();

        S.each( packagePathArr, function( pkgSeg ){
            if( pkgSeg == '..' ){
                pageUrlArr.pop();
            }
            else if( pkgSeg != '.' ){
                pageUrlArr.push( pkgSeg );
            }
        });

        currentScriptPath = pageUrlArr.join( '/' );
    }

    // 当前脚本的url除去入口模块的路劲就是包的path.
    packagePath = currentScriptPath.substring( 0, currentScriptPath.indexOf( OUTPUT_PACKAGE_PATH ) );

    // 包配置
    S.config({
        packages:[
            {
                name: PACKAGE_NAME,
                tag: PACKAGE_TAG,
                path: packagePath,
                charset: PACKAGE_CHARSET
            }
        ],
        // 将所有当前包下的请都映射到当前文件
        map: [
            [ new RegExp( '\/' + PACKAGE_NAME + '\/.*' ), currentScriptPath ]
        ]
    });
})( KISSY );

// 引入所有的模块定义
/*
combined files :

example/package_one/mod
example/package_one/main_a

*/
KISSY.add('example/package_one/mod',function(){
    console.log( 'mod' );
});KISSY.add('example/package_one/main_a',function(){

    console.log( 'index');
},{requires: [ './mod' ]});

(function(S){
    // 启动入口模块
    S.use( 'example/package_one/main_a' );
})(KISSY);
```

That's all!

## License

(The MIT License)

Copyright (c) 2012 Neekey ni184775761@gmail.com;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.