export class Graph { 
    public noOfVertices: number;
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
        var get_keys = this.AdjList.keys(); 
        var edgeText : string = ''; 
        for (var i of get_keys)  { 
            var get_values = this.AdjList.get(i); 
            if(get_values != ""){
                for (var j of get_values) {
                    edgeText += '{from:' + i + ', to: '+  j + '},';
                }
            }
        }
        return edgeText;
    }

    getVertices(intentIndex) 
    { 
        var numOfNode = this.noOfVertices;
        var i: number = 0; 
        var intentStr: string = '';     
        for(i = 1 ;i <= numOfNode ;i++) {
            let name = this.getByValue(intentIndex, i);
            intentStr += '{id:' + i + ', label:"'+ name + '", title: "Tooltip for ' + name +'"}';
            if( i < numOfNode){
                intentStr += ',' 
            }
        }   
        return intentStr;
    }

    private getByValue(map, searchValue) {
        for (let [key, value] of map.entries()) {
          if (value === searchValue)
            return key;
        }
    }
} 