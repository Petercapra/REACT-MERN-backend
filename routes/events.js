const {Router} = require('express')
const {getEventos, crearEvento, actualizarEvento, eliminarEvento} = require('../controllers/events');
const {validarJWT} = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');
const {isDate} = require('../helpers/isDate')
const router = Router();

//Obtener eventos
router.get('/', validarJWT , getEventos);

//Crear un nuevo evento
router.post('/',
     [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos,
        validarJWT
     ],
      crearEvento);

//Actualizar evento
router.put('/:id', 
   [ check('title', 'El titulo es obligatorio').not().isEmpty(),
      check('start', 'La fecha de inicio es obligatoria').custom(isDate),
      check('end', 'La fecha de finalizacion es obligatoria').custom(isDate),
   validarJWT,
    validarCampos
   ],
     actualizarEvento);

//Borrar evento
router.delete('/:id', validarJWT , eliminarEvento);


module.exports = router;