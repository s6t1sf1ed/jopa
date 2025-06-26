const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Task = require('../models/task');

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

// 🔽 Получить все задачи проекта
router.get('/projects/:projectId/tasks', auth, async (req, res) => {
  const { projectId } = req.params;
  const tasks = await Task.find({ projectId, userId: req.userId });
  res.json(tasks);
});

// ➕ Добавить новую задачу
router.post('/projects/:projectId/tasks', auth, async (req, res) => {
  const { projectId } = req.params;
  const { title, description, deadline } = req.body;

  const task = await Task.create({
    projectId,
    userId: req.userId,
    title,
    description,
    deadline,
  });

  res.json(task);
});

// ✏️ Обновить задачу
router.put('/projects/:projectId/tasks/:taskId', auth, async (req, res) => {
  const { taskId } = req.params;
  const { title, description, deadline } = req.body;

  const updated = await Task.findOneAndUpdate(
    { _id: taskId, userId: req.userId },
    { title, description, deadline },
    { new: true }
  );

  res.json(updated);
});

// ❌ Удалить задачу
router.delete('/projects/:projectId/tasks/:taskId', auth, async (req, res) => {
  const { taskId } = req.params;
  await Task.deleteOne({ _id: taskId, userId: req.userId });
  res.json({ success: true });
});

module.exports = router;
