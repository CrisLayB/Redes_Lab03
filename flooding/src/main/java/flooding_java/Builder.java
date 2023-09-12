package flooding_java;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class Builder {
    private String message;

    public Builder(String pMessage){
        message = pMessage;
        // run the formater.py
        formatJsons();
    }

    private void formatJsons(){
        String[] cmd = new String[2];
        cmd[0] = "python3";
        cmd[1] = "formater.py";
        try {
            Runtime rt = Runtime.getRuntime();
            rt.exec( cmd );
        } catch (Exception e) {
            System.out.println(e);
        }
    }
    
    public void build(){
        Map<String, String> readedNodes = readJsonNames("./names1-x-randomX-2023.txt");

        if(readedNodes == null) return;
        
        Map<String, Node> nodes = new HashMap<String, Node>();

        String firstNode = "";
        
        for(Map.Entry<String, String> node : readedNodes.entrySet()){
            String key = node.getKey();
            String value = node.getValue();
            nodes.put(key, new Node(key, value));

            if(firstNode.equals("")){
                firstNode = key;
            }
        }

        Map<String, ArrayList<String>> readedTopology = readJsonTopology("./topo1-x-randomX-2023.txt");

        if(readedTopology == null) return;

        for(Map.Entry<String, ArrayList<String>> topology : readedTopology.entrySet()){
            String key = topology.getKey();
            ArrayList<String> list = topology.getValue();

            for (String item : list) {
                Edge edge = new Edge(nodes.get(item));
                nodes.get(key).addNeighbor(edge);
            }
        }

        Flooding flooding = new Flooding(nodes.get(firstNode), message);
        flooding.visitedNodes();
    }
    
    public void build(String principalName){
        Map<String, String> readedNodes = readJsonNames("./names1-x-randomX-2023.txt");

        if(readedNodes == null) return;

        Map<String, Node> nodes = new HashMap<String, Node>();
        
        Node first = new Node("FIRST", principalName);
        String firstNode = "";

        for(Map.Entry<String, String> node : readedNodes.entrySet()){
            String key = node.getKey();
            String value = node.getValue();
            nodes.put(key, new Node(key, value));

            if(firstNode.equals("")){
                firstNode = key;
            }
        }

        Edge firstWithfirst = new Edge(nodes.get(firstNode));
        first.addNeighbor(firstWithfirst);

        Map<String, ArrayList<String>> readedTopology = readJsonTopology("./topo1-x-randomX-2023.txt");

        if(readedTopology == null) return;

        for(Map.Entry<String, ArrayList<String>> topology : readedTopology.entrySet()){
            String key = topology.getKey();
            ArrayList<String> list = topology.getValue();

            for (String item : list) {
                Edge edge = new Edge(nodes.get(item));
                nodes.get(key).addNeighbor(edge);
            }
        }

        Flooding flooding = new Flooding(first, message);
        flooding.visitedNodes();
    }
    
    private Map<String, String> readJsonNames(String jsonPath){
        JSONParser jsonParser = new JSONParser();
        Map<String, String> address = null;

        try (FileReader reader = new FileReader(jsonPath))
        {
            Object obj = jsonParser.parse(reader);
 
            JSONObject element = (JSONObject) obj;
            System.out.println(element);

            address = ((Map<String, String>)element.get("config"));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return address;
    }

    private Map<String, ArrayList<String>> readJsonTopology(String jsonPath){
        JSONParser jsonParser = new JSONParser();
        Map<String, ArrayList<String>> topology = null;

        try (FileReader reader = new FileReader(jsonPath))
        {
            Object obj = jsonParser.parse(reader);

            JSONObject element = (JSONObject) obj;
            System.out.println(element);

            topology = ((Map<String, ArrayList<String>>)element.get("config"));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        
        return topology;
    }
}
