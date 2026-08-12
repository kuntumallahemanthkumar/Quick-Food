
/* Quick Food - GitHub Pages Edition
   Static frontend using localStorage instead of PHP/MySQL.
   This is suitable for GitHub Pages. It is a demo/client-side app, not a secure production backend.
*/
const KEY = {
  users: "qf_users_v2", foods: "qf_foods_v2", cats: "qf_cats_v2",
  cart: "qf_cart_v2", orders: "qf_orders_v2", session: "qf_session_v2"
};

const defaultCategories = [
  {id:1,name:"Pizza",image:"pizza.jpg"},
  {id:2,name:"Burgers",image:"burger.jpg"},
  {id:3,name:"Biryani",image:"biryani.jpg"},
  {id:4,name:"Noodles",image:"hakkanoodles.jpg"},
  {id:5,name:"Cakes",image:"cake.jpg"},
  {id:6,name:"Beverages",image:"coldcoffee.jpg"}
];
const defaultFoods = [
  {id:1,category_id:1,name:"Veg Pizza",description:"Fresh vegetable pizza with cheese.",price:249,image:"vegpizza.jpg",rating:4.5,status:"Available"},
  {id:2,category_id:1,name:"Chicken Pizza",description:"Loaded chicken pizza with mozzarella.",price:299,image:"pizza.jpg",rating:4.6,status:"Available"},
  {id:3,category_id:2,name:"Chicken Burger",description:"Crispy chicken burger with fresh vegetables.",price:179,image:"chickenburger.jpg",rating:4.5,status:"Available"},
  {id:4,category_id:2,name:"Veg Burger",description:"Classic vegetable burger with cheese.",price:149,image:"vegburger.jpg",rating:4.3,status:"Available"},
  {id:5,category_id:3,name:"Chicken Biryani",description:"Aromatic basmati rice with spicy chicken.",price:249,image:"cbiryani.jpg",rating:4.7,status:"Available"},
  {id:6,category_id:3,name:"Veg Biryani",description:"Fragrant rice cooked with mixed vegetables.",price:199,image:"biryani.jpg",rating:4.4,status:"Available"},
  {id:7,category_id:4,name:"Hakka Noodles",description:"Stir-fried noodles with vegetables.",price:159,image:"hakkanoodles.jpg",rating:4.4,status:"Available"},
  {id:8,category_id:4,name:"Veg Noodles",description:"Classic vegetable noodles.",price:139,image:"noodles.jpg",rating:4.2,status:"Available"},
  {id:9,category_id:5,name:"Chocolate Cake",description:"Soft chocolate cake with creamy topping.",price:129,image:"chocolatecake.jpg",rating:4.6,status:"Available"},
  {id:10,category_id:6,name:"Cold Coffee",description:"Chilled creamy cold coffee.",price:99,image:"coldcoffee.jpg",rating:4.5,status:"Available"}
];

function get(key, fallback=[]) {
  try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
}
function set(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function initData(){
  if(!localStorage.getItem(KEY.cats)) set(KEY.cats, defaultCategories);
  if(!localStorage.getItem(KEY.foods)) set(KEY.foods, defaultFoods);
  if(!localStorage.getItem(KEY.users)) set(KEY.users, [{
    id:1,name:"Demo User",username:"demo",email:"demo@quickfood.local",phone:"9876543210",password:"demo123"
  }]);
  if(!localStorage.getItem(KEY.orders)) set(KEY.orders, []);
  if(!localStorage.getItem(KEY.cart)) set(KEY.cart, []);
}
function currentUser(){ return get(KEY.session, null); }
function money(n){ return "₹" + Number(n).toFixed(2); }
function esc(v){ return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])); }
function img(name){ return "assets/images/"+encodeURIComponent(name).replace(/%2F/g,"/"); }
function page(name){ location.href=name; }
function toast(msg,type="success"){
  const el=document.createElement("div"); el.className=`qf-toast ${type}`; el.textContent=msg;
  document.body.appendChild(el); setTimeout(()=>el.classList.add("show"),10); setTimeout(()=>{el.classList.remove("show");setTimeout(()=>el.remove(),250)},2500);
}
function cartItems(){
  const cart=get(KEY.cart,[]), foods=get(KEY.foods,[]);
  return cart.map(c=>({...c,food:foods.find(f=>f.id===c.foodId)})).filter(x=>x.food && x.food.status==="Available");
}
function cartCount(){ return get(KEY.cart,[]).reduce((s,x)=>s+x.qty,0); }
function addCart(id){
  const cart=get(KEY.cart,[]); const item=cart.find(x=>x.foodId===id);
  if(item) item.qty++; else cart.push({foodId:id,qty:1});
  set(KEY.cart,cart); updateNav(); toast("Added to cart");
}
function changeCart(id,delta){
  let cart=get(KEY.cart,[]); const i=cart.findIndex(x=>x.foodId===id);
  if(i<0)return; cart[i].qty+=delta; if(cart[i].qty<=0)cart.splice(i,1); set(KEY.cart,cart); render();
}
function removeCart(id){ set(KEY.cart,get(KEY.cart,[]).filter(x=>x.foodId!==id)); render(); }
function requireLogin(action){
  if(!currentUser()){ toast("Please login to continue","warning"); setTimeout(()=>page("login.html"),500); return false; }
  return true;
}

function navbar(){
  const u=currentUser();
  return `<nav class="navbar navbar-expand-lg navbar-dark shadow-sm"><div class="container">
    <a class="navbar-brand" href="index.html"><span class="me-1">🍔</span> Quick Food</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="navbar"><ul class="navbar-nav ms-auto align-items-lg-center">
      <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="category.html">Categories</a></li>
      <li class="nav-item"><a class="nav-link" href="food.html">Menu</a></li>
      <li class="nav-item"><a class="nav-link" href="cart.html"><i class="bi bi-bag-fill me-1"></i> Cart <span class="badge rounded-pill bg-light text-dark cart-count">${cartCount()}</span></a></li>
      ${u?`<li class="nav-item"><a class="nav-link" href="profile.html"><i class="bi bi-person-circle me-1"></i> Profile</a></li>
      <li class="nav-item"><a class="nav-link" href="#" onclick="logout();return false">Logout</a></li>`
      :`<li class="nav-item"><a class="nav-link" href="login.html">Login</a></li><li class="nav-item"><a class="nav-link" href="register.html">Register</a></li>`}
    </ul></div></div></nav>`;
}
function footer(){
 return `<footer><div class="container"><div class="row g-4 align-items-center"><div class="col-lg-7 text-center text-lg-start"><h4 class="mb-2">Quick Food</h4><p class="mb-0">Restaurant-quality favourites, delivered fresh and fast.</p></div><div class="col-lg-5 text-center text-lg-end"><div><a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a><a href="#" class="ms-2"><i class="bi bi-instagram"></i></a><a href="#" class="ms-2"><i class="bi bi-twitter-x"></i></a></div></div></div><hr><div class="d-flex flex-column flex-md-row justify-content-between gap-2 text-center text-md-start"><small>© ${new Date().getFullYear()} Quick Food. All Rights Reserved.</small><small>Fresh food. Simple ordering. Better moments.</small></div></div></footer>`;
}
function layout(content){ document.getElementById("app").innerHTML=navbar()+content+footer(); updateNav(); }

function foodCard(f){
 return `<div class="col-md-4 mb-4"><div class="card food-card shadow h-100"><img src="${img(f.image)}" height="250" class="card-img-top" style="object-fit:cover" alt="${esc(f.name)}" onerror="this.src='assets/images/banner.jpg'"><div class="card-body d-flex flex-column"><h4>${esc(f.name)}</h4><h5 class="text-danger">${money(f.price)}</h5><p class="flex-grow-1">${esc(f.description)}</p><p>⭐ ${esc(f.rating)}/5</p><p>Category: <b>${esc(get(KEY.cats,[]).find(c=>c.id===f.category_id)?.name||"")}</b></p><button onclick="addCart(${f.id})" class="btn btn-primary w-100 mt-auto"><i class="bi bi-cart-plus"></i> Add to Cart</button></div></div></div>`;
}
function categoryCard(c){
 const count=get(KEY.foods,[]).filter(f=>f.category_id===c.id&&f.status==="Available").length;
 return `<div class="col-12 col-sm-6 col-lg-4"><a href="food.html?category_id=${c.id}" class="text-decoration-none text-dark"><div class="card food-card h-100 shadow-sm"><img src="${img(c.image)}" class="card-img-top" style="height:220px;object-fit:cover" alt="${esc(c.name)}" onerror="this.src='assets/images/banner.jpg'"><div class="card-body text-center"><h4>${esc(c.name)}</h4><p class="text-muted mb-3">${count} available item${count===1?"":"s"}</p><span class="btn btn-primary">View Foods</span></div></div></a></div>`;
}

function home(){
 const cats=get(KEY.cats,defaultCategories).slice().sort((a,b)=>a.name.localeCompare(b.name)).slice(0,6);
 const foods=get(KEY.foods,defaultFoods).filter(f=>f.status==="Available").slice().sort((a,b)=>b.id-a.id).slice(0,6);
 layout(`<section class="hero"><video class="hero-video" autoplay muted loop playsinline preload="auto" aria-hidden="true"><source src="assets/images/hero.mp4" type="video/mp4"></video><div class="hero-video-overlay"></div><div class="container text-center"><h1>Welcome to Quick Food</h1><p>Fresh, Fast & Delicious Food Delivered to Your Doorstep</p><div class="d-flex flex-wrap justify-content-center gap-2 mt-3 mb-4"><span class="badge rounded-pill bg-light text-dark px-3 py-2"><i class="bi bi-lightning-charge-fill text-warning me-1"></i> Fast delivery</span><span class="badge rounded-pill bg-light text-dark px-3 py-2"><i class="bi bi-star-fill text-warning me-1"></i> Customer favourites</span><span class="badge rounded-pill bg-light text-dark px-3 py-2"><i class="bi bi-shield-check text-success me-1"></i> Secure ordering</span></div><form onsubmit="event.preventDefault();location.href='food.html?search='+encodeURIComponent(this.search.value)"><div class="row justify-content-center"><div class="col-md-6"><input type="text" name="search" class="form-control form-control-lg" placeholder="Search your favorite food..."></div><div class="col-md-2 mt-2 mt-md-0"><button class="btn btn-primary btn-lg w-100">Search</button></div></div></form></div></section>
 <section class="container py-5"><div class="text-center mb-5"><div class="text-uppercase small fw-bold text-danger mb-2" style="letter-spacing:.14em;">Explore the menu</div><h2>Find your favourite</h2><p class="text-muted mb-0">Curated categories for every craving.</p></div><div class="row g-4">${cats.map(categoryCard).join("")}</div><div class="text-center mt-3"><a href="category.html" class="btn btn-primary">View All Categories</a></div></section>
 <section class="container py-5"><div class="text-center mb-5"><div class="text-uppercase small fw-bold text-danger mb-2" style="letter-spacing:.14em;">Customer favourites</div><h2>Popular right now</h2><p class="text-muted mb-0">Handpicked dishes made for a delicious experience.</p></div><div class="row g-4">${foods.map(foodCard).join("")}</div><div class="text-center mt-4"><a href="food.html" class="btn btn-outline-dark">View Full Menu</a></div></section>
 <section class="bg-warning py-5"><div class="container text-center"><div class="text-uppercase small fw-bold mb-2" style="letter-spacing:.14em;">Limited-time offer</div><h2>Today's Special</h2><h3 class="mt-3">Buy 2 Pizzas & Get 1 Coke Free</h3><a href="food.html?category_id=1" class="btn btn-dark mt-3">Order Now</a></div></section>
 <section class="container py-5"><div class="text-center mb-5"><div class="text-uppercase small fw-bold text-danger mb-2" style="letter-spacing:.14em;">Loved by foodies</div><h2>What our customers say</h2></div><div class="row g-4"><div class="col-md-4"><div class="card p-4">⭐⭐⭐⭐⭐<p class="mt-3">Amazing food and very fast delivery.</p><h5>- Rahul</h5></div></div><div class="col-md-4"><div class="card p-4">⭐⭐⭐⭐⭐<p class="mt-3">Delicious burgers. Highly recommended.</p><h5>- Priya</h5></div></div><div class="col-md-4"><div class="card p-4">⭐⭐⭐⭐⭐<p class="mt-3">Excellent service and affordable prices.</p><h5>- Arjun</h5></div></div></div></section>`);
}
function categories(){
 const cats=get(KEY.cats,defaultCategories);
 layout(`<div class="container py-5"><h2 class="text-center mb-2">Food Categories</h2><p class="text-center text-muted mb-5">Choose a category to explore delicious food.</p><div class="row g-4">${cats.map(categoryCard).join("")}</div></div>`);
}
function foods(){
 const params=new URLSearchParams(location.search), q=(params.get("search")||"").trim().toLowerCase(), cid=Number(params.get("category_id")||0);
 const cats=get(KEY.cats,defaultCategories), cname=cats.find(c=>c.id===cid)?.name||"";
 let fs=get(KEY.foods,defaultFoods).filter(f=>f.status==="Available");
 if(q)fs=fs.filter(f=>(f.name+" "+f.description).toLowerCase().includes(q));
 if(cid)fs=fs.filter(f=>f.category_id===cid);
 layout(`<div class="container mt-5 mb-5"><h2 class="text-center mb-2">${esc(cname||"Our Food Menu")}</h2><p class="text-center text-muted mb-4">${cname?"Available food in this category":"Browse all available food"}</p><form onsubmit="event.preventDefault();location.href='food.html?${cid?'category_id='+cid+'&':''}search='+encodeURIComponent(this.search.value)" class="mb-5"><div class="row justify-content-center g-2"><div class="col-md-6"><input type="text" class="form-control" placeholder="Search Food..." name="search" value="${esc(q)}"></div><div class="col-md-2"><button class="btn btn-primary w-100">Search</button></div>${q||cid?`<div class="col-md-2"><a href="food.html" class="btn btn-outline-secondary w-100">Clear</a></div>`:""}</div></form><div class="row">${fs.length?fs.map(foodCard).join(""):`<div class="col-12"><div class="alert alert-info text-center">No matching food found.</div></div>`}</div></div>`);
}
function login(){
 layout(`<div class="container mt-5 mb-5"><div class="row justify-content-center"><div class="col-md-5"><div class="card shadow"><div class="card-header bg-warning"><h3 class="text-center mb-0 text-white">User Login</h3></div><div class="card-body"><div id="loginMsg"></div><form id="loginForm"><div class="mb-3"><label class="form-label">Username or Email</label><input id="username" class="form-control" required autofocus></div><div class="mb-3"><label class="form-label">Password</label><input id="password" type="password" class="form-control" required></div><button class="btn btn-primary w-100">Login</button></form><p class="text-center mt-3 mb-0">No account? <a href="register.html">Register here</a></p><div class="alert alert-info mt-3 mb-0"><b>Demo login:</b> demo / demo123</div></div></div></div></div></div>`);
 document.getElementById("loginForm").onsubmit=e=>{e.preventDefault();const usernameEl=document.getElementById("username"), passwordEl=document.getElementById("password");
 const u=get(KEY.users,[]).find(x=>(x.username.toLowerCase()===usernameEl.value.trim().toLowerCase()||x.email.toLowerCase()===usernameEl.value.trim().toLowerCase())&&x.password===passwordEl.value);if(!u){loginMsg.innerHTML='<div class="alert alert-danger">Invalid username/email or password.</div>';return}set(KEY.session,u);location.href="index.html";};
}
function register(){
 layout(`<div class="container mt-5 mb-5"><div class="row justify-content-center"><div class="col-md-6"><div class="card shadow"><div class="card-header bg-warning"><h3 class="text-center mb-0 text-white">User Registration</h3></div><div class="card-body"><div id="regMsg"></div><form id="regForm"><div class="mb-3"><label class="form-label">Full Name</label><input id="name" class="form-control" required></div><div class="mb-3"><label class="form-label">Username</label><input id="username" class="form-control" required></div><div class="mb-3"><label class="form-label">Email</label><input id="email" type="email" class="form-control" required></div><div class="mb-3"><label class="form-label">Phone Number</label><input id="phone" class="form-control" required></div><div class="mb-3"><label class="form-label">Password</label><input id="password" type="password" minlength="6" class="form-control" required></div><div class="mb-3"><label class="form-label">Confirm Password</label><input id="confirm" type="password" minlength="6" class="form-control" required></div><button class="btn btn-primary w-100">Create Account</button></form><p class="text-center mt-3 mb-0">Already registered? <a href="login.html">Login</a></p></div></div></div></div></div>`);
 document.getElementById("regForm").onsubmit=e=>{e.preventDefault();const users=get(KEY.users,[]);const nameEl=document.getElementById("name"), usernameEl=document.getElementById("username"), emailEl=document.getElementById("email"), phoneEl=document.getElementById("phone"), passwordEl=document.getElementById("password"), confirmEl=document.getElementById("confirm"); if(passwordEl.value!==confirmEl.value){regMsg.innerHTML='<div class="alert alert-danger">Passwords do not match.</div>';return}if(users.some(x=>x.username.toLowerCase()===usernameEl.value.trim().toLowerCase()||x.email.toLowerCase()===emailEl.value.trim().toLowerCase())){regMsg.innerHTML='<div class="alert alert-warning">Username or email already exists.</div>';return}const u={id:Date.now(),name:nameEl.value.trim(),username:usernameEl.value.trim(),email:emailEl.value.trim(),phone:phoneEl.value.trim(),password:passwordEl.value};users.push(u);set(KEY.users,users);set(KEY.session,u);location.href="index.html";};
}
function cart(){
 const items=cartItems(); const total=items.reduce((s,x)=>s+x.food.price*x.qty,0);
 layout(`<div class="container mt-5 mb-5"><h2 class="text-center mb-4">🛒 My Shopping Cart</h2>${!items.length?'<div class="alert alert-warning text-center">Your cart is empty. <a href="food.html">Browse the menu</a>.</div>':`<div class="table-responsive"><table class="table table-bordered table-hover"><thead><tr><th>Image</th><th>Food</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th>Action</th></tr></thead><tbody>${items.map(x=>`<tr><td width="120"><img src="${img(x.food.image)}" width="100"></td><td>${esc(x.food.name)}</td><td>${money(x.food.price)}</td><td><button class="btn btn-sm btn-danger" onclick="changeCart(${x.food.id},-1)">−</button><strong class="mx-2">${x.qty}</strong><button class="btn btn-sm btn-success" onclick="changeCart(${x.food.id},1)">+</button></td><td>${money(x.food.price*x.qty)}</td><td><button class="btn btn-danger btn-sm" onclick="removeCart(${x.food.id})">Remove</button></td></tr>`).join("")}<tr><td colspan="4" class="text-end"><strong>Total</strong></td><td><strong>${money(total)}</strong></td><td></td></tr></tbody></table></div><div class="text-end"><a href="checkout.html" class="btn btn-lg btn-primary">Proceed to Checkout</a></div>`}</div>`);
}
function checkout(){
 if(!currentUser()){ layout(`<div class="container py-5"><div class="alert alert-warning text-center">Please <a href="login.html">login</a> before checkout.</div></div>`);return; }
 const items=cartItems(), total=items.reduce((s,x)=>s+x.food.price*x.qty,0), u=currentUser();
 layout(`<div class="container mt-5 mb-5"><h2 class="text-center mb-4">Checkout</h2>${!items.length?'<div class="alert alert-info text-center">Your cart is empty. <a href="food.html">Browse the menu</a>.</div>':`<div class="row g-4"><div class="col-md-7"><div class="card shadow"><div class="card-body"><div id="checkMsg"></div><form id="checkoutForm"><div class="mb-3"><label class="form-label">Customer Name</label><input id="customer_name" class="form-control" value="${esc(u.name)}" required></div><div class="mb-3"><label class="form-label">Phone</label><input id="phone" class="form-control" value="${esc(u.phone)}" required></div><div class="mb-3"><label class="form-label">Delivery Address</label><textarea id="address" class="form-control" rows="4" required></textarea></div><div class="mb-3"><label class="form-label">Payment Method</label><select id="payment" class="form-select"><option>Cash on Delivery</option><option>UPI</option><option>Card</option></select></div><button class="btn btn-primary w-100">Place Order</button></form></div></div></div><div class="col-md-5"><div class="card shadow"><div class="card-body"><h4>Order Summary</h4>${items.map(x=>`<div class="d-flex justify-content-between py-2"><span>${esc(x.food.name)} × ${x.qty}</span><b>${money(x.food.price*x.qty)}</b></div>`).join("")}<hr><div class="d-flex justify-content-between"><strong>Total</strong><strong>${money(total)}</strong></div></div></div></div></div>`}</div>`);
 const form=document.getElementById("checkoutForm"); if(form)form.onsubmit=e=>{e.preventDefault();const customerNameEl=document.getElementById("customer_name"), phoneEl=document.getElementById("phone"), addressEl=document.getElementById("address"), paymentEl=document.getElementById("payment");
 const order={id:Date.now(),userId:u.id,customer_name:customerNameEl.value,phone:phoneEl.value,address:addressEl.value,payment:paymentEl.value,total,status:"Pending",date:new Date().toLocaleString(),items:items.map(x=>({foodId:x.food.id,name:x.food.name,price:x.food.price,qty:x.qty}))};const orders=get(KEY.orders,[]);orders.push(order);set(KEY.orders,orders);set(KEY.cart,[]);location.href="success.html?order_id="+order.id;};
}
function success(){
 const id=Number(new URLSearchParams(location.search).get("order_id"));const o=get(KEY.orders,[]).find(x=>x.id===id);
 layout(`<div class="container mt-5 mb-5">${!o?'<div class="alert alert-danger text-center">Order not found. <a href="index.html">Return home</a>.</div>':`<div class="card shadow"><div class="card-body"><div class="text-center"><h1 class="text-success">✅ Order Placed Successfully!</h1><p>Thank you for ordering from <strong>Quick Food</strong></p></div><hr><div class="row"><div class="col-md-6"><h5>Order Information</h5><p><b>Order ID:</b> #${o.id}</p><p><b>Status:</b> <span class="badge bg-warning">${esc(o.status)}</span></p><p><b>Payment:</b> ${esc(o.payment)}</p><p><b>Order Date:</b> ${esc(o.date)}</p><p><b>Estimated Delivery:</b> 30 - 45 Minutes</p></div><div class="col-md-6"><h5>Delivery Address</h5><p>${esc(o.address).replace(/\n/g,"<br>")}</p></div></div><hr><h4>Ordered Items</h4><div class="table-responsive"><table class="table table-bordered"><thead><tr><th>Food</th><th>Quantity</th><th>Price</th><th>Total</th></tr></thead><tbody>${o.items.map(i=>`<tr><td>${esc(i.name)}</td><td>${i.qty}</td><td>${money(i.price)}</td><td>${money(i.price*i.qty)}</td></tr>`).join("")}<tr><td colspan="3" class="text-end"><b>Grand Total</b></td><td><b>${money(o.total)}</b></td></tr></tbody></table></div><div class="text-center mt-4"><a href="food.html" class="btn btn-success">Order More Food</a><a href="index.html" class="btn btn-primary">Home</a><button onclick="window.print()" class="btn btn-dark">Print Invoice</button></div></div></div>`}</div>`);
}
function profile(){
 const u=currentUser(); if(!u){location.href="login.html";return}
 layout(`<div class="container mt-5 mb-5"><div class="row justify-content-center"><div class="col-md-8"><div class="card shadow"><div class="card-header bg-warning"><h3 class="text-center text-white">My Profile</h3></div><div class="card-body"><div id="profileMsg"></div><form id="profileForm"><div class="mb-3"><label>Full Name</label><input id="name" class="form-control" value="${esc(u.name)}" required></div><div class="mb-3"><label>Username</label><input class="form-control" value="${esc(u.username)}" readonly></div><div class="mb-3"><label>Email</label><input id="email" type="email" class="form-control" value="${esc(u.email)}" required></div><div class="mb-3"><label>Phone Number</label><input id="phone" class="form-control" value="${esc(u.phone)}" required></div><button class="btn btn-primary">Update Profile</button></form></div></div></div></div></div>`);
 document.getElementById("profileForm").onsubmit=e=>{e.preventDefault();const users=get(KEY.users,[]), idx=users.findIndex(x=>x.id===u.id); if(users.some(x=>x.id!==u.id&&x.email.toLowerCase()===document.getElementById("email").value.trim().toLowerCase())){profileMsg.innerHTML='<div class="alert alert-danger">Email already exists.</div>';return}users[idx]={...users[idx],name:document.getElementById("name").value.trim(),email:document.getElementById("email").value.trim(),phone:document.getElementById("phone").value.trim()};set(KEY.users,users);set(KEY.session,users[idx]);profileMsg.innerHTML='<div class="alert alert-success">Profile updated successfully.</div>';updateNav();};
}
function logout(){localStorage.removeItem(KEY.session);location.href="index.html";}
function updateNav(){document.querySelectorAll(".cart-count").forEach(x=>x.textContent=cartCount());}

function adminLogin(){
 document.getElementById("app").innerHTML=`<div class="container py-5"><div class="row justify-content-center"><div class="col-md-5"><div class="card shadow"><div class="card-header bg-dark text-white"><h3 class="text-center mb-0">Quick Food Admin</h3></div><div class="card-body"><div id="adminMsg"></div><form id="adminForm"><div class="mb-3"><label class="form-label">Username</label><input id="username" class="form-control" required></div><div class="mb-3"><label class="form-label">Password</label><input id="password" type="password" class="form-control" required></div><button class="btn btn-dark w-100">Admin Login</button></form><div class="alert alert-info mt-3 mb-0"><b>Demo:</b> admin / admin123</div><a href="index.html" class="btn btn-link w-100 mt-2">Back to website</a></div></div></div></div></div>`;
 document.getElementById("adminForm").onsubmit=e=>{e.preventDefault();if(document.getElementById("username").value==="admin"&&document.getElementById("password").value==="admin123"){set("qf_admin_session",true);location.href="admin.html"}else adminMsg.innerHTML='<div class="alert alert-danger">Invalid admin credentials.</div>';};
}
function admin(){
 if(!get("qf_admin_session",false)){location.href="admin-login.html";return}
 const cats=get(KEY.cats,defaultCategories), foods=get(KEY.foods,defaultFoods), users=get(KEY.users,[]), orders=get(KEY.orders,[]);
 document.getElementById("app").innerHTML=`<nav class="navbar navbar-dark bg-dark"><div class="container"><a class="navbar-brand" href="index.html">🍔 Quick Food Admin</a><button class="btn btn-outline-light" onclick="adminLogout()">Logout</button></div></nav><div class="container py-5"><div class="d-flex flex-wrap justify-content-between align-items-center mb-4"><div><h1>Dashboard</h1><p class="text-muted">Client-side demo administration for GitHub Pages.</p></div><a href="index.html" class="btn btn-primary">View Website</a></div><div class="row g-4 mb-5"><div class="col-md-3"><div class="card p-4"><h6>Categories</h6><h2>${cats.length}</h2></div></div><div class="col-md-3"><div class="card p-4"><h6>Foods</h6><h2>${foods.length}</h2></div></div><div class="col-md-3"><div class="card p-4"><h6>Users</h6><h2>${users.length}</h2></div></div><div class="col-md-3"><div class="card p-4"><h6>Orders</h6><h2>${orders.length}</h2></div></div></div>
 <div class="card shadow mb-4"><div class="card-body"><div class="d-flex justify-content-between align-items-center"><h4>Foods</h4><button class="btn btn-primary" onclick="adminAddFood()">Add Food</button></div><div class="table-responsive mt-3"><table class="table"><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Action</th></tr></thead><tbody>${foods.map(f=>`<tr><td>${esc(f.name)}</td><td>${esc(cats.find(c=>c.id===f.category_id)?.name||"")}</td><td>${money(f.price)}</td><td>${esc(f.status)}</td><td><button class="btn btn-sm btn-danger" onclick="adminDeleteFood(${f.id})">Delete</button></td></tr>`).join("")}</tbody></table></div></div></div>
 <div class="card shadow"><div class="card-body"><h4>Orders</h4><div class="table-responsive"><table class="table"><thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>${orders.length?orders.slice().reverse().map(o=>`<tr><td>#${o.id}</td><td>${esc(o.customer_name)}</td><td>${money(o.total)}</td><td><span class="badge bg-warning">${esc(o.status)}</span></td></tr>`).join(""):'<tr><td colspan="4">No orders yet.</td></tr>'}</tbody></table></div></div></div></div>`;
}
function adminLogout(){localStorage.removeItem("qf_admin_session");location.href="admin-login.html";}
function adminDeleteFood(id){if(confirm("Delete this food?")){set(KEY.foods,get(KEY.foods,[]).filter(f=>f.id!==id));admin();}}
function adminAddFood(){const cats=get(KEY.cats,defaultCategories);const name=prompt("Food name:");if(!name)return;const price=Number(prompt("Price:",199));const category_id=Number(prompt("Category ID (1-6):",cats[0]?.id||1));const f={id:Date.now(),category_id,name,description:"Freshly prepared delicious food.",price,image:"banner.jpg",rating:4.5,status:"Available"};const foods=get(KEY.foods,[]);foods.push(f);set(KEY.foods,foods);admin();}

function render(){
 initData();
 const p=location.pathname.split("/").pop()||"index.html";
 const map={"index.html":home,"":"home","category.html":categories,"food.html":foods,"login.html":login,"register.html":register,"cart.html":cart,"checkout.html":checkout,"success.html":success,"profile.html":profile,"admin-login.html":adminLogin,"admin.html":admin};
 (map[p]||home)();
}
document.addEventListener("DOMContentLoaded",render);
