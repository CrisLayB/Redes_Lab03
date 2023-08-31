const readline = require("readline");

function dijkstra(graph, start, end) {
    // Crear un objeto para almacenar las distancias desde el nodo de inicio hasta cada nodo
    let distances = {};
    // Inicializar todas las distancias en infinito
    for (let node in graph) {
        distances[node] = Infinity;
    }
    // Establecer la distancia desde el nodo de inicio hasta sí mismo en 0
    distances[start] = 0;

    // Crear un objeto para almacenar los nodos visitados
    let visited = {};

    // Mientras haya nodos no visitados
    while (Object.keys(visited).length < Object.keys(graph).length) {
        // Encontrar el nodo no visitado con la distancia más corta desde el nodo de inicio
        let minNode = null;
        for (let node in distances) {
            if (!visited[node]) {
                if (minNode === null || distances[node] < distances[minNode]) {
                    minNode = node;
                }
            }
        }

        // Marcar el nodo como visitado
        visited[minNode] = true;

        // Actualizar las distancias a los nodos adyacentes
        for (let neighbor in graph[minNode]) {
            let newDistance = distances[minNode] + graph[minNode][neighbor];
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
            }
        }
    }

    // Devolver la distancia desde el nodo de inicio hasta el nodo de destino
    return distances[end];
}

function tablaEnrutamient(shortestPath, from, to, message){
    let routingTable = {};

    routingTable["from"] = from;
    routingTable["to"] = to;
    routingTable["message"] = message;
    routingTable["shortestPath"] = shortestPath;

    return routingTable;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  

// Grafo a usar de momento:
let graph = {
    A: {B: 2, C: 4, E: 3, F: 5, G: 6},
    B: {A: 2, C: 1, D: 4, F: 2, H: 7},
    C: {A: 4, B: 1, D: 2, G: 5, I: 8},
    D: {B: 4, C: 2, H: 3, J: 9},
    E: {A: 3, F: 1, K: 10},
    F: {A: 5, B: 2, E: 1, G: 3, L: 11},
    G: {A: 6, C: 5, F: 3, H: 2, M: 12},
    H: {B: 7, D: 3, G: 2, N: 13},
    I: {C: 8, J:14},
    J:{D :9,I :14,K :15,L :16,M :17,N :18,O :19,P :20},
    K:{E :10,J :15,Q :21,R :22,S :23,T :24,U :25,V :26,W :27,X :28,Y :29,Z :30},
    L:{F :11,J :16,Q :31,R :32,S :33,T :34,U :35,V :36,W :37,X :38,Y :39,Z :40},
    M:{G :12,J :17,Q :41,R :42,S :43,T :44,U :45,V :46,W :47,X :48,Y :49,Z :50}
};


// Imprimiendo el grafo.
console.log("Grafo: ");
console.log(graph);

// Pidiendo el nodo de inicio y el nodo de fin.
rl.question("Ingrese el nodo de inicio: ", function(start) {
    rl.question("Ingrese el nodo de fin: ", function(end) {

        shortestPath = dijkstra(graph, start, end);

        // Imprimiendo la distancia más corta.
        console.log("La distancia más corta desde " + start + " hasta " + end + " es: " + shortestPath);

        // Pidiendo un mensaje.
        rl.question("Ingrese un mensaje: ", function(message) {
            // Imprimiendo el mensaje.
            console.log("El mensaje es: " + message);

            // Imprimiendo la tabla de enrutamiento.
            console.log("Tabla de enrutamiento: ");
            console.log(tablaEnrutamient(shortestPath, start, end, message));
            rl.close();
        });

    });
});

//const distancia = dijkstra(graph, "A", "D")

// Imprimiendo la info adecuadamente.
//console.log("La distancia más corta desde A hasta D es: " + distancia);