// @ts-nocheck
// Desactiva la verificación de tipos de TypeScript para todo el archivo

// Agrega un listener de evento al botón con el id 'resumir'. Cuando se hace clic, se ejecuta la función anónima.
document.getElementById( 'resumir' ).addEventListener( 'click', function () {
  // Usa chrome.tabs.query para obtener información sobre la pestaña activa en la ventana actual.
  chrome.tabs.query( { active: true, currentWindow: true }, function ( tabs ) {
    // Usa chrome.scripting.executeScript para ejecutar un script en la pestaña especificada.
    chrome.scripting.executeScript( {
      // Especifica el ID de la pestaña en la que se ejecutará el script.
      target: { tabId: tabs[ 0 ].id },
      // Indica la función que se ejecutará en la pestaña.
      function: extraerContenido
    }, function ( result ) {
      // La función extraerContenido devuelve el contenido de la página como texto.
      // El resultado de la ejecución del script se pasa a esta función de callback.
      let contenido = result[ 0 ].result;
      // Llama a la función obtenerResumen con el contenido extraído.
      obtenerResumen( contenido );
    } );
  } );
} );

// Esta función se ejecuta en el contexto de la pestaña y devuelve el texto del cuerpo del documento.
function extraerContenido() {
  return document.body.innerText;
}

// Esta función se encarga de obtener el resumen del texto utilizando la API de OpenAI.
function obtenerResumen( texto ) {
  // Clave de API para autenticarse en el servicio de OpenAI.
  let apiKey = ' ';
  // URL de la API de OpenAI para obtener resúmenes.
  let url = 'https://api.openai.com/v1/chat/completions';
  // Datos que se enviarán a la API. Incluyen el modelo a usar y el texto a resumir.
  let data = {
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": `A partir del siguiente texto, por favor, resuma el contenido:\n\n${texto}`
          }
        ]
      }
    ],
    model: "gpt-4o", // Modelo de OpenAI a usar.
    temperature: 1, // Parámetro de temperatura para la generación de texto.
    max_tokens: 256, // Máximo de tokens a generar.
    top_p: 1, // Parámetro top-p para la generación de texto.
    frequency_penalty: 0, // Penalización por frecuencia para evitar repeticiones.
    presence_penalty: 0, // Penalización por presencia para evitar repeticiones.
  };

  // Se hace una solicitud POST a la API con los datos especificados.
  fetch( url, {
    method: 'POST', // Método de la solicitud HTTP.
    headers: {
      'Content-Type': 'application/json', // Tipo de contenido que se envía.
      'Authorization': `Bearer ${apiKey}` // Autorización con la clave de API.
    },
    body: JSON.stringify( data ) // Convierte el objeto data a una cadena JSON para enviarla.
  } )
    .then( response => response.json() ) // Convierte la respuesta a JSON.
    .then( data => {
      // Extrae el contenido del resumen de la respuesta de la API.
      let resumen = data.choices[ 0 ].message.content;
      // Muestra el resumen en el elemento con id 'resultado' en la página.
      // @ts-ignore
      document.getElementById( 'resultado' ).innerText = resumen;
    } )
    .catch( error => console.error( 'Error:', error ) ); // Manejo de errores en la solicitud.
}
