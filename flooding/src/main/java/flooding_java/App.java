package flooding_java;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Map;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class App 
{    
    public static void main(String[] args) {
        Map<String, String> map = readJson("./src/data/names-demo.json");

        if(map == null) return;
        
        Node first = new Node("FIRST", "lay201281@uvg.edu.gt");

        for(Map.Entry<String, String> node : map.entrySet()){
            String key = node.getKey();
            String value = node.getValue();
            System.out.println(key + " - " + value);
            Node newNode = new Node(key, value);
            
            Edge edge = new Edge(newNode);
            first.addNeighbor(edge);
        }

        Flooding flooding = new Flooding(first, "ola pero no ola de mar sino ola de saludo");
        flooding.visitedNodes();
    }

    private static Map<String, String> readJson(String jsonPath){
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
}
