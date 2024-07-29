const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');
const {validarJWT} = require('../middlewares/validar-jwt');

const crearUsuario = async(req, res) => {

    const {email, password} = req.body;
    try {
        let usuario = await Usuario.findOne({email});
        

        if(usuario){
            res.status(400).json({
                ok: false,
                msg: 'El correo ya fue registrado'
            });

            return;
        }

        usuario = new Usuario(req.body)

        //Encriptar la contrasenia
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt );

        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.name)
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error'
        })
    }

}

const loginUsuario = async(req, res) => {
    const {email, password} = req.body;

    try {
        let usuario = await Usuario.findOne({email});
        

        if(!usuario){
            res.status(400).json({
                ok: false,
                msg: 'El usuario con ese email no existe'
            });
            return;
        }

        //Confirmar passwords. Devuelve true or false
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
            return;
        }
        
        const token = await generarJWT(usuario.id, usuario.name)
        
        //Si todo sale bien
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error',
            
        })
    }

}

const revalidarToken = async(req, res) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT(uid, name)

    res.json({
        ok: true,
       token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}