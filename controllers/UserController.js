const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUserToken = require("../helpers/create-user-tolken");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const { imageUpload } = require('../helpers/image-upload')
const { underscoredIf } = require("sequelize/lib/utils");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    // validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório!" });
      return;
    }

    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatório!" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória!" });
      return;
    }

    if (!confirmpassword) {
      res
        .status(422)
        .json({ message: "A confirmação de senha é obrigatória!" });
      return;
    }

    if (password != confirmpassword) {
      res
        .status(422)
        .json({ message: "A senha e a confirmação precisam ser iguais!" });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ where: { email: email } });

    if (userExists) {
      res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
      return;
    }

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = {
      name,
      email,
      phone,
      password: passwordHash,
    };

    try {
      const newUser = await User.create(user);
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }

  /////////////

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório!" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória!" });
      return;
    }

    // check if user exists
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(422)
        .json({ message: "Não há usuário cadastrado com este e-mail!" });
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({ message: "Senha inválida" });
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;

    console.log(req.headers.authorization);

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "nossosecret");

      currentUser = await User.findByPk(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }
    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const token = getToken(req);

    const userNew = await getUserByToken(token);

    const { name, email, phone, password, confirmpassword } = req.body;

    // Obtenha o nome do novo arquivo de imagem, se houver
    let newImage = userNew.image; // Use the existing image if no new image is uploaded
    if (req.file) {
        newImage = req.file.filename; // Use req.file.filename to get the name of the uploaded file
    }

    // Validations
    if (!name) {
        res.status(422).json({ message: "O nome é obrigatório!" });
        return;
    }

    if (!email) {
        res.status(422).json({ message: "O e-mail é obrigatório!" });
        return;
    }

    // Check if user exists
    const userExists = await User.findOne({ where: { email: email } });
    if (userNew.email !== email && userExists) {
        res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
        return;
    }

    if (!phone) {
        res.status(422).json({ message: "O telefone é obrigatório!" });
        return;
    }

    // Check if password match
    let passwordHash = userNew.password;
    if (password && password !== confirmpassword) {
        res.status(422).json({ message: "As senhas não conferem." });
        return;
    } else if (password === confirmpassword && password != null) {
        // Creating password
        const salt = await bcrypt.genSalt(12);
        passwordHash = await bcrypt.hash(password, salt);
    }

    // Create an object with updated data
    const updateData = {
        name: name,
        email: email,
        phone: phone,
        image: newImage,
        password: passwordHash,
    };

    try {
        // Atualiza os dados do usuário
        await User.update(updateData, {
            where: { id: userNew.id },
        });

        const updatedUser = await User.findByPk(userNew.id, {
            attributes: { exclude: ["password"] },
        });

        res.json({
            message: "Usuário atualizado com sucesso!",
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

};
