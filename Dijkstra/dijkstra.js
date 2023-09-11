//const readline = require("readline");

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
    routingTable["messages"] = message;
    routingTable["shortestPath"] = shortestPath;
    routingTable["hop_count"] = shortestPath.hop_count; // Agrega hop_count a la tabla de enrutamiento

    return routingTable;
}


module.exports = {
    dijkstra,
    tablaEnrutamient
};

// // Definir los nombres y la topología
// let names = {
//     type: "names",
//     config: {
//         'A': 'yeet@alumchat.xyz',
//         'B': 'foo@alumchat.xyz',
//         'C': 'bar@alumchat.xyz',
//         'D': 'swag@alumchat.xyz',
//         'E': 'omg@alumchat.xyz',
//         'F': 'lol@alumchat.xyz',
//         'G': 'woot@alumchat.xyz'
//     }
// };

// let topo = {
//     type: "topo",
//     config: {
//         'A': ['B', 'E', 'G'],
//         'B': ['A', 'C', 'D', 'E', 'G'],
//         'C': ['B'],
//         'D': ['B', 'F'],
//         'E': ['A', 'B', 'F'],
//         'F': ['D', 'E'],
//         'G': ['A', 'B']
//     }
// };

// // Ingrese el nodo de inicio y el nodo de fin como nombres
// let start = 'A'; // Por ejemplo, si quieres calcular desde el nodo 'A'
// let end = 'D';   // hasta el nodo 'D'

// // Calcula Dijkstra
// const shortestPath = dijkstra(topo, start, end);

// console.log("El shortest path es: ");
// console.log(shortestPath);
