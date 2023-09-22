const { client, xml, jid } = require("@xmpp/client");
const readline = require("readline");
const { dijkstra, tablaEnrutamient } = require("./dijkstra"); // Importa las funciones de dijkstra
const fs = require('fs');

// Lector del input.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Menú inicial.
function showMenu() {
  console.log("\nMenú");
  console.log("1. Iniciar sesión");
  console.log("2. Salir");

  const user = "val20159"
  const pass = "170301M@rzo"


  rl.question("Selecciona una opción: ", (answer) => {
    switch (answer) {
      case "1":
        // Pidiendo los datos del usuario, o sea usuario y contraseña.
        login(user, pass);
        break;
      case "2":
        console.log("Saliendo...");
        rl.close(); // Cerrar la interfaz antes de salir del programa.
        // Cerrando el programa.
        process.exit();
      default:
        console.log("Opción inválida.");
        showMenu();
    }
  });
}

async function login(username, password) {
  
  //console.log("Usuario: ", username)
  //console.log("Contraseña:", password)

  const xmpp = client({
    service: "xmpp://alumchat.xyz:5222",
    domain: "alumchat.xyz",
    username: username,
    password: password,
    terminal: true,
    tls: {
      // Opción para desactivar la verificación de certificados
      rejectUnauthorized: false,
    },
  });

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  //debug(xmpp, true);

  xmpp.on("error", (err) => {
    console.error(err);
  });

  xmpp.on("online", async (address) => {


    // console.log("Online como: ", address)

    // Online.
    const presence = xml('presence', { type: 'available' });
    xmpp.send(presence);


    // console.log("Inició sesión con este address: ", address)

    /**
     * 1. Chat 1 a 1 con cualquier usuario/contacto.
     * 2. Definir mensaje de presencia.
     * 3. Cerrar sesión.
     */
    
    const mainMenu = () => {

    const MAX_MESSAGE_LENGTH = 50; // Longitud máxima del mensaje a mostrar
      
    const messages = []; // Lista para almacenar todos los mensajes recibidos

    const messagesDictionary = {}

    const gChat = [] // Lista para guardar las invitaciones a chats grupales.

    xmpp.on('stanza', (stanza) => {

      //console.log("Stanza: ", stanza)

      // Imprimiendo las stanzas que se reciben.
      //console.log("Stanza recibida: ", stanza)

      // if (stanza.is("message")) {
      //   console.log("Message stanza received", stanza);

      //   // Imprimiendo el mensaje recibido de una mejor manera
      //   //stanza.get

      //   // Imprimiendo el mensaje recibido de una mejor manera
      //   //console.log("Message stanza received", stanza.getChildText("body"));

      // }

      // Verificar que sea un mensaje y que el tipo sea 'chat'
      if (stanza.is('message')) {
        const from = stanza.attrs.from;
        const body = stanza.getChildText('body');

        //console.log("Body: ", body)

      if (body) {
         //console.log("Body: ", body);

        if (body.length > MAX_MESSAGE_LENGTH) {
          const truncatedBody = body.substring(0, MAX_MESSAGE_LENGTH) + '...';
          console.log(`${from}: ${truncatedBody}`);
          
          // Guardando el mensaje en la lista.
          messages.push(body)

          // Viendo la lista.
          // console.log(messages)

          // Guardando el mensaje con el user, o sea lo que está antes del @, en el diccionario.
          if (!messagesDictionary[from]) {
            messagesDictionary[from] = [];
          }
          messagesDictionary[from].push(body);


        } else {
          console.log(`${from}: ${body}`);

          // Imprimiendo los headers del mensaje.
          if (stanza.attrs) {
            console.log("Headers: ", stanza.attrs)
          }
          //console.log("Headers: ", stanza.attrs)
          console.log("Payload: ", body);

          // Guardando el mensaje en la lista.
          messages.push(body)

          const fromUser = from.split('@')[0]; // Obtener el nombre de usuario sin el dominio

          if (!messagesDictionary[fromUser]) {
            messagesDictionary[fromUser] = [];
          }

          messagesDictionary[fromUser].push(body);

          // console.log("Messages dictionary: ", messagesDictionary)
        
        }
      }
      }

    });
      // Llamar a la función para imprimir el último mensaje cada 10 segundos
      //setInterval(printLastMessage, 10000); // 5000 ms = 5 segundos

      async function readDataFromFile(fileName) {
        return new Promise((resolve, reject) => {
          fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      }

      function convertirTextoAJSON(texto) {
        try {
          // Reemplazar comillas simples por comillas dobles
          const textoCorregido = texto.replace(/'/g, '"');
          
          // Analizar el texto corregido como JSON
          const objetoJSON = JSON.parse(textoCorregido);
      
          return objetoJSON;
        } catch (error) {
          console.error('Error al convertir el texto a JSON:', error);
          return null;
        }
      }
      
      // Función para mostrar el menú de opciones
      const opciones = () => {
        console.log("\nMenú de opciones");
        console.log("1. Chat 1 a 1.");
        console.log("2. Definir mensaje de presencia.");
        console.log("3. Cerrar sesión.");
      };
      
      opciones()

      // Creando una interfaz de rl.
      const rl2 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });


      rl.question("¿Qué opción deseas?: ", async (answer) => {
        switch (answer) {
          case "1":

            // Creando otra interfaz de lectura para poder leer el input del usuario.
            const rl2 = readline.createInterface({
              input: process.stdin,
              output: process.stdout,
            });

            console.log("Comunicación 1 a 1 con cualquier usuario/contacto...");

            const namesJSON = await readDataFromFile('../names1-x-randomX-2023.txt');
            const names = JSON.parse(namesJSON);

            console.log("Nombres \n");
            console.log(names);

            const topoJSON = await readDataFromFile('../topo1-x-randomX-2023.txt');
            const topo = JSON.parse(topoJSON);

            //console.log("Topología: \n");
            //console.log(topo);

            // Imprimiendo mi user.

            // Descomentar esto cuando sea el día de la presentación.

            const usernameAlm = username + "@alumchat.xyz" 

            //const usernameAlm = "bar@alumchat.xyz";

            //console.log("Username actual: ", usernameAlm);

            // Verificar si el nombre de usuario está en el JSON
            const keys = Object.keys(names.config);

            if (keys.some(key => names.config[key] === usernameAlm)) {
                //console.log(`El usuario ${usernameAlm} está presente en el JSON.`);

                // Pedir un nombre de usuario con el que se quiera chatear.
                rl2.question("¿Con qué usuario desea chatear? ", async (userID) => {

                  var claveIni = "";
                  
                  for (const key of keys) {
                    if (names.config[key] === usernameAlm) {
                      //console.log(`La clave correspondiente al valor ${newI} es: ${key}`);

                      claveIni = key;

                      break; // Termina el bucle una vez que se encuentra la coincidencia
                    }
                  }

                  const newI = userID + "@alumchat.xyz"
                  //console.log("Usuario con quien chatear: ", newI);
                  
                  // Guardando la clave del usuario.
                  var claveDest = "";

                  for (const key of keys) {
                    if (names.config[key] === newI) {
                      //console.log(`La clave correspondiente al valor ${newI} es: ${key}`);

                      claveDest = key;

                      break; // Termina el bucle una vez que se encuentra la coincidencia
                    }
                  }

                  //console.log("Clave inicial: ", claveIni, " clave destino: ", claveDest);

                  //console.log("Clave a buscar: ", clave);

                  // Calcula su distancia más corta.
                  const shortestP = dijkstra(topo, claveIni, claveDest);

                  //console.log("Shortest path: ", shortestP);

                  // Chateando con el user.
                  chatWithUser(newI, shortestP, claveIni, claveDest);

                })


            } else {
              console.log(`El usuario ${usernameAlm} NO está presente en el JSON.`);
            }

            

            // // Pidiendo el usuario con el que se quiere chatear.
            // rl2.question("JID del usuario con el que deseas chatear: ", (userJID) => {
            //   const newC = userJID + "@alumchat.xyz";
            //   chatWithUser(newC);
            // });
            
            async function chatWithUser(userJID, path, claveIni, claveDest) {

              console.log(`Iniciando chat con: ${userJID}`);

              var routingTable = "";
            
              
                // Función para manejar los mensajes entrantes del usuario
                function handleIncomingMessages() {
                  xmpp.on('stanza', async (stanza) => {
                    if (stanza.is('message') && stanza.attrs.type === 'chat') {
                      const from = stanza.attrs.from;
                      const body = stanza.getChildText('body');
                      const subject = stanza.getChildText('subject');
              
                      if (subject && (subject.includes('Archivo:') || subject.includes('File:'))) {
                        console.log("Archivo recibido");
                        const fileName = subject.slice(subject.indexOf(':') + 1).trim();
                        const base64Data = body.slice(7); // Eliminar "file://"
                        const filePath = `./recibidos/${fileName}`; // Cambiar la ruta según tu necesidad
                      
                        // Convertir base64 a archivo y guardarlo
                        await saveBase64ToFile(base64Data, filePath);
                      
                        console.log(`Archivo recibido de ${from}: ${filePath}`);
                      } else if (body) {
                        console.log(`${from}: ${body}`);
                      }
                    }
                  });
                }
            
              // Comenzar a escuchar mensajes del usuario
              handleIncomingMessages();

              async function saveBase64ToFile(base64Data, filePath) {
                const fs = require('fs');
                const fileData = Buffer.from(base64Data, 'base64');
                await fs.promises.writeFile(filePath, fileData);
                console.log(`Archivo guardado en: ${filePath}`);
              }
            
              // Configurar el manejo de entrada de mensajes desde la consola
              const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
              });
            
              rl.setPrompt('Tú: ');
              rl.prompt();
              const messages = [];
            
              rl.on('line', async (message) => {
                if (message.trim() === 'exit') {
                  // Salir del chat al escribir "exit"
                  mainMenu();
                  rl.close();
                } else if (message.trim() === 'archivo'){
                  rl.question("Ingresa la ruta del archivo que deseas enviar: ", async (filePath) => {
                    // Enviar el archivo al usuario
                    await enviarArchivoBase64(userJID, filePath);
                    
                    
                    // Función para convertir archivo a base64
                    function fileToBase64(filePath) {
                      const fs = require('fs');
                      const fileData = fs.readFileSync(filePath);
                      const base64Data = fileData.toString('base64');
                      return base64Data;
                    }

                    // Función para enviar un archivo como mensaje en base64
                    async function enviarArchivoBase64(contactJID, filePath) {
                      // const newC = contactJID + '@alumchat.xyz';

                      // Leer el archivo y convertirlo a base64
                      const base64File = fileToBase64(filePath);
                      const fileName = filePath.split('/').pop(); // Obtener el nombre del archivo desde la ruta

                      // Crear el mensaje con el archivo en base64
                      const message = xml(
                        'message',
                        { type: 'chat', to: contactJID },
                        xml('body', {}, `file://${base64File}`),
                        xml('subject', {}, `Archivo: ${fileName}`)
                      );

                      //console.log(message);

                      // Enviar el mensaje al contacto
                      await xmpp.send(message);
                      //console.log('Archivo enviado con éxito. ' + message);
                    }
                  });
                }
                else {

                  routing = tablaEnrutamient(path, username, userJID, message);

                  //console.log(routing.hop_count)

                  const headers = {
                    to: userJID,
                    from: usernameAlm,
                    hop_count: routing.hop_count,
                  };

                  // Imprimiendo las llaves de los headers.
                  // console.log("Clave ini: ", claveIni, " clave dest: ", claveDest);

                  // Creando el mensaje como json en un string con el formato: {to: 'userJID', from: 'username', hop_count: 'hop_count', body: 'message'}
                  const messag = JSON.stringify({
                    type: 'message',
                    headers: {
                      to: claveDest,
                      from: claveIni,
                      hop_count: routing.hop_count,
                    },
                    payload: message,
                  });

                  const messageToSend = xml(
                    'message',
                    headers,
                    xml('body', {}, messag),
                  );

                  //console.log("Message: ", messageToSend);

                  console.log("Shortest path: ", path)

                  // Imprimiendo el body del mensaje.
                  // console.log("Body del mensaje: ", message);

                  
                  // // Enviando el mensaje al usuario destino
                  // const messageToSend = xml(
                  //   'message',
                  //   { type: 'message', to: userJID }, // Usamos el JID del usuario destino
                  //   xml('body', {}, routing),
                  // );
                  await xmpp.send(messageToSend);

                  //console.log("Message: ", messageToSend);

                  // Imprimiendo el body del mensaje.
                  //console.log("Body del mensaje: ", messageToSend.getChildText('body'));
                  
                  // // Enviando el mensaje al usuario destino
                  // const messageToSend = xml(
                  //   'message',
                  //   { type: 'message', to: userJID }, // Usamos el JID del usuario destino
                  //   xml('body', {}, routing),
                  // );

                  //await xmpp.send(messageToSend);


                  messages.push(message);

                  routingTable = tablaEnrutamient(path, username, userJID, messages);

                  // Guardando los datos en la tabla de enrutamiento.
                }
              });
            
              rl.on('close', () => {
                console.log('Chat finalizado.');
  
                console.log("Tabla de enrutamiento: ", routingTable);
                mainMenu(); // Vuelve al menú principal después de completar la conversación
              });
            }
            
            break;
          case "2":
            console.log("Definiendo un mensaje de presencia...");
          
            // Pedir el estado de presencia al usuario
            rl.question("Estado de presencia (ejemplo: 'disponible', 'ocupado', 'no disponible'): ", async (presenceState) => {
              // Pedir el mensaje personalizado para el estado de presencia
              rl.question("Mensaje personalizado: ", async (customMessage) => {
                const presence = xml(
                  'presence',
                  {},
                  xml('show', {}, presenceState),
                  xml('status', {}, customMessage)
                );
          
                // Enviar el mensaje de presencia al servidor XMPP
                await xmpp.send(presence);
          
                // Imprimiendo el mensaje de presencia con el usuario y la respuesta del servidor.
                console.log(`Mensaje de presencia enviado a ${username}: ${presence.toString()}`);
                mainMenu(); // Vuelve al menú principal después de completar la opción
              });
            });
            break; 
          case "3":
          
            console.log("Cerrando sesión...")
            
            xmpp.stop().catch(console.error);
              xmpp.on("offline", () => {
                console.log("offline");
                showMenu()
              });
            break;
          
          default:
            console.log("Opción inválida.")
            mainMenu(); // Vuelve al menú principal en caso de opción inválida
        }
      });
    };
    
    // Iniciando el menú principal
    mainMenu();
    
  });

  xmpp.start().catch(console.error);
}

// Mostrar el menú inicial.
showMenu();