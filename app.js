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
  const {id, todo, priority, status} = details
  console.log(todo, priority, status)

  const query = `INSERT INTO todo (id,todo, priority, status) VALUES (${id},"${todo}","${priority}","${status}")`

  await db.run(query)
  res.send('Todo Successfully Added')
})

app.get('/todos/', async (req, res) => {
  const {status, priority, search_q} = req.query
  let query1 = `select * from todo where 1=1`

  switch (true) {
    case Boolean(status):
      query1 += ` and status="${status}"`
      break
    case Boolean(priority):
      query1 += ` and priority="${priority}"`
      break
    case Boolean(search_q):
      query1 += ` and todo like "%${search_q}%"`
      break
    default:
      // Handle other cases or add additional logic if needed
      break
  }

  console.log(query1)
  const result = await db.all(query1)
  res.send(result)
})

app.get(`/todos/:todoId/`, async (req, res) => {
  const {todoId} = req.params
  const query2 = `select * from todo where id=${todoId}`
  re = await db.get(query2)
  res.send(re)
})

app.put(`/todos/:todoId/`, async (req, res) => {
  const {status, priority, todo} = req.body
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
