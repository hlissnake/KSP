(function(S){

    // 包名
    var PACKAGE_NAME = 'example';
    // 入口模块的包路径
    var MAIN_MOD_PATH = 'example/package_one/index.js';
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
    packagePath = currentScriptPath.substring( 0, currentScriptPath.indexOf( MAIN_MOD_PATH ) );

    // 包配置
    S.config({
        packages:[
            {
                name: PACKAGE_NAME,
                tag: PACKAGE_TAG,
                path: packagePath,
                charset: PACKAGE_CHARSET
            }
        ]
    });
})( KISSY );

// 引入所有的模块定义
/*
combined files : 

example/package_one/mod
example/package_one/index

*/
KISSY.add('example/package_one/mod',function(){
    console.log( 'mod' );
});KISSY.add('example/package_one/index',function(){

    console.log( 'index');
},{requires: [ './mod' ]});

(function(S){
    // 启动入口模块
    S.use( 'example/package_one/index.js' );
})();
