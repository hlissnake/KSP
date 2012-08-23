/**
 * Update `KSP` to the latest version.
 */
var Log = require( './log' );
var KSPInfo = require( '../package.json' );

module.exports = function(){

    // === Log ===
    Log.info( 'Current version', KSPInfo.version );

    var exec = require('child_process').exec,
        child;

    child = exec('npm update ksp -g', function(error, stdout, stderr) {

        if( error ){
            Log.error( 'Exec error: ' + error );
        }

        if( stdout ){
            Log.info('Stdout: ' + stdout);
        }

        if( stderr ){
            Log.error('stderr: ' + stderr);
        }
    });
};