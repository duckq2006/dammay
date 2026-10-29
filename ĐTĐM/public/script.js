
// ===== DATA =====
const wines = [
  {id:1,name:'Château Bordeaux 2018',origin:'Pháp',type:'red',price:3000000,stock:8,icon:'🍷',desc:'Rượu vang đỏ cao cấp từ Bordeaux với hương trái cây chín đậm đà.'},
  {id:2,name:'Chablis Premier Cru',origin:'Pháp',type:'white',price:2600000,stock:3,icon:'🥂',desc:'Vang trắng khô thanh tao, hương vị khoáng đặc trưng vùng Burgundy.'},
  {id:3,name:'Dom Pérignon 2015',origin:'Pháp',type:'champagne',price:7000000,stock:24,icon:'🍾',desc:'Champagne prestige cuvée huyền thoại, bọt mịn và hương phức tạp.'},
  {id:4,name:'Johnnie Walker Blue',origin:'Scotland',type:'whisky',price:4500000,stock:31,icon:'🥃',desc:'Whisky blended hảo hạng, cân bằng hoàn hảo giữa êm dịu và phức tạp.'},
  {id:5,name:'Moët & Chandon Brut',origin:'Pháp',type:'champagne',price:3800000,stock:19,icon:'🍾',desc:'Champagne nổi tiếng thế giới, bong bóng tinh tế và hương cam quýt.'},
  {id:6,name:'Sassicaia 2019',origin:'Ý',type:'red',price:5200000,stock:12,icon:'🍷',desc:'Super Tuscan đỉnh cao của nước Ý, tanin mịn và tuổi thọ dài.'},
  {id:7,name:'Cloudy Bay Sauvignon',origin:'New Zealand',type:'white',price:1800000,stock:27,icon:'🥂',desc:'Sauvignon Blanc tươi mát, hương chanh leo và bưởi đặc trưng.'},
  {id:8,name:'Glenfiddich 18',origin:'Scotland',type:'whisky',price:3200000,stock:15,icon:'🥃',desc:'Single malt tinh tế, ủ 18 năm với hương vani và trái cây khô.'},
  {id:9,name:'Opus One 2017',origin:'Mỹ',type:'red',price:8500000,stock:5,icon:'🍷',desc:'Kiệt tác Napa Valley, hợp tác Rothschild – Robert Mondavi.'},
];

let cart = [
  {...wines[0], qty:1},
  {...wines[2], qty:1},
];
let activeFilter = 'all';

const orders = [
  {id:'WW-001',customer:'Lê Thị Hoa',phone:'0901111222',product:'Bordeaux 2018 × 2',total:6000000,date:'12/06/2024',status:'pending'},
  {id:'WW-002',customer:'Trần Văn Nam',phone:'0912345678',product:'Dom Pérignon × 1',total:7000000,date:'12/06/2024',status:'shipping'},
  {id:'WW-003',customer:'Phạm Thu Thảo',phone:'0978654321',product:'Johnnie Walker × 3',total:13500000,date:'11/06/2024',status:'done'},
  {id:'WW-004',customer:'Nguyễn Đình Hùng',phone:'0933221100',product:'Chablis × 2, Moët × 1',total:9000000,date:'11/06/2024',status:'pending'},
  {id:'WW-005',customer:'Võ Minh Châu',phone:'0945678901',product:'Opus One 2017 × 1',total:8500000,date:'10/06/2024',status:'done'},
  {id:'WW-006',customer:'Đặng Hải Yến',phone:'0966543210',product:'Glenfiddich 18 × 2',total:6400000,date:'10/06/2024',status:'cancelled'},
];

const statusMap = {
  pending:{label:'Chờ xác nhận',cls:'badge-warn'},
  shipping:{label:'Đang giao',cls:'badge-info'},
  done:{label:'Hoàn thành',cls:'badge-success'},
  cancelled:{label:'Đã huỷ',cls:'badge-danger'},
};

// ===== UTILS =====
function fmt(n){return n.toLocaleString('vi-VN')+'₫';}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);}

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  event.currentTarget.classList.add('active');
  if(id==='products') renderProducts();
  if(id==='order') renderCart();
  if(id==='manage') renderOrders();
  if(id==='stats') renderStats();
}

function switchTab(show,hide,btn){
  document.getElementById(show).style.display='block';
  document.getElementById(hide).style.display='none';
  btn.parentElement.querySelectorAll('.tab-login').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
}

// ===== UC1 LOGIN =====
function doLogin(){
  const e=document.getElementById('login-email').value;
  const p=document.getElementById('login-pass').value;
  if(!e||!p){toast('Vui lòng nhập đầy đủ thông tin!');return;}
  toast('Đăng nhập thành công! Chào mừng quay lại WeWine 🍷');
  setTimeout(()=>{
    const tab=document.querySelector('.nav-tab:nth-child(2)');
    tab.click();
  },1200);
}
function doRegister(){
  toast('Tạo tài khoản thành công! Chào mừng đến WeWine 🎉');
}

// ===== UC2 PRODUCTS =====
function setFilter(f,el){
  activeFilter=f;
  document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  renderProducts();
}
function filterProducts(){renderProducts();}
function renderProducts(){
  const q=document.getElementById('search-input')?.value.toLowerCase()||'';
  const sort=document.getElementById('sort-select')?.value||'';
  let list=wines.filter(w=>{
    const matchQ=w.name.toLowerCase().includes(q)||w.origin.toLowerCase().includes(q);
    const matchF=activeFilter==='all'||w.type===activeFilter;
    return matchQ&&matchF;
  });
  if(sort==='asc') list.sort((a,b)=>a.price-b.price);
  if(sort==='desc') list.sort((a,b)=>b.price-a.price);
  const grid=document.getElementById('product-grid');
  if(!grid) return;
  grid.innerHTML=list.map(w=>`
    <div class="product-card" onclick="viewProduct(${w.id})">
      <div class="product-img ${w.type==='red'?'red':w.type==='white'?'white':'champagne'}">${w.icon}</div>
      <div class="product-body">
        <div class="product-name">${w.name}</div>
        <div class="product-origin">${w.origin} · ${{red:'Vang đỏ',white:'Vang trắng',champagne:'Champagne',whisky:'Whisky'}[w.type]}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
          <div class="product-price">${fmt(w.price)}</div>
          <span class="badge ${w.stock<=5?'badge-danger':'badge-success'}">${w.stock<=5?'Sắp hết':'Còn hàng'}</span>
        </div>
        <button class="btn btn-wine btn-sm" style="width:100%;margin-top:10px;justify-content:center;" onclick="event.stopPropagation();addToCart(${w.id})">+ Thêm vào giỏ</button>
      </div>
    </div>
  `).join('');
}
function viewProduct(id){
  const w=wines.find(x=>x.id===id);
  toast(`🍷 ${w.name} – ${fmt(w.price)} – Còn ${w.stock} chai`);
}
function addToCart(id){
  const w=wines.find(x=>x.id===id);
  const existing=cart.find(c=>c.id===id);
  if(existing) existing.qty++;
  else cart.push({...w,qty:1});
  toast(`Đã thêm "${w.name}" vào giỏ hàng 🛒`);
}

// ===== UC3 ORDER =====
function renderCart(){
  const cl=document.getElementById('cart-list');
  if(!cl) return;
  if(cart.length===0){cl.innerHTML='<p style="color:var(--muted);text-align:center;padding:20px;font-family:Arial,sans-serif;">Giỏ hàng trống. <a href="#" style="color:var(--wine);" onclick="document.querySelector(\'.nav-tab:nth-child(2)\').click()">Xem sản phẩm →</a></p>';updateTotal();return;}
  cl.innerHTML=cart.map((c,i)=>`
    <div class="cart-item">
      <div class="cart-icon">${c.icon}</div>
      <div class="cart-info">
        <div class="cart-name">${c.name}</div>
        <div class="cart-price">${fmt(c.price)} / chai</div>
      </div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
        <span class="qty-num">${c.qty}</span>
        <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
      </div>
      <div style="min-width:110px;text-align:right;font-weight:bold;color:var(--wine);font-size:14px;">${fmt(c.price*c.qty)}</div>
      <button class="btn btn-sm" style="color:#DC2626;border-color:#DC2626;margin-left:8px;" onclick="removeCart(${i})">✕</button>
    </div>
  `).join('');
  updateTotal();
}
function changeQty(i,d){
  cart[i].qty+=d;
  if(cart[i].qty<=0) cart.splice(i,1);
  renderCart();
}
function removeCart(i){cart.splice(i,1);renderCart();toast('Đã xoá sản phẩm khỏi giỏ hàng');}
function updateTotal(){
  const sub=cart.reduce((s,c)=>s+c.price*c.qty,0);
  const st=document.getElementById('subtotal');
  const tp=document.getElementById('total-price');
  if(st) st.textContent=fmt(sub);
  if(tp) tp.textContent=fmt(sub+30000);
}
function placeOrder(){
  if(cart.length===0){toast('Giỏ hàng đang trống!');return;}
  document.getElementById('success-modal').classList.add('open');
}
function closeModal(){
  document.getElementById('success-modal').classList.remove('open');
  cart=[];
  renderCart();
}

// ===== UC4 MANAGE =====
function renderOrders(){
  const tb=document.getElementById('orders-table');
  if(!tb) return;
  tb.innerHTML=orders.map(o=>`
    <tr>
      <td><strong style="color:var(--wine);">#${o.id}</strong></td>
      <td>${o.customer}<br><span style="font-size:11px;color:var(--muted);">${o.phone}</span></td>
      <td style="max-width:160px;font-size:12px;">${o.product}</td>
      <td><strong>${fmt(o.total)}</strong></td>
      <td style="color:var(--muted);">${o.date}</td>
      <td><span class="badge ${statusMap[o.status].cls}">${statusMap[o.status].label}</span></td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="viewOrder('${o.id}')" style="margin-right:4px;">Chi tiết</button>
        ${o.status==='pending'?`<button class="btn btn-sm btn-success" onclick="confirmOrder('${o.id}')">✓ Duyệt</button>`:''}
        ${o.status==='pending'?`<button class="btn btn-sm btn-danger" onclick="cancelOrder('${o.id}')" style="margin-left:4px;">✕</button>`:''}
      </td>
    </tr>
  `).join('');
}
function viewOrder(id){
  const o=orders.find(x=>x.id===id);
  document.getElementById('modal-order-title').textContent='Chi tiết đơn #'+o.id;
  document.getElementById('modal-order-body').innerHTML=`
    <div class="alert alert-info">📦 Trạng thái: <strong>${statusMap[o.status].label}</strong></div>
    <div class="status-steps">
      <div class="step ${['pending','shipping','done'].includes(o.status)?'done':''}"><div class="step-dot">✓</div><div class="step-label">Đặt hàng</div></div>
      <div class="step ${['shipping','done'].includes(o.status)?'done':o.status==='pending'?'active':''}"><div class="step-dot">${['shipping','done'].includes(o.status)?'✓':'2'}</div><div class="step-label">Xác nhận</div></div>
      <div class="step ${o.status==='done'?'done':o.status==='shipping'?'active':''}"><div class="step-dot">${o.status==='done'?'✓':'3'}</div><div class="step-label">Đang giao</div></div>
      <div class="step ${o.status==='done'?'done':''}"><div class="step-dot">${o.status==='done'?'✓':'4'}</div><div class="step-label">Hoàn thành</div></div>
    </div>
    <table style="margin-top:16px;">
      <tr><td style="color:var(--muted);padding:6px 0;width:120px;">Khách hàng</td><td><strong>${o.customer}</strong></td></tr>
      <tr><td style="color:var(--muted);padding:6px 0;">Điện thoại</td><td>${o.phone}</td></tr>
      <tr><td style="color:var(--muted);padding:6px 0;">Sản phẩm</td><td>${o.product}</td></tr>
      <tr><td style="color:var(--muted);padding:6px 0;">Ngày đặt</td><td>${o.date}</td></tr>
      <tr><td style="color:var(--muted);padding:6px 0;">Tổng tiền</td><td><strong style="color:var(--wine);">${fmt(o.total)}</strong></td></tr>
    </table>
    <div style="margin-top:20px;display:flex;gap:10px;">
      ${o.status==='pending'?`<button class="btn btn-wine" onclick="confirmOrder('${o.id}');closeOrderModal()">✓ Xác nhận đơn</button>`:''}
      <button class="btn btn-outline" onclick="closeOrderModal()">Đóng</button>
    </div>
  `;
  document.getElementById('order-modal').classList.add('open');
}
function confirmOrder(id){
  const o=orders.find(x=>x.id===id);
  o.status='shipping';
  renderOrders();
  toast('Đã xác nhận đơn #'+id+' – Chuyển sang đang giao 🚚');
}
function cancelOrder(id){
  const o=orders.find(x=>x.id===id);
  o.status='cancelled';
  renderOrders();
  toast('Đã huỷ đơn hàng #'+id);
}
function closeOrderModal(){document.getElementById('order-modal').classList.remove('open');}

// ===== UC5 STATS =====
function renderStats(){
  renderBarChart();
  renderPieChart();
}

function renderBarChart(){
  const svg=document.getElementById('bar-svg');
  if(!svg) return;
  const months=['Th.1','Th.2','Th.3','Th.4','Th.5','Th.6'];
  const vals=[320,280,410,390,455,487];
  const W=420, H=200, padL=36, padB=28, padT=20, padR=10;
  const chartW=W-padL-padR, chartH=H-padB-padT;
  const maxV=500;
  const barW=Math.floor(chartW/vals.length*0.55);
  const step=chartW/vals.length;
  const wine='#7B1C2E', gold='#C4973A', gridCol='#E2D5CF', textCol='#6B5A55';

  // grid lines
  let out='';
  [0,100,200,300,400,500].forEach(v=>{
    const y=padT+chartH-(v/maxV)*chartH;
    out+=`<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="${gridCol}" stroke-width="0.5"/>`;
    out+=`<text x="${padL-4}" y="${y+4}" text-anchor="end" font-size="10" fill="${textCol}" font-family="Arial">${v}</text>`;
  });
  // baseline
  out+=`<line x1="${padL}" y1="${padT+chartH}" x2="${W-padR}" y2="${padT+chartH}" stroke="${gridCol}" stroke-width="1"/>`;

  vals.forEach((v,i)=>{
    const x=padL+i*step+step/2-barW/2;
    const barH=(v/maxV)*chartH;
    const y=padT+chartH-barH;
    const fill=i===5?gold:wine;
    const opacity=i===5?1:0.82;
    out+=`<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${fill}" opacity="${opacity}" rx="3"/>`;
    // value label on top
    out+=`<text x="${x+barW/2}" y="${y-5}" text-anchor="middle" font-size="10" font-weight="bold" fill="${fill}" font-family="Arial">${v}M</text>`;
    // month label below
    out+=`<text x="${x+barW/2}" y="${padT+chartH+16}" text-anchor="middle" font-size="10" fill="${textCol}" font-family="Arial">${months[i]}</text>`;
  });

  svg.innerHTML=out;
}

function renderPieChart(){
  const svg=document.getElementById('pie-svg');
  const legend=document.getElementById('pie-legend');
  if(!svg||!legend) return;
  const data=[
    {label:'Hoàn thành',val:127,color:'#7B1C2E'},
    {label:'Đang giao',val:14,color:'#C4973A'},
    {label:'Chờ xác nhận',val:8,color:'#2563EB'},
    {label:'Đã huỷ',val:3,color:'#DC2626'},
  ];
  const total=data.reduce((s,d)=>s+d.val,0);
  const cx=100,cy=100,r=80,ri=48;
  let angle=-Math.PI/2, out='';
  data.forEach(d=>{
    const slice=(d.val/total)*2*Math.PI;
    const x1=cx+r*Math.cos(angle), y1=cy+r*Math.sin(angle);
    const x2=cx+r*Math.cos(angle+slice), y2=cy+r*Math.sin(angle+slice);
    const xi1=cx+ri*Math.cos(angle), yi1=cy+ri*Math.sin(angle);
    const xi2=cx+ri*Math.cos(angle+slice), yi2=cy+ri*Math.sin(angle+slice);
    const large=slice>Math.PI?1:0;
    out+=`<path d="M${xi1},${yi1} L${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} L${xi2},${yi2} A${ri},${ri},0,${large},0,${xi1},${yi1} Z" fill="${d.color}" stroke="#fff" stroke-width="2"/>`;
    angle+=slice;
  });
  // center text
  out+=`<text x="${cx}" y="${cy-8}" text-anchor="middle" font-size="22" font-weight="bold" fill="#2E1F1A" font-family="Arial">${total}</text>`;
  out+=`<text x="${cx}" y="${cy+12}" text-anchor="middle" font-size="10" fill="#6B5A55" font-family="Arial">đơn hàng</text>`;
  svg.innerHTML=out;

  legend.innerHTML=data.map(d=>{
    const pct=Math.round(d.val/total*100);
    return `<div style="display:flex;align-items:center;gap:10px;">
      <div style="width:10px;height:10px;border-radius:2px;background:${d.color};flex-shrink:0;"></div>
      <div style="flex:1;font-size:12px;font-family:Arial,sans-serif;color:#2E1F1A;">${d.label}</div>
      <div style="font-size:12px;font-weight:bold;font-family:Arial,sans-serif;min-width:24px;text-align:right;">${d.val}</div>
      <div style="font-size:11px;color:#6B5A55;font-family:Arial,sans-serif;min-width:34px;">${pct}%</div>
    </div>`;
  }).join('');
}

// ===== INIT =====
renderProducts();
renderCart();
renderOrders();
renderStats();
