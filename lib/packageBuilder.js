var Path = require( 'path' );
var Mustache = require( 'mustache' );
var iconv = require('iconv-lite');
var moduleCompiler = require( './moduleCompiler' );
var Compress = require( './compress' );
var KissyConfigWrapper = require( './kissyConfigWrapper');

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
    // The main module path.
    var mainModulePath = Path.relative( kspConfig.path, Path.resolve( EXECUTE_BASE_PATH, mainPath ) );
    var mainModuleExtension = Path.extname( mainModulePath );

    // Remove file extension.
    if( mainModuleExtension ){
        mainModulePath = mainModulePath.substring( 0, mainModulePath.indexOf( mainModuleExtension ) );
    }

    // The target file for moduleCompiler to parse.
    var inputPath = Path.resolve( EXECUTE_BASE_PATH, mainPath );
    var outPathFilename = Path.basename( mainPath, '.js' );

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
    if( kspConfig.output.indexOf('{{pub}}') < 0 && typeof kspConfig.pub !== undefined ){
        outputPath = Path.resolve(
            Path.resolve( Path.dirname( outputPath ), String( kspConfig.pub ) ),
            Path.basename( outputPath )
        );
    }

    // Config module compiler.
    moduleCompiler.config({
        packages: [
            {
                name: kspConfig.name,
                path: kspConfig.path,
                charset: kspConfig.charset
            }
        ]
    });

    // Build!
    moduleCompiler.build( inputPath, outputPath );

    // if --wrapConfig is specified, Wrap with package config.
    if( ifComboConfig === true ){

        KissyConfigWrapper({
            packageName: kspConfig.name,
            mainModPath: mainModulePath,
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

        Compress( outputPath, compressOutputPath, { charset: kspConfig.charset } );
    }
    else if( ifCompress === true ){

        Compress( outputPath, outputPath, { charset: kspConfig.charset } );
    }
};