const { client, xml, jid } = require("@xmpp/client");
const readline = require("readline");
const { dijkstra, tablaEnrutamient, generateLSAs, generateLSDB, generateRoutingTable } = require("./routing");
const fs = require('fs');
const namesJSON = fs.readFileSync('../names1-x-randomX-2023.txt', 'utf8');
const names = JSON.parse(namesJSON);

const topoJSON = fs.readFileSync('../topo1-x-randomX-2023.txt', 'utf8');
const topo = JSON.parse(topoJSON);

//*************** UTIL SECTION ****************/
const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Asynchronously read data from a file
async function readDataFromFile(filePath) {
    try {
        return await fs.promises.readFile(filePath, 'utf8');
    } catch (err) {
        console.error(`Error reading file from path ${filePath}`, err);
        throw err;
    }
}

// Utility function to handle asynchronous user input prompts
function prompt(question) {
    return new Promise((resolve) => {
        readlineInterface.question(question, (input) => {
            resolve(input);
        });
    });
}

// Utility function to retrieve key from object based on value
function getKeyFromValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
//**********************************************/

async function mainPage() {
    console.log("\nMain Menu");
    console.log("1. Login Existing User");
    console.log("2. Exit");

    // Defining login credentials
    const username = "val20159";
    const password = "170301M@rzo";
    const domain = 'alumchat.xyz';

    const input = await prompt('Choose an option (1, 2): ');
    switch (input) {
        case "1":
            loginExistingUser(username, password);
            break;
        case "2":
            closeChat();
            break;
        default:
            console.log("Invalid option.");
            mainPage();
    }
}

//**********************************************/

//**********************************************/
//*************** LOGIN SECTION ****************/

async function loginExistingUser(username, password) {
    const xmpp = createXMPPClient(username, password);
    setXMPPEventHandlers(xmpp, username);
    // Initialize LSDB here using the global topo variable
    const LSAs = generateLSAs(topo);
    const LSDB = generateLSDB(topo, LSAs);
    console.log("Generated LSDB: ", LSDB);
    xmpp.start().catch(console.error);
}

function createXMPPClient(username, password) {
    return client({
        service: "xmpp://alumchat.xyz:5222",
        domain: "alumchat.xyz",
        username: username,
        password: password,
        terminal: true,
        tls: {
            rejectUnauthorized: false
        }
    });
}

function setXMPPEventHandlers(xmpp, username) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    xmpp.on("error", (err) => {
        console.error(err);
    });

    xmpp.on("online", async (address) => {
        setStatus(xmpp);
        await loggedInMenu(xmpp, username);
    });
}

function setStatus(xmpp) {
    const presence = xml('presence', { type: 'available' });
    xmpp.send(presence);
}

async function loggedInMenu(xmpp, username) {
    //changeOnlineStatus();
    const options = [
        "Chats",
        "Logout"
    ];

    options.forEach((option, index) => {
        console.log(`${index + 1}. ${option}`);
    });

    const input = await prompt("Choose an option: ");
    switch (input) {
        case "1":
            await startChatWithUser(xmpp, username);
            break;
        case "2":
            logoutSession(xmpp);
            break;
        default:
            console.log("Invalid option.");
            await loggedInMenu(xmpp, username);
    }
}

// Handle chat with contact
async function startChatWithUser(xmpp, username) {
    console.log("1-on-1 communication with any user.");

    const namesJSON = await readDataFromFile('../names1-x-randomX-2023.txt');
    const names = JSON.parse(namesJSON);

    console.log("Names: \n");
    console.log(names);

    const topoJSON = await readDataFromFile('../topo1-x-randomX-2023.txt');
    const topo = JSON.parse(topoJSON);

    const tempUser = "bar@alumchat.xyz"; // Use the desired username here
    console.log("Current Username: ", tempUser);

    const keys = Object.keys(names.config);

    if (keys.some(key => names.config[key] === tempUser)) {
        const userID = await prompt("Enter the JID of the user you want to chat with: ");
        const claveIni = getKeyFromValue(names.config, tempUser);
        const newI = userID + "@alumchat.xyz";
        const claveDest = getKeyFromValue(names.config, newI);

        // Generate LSAs and LSDB
        const LSAs = generateLSAs(topo);
        const LSDB = generateLSDB(topo, LSAs);

        // After initializing LSDB, calculate the routing table
        const shortestPathResult = dijkstra(topo, claveIni, claveDest);
        const routingTable = generateRoutingTable(shortestPathResult);
        console.log("Generated Routing Table: ");
        console.log(routingTable);  // Print the entire routing table
        console.log("Shortest path: ", routingTable[claveDest]);  // Use routingTable to get the shortest path

        const userJID = username + "@alumchat.xyz";
        chatWithUser(xmpp, userID, routingTable, userJID);  // Pass the entire routingTable

    } else {
        console.log(`The user ${currentUsername} is NOT present in the JSON.`);
    }
}

// Chat with contact
async function chatWithUser(xmpp, destinationJID, routingTable, currentJID) {
    console.log(`Starting chat with: ${destinationJID}`);
    const userInternalName = getKeyFromValue(names.config, destinationJID + "@alumchat.xyz");
    console.log("Directly printing routingTable:", routingTable);
    console.log("Directly printing userInternalName:", userInternalName);
    const nextHop = routingTable[userInternalName];

    console.log("Internal name for user:", userInternalName);
    console.log("Next hop derived from the routing table:", nextHop);
    if (!nextHop) { // Check if nextHop is undefined
        console.error("No path available to the destination. Exiting chat.");
        return;
    }

    const MAX_MESSAGE_LENGTH = 50;
    const messages = [];
    const messagesDictionary = {};

    xmpp.on('stanza', async (stanza) => {
        if (stanza.is('message') && stanza.attrs.type === 'chat') {
            const from = stanza.attrs.from;
            const to = stanza.attrs.to;
            const body = stanza.getChildText('body');

            if (to === currentJID) {
                console.log(`${from}: ${body}`);
            } else {
                const destinationInternalName = getKeyFromValue(names.config, to);
                const nextHop = routingTable[destinationInternalName];
                const hop_count = stanza.attrs.hop_count ? parseInt(stanza.attrs.hop_count, 10) + 1 : 1;

                if (nextHop) {
                    const nextHopJID = names.config[nextHop];
                    const headers = {
                        from: from,
                        to: nextHopJID,
                        hop_count: hop_count
                    };
                    const forwardMessage = xml('message', headers, xml('body', {}, body));
                    await xmpp.send(forwardMessage);
                    console.log(`Forwarded message to: ${nextHopJID}`);
                } else {
                    console.error(`No next hop found for destination: ${to}`);
                }
            }
        }
    });

    readlineInterface.setPrompt('Type a message: ');
    readlineInterface.prompt();

    readlineInterface.on('line', async (message) => {
        if (message.trim() === './exit') {
            console.log('Chat ended');
            readlineInterface.close();
        } else if (message.trim() === 'File') {
            const filePath = await prompt("Enter the path of the file you want to send: ");
            await sendFileBase64(xmpp, destinationJID, filePath);
        } else {
            console.log(`Next hop for ${destinationJID} is: ${nextHop}`);
            const headers = {
                from: currentJID,
                to: destinationJID,
                hop_count: 0
            };
            const messageToSend = xml('message', headers, xml('body', {}, message));
            await xmpp.send(messageToSend);
        }
        readlineInterface.prompt();
    });

    readlineInterface.on('close', () => {
        console.log('Chat ended');
    });

    async function saveBase64ToFile(base64Data, filePath) {
        const fileData = Buffer.from(base64Data, 'base64');
        await fs.promises.writeFile(filePath, fileData);
        console.log(`File saved at: ${filePath}`);
    }

    function fileToBase64(filePath) {
        const fileData = fs.readFileSync(filePath);
        return fileData.toString('base64');
    }

    async function sendFileBase64(xmpp, contactJID, filePath) {
        const base64File = fileToBase64(filePath);
        const fileName = filePath.split('/').pop();
        const message = xml('message', { type: 'chat', to: contactJID }, xml('body', {}, `file://${base64File}`), xml('subject', {}, `File: ${fileName}`));
        await xmpp.send(message);
    }
}

// Logout
function logoutSession(xmpp) {
    xmpp.stop().catch(console.error);
    xmpp.on("offline", () => {
        console.log("offline");
        mainPage();
    });
}

//**********************************************/

//**********************************************/
//**************** EXIT SECTION ****************/

function closeChat() {
    console.log("Closing chat");
    // Then, close the connection with the server (if necessary)
    readlineInterface.close();
    console.log("Chat closed. Goodbye!");
    process.exit(); // Exiting the process
}

//**********************************************/

mainPage(); // Start the main page loop
