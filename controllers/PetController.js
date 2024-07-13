const Pet = require("../models/Pet");

// helpers
const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");

module.exports = class PetController {
  static async create(req, res) {
    const name = req.body.name;
    const age = req.body.age;
    const description = req.body.description;
    const weight = req.body.weight;
    const color = req.body.color;
    const available = true;

    // validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    if (!age) {
      res.status(422).json({ message: "A idade é obrigatória!" });
      return;
    }

    if (!weight) {
      res.status(422).json({ message: "O peso é obrigatório!" });
      return;
    }

    if (!color) {
      res.status(422).json({ message: "A cor é obrigatória!" });
      return;
    }
    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pet = {
        name: name,
        age: age,
        description: description,
        weight: weight,
        color: color,
        available: available,
        images: [],
        userId : user.id
    }

    try {

        const newPet = await Pet.create(pet)

        res.status(201).json({
            message: 'Pet cadastrado com sucesso!',
            newPet: newPet,
          })
    } catch (error) {
        
    }
  }
};
