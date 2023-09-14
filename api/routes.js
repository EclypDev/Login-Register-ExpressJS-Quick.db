import { Router } from "express";
import Path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import db from 'quick.db'
import TokenGenerator from 'uuid-token-generator';
import { generateNumericId } from './utils.js'
import fs from 'fs'


function generateToken() {
    const tokgen = new TokenGenerator();
    let token = tokgen.generate()
    return token
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const route = Router();

//paths
const pathWeb = Path.join(__dirname, "../web");
const registerFilePath = Path.join(pathWeb, "register.html");
const loginFilePath = Path.join(pathWeb, "login.html");

//Database 
const database = db.get('database_users') || [];
console.log(database)
route.post('/api/session/login', (req, res) => {
    const userDataLogin = req.body;
    const { username, password } = userDataLogin;

    // Busca un usuario en la base de datos que coincida con el nombre de usuario y la contraseña
    const user = database.users.find(user => user.info.name === username && user.session.password === password);

    if (user) {
        // Si se encuentra un usuario, envía los datos de sesión como respuesta
        const { info, session } = user;
        res.send({
            status: "Sesión iniciada correctamente",
            token: session.tokenId,
            email: session.email,
            userId: info.id,
            username: info.name
        });
    } else {
        // Si no se encuentra un usuario, envía una respuesta de error
        res.status(401).json({ error: "Nombre de usuario o contraseña incorrectos" });
    }

})
route.post('/api/session/register', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // Obtén la lista de usuarios existentes de la base de datos usando quick.db
    let database = db.get('database_users') || { users: [] };

    let validateUser = (username, demail) => {
        return new Promise((resolve, reject) => {
            let foundUser = database.users.find((user) => {
                return user.info.name === username || user.session.email === demail;
            });

            if (foundUser) {
                let foundInfo = {};

                if (foundUser.info.name === username) {
                    foundInfo.type = "username";
                } else if (foundUser.session.email === demail) {
                    foundInfo.type = "email";
                }

                resolve({ userFound: true, foundInfo });
            } else {
                resolve({ userFound: false });
            }
        });
    };

    validateUser(username, email)
        .then(({ userFound, foundInfo }) => {
            if (userFound) {
                res.status(400).json({ error: `Usuario ya registrado (${foundInfo.type})` });
            } else {
                // Genera valores únicos para userId y token
                let data = {
                    message: "Registro exitoso.",
                    userId: generateNumericId(10), // Puedes reemplazar con tu lógica real
                    token: generateToken(), // Puedes reemplazar con tu lógica real
                    email: email,
                    username: username
                }

                let newUser = {
                    "info": {
                        "id": data.userId,
                        "name": data.username,
                        "imgUrl": "https://thumbs.dreamstime.com/b/vector-de-usuario-redes-sociales-perfil-avatar-predeterminado-retrato-vectorial-del-176194876.jpg",
                        "channels": []
                    },
                    "session": {
                        "tokenId": data.token,
                        "email": data.email,
                        "password": password
                    }
                };

                // Agrega el nuevo usuario a la lista de usuarios existentes en la base de datos
                database.users.push(newUser);

                // Guarda la lista actualizada de usuarios en la base de datos usando quick.db
                db.set('database_users', database);

                // Enviar datos personalizados en caso de registro exitoso
                res.status(200).json(data);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            res.status(400).json({ error: error });
        });

});

route.get("/register", (req, res) => {
    res.sendFile(registerFilePath);
});

route.get('/login', (req, res) => {
    res.sendFile(loginFilePath)
})
export default route;