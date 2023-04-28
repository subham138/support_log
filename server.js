const express = require('express');
const app = express();
const cors = require('cors');
const graphql = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');
const path = require('path');
const {schema} = require('./Schema');
const port = process.env.PORT || 3000;
const db = require('./Schema/db');
var data = '';
const nodemailer = require('nodemailer');
const Buffer = require('buffer').Buffer;

app.use(cors());
app.use(express.json());
app.use(graphqlUploadExpress({ maxFileSize: 10485760, maxFiles: 10 }));
app.use(express.static(path.join(__dirname, "assets")));

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.get('/', async (req, res) => {
    const dateFormat = require('dateformat');
    var nowDate = new Date();
    var day = dateFormat("2023-04-30", "dddd");
    console.log(day);
	res.send('Welcome To GraphQL API Server');
})

// RUN LOG OUT SCRIPT IN EVERY 8 HOURS
function intervalFunc() {
    var sql = `SELECT * FROM md_users WHERE login_status = '1'`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) console.log({ err });
            if (result.length > 0) {
                result.forEach((dt) => {
                    // console.log({ id: dt.id });
                    var up_sql = `UPDATE md_users SET login_status = '0'`;
                    db.query(up_sql, (err, lastId) => {
                        if (err) console.log({ updation_err: err });
                        // console.log(lastId);
                    })
                })
            }
            // console.log({ result: result.length });
            resolve(result);
        })
    })

}

setInterval(intervalFunc, 3600000);

app.listen(port, () => {
    console.log(`App is runnig at port: ${port}`);
})