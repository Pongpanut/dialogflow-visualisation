# Conversation flow visualisation for Dialogflow 

This project enhance visualisation ability to your dialogflow project. It will shown you the relation of an intent that you designed for the converstion. This is a [Demo](https://light-ether-235104.appspot.com/). 

## Getting Started

Dialogflow platform provide service to create chatbot in a few click. You can build a conversation logic by create an intent, define a training phase and define a reponse to what ever you want the bot to reply. but the conversation in real life it not only question and answer. We need to consider the context of converstion aswell. To make conversation more smooth you have to create conversation flow by define input/output context but let imagine if you have a hundread of intent with fully relationship It will be exhausted task to understand how the conversation flow is

### Prerequisites

In google cloud platform you need to create service accounts for your project. download a key and setting your environment variable with name 'GOOGLE_APPLICATION_CREDENTIALS'

```
export GOOGLE_APPLICATION_CREDENTIALS='your-key-file.json'
```

### Installing

Install all dependency

```
npm install
```

In /src/config folder replace 'proj-id' with your project id

```
{
    "projectId": "proj-id"
}
```

Start visulisation server

```
npm run build && npm run start
```

<p align="center">
  <img width="460"  src="https://drive.google.com/uc?export=view&id=1TM0Y6ATHB8ZUD_fuFaW2v6b70NdJoaIL">
</p>

Open your browser with 8080 port
```
http://localhost:8080/
```

After open the browser. On the header you will see your project ID on the left and main menu on the right.
   - Intent - This section shows intents which have a relation (inputcontext and outputcontext) with other
   - Individual intent - This section shows stand alone intents (no relation with others)
   - Read me This section shows the information about icon or meaning of the edge color
   
![image](https://drive.google.com/uc?export=view&id=1ioMfULcn3Zx64tp-495HVdoTKxpI-6da)


Intent sestion will show the graph about relation of an intents. it's directional graph

![image](https://drive.google.com/uc?export=view&id=1QcUMuAGTxekRw6G5_iNPvr8s78lZwyW9)

At the bottom, there is a control panel make you able to move left/right zoom in/out 

  

Once you hover the node it will show you below</br>
   - Training pharse - This is your training phrase that you use. we limited number of the phrase to 3 pharses.</br>
   - Response Message - This is your <b style="color:red">Text</b> Response Message (not include text in payload)
   - Number of payload - This is you number of payload that you create on platform

<p align="center">
  <img width="460"  src="https://drive.google.com/uc?export=view&id=1A0H8JkE-E34nBvsDMbkaAs5tbO4pK5oQ">
</p>

Once you hover the edge it will show you below
   - Context name - This is direct arrow. the edge will start from the parent intent to follow-up intent
   - LifespanCount - This is a number of lifespan for this context

<p align="center">
  <img width="460"  src="https://drive.google.com/uc?export=view&id=1JqAz7wswOY1hqpnihE1RMgLO6leMSS2i">
</p>

Next section is individual intent This section will show the intent in yourproject which has/have no relation with other intents

![image](https://drive.google.com/uc?export=view&id=1DVhjWGGxR-RH8rYmIYf8AWJgjCMPzqLh)

Last section is readme section. This will provide information about the symbol, color that we use in visualisation

![image](https://drive.google.com/uc?export=view&id=1GYzrwzz1m7pTNyhVcbOAeBU4UNpkDX3R)


## Running the tests


You can execute our unit test by using below command

```
npm t
```
if all unit test passed will show result as below

<p align="center">
  <img width="460"  src="https://drive.google.com/uc?export=view&id=1on73XQRw6YSCTuLx3iKtxYnHGGeyLE1d">
</p>

or with coverage version

```
npm run testWithCoverage
```

