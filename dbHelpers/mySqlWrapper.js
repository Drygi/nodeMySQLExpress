const mySql = require('mysql')

let connection = null

initConnection = () => {
  connection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123abc',
    database: 'testMedDB'
  })
}

query = (queryString, callback) => {
  initConnection()
  connection.connect()

  connection.query(queryString, (error, results, fields) => {
    callback(createDataResponseObject(error, results))
  });

  connection.end();
}

createDataResponseObject = (error, results) => {
  return {
    error: error,
    results: results === undefined
      ? null
      : results === null
        ? null
        : results
  }
}

module.exports = {
  query: query
}