const Evento = require('../models/Eventos')

const getEventos = async(req, res) => {
    
    const eventos = await Evento.find().populate('user', 'name');

       res.json({
         ok:true,
         eventos
     });  
}

const crearEvento = async(req, res) => {

    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        res.json({
            ok:true,
            evento: eventoGuardado            
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Erroooooooor'
        })
        
    }

}

const actualizarEvento = async(req, res) => {

    const eventoId = req.params.id;
    console.log(eventoId);

    try {
        const evento = await Evento.findById(eventoId);
        if(!evento){
            res.status(404).json({
                ok: false,
                msg: 'El evento con ese id no existe'
            });
        }

        if (evento.user.toString() !== req.uid){
            res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(evento.id, nuevoEvento);

        res.json({
            ok: true,
            evebto: eventoActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Super errorr mal ahi'
        })
        
    }
     
}

const eliminarEvento = async(req, res) => {
    
    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById(eventoId);
        if(!evento){
            res.status(404).json({
                ok: false,
                msg: 'El evento con ese id no existe'
            });
        }

        if (evento.user.toString() !== req.uid){
            res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio de eliminar este evento'
            });
        }

        const eventoEliminado= await Evento.findByIdAndDelete (evento.id);

        res.json({
            ok: true,
            eventoEliminado: eventoEliminado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Super errorr mal ahi'
        })
        
    }
     
};


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
}