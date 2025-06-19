const express = require("express");
const ProjectField = require("../models/ProjectField");
const jwt = require("jsonwebtoken");
const SpecificationField = require("../models/SpecificationField");
const router = express.Router();

// 🔐 Middleware авторизации
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.sendStatus(403);
  }
}

//поля проекта

// 📄 Получить поля ТЕКУЩЕГО пользователя
router.get('/fields', auth, async (req, res) => {
  try {
    const fields = await ProjectField.find({ user: req.userId });
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении полей' });
  }
});

// ➕ Добавить поле
router.post("/fields", auth, async (req, res) => {
  const { name, key, type } = req.body;
  try {
    const newField = await ProjectField.create({
      name,
      key,
      type,
      user: req.userId,
    });
    res.status(201).json(newField);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Ошибка при создании поля" });
  }
});

// ❌ Удалить поле
router.delete("/fields/:id", auth, async (req, res) => {
  try {
    await ProjectField.deleteOne({ _id: req.params.id, user: req.userId });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при удалении поля" });
  }
});
 
//спецификации


router.get("/specification-fields", auth, async (req, res) => {
  try {
    const fields = await SpecificationField.find({ user: req.userId });
    res.json(fields);
  } catch (err) {
    res.status(500).json({ error: "Ошибка при получении полей спецификации" });
  }
});

router.post("/specification-fields", auth, async (req, res) => {
  const { name, key, type } = req.body;
  try {
    const newField = await SpecificationField.create({ name, key, type, user: req.userId });
    res.status(201).json(newField);
  } catch (err) {
    res.status(400).json({ error: "Ошибка при создании поля спецификации" });
  }
});

router.delete("/specification-fields/:id", auth, async (req, res) => {
  try {
    await SpecificationField.deleteOne({ _id: req.params.id, user: req.userId });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Ошибка при удалении поля спецификации" });
  }
});

module.exports = router;
