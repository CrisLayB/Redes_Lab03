package flooding;

import java.util.ArrayList;
import java.util.List;

public class Node {
    private String name;
    private boolean ready;
    private List<Edge> neighbors;

    public Node(String name) {
        this.name = name;
        this.ready = true;
        this.neighbors = new ArrayList<>();
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
