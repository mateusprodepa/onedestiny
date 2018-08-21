const bcrypt = require('bcrypt')

const db = require('../db/db')

const QUERIES = require('../config/queries')
const TABLES = require('../config/tables')

function sortAnswer(type = "forgot") {
  const forgot = [
    "Acho que você esqueceu de alguma coisa !",
    "Não esqueça disto aqui.",
    "Está faltando alguma coisa bem aqui",
    "Você olhou direito aqui ?",
    "Tente preencher aqui dessa vez."
  ]

  const error = [
    "Tem certeza disto ?",
    "Ops, você inseriu algo errado aqui !",
    "Tente outra vez",
  ]

  switch(type) {
    case "forgot":
      return forgot[Math.floor(Math.random() * forgot.length)];
    case "error":
      return error[Math.floor(Math.random() * error.length)];
  }
}

module.exports = {

  validage_login_request: function(user, credentials) {
    let errors = {}

    if(!user) {
      errors = { ...errors, username: sortAnswer('error') }
    }

    if(credentials.username === "") {
      errors = { ...errors, username: sortAnswer('forgot') }
    }

    if(credentials.password.length === 0) {
      errors = { ...errors, password: sortAnswer('forgot') }
    }

    if(user && user.senha && !bcrypt.compareSync(credentials.password, user.senha)) {
      errors = { ...errors, password: sortAnswer('error') }
    }

    return errors
  },

  validate_register_request: function(credentials) {
    let errors = {}

    if(credentials.username.length < 5) {
      errors = { ...errors, username: "Seu nome deve conter pelo menos 5 caracteres" }
    }

    if(credentials.username === "" || null || credentials.length === 0) {
      errors = { ...errors, username: "Por favor, não deixe os campos em branco" }
    }

    if(credentials.username.length > 10) {
      errors = { ...errors, username: "Seu nome de usuário deve conter no máximo 10 caracteres" }
    }

    if(credentials.email == "" || null || credentials.length === 0) {
      errors = { ...errors, email: "Não deixe seu email em branco" }
    }

    if(credentials.password.length < 8) {
      errors = { ...errors, password: "Sua senha deve conter no mínimo 8 caracteres" }
    }

    if(credentials.password !== credentials.cnfPass) {
      errors = { ...errors, password: "As senhas devem combinar" }
    }

    if(credentials.password === "" || null || credentials.length === 0) {
      errors = { ...errors, password: "Não deixe sua senha em branco" }
    }

    return errors
  }
}
