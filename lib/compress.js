/**
 * Compress file with UglifyJS.
 */

var Fs = require( 'fs' );
var Jsp = require("uglify-js").parser;
var Pro = require("uglify-js").uglify;
var Iconv = require( 'iconv-lite');

/**
 * @param input Input file path.
 * @param output Output file path.
 * @param option { charset: 'gbk' }
 */
module.exports = function( input, output, option ){

    option = option || {};
    var charset = option.charset || 'utf8';

    var origCode = Iconv.decode( Fs.readFileSync( input ), charset.toLowerCase() );

    // Convert to 'utf8' when compressing.
    orig_code = Iconv.decode( Iconv.encode( origCode, 'utf8'), 'utf8' );
    // parse code and get the initial AST.
    var ast = Jsp.parse(orig_code);
    // get a new AST with mangled names.
    ast = Pro.ast_mangle(ast);
    // get an AST with compression optimizations.
    ast = Pro.ast_squeeze(ast);
    var finalCode = Pro.gen_code(ast);

    // Convert back to origin charset when outputting.
    Fs.writeFileSync( output, Iconv.encode( finalCode, charset.toLowerCase() ) );
};
