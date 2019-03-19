# Dialogflow conversation visualisation

This project provide visualisation ability to your dialogflow project. and shown you how each intent has a relationship and what is an input/output context including lifespancount.

## Getting Started

Dialogflow platform provide service to create chatbot with a few click. using dialogflow is a straight forward task. Just create an intent set a training phase and set a reponse to what you want and that's it your bot will be reply as you want.   

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

Open your browser and enjoy with this path 
```
http://localhost:3000/
```

## Running the tests


You can execute our unit test by using below command

```
npm t
```
or with coverage version

```
npm run testWithCoverage
```

