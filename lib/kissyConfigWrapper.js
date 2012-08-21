/**
 * Prepend `KISSY.config` info before all the modules and append `KISSY.use( mainModule )`.
 * @return {*}
 */
var Fs = require( 'fs' );
var Path = require( 'path' );
var Mustache = require( 'mustache' );
var iconv = require( 'iconv-lite' );

// Template file path for wrapping.
var COMBO_WITH_CONFIG_PATH = 'template/combo_with_config.mustache';

/**
 * Wrap moduleContent with KISSY package configuration and KISSY use.
 * @param pkgConfig
 * @param moduleContentPath
 * @param outputPath
 * @return {*}
 */
module.exports = function( pkgConfig, moduleContentPath, outputPath ){

    // Path  of Package name to outputPath basename.
    // ex: /path/to/package/package_name/pkg/to/mod --> package_name/pkg/to/mod
    var outputPackagePath = Path.relative( pkgConfig.path, outputPath );
    var template = Fs.readFileSync( Path.resolve( __dirname, COMBO_WITH_CONFIG_PATH ) ).toString();

    // modulesContent and outputPackagePath is just for mustache to render.
    pkgConfig.modulesContent = iconv.decode( Fs.readFileSync( moduleContentPath), pkgConfig.charset );
    pkgConfig.outputPackagePath = outputPackagePath;

    var ret = iconv.encode( Mustache.render( template, pkgConfig ), pkgConfig.charset );
    Fs.writeFileSync( outputPath, ret  );

    return ret;
};