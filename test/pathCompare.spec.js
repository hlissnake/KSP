var Util = require( '../lib/util' );

describe( 'Test for util method: pathCompare', function(){

    it( 'Normal', function(){

        var pathA = 'users/neekey/nodejs/app/helloworld/package/index';
        var pathB = 'users/nic/ruby/app/monster/package/index';
        var expectOverlay = '/package/index';
        var expectDiffPathA = 'users/neekey/nodejs/app/helloworld';
        var expectDiffPathB = 'users/nic/ruby/app/monster';

        var actual = Util.pathCompare( pathA, pathB );

        expect( actual[ 0 ]).toBe( expectOverlay );
        expect( actual[ 1 ]).toBe( expectDiffPathA );
        expect( actual[ 2 ]).toBe( expectDiffPathB );
    });

    it( 'No overlap', function(){

        var pathA = 'users/neekey/nodejs/app/helloworld/package/index';
        var pathB = 'users/nic/ruby/app/monster/package/main';
        var expectOverlay = '';
        var expectDiffPathA = 'users/neekey/nodejs/app/helloworld/package/index';
        var expectDiffPathB = 'users/nic/ruby/app/monster/package/main';

        var actual = Util.pathCompare( pathA, pathB );

        expect( actual[ 0 ]).toBe( expectOverlay );
        expect( actual[ 1 ]).toBe( expectDiffPathA );
        expect( actual[ 2 ]).toBe( expectDiffPathB );
    });
});