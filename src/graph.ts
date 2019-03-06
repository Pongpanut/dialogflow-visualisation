export class Graph { 
    public noOfVertices: string;
    public AdjList;

    constructor(noOfVertices) 
    { 
        this.noOfVertices = noOfVertices; 
        this.AdjList = new Map(); 
    } 

    addVertex(v) 
    { 
        this.AdjList.set(v, []); 
    } 

    addEdge(v, w) 
    { 
        this.AdjList.get(v).push(w); 
    } 

    printGraph() 
    { 
        // get all the vertices 
        var get_keys = this.AdjList.keys(); 
      
        for (var i of get_keys)  { 
            var get_values = this.AdjList.get(i); 
            var conc = ""; 
      
            for (var j of get_values) {
                conc += j + " "; 
            }

            console.log(i + " -> " + conc); 
        } 
    }
    
    getEdge() 
    { 
        // get all the vertices 
        var get_keys = this.AdjList.keys(); 
        var edgeText : string = ''; 
        for (var i of get_keys)  { 
            var get_values = this.AdjList.get(i); 
            if(get_values != ""){
                var conc = ""; 
        
                for (var j of get_values) {
                    edgeText += '{from:' + i + ', to: '+  j + '},';
                    conc += j + " "; 
                }

                console.log(i + " -> " + conc); 
            }
        }
        return edgeText;
    }

    getNode(intentIndex) 
    { 
        // get all the vertices 
        var numOfNode = this.noOfVertices;
        var i:number = 0; 
        var intentStr:String = '';     
        // var graphObj = graph.AdjList;
        for(i = 1 ;i <= numOfNode ;i++) {
            let name = getByValue(intentIndex, i);
            intentStr += '{id:' + i + ', label:"'+ name + '", title: "Tooltip for' + name +'"}';
            if( i < numOfNode){
                intentStr += ',' 
            }
        }   
        console.log(intentStr);

        return intentStr;
    }

    function getByValue(map, searchValue) {
        for (let [key, value] of map.entries()) {
          if (value === searchValue)
            return key;
        }
    }
} 