const express = require("express");
const router = new express.Router();
const { readItems, writeItems } = require("../dataStore");

// GET /items
router.get("/", async (req, res) => {
    const items = await readItems();
    return res.json(items);
  });

// POST /items
router.post("/", async (req, res) => {
  const items = await readItems();
  const newItem = { name: req.body.name, price: req.body.price };
  items.push(newItem);
  await writeItems(items);
  return res.status(201).json({ added: newItem });
});

// GET /items/:name
router.get("/:name", async (req, res) => {
    const items = await readItems();
    const item = items.find(i => i.name === req.params.name);
    if (!item) return res.status(404).json({ error: "Item not found" });
    return res.json(item);
});

// PATCH /items/:name
router.patch("/:name", async (req, res) => {
    const items = await readItems();
    const item = items.find(i => i.name === req.params.name);
    if (!item) return res.status(404).json({ error: "Item not found" });
  
    item.name = req.body.name || item.name;
    item.price = req.body.price || item.price;
  
    await writeItems(items);
    return res.json({ updated: item });
  });
  

// DELETE /items/:name
router.delete("/:name", async (req, res) => {
    let items = await readItems();
    const idx = items.findIndex(i => i.name === req.params.name);
    if (idx === -1) return res.status(404).json({ error: "Item not found" });
  
    items.splice(idx, 1);
    await writeItems(items);
    return res.json({ message: "Deleted" });
  });

module.exports = router;
