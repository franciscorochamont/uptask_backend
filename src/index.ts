import server from './server'
import colors from 'colors'

// Define el puerto
const port = process.env.PORT || 4000;

// Inicia el servidor
server.listen(port, () => {
    console.log(colors.bold.blue(`Server is running on port ${port}`));
})

