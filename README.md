# Dialogflow conversation visualisation

This project enhance visualisation ability to your dialogflow project. It will shown you the relation of an intent that you designed for the converstion.

## Getting Started

Dialogflow platform provide service to create chatbot with a few click. You can build a conversation logic by create an intent, set a training phase and set a reponse to what ever you want then the bot will reply what you want. but to make a conversation in real life it not only question and answer. You need to consider the context of converstion aswell To make conversation more smooth you have to create conversation flow by define input/output context but let imagine if you have a hundread of intent with fully relationship It will be exhausted task 

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
npm run start
```

<p align="center">
  <img width="460"  src="https://drive.google.com/uc?export=view&id=1TM0Y6ATHB8ZUD_fuFaW2v6b70NdJoaIL">
</p>

Open your browser and enjoy with this path 
```
http://localhost:8080/
```

After open the browser. On the header you will see your project ID on the left and main menu on the right.
   - Intent - This section shows the intent which have a relation (inputcontext and outputcontext) with other
   - Individual intent - This section will show stand alone intent (no relation with others)
   - Read me This section will show the information about icon or meaning of the edge color
   
![image](https://drive.google.com/uc?export=view&id=1ioMfULcn3Zx64tp-495HVdoTKxpI-6da)


Intent sestion will show the graph about relation of an intents. it's directional graph

![image](https://drive.google.com/uc?export=view&id=1hbslUu9PwEBxIt60jsIBeTWpLaZ8kAgt)

There is a control panel at the bottom of each section you can move left/right zoom in/out 

![image](https://drive.google.com/uc?export=view&id=12UoHiQE1Ru-wLla4l5ugBEfu3kgEvgQ9)

  

Once you hover the node it will show you below</br>
   - Training pharse - This is your training phrase that you use. we limited number of the phrase to 3 pharses.</br>
   - Response Message - This is your <b style="color:red">Text</b> Response Message (not include text in payload)
   - Number of payload - This is you number of payload that you create on platform

<p align="center">
  <img width="460"  src="https://drive.google.com/uc?export=view&id=1ErCTo_-29q-TwnJ36Agvujc8PExen0MC">
</p>

Once you hover the edge it will show you below
   - Context name - This is direct arrow. the edge will start from the parent intent to follow-up intent
   - LifespanCount - This is a number of lifespan for this context

<p align="center">
  <img width="460"  src="https://drive.google.com/uc?export=view&id=1JqAz7wswOY1hqpnihE1RMgLO6leMSS2i">
</p>

Next section is individual intent This section will show the intent in yourproject which has/have no relation with other intents

![image](https://drive.google.com/uc?export=view&id=1y0G-TD0_-0wV9kc0M7z7gLCCfThBFgDc)



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

