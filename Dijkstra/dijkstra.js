const readline = require("readline");

function dijkstra(topo, start, end) {
    let distances = {};
    for (let node in topo.config) {
        distances[node] = Infinity;
    }
    distances[start] = 0;

    let visited = {};
    let previousNodes = {};

    let hopCount = 0; // Variable para contar los nodos visitados

    while (Object.keys(visited).length < Object.keys(topo.config).length) {
        let minNode = null;
        for (let node in distances) {
            if (!visited[node]) {
                if (minNode === null || distances[node] < distances[minNode]) {
                    minNode = node;
                }
            }
        }

        visited[minNode] = true;
        hopCount++; // Incrementa el contador de nodos visitados

        for (let neighbor of topo.config[minNode]) {
            let newDistance = distances[minNode] + 1; // Asumiendo distancia 1 entre todos los nodos
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                previousNodes[neighbor] = minNode;
            }
        }
    }

    let path = [];
    let currentNode = end;
    while (currentNode !== start) {
        path.unshift(currentNode);
        currentNode = previousNodes[currentNode];
    }
    path.unshift(start);

    return { distance: distances[end], path: path, hop_count: hopCount }; // Agrega hop_count al resultado
}

function tablaEnrutamient(shortestPath, from, to, message){
    let routingTable = {};

    routingTable["from"] = from;
    routingTable["to"] = to;
    routingTable["message"] = message;
    routingTable["shortestPath"] = shortestPath;
    routingTable["hop_count"] = shortestPath.hop_count; // Agrega hop_count a la tabla de enrutamiento

    return routingTable;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let topo = {
    type: "topo",
    config: {
        'A': ['C', 'E', 'F', 'G'],
        'B': ['F', 'G'],
        'C': ['A', 'D', 'G'],
        'D': ['C', 'E', 'G']
    }
};

console.log("Topo: ");
console.log(topo);

rl.question("Ingrese el nodo de inicio: ", function(start) {
    rl.question("Ingrese el nodo de fin: ", function(end) {
        rl.question("Ingrese un mensaje: ", function(message) {
            console.log("El mensaje es: " + message);

            const shortestPath = dijkstra(topo, start, end);
            console.log("El shortest path es: ");
            console.log(shortestPath);

            const routingTable = tablaEnrutamient(shortestPath, start, end, message);
            console.log("La tabla de enrutamiento es: ");
            console.log(routingTable);

            rl.close();
        });
    });
});
