var Path = require( 'path' );
var Fs = require( 'fs' );
var Mustache = require( 'mustache' );
var _ = require( 'underscore' );

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
        pkgConfig.modulesContent = Fs.readFileSync( moduleContentPath).toString();

        var ret = Mustache.render( template, pkgConfig );
        Fs.writeFileSync( outputPath, ret  );

        return ret;
    }
};