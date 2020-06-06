//Quando utilziado TypeScrip é necessário ter também a definição de Tipos
//Através dela é trazido as informações de determinada biblioteca
//Algumas bibliotecas já possuem a definição de tipos e outras não
import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';


const app = express();
app.use(cors())
app.use(express.json()); //Isso permite que o express permita entender as requisições no formato JSON
app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

//ROTA: Endereço completo da requisição
//METÓDOS HTTP:
// -GET: Busca uma ou mais informações do back-end
// -POST: Cria uma nova informação no back-end
// -PUT: Atualiza uma informação existente no back-end
// -DELETE: Remover uma informação existente no back-end

//TIPOS DE PARÂMETROS:
// -REQUEST PARAMS: parãmetros que vem na própria rota que identificam um recurso
// -QUERY PARAMS: parâmetros que vem na rota geralmente para filtros, paginação, e outros
// -REQUEST BODY: parâmetros para atualização e crição de informações


app.listen(3333);
