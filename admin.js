/* ============================================================
   SACRED CUISINE ADMIN DASHBOARD — admin.js
   ============================================================ */

'use strict';

/* ---- Paste your same Supabase keys here ---- */
const SUPABASE_URL = 'https://tynxzqwutxlgvutjsmqi.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bnh6cXd1dHhsZ3Z1dGpzbXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODA1NTAsImV4cCI6MjA4NzI1NjU1MH0.n5cJbswcOzM67Q8FgDuiEe-DMYe7GJddc6kibmTdZX8';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

let allOrders = [];

/* ============================================================
   AUTH
   ============================================================ */
async function checkSession() {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
        showDashboard(session.user.email);
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const errEl = document.getElementById('loginError');
    btn.textContent = 'Signing in...';
    btn.disabled = true;
    errEl.hidden = true;

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
        errEl.textContent = 'Invalid email or password. Please try again.';
        errEl.hidden = false;
        btn.textContent = 'Sign In';
        btn.disabled = false;
    } else {
        showDashboard(data.user.email);
    }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await sb.auth.signOut();
    document.getElementById('dashboard').hidden = true;
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('loginForm').reset();
    document.getElementById('loginBtn').textContent = 'Sign In';
    document.getElementById('loginBtn').disabled = false;
});

function showDashboard(email) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').hidden = false;
    document.getElementById('adminEmail').textContent = email;
    loadDashboard();
}

/* ============================================================
   DATA LOADING
   ============================================================ */
async function loadDashboard() {
    await Promise.all([loadOrders(), loadVisitors()]);
}

async function loadOrders() {
    const { data, error } = await sb
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) { console.error(error); return; }
    allOrders = data || [];

    // Stats
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = allOrders.filter(o => o.created_at?.slice(0, 10) === today).length;
    document.getElementById('totalOrders').textContent = allOrders.length;
    document.getElementById('todayOrders').textContent = todayCount;

    renderOrders(allOrders);
    renderChart('areaChart', countBy(allOrders, 'delivery_area'));
    renderChart('referralChart', countBy(allOrders, 'referral_source'));
    renderChart('paymentChart', countBy(allOrders, 'payment_method'));
}

async function loadVisitors() {
    const { data } = await sb.from('page_visitors').select('device');
    if (!data) return;
    document.getElementById('totalVisitors').textContent = data.length;
    document.getElementById('mobileVisitors').textContent = data.filter(v => v.device === 'Mobile').length;
}

/* ============================================================
   CHARTS (simple bar charts)
   ============================================================ */
function countBy(arr, key) {
    const counts = {};
    arr.forEach(item => {
        const val = item[key] || 'Unknown';
        counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
}

function renderChart(containerId, entries) {
    const el = document.getElementById(containerId);
    if (!entries.length) { el.innerHTML = '<p style="color:#888;font-size:0.85rem">No data yet</p>'; return; }
    const max = entries[0][1];
    el.innerHTML = entries.map(([label, count]) => `
    <div class="bar-item">
      <div class="bar-label"><span>${label}</span><span>${count}</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round((count / max) * 100)}%"></div></div>
    </div>
  `).join('');
}

/* ============================================================
   ORDERS TABLE
   ============================================================ */
function filterOrders() {
    const filter = document.getElementById('statusFilter').value;
    const filtered = filter === 'all' ? allOrders : allOrders.filter(o => o.status === filter);
    renderOrders(filtered);
}

function renderOrders(orders) {
    const tbody = document.getElementById('ordersBody');
    if (!orders.length) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:#888">No orders found</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(o => {
        const date = o.created_at ? new Date(o.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
        const statusClass = `status-${o.status || 'pending'}`;
        return `
      <tr>
        <td style="white-space:nowrap;color:#888;font-size:0.78rem">${date}</td>
        <td><strong style="color:#fff">${o.customer_name || '—'}</strong></td>
        <td><a href="tel:${o.phone}" style="color:var(--orange)">${o.phone || '—'}</a></td>
        <td>${o.delivery_area || '—'}</td>
        <td style="max-width:200px;white-space:normal">${o.items_ordered || '—'}</td>
        <td>${o.payment_method || '—'}</td>
        <td>${o.referral_source || '—'}</td>
        <td>
          <select class="status-select ${statusClass}" onchange="updateStatus('${o.id}', this)">
            <option value="pending"   ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `;
    }).join('');
}

async function updateStatus(id, selectEl) {
    const newStatus = selectEl.value;
    selectEl.className = `status-select status-${newStatus}`;
    await sb.from('orders').update({ status: newStatus }).eq('id', id);
    // Update local array too
    const order = allOrders.find(o => o.id === id);
    if (order) order.status = newStatus;
}

/* ============================================================
   INIT
   ============================================================ */
checkSession();
