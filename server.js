const { v4: uuidv4 } = require('uuid');
const express = require('express')
const path = require('path')
const session = require('express-session')
const mysql = require('mysql')
const body_parser = require('body-parser')
const md5 = require('md5')

const PORT = process.env.PORT || 3000
const dir = path.join(__dirname, 'public')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: 'key'}))
app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'graduation-db',
    typeCast: function castField( field, useDefaultTypeCasting ) {

		if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
			var bytes = field.buffer()
			return( bytes[ 0 ] === 1 )
		}

		return( useDefaultTypeCasting() )

	}
})

db.connect((err) => {
    if (err) throw err
    console.log('Connected!')
})

db.query('CREATE TABLE IF NOT EXISTS accounts (id int(10), username varchar(50) NOT NULL, password varchar(255) NOT NULL, email varchar(100) NOT NULL, is_admin BOOLEAN, PRIMARY KEY (id))', (error, results)=>{})
db.query('CREATE TABLE IF NOT EXISTS exercise (ID varchar(40), name varchar(100) NOT NULL, description varchar(255) NOT NULL, genericTarget varchar(10) NOT NULL, specificTarget varchar(10) NOT NULL, set_number int(3) NOT NULL, min_reps int(3) NOT NULL, max_reps int(3) NOT NULL, PRIMARY KEY (ID))', (error, results)=>{})
db.query('SELECT * FROM accounts WHERE email LIKE "admin%"', (err, result)=>{
    if(result === '[]'){
        db.query(`INSERT INTO accounts (id, username, password, email, is_admin) VALUES (${uuid4()}, '${Admin}', '${md5("admin")}', ${"admin@admin.com"}, ${true})`)
    }
})

app.get('/', (req, res) => {
    if(session.email!==undefined){
        res.sendFile(path.join(__dirname, '/html/home/index.html'))
    }else{
        res.sendFile(path.join(dir+'/index.html'))
    }
})

app.get('/home', (req, res) => {
    if(session.email!==undefined){
        res.sendFile(path.join(__dirname, '/html/home/index.html'))
    }else{
        res.sendFile(path.join(__dirname, '/public/index.html'))
    }
})

app.get('/add-new-exercise', (req, res)=>{
    res.sendFile(path.join(__dirname, 'html/addNew/index.html'))
})

app.get('/users', (req, res)=>{
    res.sendFile(path.join(__dirname, 'html/users/index.html'))
})

app.get('/get-users', (req, res)=>{
    db.query(`SELECT id, username, email, password, is_admin FROM accounts`, (err, result)=>{
        res.send(JSON.stringify(result))
    })
})

app.post('/edit-user', (req, res)=>{
    //console.log(req.body.id)
    obj = JSON.parse(req.body.string)

    if(obj.user !== ''){
        db.query(`UPDATE accounts SET username = '${obj.user}' WHERE id = ${req.body.id}`, (err, result)=>{
        })
    }

    if(obj.email !== ''){
        db.query(`UPDATE accounts SET email = '${obj.email}' WHERE id = ${req.body.id}`, (err, result)=>{
        })
    }

    if(obj.password !== ''){
        db.query(`UPDATE accounts SET password = '${md5(obj.password)}' WHERE id = ${req.body.id}`, (err, result)=>{
        })
    }

    if(obj.admin == true){
        db.query(`UPDATE accounts SET is_admin = ${obj.admin} WHERE id = ${req.body.id}`, (err, result)=>{
        })
    }else{
        db.query(`UPDATE accounts SET is_admin = ${obj.admin} WHERE id = ${req.body.id}`, (err, result)=>{
        })
    }
})

app.post('/delete-user', (req, res)=>{
    console.log(req.body.id);
    db.query(`DELETE FROM accounts WHERE id = ${req.body.id}`, (err, result)=>{
        res.send(true)
    })
})

app.post('/new-exercise', (req, res)=>{
    let obj = JSON.parse(req.body.jsonString)
    db.query(`INSERT INTO exercise (ID, name, description, genericTarget, specificTarget, set_number, min_reps, max_reps) VALUES ('${uuidv4()}', '${obj.exerciseName}', '${obj.description}', '${obj.genericTarget}', '${obj.specificTarget}', ${obj.sets}, ${obj.min}, ${obj.max})`, (err, result)=>{
        console.log(err)
        if(err === null){
            res.send(true)
        }else{
            res.send(false)
        }
    })
})

app.post('/get-exercise', (req, res)=>{
    let target = req.body.target
    db.query(`SELECT name, description, specificTarget, set_number, min_reps, max_reps FROM exercise WHERE genericTarget = '${target}'`, (err, result)=>{
        res.send(JSON.stringify(result))
    })
})

app.post('/login', (req, res) => {
    let users=[]
    let check=false

    db.query('SELECT * FROM accounts', (error, result)=>{
        users = result
        for(i=0;i<users.length;i++){
            if(req.body.email === users[i].email && md5(req.body.password) === users[i].password){
                db.query(`SELECT id FROM accounts WHERE email = '${req.body.email}'`, (err, result)=>{session.id = result[0].id})
                session.email = req.body.email
                session.password = md5(req.body.password)
                if(users[i].is_admin){
                    session.isAdmin = true
                }else{
                    session.isAdmin = false
                }
                check=true
            }
        }

        if(check){            
            res.send(true)
        }else{
            res.send(false)
        } 
    })   
    
})

app.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname, '/html/register/index.html'))
})

app.post('/register-form', (req, res)=>{
        db.query('SELECT email FROM accounts', (err, result)=>{
            users = result
            let check = false
            let id = Math.random() * (99999 - 1) + 1
            if(result!==undefined){
                for(i=0;i<users.length;i++){
                    if(req.body.email === users[i].email){
                       check = true
                    }
                }

                if(check){
                    res.send('alert')
                }else{
                    db.query(`INSERT INTO accounts (id, username, password, email, is_admin) VALUES (${id}, '${req.body.name} ${req.body.surname}', '${md5(req.body.password)}', '${req.body.email}', 0)`, (err, result, fields)=>{
                        session.id = id
                        session.email = req.body.email
                        session.password = md5(req.body.password)
                        session.isAdmin = false
                    })   
                    res.send('registration-complete')
                }
            }else{
                db.query(`INSERT INTO accounts (id, username, password, email, is_admin) VALUES (${id}, '${req.body.name} ${req.body.surname}', '${md5(req.body.password)}', '${req.body.email}', 0)`, (err, result, fields)=>{
                    session.id = id
                    session.email = req.body.email
                    session.password = md5(req.body.password)
                    session.isAdmin = false
                })               
                res.send('registration-complete')
            }            
        })
})

app.get('/session', (req, res)=>{
    if(session.isAdmin){
        res.send(true)
    }else{
        res.send(false)

    }
})

app.post('/log-out', (req, res) => {
    if(session.email !== undefined) {
        delete session.email
        delete session.password
        delete session.isAdmin
    }      
    res.send(true)
})

app.get('/delete-session', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/refresh', (req, res)=>{
    if(session.email != undefined){
        res.send(true)
    }else{
        res.send(false)
    }
})

app.get('/no-refresh', (req, res)=>{
    res.sendFile(path.join(__dirname, 'html/home/index.html'))
})

app.listen(PORT, () => {
    console.log('Server started')
})