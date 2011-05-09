var express = require('express');

module.exports = {
  
  db: {
    name: 'thecount_dev',
    user: 'root',
    password: ''
  },
  
  session: express.session({
      key: 'thecount.sid',
      secret: '244260da-b619-407d-b796-69039de01c09'
  }),
  
  credentials: {
    username: 'foo',
    password: 'bar'
  }
  
}