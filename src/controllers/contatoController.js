const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
    res.render('contato', {
        contato: {}
    });
};

exports.register = async (req, res) => {
    try {
        const contato = new Contato(req.body);
        await contato.register();
        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('/contato'));
            return;
        }
        req.flash('success', 'Contato registrado com sucesso.');
        req.session.save(() => res.redirect(`/contato/${contato.contato._id}`));
        return;
    } catch (e) {
        console.log(e);
        return req.flash('errors', 'Não foi possível registrar o contato.')
    }
};

exports.editIndex = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404');
        const contato = await Contato.buscaPorId(req.params.id);
        if (!contato) return res.render('404');
        res.render('contato', { contato });
    } catch (error) {
        console.log(error)
        return res.render('404')
    }
};

exports.edit = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404');
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);
        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect(`/contato/${req.params.id}`)); // Usar req.params.id
            return;
        }
        req.flash('success', 'Contato editado com sucesso.');
    } catch (error) {
        console.log(error);
        return req.flash('errors', 'Não foi possível editar o contato');
    }
    req.session.save(() => res.redirect(`/contato/${req.params.id}`)); // Usar req.params.id
};

exports.delete = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404');
        const contato = await Contato.delete(req.params.id);
        if (!contato) return res.render('404');
        req.flash('success', 'Contato excluído com sucesso.')
        req.session.save(() => res.redirect(`back`));
        return;
    } catch (error) {
        console.log(error)
        return req.flash('errors', 'Não foi possível excluir o contato.')
    }
}