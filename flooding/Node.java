package flooding;

import java.util.ArrayList;
import java.util.List;

public class Node {
    private String label;
    private String name;
    private boolean ready;
    private List<Edge> neighbors;

    public Node(String label){
        this.label = label;
        this.name = "";
        this.ready = true;
        this.neighbors = new ArrayList<>();
    }
    
    public Node(String label, String name) {
        this.label = label;
        this.name = name;
        this.ready = true;
        this.neighbors = new ArrayList<>();
    }

    public String getLabel() {
        return label;
    }

    public String getName() {
        return name;
    }

    public boolean getReady(){
        return ready;
    }

    public List<Edge> getNeighbors() {
        return neighbors;
    }

    public void addNeighbor(Edge edge) {
        neighbors.add(edge);
    }
}
