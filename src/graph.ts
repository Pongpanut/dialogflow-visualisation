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
    
    getEdge(intentDict) 
    { 
        console.log(intentDict)
        var get_keys = this.AdjList.keys(); 
        var edgeText : string = ''; 
        for (var i of get_keys)  { 
            var get_values = this.AdjList.get(i); 
            if(get_values != ""){
                for (var j of get_values) {
                    var intent = intentDict.find(x => x.id == i);    
                    edgeText += '{from:' + i + ', to: '+  j + ', title: "'+intent.outputContexts+'"},';
                }
                
            }
        }
        return edgeText;
    }

    getVertices(intentIndex, intentDict) 
    { 
        var numOfNode = this.noOfVertices;
        var i: number = 0; 
        var intentStr: string = ''; 
        
        for(i = 1 ;i <= numOfNode ;i++) {
            var intentTemp = intentDict.find(x => x.id == i);
            if(intentTemp.inputContextNames != "" || intentTemp.outputContexts != ""){
                intentStr += '{id:' + i + ', label:"'+ intentTemp.intentName + '", title: "Tooltip for ' + intentTemp.intentName +'"}';
                if( i < numOfNode){
                    intentStr += ',' 
                }
            }
        }   
        return intentStr;
    }
} 