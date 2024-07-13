const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'postgres',
});

try {
    sequelize.authenticate()
    console.log('Conexão feita com sucesso!')
} catch (error) {
    console.log('Não foi possivel conectar')
}

module.exports = sequelize