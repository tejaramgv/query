const express = require('express')
const app = express()
app.use(express.json())
const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')
const dbpath = path.join(__dirname, 'todoApplication.db')
let db = null
const init = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3004, () => {
      console.log('Running')
    })
  } catch (err) {
    console.log(err)
  }
}
init()
app.post('/todos/', async (req, res) => {
  const details = req.body
  const {todo, priority, status} = details
  console.log(todo, priority, status)

  const query = `INSERT INTO todo (todo, priority, status) VALUES ("${todo}","${priority}","${status}")`

  await db.run(query)
  res.send('Todo Successfully Added')
})

app.get('/todos/', async (req, res) => {
  const details = req.query
  const {status, priority, search_q} = details
  let query1 = `select * from todo where 1=1`
  if (status) {
    query1 += ` and status="${status}"`
  }
  if (priority) {
    query1 += ` and priority="${priority}"`
  }
  if (search_q) {
    query1 += ` and todo like "%${search_q}%"`
  }
  console.log(query1)
  const q = await db.all(query1)
  res.send(q)
})

app.get(`/todos/:todoId/`, async (req, res) => {
  const {todoId} = req.params
  const query2 = `select * from todo where id=${todoId}`
  re = await db.get(query2)
  res.send(re)
})

app.put(`/todos/:todoId/`, async (req, res) => {
  const {status, priority, todo} = req.query
  const {todoId} = req.params
  let query3 = null
  if (status) {
    query3 = `update todo set status="${status}" where id=${todoId}`
  } else if (priority) {
    query3 = `update todo set priority="${priority}" where id=${todoId}`
  } else {
    query3 = `update todo set todo="${todo}" where id=${todoId}`
  }
  await db.run(query3)
  if (status) {
    res.send('Status Updated')
  } else if (priority) {
    res.send('Priority Updated')
  } else {
    res.send('Todo Updated')
  }
})

app.delete(`/todos/:todoId/`, async (req, res) => {
  const {todoId} = req.params
  const query4 = `delete from todo where id=${todoId}`
  await db.run(query4)
  res.send('Todo Deleted')
})
module.exports = app
