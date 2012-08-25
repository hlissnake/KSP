var Path = require( 'path' );
var Mustache = require( 'mustache' );
var iconv = require('iconv-lite');
var moduleCompiler = require( './moduleCompiler' );
var Compress = require( './compress' );
var KissyConfigWrapper = require( './kissyConfigWrapper');
var Log = require( './log' );
var Util = require( './util' );

// Current working directory.
var EXECUTE_BASE_PATH = process.cwd();

/**
 * Build a package.
 *
 * @param kspConfig package Info
 * @param mainPath
 * @param option
 */
module.exports = function( kspConfig, mainPath, option ){

    option = option || {};

    // If need to wrap with kissy package configuration.
    var ifComboConfig = option.ifComboConfig;
    // If need to do the compress.
    var ifCompress = option.ifCompress;

    // The target file for moduleCompiler to parse.
    var inputPath = Path.resolve( EXECUTE_BASE_PATH, mainPath );
    var outPathFilename = Path.basename( mainPath, Path.extname( mainPath ) );

    // Render outputPath with Mustache. `filename` and so on... will be given as params.
    var outputPath = Path.resolve(
        EXECUTE_BASE_PATH,
        Mustache.render( kspConfig.output, {
            filename: outPathFilename,
            pub: kspConfig.pub,
            path: Path.dirname( mainPath ),
            basePath: Path.basename( Path.dirname( mainPath) )
        })
    );

    // If publish timestamp directory is specified. Than add that dir.
    // ex: `output` is 'out/index.combo.js' and set `pub` to 20120819,
    // than the final output path will be `out/pub/index.combo.js`.
    if( kspConfig.output.indexOf('{{pub}}') < 0 && typeof kspConfig.pub !== 'undefined' ){
        outputPath = Path.resolve(
            Path.resolve( Path.dirname( outputPath ), String( kspConfig.pub ) ),
            Path.basename( outputPath )
        );
    }

    // The module path of the input main module file. like `/v2/source/package/mod.js`
    var inputMainModulePath = Path.relative( kspConfig.path, inputPath );
    // The module path of the output main module file. like `v2/release/package/mod.combo.js`
    var outputMainModulePath = Path.relative( kspConfig.path, outputPath );
    // The output main module name. like `v2/release/package/mod.js`
    var outputMainModuleName = Path.join( Path.dirname( outputMainModulePath ), Path.basename( mainPath ) );

    // The extension of main module file.
    var mainModuleExtension = Path.extname( mainPath );

    // Remove file extension.
    if( mainModuleExtension ){
        outputMainModuleName = outputMainModulePath.substring( 0, outputMainModuleName.indexOf( mainModuleExtension ) );
    }

    // Compare inputPath with outputPath.
    var outputInputCompareRet = Util.pathCompare(
        Path.dirname( inputMainModulePath ),
        Path.dirname( outputMainModulePath )
    );

    // Config module compiler.
    moduleCompiler.config({
        packages: [
            {
                name: kspConfig.name,
                path: kspConfig.path,
                charset: kspConfig.charset
            }
        ],
        // Map to replace source module name to release module name.
        // Convert `\\` --> `/` in windows.
        map: [
            [
                Util.backSlashToSlash( outputInputCompareRet[ 1 ] ),
                Util.backSlashToSlash( outputInputCompareRet[ 2 ] )
            ]
        ]
    });

    // === Log ===
    Log.info( '\tCombo all Modules into path:\n\t\t', outputPath );
    // Build!
    moduleCompiler.build( inputPath, outputPath );

    // if --wrapConfig is specified, Wrap with package config.
    if( ifComboConfig === true ){

        // === Log ===
        Log.info( '\tWrap modules with KISSY config & use.' );
        KissyConfigWrapper({
            packageName: kspConfig.name,
            mainModPath: outputMainModuleName,
            tag: kspConfig.tag,
            charset: kspConfig.charset
        }, outputPath, outputPath );
    }

    // If `compress` is specified in configuration file, ignore program.compress.
    if( kspConfig.compress !== undefined ){

        var outputExtension = Path.extname( outputPath );
        var compressOutputPath = Path.join(
            Path.dirname( outputPath ),
            Path.basename( outputPath, outputExtension ) + kspConfig.compress
            + outputExtension
        );

        // === Log ===
        Log.info( '\tCompress file into:\n\t\t', compressOutputPath );
        try{
            Compress( outputPath, compressOutputPath, { charset: kspConfig.charset } );
        }
        catch( e ){
            // === Log ===
            Log.error( '\tCompress fail! Error:', JSON.stringify( e ) );
            process.exit(1);
        }
    }
    else if( ifCompress === true ){

        // === Log ===
        Log.info( '\tCompress file into:\n\t\t', outputPath );
        try{
            Compress( outputPath, outputPath, { charset: kspConfig.charset } );
        }
        catch( e ){
            // === Log ===
            Log.error( '\tCompress fail! Error:', JSON.stringify( e ) );
            process.exit(1);
        }
    }

    // === Log ===
    Log.info( '', '\tDone' );
};