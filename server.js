const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Database file
const ordersFile = 'orders.json';

// Initialize orders file
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify([]));
}

// Get all orders
app.get('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  res.json(orders);
});

// Create new order
app.post('/api/orders', (req, res) => {
  const { serviceName, amount, transactionId, customerName, customerEmail, customerPhone } = req.body;
  
  const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  
  const newOrder = {
    id: Date.now(),
    serviceName,
    amount,
    transactionId,
    customerName,
    customerEmail,
    customerPhone,
    status: 'pending',
    createdAt: new Date().toISOString(),
    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
  
  orders.push(newOrder);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  
  // Send WhatsApp notification
  const whatsappMessage = ;
  
  console.log('Order created:', newOrder);
  
  res.json({
    success: true,
    order: newOrder,
    message: 'Order created successfully! You will receive delivery within 12-24 hours.'
  });
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
  const { status } = req.body;
  const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  
  const order = orders.find(o => o.id == req.params.id);
  if (order) {
    order.status = status;
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    res.json({ success: true, order });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Get order by transaction ID
app.get('/api/orders/transaction/:transactionId', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  const order = orders.find(o => o.transactionId === req.params.transactionId);
  
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log();
});
