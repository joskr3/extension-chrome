// var miBoton = document.getElementById( "miBoton" );

// if ( miBoton !== null ) {
//   miBoton.onclick = function () {
//     alert( "Hola mundo !!!!" );
//   };


// }


// @ts-ignore
// document.getElementById( "miBoton" ).onclick = function () {
//   alert( "Hola mundo !!!!" );
// }

document.getElementById( "miBoton" )?.addEventListener( 'click', function () { 
  console.log("Hola mundo")
  alert( "Hola mundo !!!!" );
} )
