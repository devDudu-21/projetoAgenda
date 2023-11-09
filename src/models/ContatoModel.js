const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
  }

  async buscaPorId(id) {
    if (typeof id !== 'string') return;
    const user = await ContatoModel.findById(id);
    return user;
  };

  async register() {
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.create(this.body);
  };

  valida() {
    this.cleanUp();

    // Validação
    // O e-mail precisa ser válido
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
    // O telefone precisa ser válido
    if (this.body.telefone && !validator.isMobilePhone(this.body.telefone, false)) this.errors.push('Este número de telefone é inválido');
    // O nome deve existir
    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
    // É necessário existir pelo menos um e-mail ou telefone
    if (!this.body.email && !this.body.telefone) {
      this.errors.push('É necessária pelo menos uma informação de contato: e-mail ou telefone.');
    }
  };

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone,
    };
  };

  async edit(id) {
    if (typeof id !== 'string') return;
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
  };
}



// Métodos estáticos
Contato.buscaPorId = async (id) => {
  if (typeof id !== 'string') return;

  const contato = await ContatoModel.findById(id);
  return contato;
};

Contato.buscaContatos = async () => {

  const contatos = await ContatoModel.find()
    .sort({ criadoEm: -1 });
  return contatos;
};

Contato.delete = async (id) => {
  if (typeof id !== 'string') return;
  const contato = await ContatoModel.findOneAndDelete({ _id: id })
  return contato;
};

module.exports = Contato;