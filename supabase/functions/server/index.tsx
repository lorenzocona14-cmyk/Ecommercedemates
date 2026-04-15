import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a8bad502/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint
app.post("/make-server-a8bad502/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup error processing request: ${error}`);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Get user cart
app.get("/make-server-a8bad502/cart", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const cart = await kv.get(`cart:${user.id}`);
    return c.json({ cart: cart || [] });
  } catch (error) {
    console.log(`Get cart error: ${error}`);
    return c.json({ error: 'Failed to get cart' }, 500);
  }
});

// Save user cart
app.post("/make-server-a8bad502/cart", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { cart } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    await kv.set(`cart:${user.id}`, cart);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Save cart error: ${error}`);
    return c.json({ error: 'Failed to save cart' }, 500);
  }
});

// Create order
app.post("/make-server-a8bad502/orders", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { cart, total } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get existing orders or initialize empty array
    const existingOrders = await kv.get(`orders:${user.id}`) || [];
    
    const order = {
      id: crypto.randomUUID(),
      userId: user.id,
      items: cart,
      total,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    // Add new order to the beginning of the array
    const updatedOrders = [order, ...existingOrders];
    await kv.set(`orders:${user.id}`, updatedOrders);

    // Clear cart after order
    await kv.set(`cart:${user.id}`, []);

    return c.json({ order });
  } catch (error) {
    console.log(`Create order error: ${error}`);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Get user orders
app.get("/make-server-a8bad502/orders", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const orders = await kv.get(`orders:${user.id}`);
    return c.json({ orders: orders || [] });
  } catch (error) {
    console.log(`Get orders error: ${error}`);
    return c.json({ error: 'Failed to get orders' }, 500);
  }
});

Deno.serve(app.fetch);