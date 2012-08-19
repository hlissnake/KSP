var Path = require( 'path' );
var _ = require( 'underscore' );

module.exports = {

    getPackagePath: function( packageName, currentPath ){

        currentPath = Path.normalize( currentPath || process.cwd() );
        var pathArr = currentPath.split( Path.sep );
        var packageNameIndex = undefined;

        packageNameIndex = _.indexOf( pathArr, packageName );
        console.log( pathArr, currentPath );

        // If the `packageName` not exists or is the first place of the current path, just return undefined.
        if( packageNameIndex < 1 ){
            return undefined;
        }
        else {
            return Path.normalize( pathArr.splice( 0, packageNameIndex).join( Path.sep ) );
        }
    }
}