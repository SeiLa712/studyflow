// IMPORTAÇÃO DOS MÓDULOS NECESSÁRIO
const multer = require("multer")
const path = require("path")
const fs = require("fs")
// Configuração do diskStorage, lugar onde as imagens serão armazenadas
const storage = multer.diskStorage({
    // Definição da pasta de destino
    destination: (req, file, cb) => {
        // Pasta reserva para caso dê errado o local certo
        let pastaDestino = 'gerais'
        // Dependendo da rota que chamar, encaminha a imagem para a pasta correta
        if (req.originalUrl.includes('/usuarios')) {
            pastaDestino = 'usuarios'
        }
        else if (req.originalUrl.includes('/produtos')) {
            pastaDestino = 'produtos'
        }
        // Variável que guarda o caminho da pasta principal de uploads
        const uploadPath = path.join(__dirname, `../../client/public/uploads/${pastaDestino}`)

        // Se não existir a pasta, o node tenta criar com o módulo fs
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

    // Função de callback, null diz que não houve erro nenhum, e retorna o caminho para a imagem
        cb(null, uploadPath)
    },
    // função para alterar o nome do arquivo
    filename: (req, file, cb) => {
        // pega a data atual
        const timestamp = Date.now()
        // gera um número aleatório
        const numeroAleatorio = Math.round(Math.random() * 1E9)
        // pega a extensão do arquivo
        const extensaoDoArquivo = path.extname(file.originalname)
        
        // variavel com o nome final do arquivo, já com as alterações para evitar duplicatas
        const nomeFinalSeguro = `${timestamp}-${numeroAleatorio}${extensaoDoArquivo}`
        // Funcão de callback, null diz que não houve erro nenhum, e retorna o nome para a imagem
        cb(null, nomeFinalSeguro)
    }
})

const upload = multer({ storage:storage });
module.exports = upload;