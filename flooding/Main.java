package flooding;

/*************************************************************
 * <h1> Universidad del Valle de Guatemala </h1>
 * <h2> Redes - Sección 10 </h2>
 * <h3> Laboratorio 3 </h3>
 * 
 * Flooding Algorithm
 * 
 * @author: [
 *      Cristian Laynez,
 *      Mario de León,
 *      Javier del Valle
 * ]
 *************************************************************/

public class Main {
    public static void main(String[] args) {
        testing0();
    }
    
    private static void testing0(){
        Node a = new Node("A");
        Node b = new Node("B");
        Node c = new Node("C");

        Edge ab = new Edge(b);
        a.addNeighbor(ab);

        Edge ac = new Edge(c);
        a.addNeighbor(ac);

        // ...

        Edge bc = new Edge(c);
        b.addNeighbor(bc);

        // ...

        Edge cb = new Edge(b);
        c.addNeighbor(cb);

        Flooding flooding = new Flooding(a, "ola pero no ola de mar sino ola de saludo");
        flooding.visitedNodes();
    }

    private static void testing(){
        // A -> I : 1
        Node a = new Node("A");
        Node i = new Node("I");
    
        Edge ai = new Edge(i, 1);
        a.addNeighbor(ai);
    
        // A -> C : 7
        Node c = new Node("C");
    
        Edge ac = new Edge(c, 7);
        a.addNeighbor(ac);
    
        // A -> B : 7
        Node b = new Node("B");
    
        Edge ab = new Edge(b, 7);
        a.addNeighbor(ab);
    
        // I -> D : 6
        Node d = new Node("D");
    
        Edge id = new Edge(d, 6);
        i.addNeighbor(id);
    
        // C -> D : 5
        Edge cd = new Edge(d, 5);
        c.addNeighbor(cd);
    
        // B -> F : 2
        Node f = new Node("F");
    
        Edge bf = new Edge(f, 2);
        b.addNeighbor(bf);
    
        // D -> F : 1
        Edge df = new Edge(f, 1);
        d.addNeighbor(df);
    
        // F -> H : 4
        Node h = new Node("H");
    
        Edge fh = new Edge(h, 4);
        f.addNeighbor(fh);
    
        // D -> E : 1
        Node e = new Node("E");
    
        Edge de = new Edge(e, 1);
        d.addNeighbor(de);
    
        // E -> G : 4
        Node g = new Node("G");
        
        Edge eg = new Edge(g, 4);
        e.addNeighbor(eg);
    
        // F -> G : 3
        Edge fg = new Edge(g, 3);
        f.addNeighbor(fg);
    
        Flooding flooding = new Flooding(a, "ola pero no ola de mar sino ola de saludo");
        flooding.visitedNodes();
    }
}
