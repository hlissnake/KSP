var Path = require( 'path' );
var Fs = require( 'fs' );
var Mustache = require( 'mustache' );
var iconv = require('iconv-lite');
var _ = require( 'underscore' );
var Compress = require( './compress' );
var Log = require( './log' );

var KSP_CONFIG_FILENAME = 'ksp.json';
var EXECUTE_BASE_PATH = process.cwd();

module.exports = {

    /**
     * Get Package Path.
     *
     * @example: `getPackagePath( 'v1', '/path/to/package/v1/version/pub/mod' ) will get '/path/to/package/'.
     * @param packageName
     * @param currentPath
     * @return {*}
     */
    getPackagePath: function( packageName, currentPath ){

        currentPath = Path.normalize( currentPath || process.cwd() );
        var pathArr = currentPath.split( Path.sep );
        var packageNameIndex = undefined;

        packageNameIndex = _.indexOf( pathArr, packageName );

        // If the `packageName` not exists or is the first place of the current path, just terminal the program.
        if( packageNameIndex < 1 ){
            throw new Error( 'package name is not valid, as `' + packageName + '` is not found in path: ' + currentPath );
        }
        else {
            return Path.normalize( pathArr.splice( 0, packageNameIndex).join( Path.sep ) );
        }
    },

    /**
     * Get configuration from current work directory.
     */
    parseConfig: function(){

        // Find config file in the current work directory.
        var cfgPath = Path.join( EXECUTE_BASE_PATH, KSP_CONFIG_FILENAME );
        if( Fs.existsSync( cfgPath ) ){
            var kspConfig = require( cfgPath );
        }
        else {
            // === Log ===
            Log.error( 'Config file missing!', 'Can\'t find `' + KSP_CONFIG_FILENAME + '` in directory: %s', Path.dirname( cfgPath ) );
            process.exit(1);
        }

        if( typeof kspConfig.main == 'string' ){
            kspConfig.main = [ kspConfig.main ];
        }

        // If path is not specified, calculate it automatically.
        // Use the first `main` module file path to do the calculating,
        // so that wo can call command `ksp` in directory that is higher than the package directory.
        if( !kspConfig.path ){
            kspConfig.path = this.getPackagePath( kspConfig.name, Path.resolve( EXECUTE_BASE_PATH, kspConfig.main[ 0 ] ));
        }

        // === Log ===
        Log.info( 'Parsing configuration file......' );
        Log.info( 'Configuration info:' );
        _.each(kspConfig, function( value , key ){
            Log.info( '\t' + key, value  );
        });

        return kspConfig;
    },

    /**
     * Compare two path string, and get the overlap part.
     * @param pathA
     * @param pathB
     * @return {Array} [ overlap, diffPathA, diffPathB ]
     */
    pathCompare: function( pathA, pathB ){

        var lenA = pathA.length;
        var lenB = pathB.length;
        var minLen = lenA > lenB ? lenB : lenA;
        var diffFound = false;
        var diffIndexA = lenA - 1;
        var diffIndexB = lenB - 1;
        var overlapPath;
        var diffPathA;
        var diffPathB;
        var valueA;
        var valueB;
        var index;

        for( index = 1; index <= minLen; index++ ){

            valueA = pathA[ lenA - index ];
            valueB = pathB[ lenB - index ];

            if( valueA !== valueB ){
                diffFound = true;
                diffIndexA = lenA - index;
                diffIndexB = lenB - index;
                break;
            }
        }

        overlapPath = pathA.substring( diffIndexA + 1 );
        diffPathA = pathA.substring( 0, diffIndexA + 1 );
        diffPathB = pathB.substring( 0, diffIndexB + 1 );

        return [ overlapPath, diffPathA, diffPathB ];
    }
};