var util = require( '../lib/util' );

describe( 'Test for method getPackagePath', function(){

    it('Normal', function(){
        var packageName = 'pkgName';
        var currentPath = '/users/neekey/Dropbox/pkgName/to/current/path';
        var expectPath = '/users/neekey/Dropbox';

        var actualPath = util.getPackagePath( packageName, currentPath );
        expect( expectPath ).toEqual( actualPath );
    });

    it('Relative', function(){
        var packageName = 'pkgName';
        var currentPath = '../neekey/Dropbox/pkgName/to/current/path';
        var expectPath = '../neekey/Dropbox';

        var actualPath = util.getPackagePath( packageName, currentPath );
        expect( expectPath ).toEqual( actualPath );

        packageName = 'pkgName';
        currentPath = 'neekey/Dropbox/pkgName/to/current/path';
        expectPath = 'neekey/Dropbox';

        actualPath = util.getPackagePath( packageName, currentPath );
        expect( expectPath ).toEqual( actualPath );

        packageName = 'pkgName';
        currentPath = './neekey/Dropbox/pkgName/to/current/path';
        expectPath = 'neekey/Dropbox';

        actualPath = util.getPackagePath( packageName, currentPath );
        expect( expectPath ).toEqual( actualPath );
    });

    /* these two test will terminal the program
    it('Not exists', function(){

        var packageName = 'pkgName';
        var currentPath = 'neekey/Dropbox/to/current/path';
        var expectPath = undefined;

        var actualPath = util.getPackagePath( packageName, currentPath );
        expect( expectPath ).toEqual( actualPath );
    });

    it('First', function(){
        var packageName = 'pkgName';
        var currentPath = 'pkgName/neekey/Dropbox/to/current/path';
        var expectPath = undefined;

        var actualPath = util.getPackagePath( packageName, currentPath );
        expect( expectPath ).toEqual( actualPath );
    })
    */
});