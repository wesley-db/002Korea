import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
/*<----------------------------------------------------------->*/
import express from "express"; /* Accessing express module */
const app = express(); /* app is a request handler function */
/*<----------------------------------------------------------->*/
import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
/*<----------------------------------------------------------->*/
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, '../credentials/.env') });
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.gbmvg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
import {MongoClient, ServerApiVersion} from "mongodb";
const client = new MongoClient(uri, {serverApi: ServerApiVersion.v1 });
const db = process.env.MONGO_DB_NAME;
const coll = process.env.MONGO_COLLECTION;
/*<----------------------------------------------------------->*/
app.set("views", path.resolve(__dirname, "../template"));
app.set("view engine", "ejs");
import * as ui from './publicScripts/UIshop.js';
app.use(express.static(path.resolve(__dirname, "../styling")));
app.use(express.static(path.resolve(__dirname, "./publicScripts")));
app.use(express.static(path.resolve(__dirname, "../images")));
/*<----------------------------------------------------------->*/
import * as transl from './utils/translateUtil.js';
const apiKey = process.env.API_KEY;
/*<----------------MODIFY BELOW------------------------------------------->*/
process.stdin.setEncoding("utf8");
const portNumber = process.env.PORT_NUMBER;
console.log(`http://localhost:${portNumber}`);
app.listen(portNumber);
/*<----------------------------------------------------------->*/

async function connect2Mongo() {
    try {
        await client.connect();
    } catch(e) {
        console.log(e);
    }
}
/*<----------------------------------------------------------->*/

app.get("/", (req, resp) => {
    resp.render("index", {searchBar: ui.searchBar("거북이")});
    connect2Mongo();
});

app.get("/search", async (req, resp) => {
    const kWord = req.query.kWord;

    let result = await transl.translate("https://krdict.korean.go.kr/api/", apiKey, kWord);
    if (!result)
        result = ui.getBigMssg("Something went wrong, please try again.");
    else if (result.length === 0) 
        result = ui.getBigMssg("Not found, maybe cheeck your spelling?");
    else
        result = ui.getCards(result);
    resp.render("search", {
        header: ui.subHeader,
        searchBar: ui.searchBar(kWord),
        display: result
    });
});

app.post("/record", async (req, resp) => {
    const {name} = req.body;
    const words = await client.db(db).collection(coll).find({name: name}).toArray();

    const display = words.length > 0 ? ui.getTable(words) : ui.getBigMssg("I'm sorry we cannot find you.\n Please check your spelling.");
    resp.render("record", {
        header: ui.subHeader,
        table: display
    });
});

app.post("/savingWord", async (req, resp) => {
    req.body.meaning = req.body.meaning.split(",");
    try {
        await client.db(db).collection(coll).insertOne(req.body);
    } catch(e) {
        console.log(e);
    }
});
