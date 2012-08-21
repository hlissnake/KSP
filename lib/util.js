var Path = require( 'path' );
var Fs = require( 'fs' );
var Mustache = require( 'mustache' );
var iconv = require('iconv-lite');
var _ = require( 'underscore' );
var moduleCompiler = require( './moduleCompiler' );

var COMBO_WITH_CONFIG_PATH = 'template/combo_with_config.mustache';

module.exports = {

    getPackagePath: function( packageName, currentPath ){

        currentPath = Path.normalize( currentPath || process.cwd() );
        var pathArr = currentPath.split( Path.sep );
        var packageNameIndex = undefined;

        packageNameIndex = _.indexOf( pathArr, packageName );

        // If the `packageName` not exists or is the first place of the current path, just return undefined.
        if( packageNameIndex < 1 ){
            return undefined;
        }
        else {
            return Path.normalize( pathArr.splice( 0, packageNameIndex).join( Path.sep ) );
        }
    },

    combo_with_config: function( pkgConfig, moduleContentPath, outputPath ){

        var template = Fs.readFileSync( Path.resolve( __dirname, COMBO_WITH_CONFIG_PATH ) ).toString();
        pkgConfig.modulesContent = iconv.decode( Fs.readFileSync( moduleContentPath), pkgConfig.charset );

        var ret = iconv.encode( Mustache.render( template, pkgConfig ), pkgConfig.charset );
        Fs.writeFileSync( outputPath, ret  );

        return ret;
    },

    /**
     * Build Module.
     *
     * @param kspConfig
     * @param mainPath
     * @param ifComboConfig
     */
    build: function( kspConfig, mainPath, ifComboConfig ){

        var EXECUTE_BASE_PATH = process.cwd();
        // The main module path.
        var mainModulePath = Path.relative( kspConfig.path, Path.resolve( EXECUTE_BASE_PATH, mainPath ) );

        // The target file for moduleCompiler to parse.
        var inputPath = Path.resolve( EXECUTE_BASE_PATH, mainPath );
        var outPathFilename = Path.basename( mainPath, '.js' );

        // Render outputPath with Mustache. `filename` will be given as param.
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
        if( ifComboConfig ){

            this.combo_with_config({
                packageName: kspConfig.name,
                mainModPath: mainModulePath,
                tag: kspConfig.tag,
                charset: kspConfig.charset
            }, outputPath, outputPath );
        }
    }
};