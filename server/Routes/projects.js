const express = require("express");
const Project = require("../models/Project");
const ProjectField = require("../models/ProjectField");
const jwt = require("jsonwebtoken");

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

// 📄 Получить все проекты текущего пользователя
router.get("/", auth, async (req, res) => {
  const projects = await Project.find({ user: req.userId });
  res.json(projects);
});

// ➕ Создать новый проект
router.post("/", auth, async (req, res) => {
  const { name, description, custom = {}, specifications = [] } = req.body;

  // Фильтрация custom по доступным ключам
  const fields = await ProjectField.find({ user: req.userId }).select("key");
  const allowedKeys = fields.map(f => f.key);
  const filteredCustom = Object.fromEntries(
    Object.entries(custom).filter(([key]) => allowedKeys.includes(key))
  );

  const project = await Project.create({
    user: req.userId,
    name,
    description,
    specifications,
    custom: filteredCustom
  });

  res.json(project);
});

// 🛠 Обновить проект
router.put("/:id", auth, async (req, res) => {
  const { name, description, specifications = [], custom = {} } = req.body;

  // Фильтрация custom
  const fields = await ProjectField.find({ user: req.userId }).select("key");
  const allowedKeys = fields.map(f => f.key);
  const filteredCustom = Object.fromEntries(
    Object.entries(custom).filter(([key]) => allowedKeys.includes(key))
  );

  try {
    await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name, description, specifications, custom: filteredCustom }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении проекта' });
  }
});

// 📄 Получить один проект
router.get("/:id", auth, async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.userId });
  if (!project) return res.sendStatus(404);
  res.json(project);
});

// ❌ Удалить проект
router.delete("/:id", auth, async (req, res) => {
  await Project.deleteOne({ _id: req.params.id, user: req.userId });
  res.sendStatus(204);
});

module.exports = router;

