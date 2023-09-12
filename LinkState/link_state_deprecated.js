const fs = require('fs');

// Leer el archivo JSON para obtener los nodos y sus direcciones de correo
const rawData = fs.readFileSync('names-demo-1.json');
const data = JSON.parse(rawData);
const nodes = Object.keys(data.config);

// Objeto que asigna un costo aleatorio a cada par de nodos conectados
let costs = {};
for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        const key = `${nodes[i]}_${nodes[j]}`;
        costs[key] = Math.floor(Math.random() * 10) + 1;
    }
}

// Funcion Dijkstra para calcular la tabla de enrutamiento
function dijkstra(startNode) {
    let distances = {};
    nodes.forEach(node => {
        distances[node] = Infinity;
    });
    distances[startNode] = 0;

    let visited = new Set();
    let queue = [startNode];

    while (queue.length > 0) {
        const currentNode = queue.shift();
        visited.add(currentNode);

        for (const [key, cost] of Object.entries(costs)) {
            const [node1, node2] = key.split('_');
            if (node1 === currentNode || node2 === currentNode) {
                const neighbor = node1 === currentNode ? node2 : node1;
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                }
                const newDistance = distances[currentNode] + cost;
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                }
            }
        }
    }

    return distances;
}

// Calcula las tablas de enrutamiento para cada nodo
let routingTables = {};
nodes.forEach(node => {
    routingTables[node] = dijkstra(node);
});

console.log("Routing Tables:", routingTables);

// Funcion para enviar un mensaje de un nodo a otro
function sendMessage(fromNode, toNode, message) {
    // Obtener la tabla de enrutamiento del nodo de origen
    const routingTable = routingTables[fromNode];

    // Obtener el siguiente nodo en el camino hacia el nodo de destino
    const nextNode = Object.keys(routingTable).reduce((next, node) => {
        if (node !== toNode) return next;
        return routingTable[node] < next.cost ? { node, cost: routingTable[node] } : next;
    }, { node: null, cost: Infinity }).node;

    // Crear el paquete JSON para el mensaje
    const packet = {
        type: 'message',
        headers: {
            from: fromNode,
            to: toNode,
            hop_count: 0
        },
        payload: message
    };

    console.log(`Sending packet from ${fromNode} to ${nextNode}: ${JSON.stringify(packet)}`);
}

// Enviar un mensaje de A a F
sendMessage('A', 'F', 'Hola mundo');