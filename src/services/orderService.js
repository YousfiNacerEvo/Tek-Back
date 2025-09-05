const { supabase } = require('../config/supabaseClient');
const { logError, logInfo } = require('../utils/logger');

const ORDERS_TABLE = 'commande';
const ORDER_ITEMS_TABLE = 'commande_produit';

function calculateTotalFromItems(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const unit = Number(item.prix_unitaire || item.unit_price || item.price || 0);
    const qty = Number(item.quantite || item.qty || 0);
    if (!Number.isFinite(unit) || !Number.isFinite(qty)) return sum;
    return sum + unit * qty;
  }, 0);
}

async function createOrder(input) {
  const {
    full_name,
    phone,
    state,
    city,
    items,
    total: providedTotal,
  } = input || {};

  if (!full_name || !phone || !state || !city) {
    const err = new Error('Missing required customer fields');
    err.status = 400;
    throw err;
  }
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error('Cart items are required');
    err.status = 400;
    throw err;
  }

  const computedTotal = calculateTotalFromItems(items);
  const total = Number.isFinite(Number(providedTotal)) ? Number(providedTotal) : computedTotal;

  const orderPayload = {
    full_name,
    phone,
    state,
    city,
    total,
  };

  const { data: order, error: orderError } = await supabase
    .from(ORDERS_TABLE)
    .insert(orderPayload)
    .select()
    .single();

  if (orderError) {
    logError('Failed to create order', { orderPayload, orderError });
    const err = new Error('Failed to create order');
    err.status = 500;
    throw err;
  }

  const orderId = order.id;
  if (!orderId) {
    const err = new Error('Order ID missing after insert');
    err.status = 500;
    throw err;
  }

  const orderItems = items.map((p) => ({
    commande_id: orderId,
    produit_id: p.produit_id ?? p.id,
    produit_nom: p.produit_nom ?? p.name ?? p.nom,
    prix_unitaire: p.prix_unitaire ?? p.rawPrice ?? p.unit_price ?? p.price ?? 0,
    quantite: p.quantite ?? p.qty ?? 1,
  }));

  const { data: itemsData, error: itemsError } = await supabase
    .from(ORDER_ITEMS_TABLE)
    .insert(orderItems)
    .select();

  if (itemsError) {
    logError('Failed to insert order items', { orderId, itemsError });
    const err = new Error('Failed to insert order items');
    err.status = 500;
    throw err;
  }

  logInfo('Order created', { orderId, itemsCount: orderItems.length, total });
  return { order, items: itemsData };
}

module.exports = {
  createOrder,
};


