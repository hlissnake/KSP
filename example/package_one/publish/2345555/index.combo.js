/*
combined files : 

package_one/mod
package_one/index

*/
KISSY.add('package_one/mod',function(){
    console.log( 'mod' );
});KISSY.add('package_one/index',function(){

    console.log( 'index');
},{requires: [ './mod' ]});