// Link State Routing Functions

function generateLSAs(topo) {
    let LSAs = {};
    for (let node in topo.config) {
        LSAs[node] = topo.config[node];
    }
    return LSAs;
}

function generateLSDB(LSAs) {
    let LSDB = {};
    for (let LSA in LSAs) {
        LSDB[LSA] = LSAs[LSA];
    }
    return LSDB;
}

function generateRoutingTable(shortestPathResult) {
    let routingTable = {};
    const dest = shortestPathResult.path[shortestPathResult.path.length - 1];  // Get the last node in the path as destination
    routingTable[dest] = shortestPathResult.path[1];  // Next hop is the second node in the path
    console.log("Generated routing table:", routingTable);
    return routingTable;
}

// Dijkstra's Algorithm
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

    console.log("Dijkstra result:", { distance: distances[end], path: path, hop_count: hopCount });
    return { distance: distances[end], path: path, hop_count: hopCount };
}

function tablaEnrutamient(shortestPath, from, to, message) {
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
    tablaEnrutamient,
    generateLSAs,
    generateLSDB,
    generateRoutingTable
};
