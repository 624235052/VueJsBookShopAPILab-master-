var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

const dotenv = require('dotenv');
dotenv.config();

var apiversion = '/api/v1';
var bookpicturepath = process.env.IMAGE_PATH;
const secretkey = process.env.SECRET;

//MYSQL Connection
var db = require('./config/db.config');

const bcrypt = require('bcryptjs');
const { sign, verify } = require('./middleware.js');


var port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());


//Upload
app.post(apiversion + '/upload', verify, (req, res) => {
  
  try {
    if (!req.files) {
      return res.status(500).send({ msg: "file is not found" })
    }

    const myFile = req.files.file;

    myFile.mv(`${bookpicturepath}${myFile.name}`, function (err) {

      if (err) {
        console.log(err)
        return res.status(500).send({ msg: "Error occured" });
      }

      return res.send({ name: myFile.name, path: `/${myFile.name}` });

    });
  } catch {
    return res.status(401).send()
  }
  

});

//Get all books
app.get(apiversion + '/books', verify, function (req, res) {

  try {

    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    db.query('SELECT * FROM books', function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: 'books list', data: results });
    });

  } catch {
    return res.status(401).send()
  }

});

//Get all student
app.get(apiversion + '/students', verify, function (req, res) {

  try {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    db.query('SELECT * FROM students', function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: 'student list', data: results });
    });
  } catch {
    return res.status(401).send()
  }

});

//Get book by id
app.get(apiversion + '/book/:bookid', verify, function (req, res) {

  try {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var bookid = Number(req.params.bookid);

    db.query('SELECT * FROM books where bookid=?', bookid.toString(), function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: 'book id =' + bookid.toString(), data: results });
    });
  } catch {
    return res.status(401).send()
  }

});

//Get student by id
app.get(apiversion + '/student/:number', verify, function (req, res) {

  try {
    var number = Number(req.params.number);

    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    db.query('SELECT * FROM students where number=?', number.toString(), function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: 'number = ' + number.toString(), data: results });
    });
  } catch {
    return res.status(401).send()
  }

});


//Delete book by id
app.delete(apiversion + '/book/:bookid', verify, function (req, res) {

  try {
    var bookid = req.params.bookid;

    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    db.query(`DELETE from books WHERE bookid =${bookid};`, function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: ' Modified book' });
    });

  } catch {
    return res.status(401).send()
  }


});


//Delete student by Id
app.delete(apiversion + '/student/:number', verify, function (req, res) {

  try {
    var number = req.params.number;

    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    db.query(`DELETE from students WHERE number =${number};`, function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: ' Modified student' });
    });
  } catch {
    return res.status(401).send()
  }


});



//Add new book
app.post(apiversion + '/book',verify, function (req, res) {

  try {
    var title = req.body.title;
    var price = req.body.price;
    var isbn = req.body.isbn;
    var pageCount = req.body.pageCount;
    var publishedDate = req.body.publishedDate;
    var thumbnailUrl = req.body.thumbnailUrl;
    var shortDescription = req.body.shortDescription;
    var author = req.body.author;
    var category = req.body.category;

    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    db.query(`INSERT INTO books 
    (title,price, isbn, pageCount, publishedDate, thumbnailUrl, 
    shortDescription, author, category) 
    VALUES ( '${title}',${price}, '${isbn}', ${pageCount}, '${publishedDate}', '${thumbnailUrl}', 
    '${shortDescription}', '${author}', '${category}');`, function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: 'Insert new book' });
    });
    
  } catch {
    return res.status(401).send()
  }

});


//Add new student
app.post(apiversion + '/student', verify, function (req, res) {

  try {
    var studentId = req.body.studentId;
    var studentName = req.body.studentName;

    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    db.query(`INSERT INTO students (studentId,studentName) VALUES ('${studentId}','${studentName}');`, function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: 'Insert new student' });
    });
  } catch {
    return res.status(401).send()
  }

});





//Edit book by id
app.put(apiversion + '/book/:bookid', verify, function (req, res) {

  try {
    var title = req.body.title;
    var price = req.body.price;
    var isbn = req.body.isbn;
    var pageCount = req.body.pageCount;
    var publishedDate = req.body.publishedDate;
    var thumbnailUrl = req.body.thumbnailUrl;
    var shortDescription = req.body.shortDescription;
    var author = req.body.author;
    var category = req.body.category;

    var bookid = req.params.bookid;


    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    db.query(`UPDATE books 
            SET 
              title ='${title}',
              price = ${price}, 
              isbn = '${isbn}', 
              pageCount = ${pageCount}, 
              publishedDate = '${publishedDate}', 
              thumbnailUrl = '${thumbnailUrl}', 
              shortDescription = '${shortDescription}', 
              author = '${author}', 
              category = '${category}'
            WHERE bookid =${bookid};`, function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: ' Modified book' });
    });
  } catch {
    return res.status(401).send()
  }



});

//put student
app.put(apiversion + '/student/:number', verify, function (req, res) {

  try {
    var studentId = req.body.studentId;
    var studentName = req.body.studentName;
    var number = req.params.number;


    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    db.query(`UPDATE students 
            Set
               studentId = '${studentId}',
               studentName = '${studentName}'
  
            where number=${number};`, function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, message: ' Modified student' });
    });
  } catch {
    return res.status(401).send()
  }
});

//API ??????????????????????????????????????????????????? Token
app.post(apiversion + '/auth/register', (req, res) => {

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  let user = {
    username: req.body.username,
    role: req.body.role,
    password: hashedPassword,
  }

  res.setHeader('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


  try {

    db.query(`INSERT INTO users 
      (username,password,role) 
      VALUES ( '${user.username}','${hashedPassword}','${user.role}');`, function (error, results, fields) {
      if (error) throw error;
      return res.status(201).send({ error: false, message: 'created a user' })
    });

  }
  catch (err) {

    return res.send(err)

  }

});

//API ????????????????????????????????????????????????
app.post(apiversion + '/auth/signin', (req, res) => {

  db.query('SELECT * FROM users where username=?', req.body.username, function (error, results, fields) {

    try {
      if (error) {

        throw error;

      } else {


        let hashedPassword = results[0].password
        const correct = bcrypt.compareSync(req.body.password, hashedPassword)

        if (correct) {
          let user = {
            username: req.body.username,
            role: results.role,
            password: hashedPassword,
          }

          // create a token
          let token = sign(user, secretkey);

          res.setHeader('Content-Type', 'application/json');
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

          return res.status(201).send({ error: false, message: 'user sigin', accessToken: token });

        } else {

          return res.status(401).send("login fail")

        }

      }

    }
    catch (e) {
      return res.status(401).send("login fail")
    }

  });




});


app.listen(port, function () {
  console.log("Server is up and running...");
});
