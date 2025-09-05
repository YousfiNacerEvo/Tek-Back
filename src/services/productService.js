const { supabase } = require('../config/supabaseClient');
const { logError } = require('../utils/logger');

const TABLE = 'produits';

async function getAllProducts() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, categorie:categorie_id(nom), marque:marque_id(nom)')
    .order('id');
  if (error) {
    logError('Failed to fetch products', { error });
    const err = new Error('Failed to fetch products');
    err.status = 500;
    throw err;
  }
  const mapped = (data || []).map((p) => ({
    ...p,
    category_name: p.categorie?.nom ?? null,
    brand_name: p.marque?.nom ?? null,
  }));
  return mapped;
}

async function getProductById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, categorie:categorie_id(nom), marque:marque_id(nom)')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('0 rows')) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    logError('Failed to fetch product', { id, error });
    const err = new Error('Failed to fetch product');
    err.status = 500;
    throw err;
  }
  return {
    ...data,
    category_name: data.categorie?.nom ?? null,
    brand_name: data.marque?.nom ?? null,
  };
}

async function createProduct(productInput) {
  const { data, error } = await supabase.from(TABLE).insert(productInput).select().single();
  if (error) {
    logError('Failed to create product', { productInput, error });
    const err = new Error('Failed to create product');
    err.status = 500;
    throw err;
  }
  return data;
}

async function updateProduct(id, updateInput) {
  const { data, error } = await supabase.from(TABLE).update(updateInput).eq('id', id).select().single();
  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('0 rows')) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    logError('Failed to update product', { id, updateInput, error });
    const err = new Error('Failed to update product');
    err.status = 500;
    throw err;
  }
  return data;
}

async function deleteProduct(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) {
    logError('Failed to delete product', { id, error });
    const err = new Error('Failed to delete product');
    err.status = 500;
    throw err;
  }
  return { success: true };
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

