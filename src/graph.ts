const stringUtils = require('./utils/StringUtils');

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

    async createEdgeString(data, intents, intentIndex): Promise<string>{
        let edgeString = '';
    
        data.forEach(function(dataObj){
          dataObj.outputContext.forEach(function(outputContext){
              var outputIntent = intents.filter(x => x.inputContextNames[0] == outputContext.name)
              if(outputIntent){
                    outputIntent.forEach(function (data) {
                         edgeString += '{from:' + dataObj.index + ', to: '+  intentIndex.get(data.displayName) + ', title: "'+stringUtils.extractIntentName(outputContext.name)+'"},';
                    });
                }
            });
        });
        return edgeString
    }

    async createVerticesString(intentIndex, intentDict) : Promise<any>{ 
        var numOfNode = this.noOfVertices;
        var i: number = 0; 
        var intentStr: string = ''; 
        var idvIntentStr: string = ''; 
        
        for(i = 1 ;i <= numOfNode ;i++) {
            var intent = intentDict.find(x => x.id == i);
            if(intent.inputContextNames != "" || intent.outputContexts != ""){
                intentStr += '{id:' + i + ', label:"'+ intent.intentName + '", title: "Tooltip for ' + intent.intentName +'"},';
            }
            else {
                idvIntentStr += '{id:' + i + ', label:"'+ intent.intentName + '", title: "Tooltip for ' + intent.intentName +'"},'; 
            }
        }   
        return {
            intentStr: intentStr,
            idvIntentStr: idvIntentStr
        };
    }
} 