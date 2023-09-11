const { client, xml, jid } = require("@xmpp/client");
//const debug = require("@xmpp/debug");
const net = require("net");
const cliente = new net.Socket();
// const muc = require('node-xmpp-muc');

// Password: 1234

const readline = require("readline");
//const { invite } = require("simple-xmpp");
//const { default: messaging } = require("stanza/plugins/messaging");

// const xmpp = client({
//   service: "xmpp://alumchat.xyz:5222",
//   domain: "alumchat.xyz",
//   username: "val20159",
//   password: "1234",
// });

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// // debug(xmpp, true);

// xmpp.on("error", (err) => {
//   console.error(err);
// });

// xmpp.on("online", async (address) => {
//   // Makes itself available
//   await xmpp.send(xml("presence"));

//   // Sends a chat message to "gon20362@alumchat.xyz"
//   const message = xml(
//     "message",
//     { type: "chat", to: "mom20067@alumchat.xyz" },
//     xml("body", {}, "Hello, this is a message from val20159!"),
//   );

//   // Log the sent message to avoid an infinite loop of receiving it as well
//   //console.log("Sending message:", message.toString());

//   await xmpp.send(message);
// });

// xmpp.start().catch(console.error);

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

      // Imprimiendo las stanzas que se reciben.
      //console.log("Stanza recibida: ", stanza)

      // Verificar que sea un mensaje y que el tipo sea 'chat'
      if (stanza.is('message') && stanza.attrs.type === 'chat') {
        const from = stanza.attrs.from;
        const body = stanza.getChildText('body');

        //console.log("Body: ", body)

      if (body) {
        // console.log("Body: ", body);

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

    // Función para convertir archivo a base64
    function fileToBase64(filePath) {
      const fs = require('fs');
      const fileData = fs.readFileSync(filePath);
      const base64Data = fileData.toString('base64');
      return base64Data;
    }    
      // Llamar a la función para imprimir el último mensaje cada 10 segundos
      //setInterval(printLastMessage, 10000); // 5000 ms = 5 segundos
      
      // Función para mostrar el menú de opciones
      const opciones = () => {
        console.log("\nMenú de opciones");
        console.log("1. Chat 1 a 1.");
        console.log("2. Definir mensaje de presencia.");
        console.log("3. Cerrar sesión.");
      };
      
      opciones()

      rl.question("¿Qué opción deseas?: ", async (answer) => {
        switch (answer) {
          case "1":
            console.log("Comunicación 1 a 1 con cualquier usuario/contacto...");
            
            
            // Pidiendo el usuario con el que se quiere chatear.
            rl.question("JID del usuario con el que deseas chatear: ", (userJID) => {
              const newC = userJID + "@alumchat.xyz";
              chatWithUser(newC);
            });
            
            async function chatWithUser(userJID) {
              console.log(`Iniciando chat con: ${userJID}`);
            
              
                // Función para manejar los mensajes entrantes del usuario
                function 
                handleIncomingMessages() {
                  xmpp.on('stanza', async (stanza) => {
                    if (stanza.is('message') && stanza.attrs.type === 'chat') {
                      const from = stanza.attrs.from;
                      const body = stanza.getChildText('body');
                      const subject = stanza.getChildText('subject');

                      // console.log("Recibiendo: ", stanza)
                      
                      // console.log("Stanza: ", stanza)

                      // if(subject){
                      //   console.log("Subject: ", subject)
                      // }
              
                      if (subject && (subject.includes('Archivo:') || subject.includes('File:'))) {
                        console.log("Archivo recibido");
                        const fileName = subject.slice(subject.indexOf(':') + 1).trim();
                        const base64Data = body.slice(7); // Eliminar "file://"
                        const filePath = `./recibidos/${fileName}`; // Cambiar la ruta según tu necesidad
                      
                        // Convertir base64 a archivo y guardarlo
                        await saveBase64ToFile(base64Data, filePath);
                      
                        console.log(`Archivo recibido de ${from}: ${filePath}`);
                      } else if (body.includes('Archivo:') || body.includes("File:")) {
                        console.log("Archivo recibido");
                        const fileName = body.slice(body.indexOf(':') + 1).trim();
                        const base64Data = body.split('\n')[1].slice(7); // Eliminar "file://"
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
                  // Enviando el mensaje al usuario destino
                  const messageToSend = xml(
                    'message',
                    { type: 'chat', to: userJID }, // Usamos el JID del usuario destino
                    xml('body', {}, message),
                  );
                  await xmpp.send(messageToSend);
                }
              });
            
              rl.on('close', () => {
                console.log('Chat finalizado.');
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