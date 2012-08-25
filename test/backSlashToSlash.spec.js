var Util = require( '../lib/util' );

describe('Test for util method: backSlashToSlash', function(){

    it( 'Normal', function(){

        var backSlash = '\\\\'; // --> `\\`
        var slash = Util.backSlashToSlash( backSlash );
        var expectStr = '//';

        expect( slash).toBe( expectStr );
    });

    it( 'Path', function(){

        var winPath = 'package\\module\\main\\index.js';
        var expectPath = 'package/module/main/index.js';
        var actualPath = Util.backSlashToSlash( winPath );

        expect( expectPath ).toBe( actualPath );
    });
});