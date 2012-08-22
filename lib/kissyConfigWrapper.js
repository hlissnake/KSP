/**
 * Prepend `KISSY.config` info before all the modules and append `KISSY.use( mainModule )`.
 * @return {*}
 */
var Fs = require( 'fs' );
var Path = require( 'path' );
var Mustache = require( 'mustache' );
var iconv = require( 'iconv-lite' );
var Log = require( './log' );

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
    var templatePath = Path.resolve( __dirname, COMBO_WITH_CONFIG_PATH );

    try{
        var template = Fs.readFileSync( Path.resolve( __dirname, COMBO_WITH_CONFIG_PATH ) ).toString();
    }
    catch(e){
        // === Log ===
        Log.error( 'Read KISSY CONFIG Template file Fail!', 'path: %s', templatePath );
        process.exit(1);
    }

    // modulesContent and outputPackagePath is just for mustache to render.
    pkgConfig.modulesContent = iconv.decode( Fs.readFileSync( moduleContentPath), pkgConfig.charset );
    pkgConfig.outputPackagePath = outputPackagePath;

    var ret = iconv.encode( Mustache.render( template, pkgConfig ), pkgConfig.charset );

    try{
        Fs.writeFileSync( outputPath, ret  );
    }
    catch( e ){
        // === Log ===
        Log.error( 'Write file Fail!', 'path: %s', outputPath );
        process.exit(1);
    }

    return ret;
};