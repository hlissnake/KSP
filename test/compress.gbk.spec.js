var Compress = require( '../lib/compress' );
var Path = require( 'path' );
var _ = require( 'underscore' );

var sourceFilePath = './gbk.source.js';
var outputPath = './gbk.min.js';

describe('Test for `GBK` compress', function(){

    it( 'Before compress', function(){

        var gbkInfo = require( sourceFilePath );
        var gbkOriginInfo = {
            filename: '这是一个GBK编码的文件',
            desc: '这个文件是用来测试非utf8编码文件的压缩是否会乱码',
            action: '压缩后你还能看懂这些文字，你就赢了'
        };

        // Because the difference in file encoding of `gbk.source` and `compress.gbk.spec.js`.
        _.each( gbkOriginInfo, function( value, key ){
            expect( value).not.toEqual( gbkInfo[ key ] );
        });
    });

    // todo 求更好的检验方式
    it( 'Compress', function(){

        Compress( Path.resolve( __dirname, sourceFilePath ), Path.resolve( __dirname, outputPath ), { charset: 'GBK' } );

        var gbkInfo = require( sourceFilePath );
        var gbkCompressedInfo = require( outputPath );

        _.each( gbkCompressedInfo, function( value, key ){

            console.log( value, key );
            expect( value).toEqual( gbkInfo[ key ] );
        });
    });
});