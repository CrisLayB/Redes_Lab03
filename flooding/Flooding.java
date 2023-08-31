package flooding;

import java.util.HashMap;
import java.util.Map;

public class Flooding {
    private Map<Node, Boolean> visited;

    public Flooding(Node startNode, String message){
        visited = new HashMap<Node, Boolean>();
        algorithmFlooding(startNode, message);
    }

    private void algorithmFlooding(Node node, String message){        
        if (visited.containsKey(node) && visited.get(node)) {
            return;
        }

        System.out.println("Node " + node.getName() + " received message: " + message);
        visited.put(node, true);

        for (Edge edge : node.getNeighbors()) {
            algorithmFlooding(edge.getTarget(), message);
        }        
    }

    public void visitedNodes(){
        for(Map.Entry<Node, Boolean> visNode : visited.entrySet()){
            System.out.println("\n---------------------------------");
            Node node = visNode.getKey();
            boolean vis = visNode.getValue();

            System.out.println("Nodo: " + node.getName());
            System.out.println("Neighbors: ");
            for (Edge edge : node.getNeighbors()) {
                Node target = edge.getTarget();
                System.out.println("\t=> " + target.getName() + " - Weight: " + edge.getWeight());
            }
            System.out.println("Visited: " + vis);
        }
    }
}

// public class Flooding {
//     public Flooding(){

//     }

//     private void addEdge(Node node1, Node node2, int weight){

//     }
// }
