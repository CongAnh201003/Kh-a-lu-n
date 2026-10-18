/**
 * LINGUAPAY ADMIN PORTAL - JAVASCRIPT CORE LOGIC (12 MODULES)
 * Quản trị toàn diện Hệ thống Học Từ Vựng Tiếng Anh & Cổng Bank Gateway
 */

// ==========================================================================
// GLOBAL STATE
// ==========================================================================
let currentRole = 'super_admin';
let adminUserTrendChart = null;
let adminLearningActivityChart = null;
let adminRevenueChart = null;
let adminDonutChart = null;
let adminDauChart = null;
let activePlayingAudio = null;
let currentMatchingGame = null;
let dashboardChecklistState = [false, false, false, false, false, false, false, false, false, false, false, false];

// ==========================================================================
// 1. KHỞI TẠO ỨNG DỤNG (INITIALIZATION)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Render Dashboard & Checklist
  initChecklist();
  renderDashboardAlerts();
  initAdminCharts();

  // Render các module
  renderUserTable();
  renderCustomersTable();
  renderPermissionGroupsTable();
  renderSystemUsersTable();
  populateTopicDropdowns();
  renderVocabTable();
  renderTopicsGrid();
  renderExercisesGrid('ALL');
  renderMediaLibrary();
  renderAdminAccountsTable();
  renderRbacMatrixTable();
  renderAuditLogsTable();
  renderPlanCardsGrid();
  renderUserSubscriptionsTable();
  renderFinanceDashboard();
  renderPaymentTxnTable();
  renderMoneyInTable();
  renderMoneyOutTable();
  renderRefundsTable();
  renderReconciliationSessions();
  renderReconcileDiffTable();
  renderPaymentChannels();
  renderFinancialAuditTable();
  renderAiExecutionLogsTable();

  // Thiết lập ma trận quyền và tìm kiếm
  applyRolePermissions(currentRole);
  setupGlobalSearch();

  // Kiểm tra hash URL
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    switchAdminTab(hash);
  }
});

// ==========================================================================
// 2. SPA NAVIGATION & ROUTING
// ==========================================================================
function switchAdminTab(tabName) {
  const sectionMap = {
    'dashboard': 'viewDashboard',
    'permission-groups': 'viewPermissionGroups',
    'system-users': 'viewSystemUsers',
    'customers': 'viewCustomers',
    'users': 'viewCustomers',
    'vocab-list': 'viewVocab',
    'topics': 'viewTopics',
    'exercises': 'viewExercises',
    'media-library': 'viewMedia',
    'ai-config': 'viewAiConfig',
    'learning-analytics': 'viewAnalytics',
    'admin-rbac': 'viewPermissionGroups',
    'settings-logs': 'viewSettingsLogs',
    'subscriptions': 'viewSubscriptions',
    'transactions': 'viewTransactions'
  };

  const targetSectionId = sectionMap[tabName] || 'viewDashboard';

  // Ẩn tất cả section
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

  // Hiện section tương ứng
  const targetSec = document.getElementById(targetSectionId);
  if (targetSec) targetSec.classList.add('active');

  // Đổi active link trên sidebar
  document.querySelectorAll('.sidebar-menu .nav-item a').forEach(a => a.classList.remove('active'));
  const activeLink = document.querySelector(`.sidebar-menu .nav-item a[href="#${tabName}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
    const parentGroup = activeLink.closest('.nav-group-item');
    if (parentGroup) parentGroup.classList.add('expanded');
  }

  // Khởi tạo chart nếu vào analytics
  if (tabName === 'learning-analytics' && !adminDauChart) {
    setTimeout(initDauChart, 100);
  }

  // Refresh tables
  if (tabName === 'permission-groups') {
    renderPermissionGroupsTable();
  } else if (tabName === 'system-users') {
    renderSystemUsersTable();
  } else if (tabName === 'customers' || tabName === 'users') {
    renderCustomersTable();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleNavGroup(groupId) {
  const group = document.getElementById(groupId);
  if (group) {
    group.classList.toggle('expanded');
  }
}

function openFinanceTab(tabKey) {
  switchAdminTab('transactions');
  switchFinanceSubtab(tabKey);

  // Set active link inside finance group
  document.querySelectorAll('#navGroup_finance .nav-item a').forEach(a => a.classList.remove('active'));
  const navIdMap = {
    'fin-dashboard': 'navFinDashboard',
    'fin-transactions': 'navFinTransactions',
    'fin-money-in': 'navFinMoneyIn',
    'fin-money-out': 'navFinMoneyOut',
    'fin-refunds': 'navFinRefunds',
    'fin-reconciliation': 'navFinReconciliation',
    'fin-channels': 'navFinChannels',
    'fin-reports': 'navFinReports',
    'fin-audit': 'navFinAudit'
  };
  const activeNavId = navIdMap[tabKey];
  if (activeNavId) {
    const el = document.getElementById(activeNavId);
    if (el) el.classList.add('active');
  }
}

// ==========================================================================
// 3. GIẢ LẬP PHÂN QUYỀN 6 VAI TRÒ (RBAC SIMULATOR)
// ==========================================================================
function handleRoleSwitch(roleId) {
  currentRole = roleId;
  const roleObj = RBAC_ROLES[roleId];
  if (!roleObj) return;

  // Cập nhật giao diện
  const roleBadge = document.getElementById('sidebarRoleBadge');
  if (roleBadge) {
    roleBadge.innerHTML = roleObj.badge;
    roleBadge.style.color = roleObj.color;
  }

  const topbarRoleText = document.getElementById('topbarRoleText');
  if (topbarRoleText) topbarRoleText.innerText = roleObj.name;

  applyRolePermissions(roleId);
  renderSystemUsersTable();
  renderPermissionGroupsTable();
  showToast(`Đã chuyển sang vai trò: ${roleObj.name} (${roleObj.badge})`, 'info');
}

function applyRolePermissions(roleId) {
  const perms = RBAC_ROLES[roleId]?.permissions || {};

  // Cập nhật trạng thái hiển thị của các menu item
  document.querySelectorAll('.nav-item').forEach(item => {
    const permKey = item.getAttribute('data-perm');
    if (!permKey) return;

    const [module, action] = permKey.split('.');
    const hasPerm = perms[module] && (perms[module][action] !== false);

    if (hasPerm) {
      item.style.opacity = '1';
      item.style.pointerEvents = 'auto';
    } else {
      item.style.opacity = '0.4';
      // Không chặn hoàn toàn để người dùng vẫn xem được các màn hình nhưng gắn cảnh báo
    }
  });
}

// ==========================================================================
// 4. MODULE 1: DASHBOARD LOGIC (CHUẨN NGHIỆP VỤ BA & PM)
// ==========================================================================
function renderDashboardAlerts() {
  const container = document.getElementById('dashboardAlertsContainer');
  if (!container) return;

  container.innerHTML = DASHBOARD_METRICS.systemAlerts.map(alert => `
    <div class="priority-alert-card ${alert.levelClass}" id="${alert.id}">
      <div class="alert-left-group">
        <div class="alert-icon-box">
          <i class="fa-solid ${alert.icon}"></i>
        </div>
        <div class="alert-content-box">
          <div class="alert-meta-row">
            <span class="alert-priority-tag ${alert.tagClass}">${alert.level}</span>
            <span class="alert-target-module">${alert.moduleName}</span>
          </div>
          <h4 class="alert-title">${alert.title}</h4>
          <p class="alert-desc">${alert.desc}</p>
        </div>
      </div>
      <div class="alert-action-box">
        <button type="button" class="btn-alert-action ${alert.levelClass === 'level-warning' ? 'btn-warning' : alert.levelClass === 'level-info' ? 'btn-info' : 'btn-sla'}" onclick="${alert.actionHandler}">
          <span>${alert.actionText}</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// --------------------------------------------------------------------------
// CÁC HÀNH ĐỘNG XỬ LÝ CẢNH BÁO TRỰC TIẾP TỚI ĐÚNG BẢN GHI (BA/PM REQUIREMENT)
// --------------------------------------------------------------------------
function handleResolveTxnAlert() {
  switchAdminTab('transactions');
  // Chuyển sang subtab 2: Bảng Đối Soát Bank Gateway (10 Cột)
  const tabBtns = document.querySelectorAll('.module-tabs-nav .module-tab-btn');
  if (tabBtns && tabBtns.length > 1) {
    switchPaymentSubtab('reconciliation', tabBtns[1]);
  }
  setTimeout(() => {
    const recPanel = document.getElementById('subpanelReconciliation');
    if (recPanel) {
      recPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Đã mở danh sách 4 giao dịch đối soát cần xử lý thủ công!', 'warning');
    }
  }, 150);
}

function handleResolveVocabAlert() {
  switchAdminTab('vocab-list');
  const selStatus = document.getElementById('vocabFilterStatus');
  if (selStatus) {
    selStatus.value = 'DRAFT';
    filterVocabTable();
  }
  // Mở ngay modal chi tiết/sửa từ vựng Biodiversity (voc-010)
  setTimeout(() => {
    openEditVocabModal('voc-010');
    showToast('Đã mở bản ghi từ vựng "Biodiversity" (Trạng thái Bản nháp chờ phê duyệt)!', 'info');
  }, 200);
}

function handleResolveAiAlert() {
  switchAdminTab('ai-config');
  setTimeout(() => {
    window.scrollTo({ top: 350, behavior: 'smooth' });
    showToast('Cảnh báo SLA: Uptime AI Story hiện tại là 99,8% (Dưới ngưỡng cam kết 99,9%).', 'warning');
  }, 150);
}

// --------------------------------------------------------------------------
// BỘ LỌC THỜI GIAN NHẤT QUÁN & CẬP NHẬT CHỈ SỐ THEO KỲ
// --------------------------------------------------------------------------
function filterDashboardTime(period, btn) {
  document.querySelectorAll('.btn-time-filter').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const rangeTextEl = document.getElementById('activeFilterRangeText');
  const dauTag = document.getElementById('kpiDauTag');

  if (period === 'today') {
    if (rangeTextEl) rangeTextEl.innerText = 'Hôm nay (11/10/2026, từ 00:00 đến thời điểm hiện tại)';
    if (dauTag) dauTag.innerText = 'DAU: 3.450';
    document.getElementById('kpiTotalUsers').innerText = '12.480';
    document.getElementById('kpiActiveUsers').innerText = '3.450';
    document.getElementById('kpiTotalSessions').innerText = '4.120';
    document.getElementById('kpiCompletionRate').innerText = '86,2%';
    document.getElementById('kpiPremiumUsers').innerText = '3.840';
    document.getElementById('kpiSuccessPayments').innerText = '142';
    document.getElementById('kpiRevenue').innerText = '18.450.000 ₫';
    document.getElementById('kpiAiUptime').innerText = '100%';
    showToast('Đã cập nhật số liệu theo kỳ: Hôm nay (11/10/2026) · GMT+7', 'info');

    // Cập nhật biểu đồ hôm nay
    if (adminUserTrendChart) {
      adminUserTrendChart.updateOptions({
        xaxis: { categories: ['00h-04h', '04h-08h', '08h-12h', '12h-16h', '16h-20h', '20h-24h'] },
        series: [
          { name: 'Học Viên Mới', data: [12, 28, 45, 38, 52, 25] },
          { name: 'Active Users (DAU)', data: [210, 580, 1140, 980, 1280, 640] }
        ]
      });
    }
    if (adminLearningActivityChart) {
      adminLearningActivityChart.updateOptions({
        xaxis: { categories: ['00h-04h', '04h-08h', '08h-12h', '12h-16h', '16h-20h', '20h-24h'] },
        series: [
          { name: 'Phiên Học (Sessions)', data: [280, 720, 1420, 1180, 1580, 840] },
          { name: 'Bài Tập Hoàn Thành', data: [240, 620, 1250, 1010, 1380, 720] }
        ]
      });
    }
  } else if (period === '7days') {
    if (rangeTextEl) rangeTextEl.innerText = '7 ngày qua (05/10/2026 - 11/10/2026)';
    if (dauTag) dauTag.innerText = 'WAU: 6.120';
    document.getElementById('kpiTotalUsers').innerText = '12.480';
    document.getElementById('kpiActiveUsers').innerText = '6.120';
    document.getElementById('kpiTotalSessions').innerText = '24.800';
    document.getElementById('kpiCompletionRate').innerText = '85,4%';
    document.getElementById('kpiPremiumUsers').innerText = '3.840';
    document.getElementById('kpiSuccessPayments').innerText = '980';
    document.getElementById('kpiRevenue').innerText = '112.500.000 ₫';
    document.getElementById('kpiAiUptime').innerText = '99,9%';
    showToast('Đã cập nhật số liệu theo kỳ: 7 ngày qua · GMT+7', 'info');

    // Cập nhật biểu đồ 7 ngày
    if (adminUserTrendChart) {
      adminUserTrendChart.updateOptions({
        xaxis: { categories: ['05/10', '06/10', '07/10', '08/10', '09/10', '10/10', '11/10'] },
        series: [
          { name: 'Học Viên Mới', data: [140, 185, 210, 165, 140, 120, 95] },
          { name: 'Active Users (DAU)', data: [3200, 3450, 3520, 3380, 3410, 3450, 3120] }
        ]
      });
    }
    if (adminLearningActivityChart) {
      adminLearningActivityChart.updateOptions({
        xaxis: { categories: ['05/10', '06/10', '07/10', '08/10', '09/10', '10/10', '11/10'] },
        series: [
          { name: 'Phiên Học (Sessions)', data: [4600, 5600, 5900, 5100, 5300, 5440, 4800] },
          { name: 'Bài Tập Hoàn Thành', data: [3950, 4820, 5100, 4350, 4520, 4600, 4100] }
        ]
      });
    }
  } else {
    // 30 days hoặc Toàn tháng 10/2026
    if (rangeTextEl) rangeTextEl.innerText = period === 'month' ? 'Toàn tháng 10/2026 (01/10/2026 - 31/10/2026)' : '30 ngày gần nhất (12/09/2026 - 11/10/2026)';
    if (dauTag) dauTag.innerText = 'DAU: 3.450';
    document.getElementById('kpiTotalUsers').innerText = '12.480';
    document.getElementById('kpiActiveUsers').innerText = '8.620';
    document.getElementById('kpiTotalSessions').innerText = '48.290';
    document.getElementById('kpiCompletionRate').innerText = '84,6%';
    document.getElementById('kpiPremiumUsers').innerText = '3.840';
    document.getElementById('kpiSuccessPayments').innerText = '4.120';
    document.getElementById('kpiRevenue').innerText = '485.600.000 ₫';
    document.getElementById('kpiAiUptime').innerText = '99,8%';
    showToast(period === 'month' ? 'Đã cập nhật số liệu: Tháng 10/2026 · GMT+7' : 'Đã cập nhật số liệu: 30 ngày qua · GMT+7', 'info');

    // Cập nhật biểu đồ 30 ngày
    if (adminUserTrendChart) {
      adminUserTrendChart.updateOptions({
        xaxis: { categories: ['01/10', '02/10', '03/10', '04/10', '05/10', '06/10', '07/10', '08/10', '09/10', '10/10'] },
        series: [
          { name: 'Học Viên Mới', data: [95, 110, 130, 125, 140, 185, 210, 165, 140, 120] },
          { name: 'Active Users (DAU)', data: [2850, 2920, 3100, 3050, 3200, 3450, 3520, 3380, 3410, 3450] }
        ]
      });
    }
    if (adminLearningActivityChart) {
      adminLearningActivityChart.updateOptions({
        xaxis: { categories: ['01/10', '02/10', '03/10', '04/10', '05/10', '06/10', '07/10', '08/10', '09/10', '10/10'] },
        series: [
          { name: 'Phiên Học (Sessions)', data: [3800, 4100, 4350, 4200, 4600, 5600, 5900, 5100, 5300, 5440] },
          { name: 'Bài Tập Hoàn Thành', data: [3200, 3480, 3720, 3550, 3950, 4820, 5100, 4350, 4520, 4600] }
        ]
      });
    }
  }
}

function filterDashboardSegment() {
  const plan = document.getElementById('dashFilterPlan')?.value || '';
  const channel = document.getElementById('dashFilterChannel')?.value || '';
  let parts = [];
  if (plan) parts.push(`Phân khúc: ${plan}`);
  if (channel) parts.push(`Kênh: ${channel}`);
  const label = parts.length > 0 ? parts.join(' · ') : 'Toàn bộ học viên';
  showToast(`Đã lọc dữ liệu Dashboard: ${label}`, 'info');
}

function resetDashboardFilters() {
  if (document.getElementById('dashFilterPlan')) document.getElementById('dashFilterPlan').value = '';
  if (document.getElementById('dashFilterChannel')) document.getElementById('dashFilterChannel').value = '';
  filterDashboardTime('30days', document.querySelector('.btn-time-filter.active'));
  showToast('Đã đặt lại bộ lọc Dashboard về mặc định!', 'info');
}

// --------------------------------------------------------------------------
// KHỞI TẠO 4 BIỂU ĐỒ XU HƯỚNG CHUYÊN SÂU CHUẨN BA/PM
// --------------------------------------------------------------------------
function initAdminCharts() {
  // Biểu đồ 1: Xu Hướng Người Dùng (Học viên mới & Active DAU)
  const userChartEl = document.getElementById('apexUserTrendChart');
  if (userChartEl) {
    const userOptions = {
      series: [
        {
          name: 'Học Viên Mới',
          type: 'column',
          data: [95, 110, 130, 125, 140, 185, 210, 165, 140, 120]
        },
        {
          name: 'Active Users (DAU)',
          type: 'line',
          data: [2850, 2920, 3100, 3050, 3200, 3450, 3520, 3380, 3410, 3450]
        }
      ],
      chart: {
        height: 310,
        type: 'line',
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#2563eb', '#10b981'],
      stroke: { width: [0, 3], curve: 'smooth' },
      plotOptions: { bar: { columnWidth: '40%', borderRadius: 5 } },
      labels: ['01/10', '02/10', '03/10', '04/10', '05/10', '06/10', '07/10', '08/10', '09/10', '10/10'],
      yaxis: [
        {
          title: { text: 'Học Viên Mới', style: { color: '#2563eb', fontSize: '11px' } },
          labels: { formatter: val => val ? val.toFixed(0) : '0' }
        },
        {
          opposite: true,
          title: { text: 'Active DAU', style: { color: '#10b981', fontSize: '11px' } },
          labels: { formatter: val => val ? val.toLocaleString('vi-VN') : '0' }
        }
      ],
      grid: { borderColor: '#f1f5f9' },
      legend: { position: 'top', horizontalAlign: 'right' }
    };
    adminUserTrendChart = new ApexCharts(userChartEl, userOptions);
    adminUserTrendChart.render();
  }

  // Biểu đồ 2: Xu Hướng Hoạt Động Học Tập (Phiên học & Bài tập hoàn thành)
  const learningChartEl = document.getElementById('apexLearningActivityChart');
  if (learningChartEl) {
    const learningOptions = {
      series: [
        {
          name: 'Phiên Học (Sessions)',
          type: 'column',
          data: [3800, 4100, 4350, 4200, 4600, 5600, 5900, 5100, 5300, 5440]
        },
        {
          name: 'Bài Tập Hoàn Thành',
          type: 'line',
          data: [3200, 3480, 3720, 3550, 3950, 4820, 5100, 4350, 4520, 4600]
        }
      ],
      chart: {
        height: 310,
        type: 'line',
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#8b5cf6', '#ec4899'],
      stroke: { width: [0, 3], curve: 'smooth' },
      plotOptions: { bar: { columnWidth: '40%', borderRadius: 5 } },
      labels: ['01/10', '02/10', '03/10', '04/10', '05/10', '06/10', '07/10', '08/10', '09/10', '10/10'],
      yaxis: [
        {
          title: { text: 'Phiên Học', style: { color: '#8b5cf6', fontSize: '11px' } },
          labels: { formatter: val => val ? val.toLocaleString('vi-VN') : '0' }
        },
        {
          opposite: true,
          title: { text: 'Bài Nộp Hoàn Thành', style: { color: '#ec4899', fontSize: '11px' } },
          labels: { formatter: val => val ? val.toLocaleString('vi-VN') : '0' }
        }
      ],
      grid: { borderColor: '#f1f5f9' },
      legend: { position: 'top', horizontalAlign: 'right' }
    };
    adminLearningActivityChart = new ApexCharts(learningChartEl, learningOptions);
    adminLearningActivityChart.render();
  }

  // Biểu đồ 3: Xu Hướng Doanh Thu & Số GD Thành Công
  const revenueChartEl = document.getElementById('apexRevenueChart');
  if (revenueChartEl) {
    const revenueOptions = {
      series: [
        {
          name: 'Doanh Thu (Tr. VNĐ)',
          type: 'column',
          data: [38.5, 42.0, 45.2, 41.0, 49.5, 62.0, 68.5, 52.0, 46.4, 40.5]
        },
        {
          name: 'Số GD Thành Công',
          type: 'line',
          data: [340, 370, 395, 360, 430, 540, 590, 460, 410, 365]
        }
      ],
      chart: {
        height: 310,
        type: 'line',
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#173d8f', '#059669'],
      stroke: { width: [0, 3], curve: 'smooth' },
      plotOptions: { bar: { columnWidth: '40%', borderRadius: 5 } },
      labels: ['01/10', '02/10', '03/10', '04/10', '05/10', '06/10', '07/10', '08/10', '09/10', '10/10'],
      yaxis: [
        {
          title: { text: 'Doanh Thu (Tr. VNĐ)', style: { color: '#173d8f', fontSize: '11px' } },
          labels: { formatter: val => val ? val.toFixed(1) + ' tr' : '0' }
        },
        {
          opposite: true,
          title: { text: 'Số GD Thành Công', style: { color: '#059669', fontSize: '11px' } },
          labels: { formatter: val => val ? val.toFixed(0) : '0' }
        }
      ],
      grid: { borderColor: '#f1f5f9' },
      legend: { position: 'top', horizontalAlign: 'right' }
    };
    adminRevenueChart = new ApexCharts(revenueChartEl, revenueOptions);
    adminRevenueChart.render();
  }

  // Biểu đồ 4: Cơ Cấu Gói Dịch Vụ Donut
  const donutChartEl = document.getElementById('apexPackageDonutChart');
  if (donutChartEl) {
    const donutOptions = {
      series: [8640, 1920, 1440, 480],
      labels: ['Gói Free (Miễn phí)', 'Gói Premium 45k/tháng', 'Gói VIP 60k/tháng', 'Gói VIP 1 Năm 599k'],
      colors: ['#94a3b8', '#3b82f6', '#f59e0b', '#10b981'],
      chart: {
        type: 'donut',
        height: 310,
        fontFamily: 'Inter, sans-serif'
      },
      legend: { position: 'bottom' },
      dataLabels: { enabled: true, formatter: val => val.toFixed(1) + '%' },
      tooltip: {
        y: {
          formatter: val => `${val.toLocaleString('vi-VN')} học viên (${((val/12480)*100).toFixed(1)}%)`
        }
      }
    };
    adminDonutChart = new ApexCharts(donutChartEl, donutOptions);
    adminDonutChart.render();
  }
}

// --------------------------------------------------------------------------
// CHECKLIST NGHIỆM THU DASHBOARD (12 MỤC CHUẨN BA/QA/PM)
// --------------------------------------------------------------------------
function initChecklist() {
  const saved = localStorage.getItem('dashboard_qa_checklist');
  if (saved) {
    try {
      dashboardChecklistState = JSON.parse(saved);
    } catch (e) {
      dashboardChecklistState = [false, false, false, false, false, false, false, false, false, false, false, false];
    }
  }
  updateChecklistUI();
}

function openChecklistModal() {
  const modal = document.getElementById('checklistModal');
  if (modal) {
    modal.classList.add('active');
    updateChecklistUI();
  }
}

function toggleChecklistItem(index) {
  if (index >= 0 && index < dashboardChecklistState.length) {
    dashboardChecklistState[index] = !dashboardChecklistState[index];
    localStorage.setItem('dashboard_qa_checklist', JSON.stringify(dashboardChecklistState));
    updateChecklistUI();
  }
}

function resetChecklist() {
  dashboardChecklistState = [false, false, false, false, false, false, false, false, false, false, false, false];
  localStorage.setItem('dashboard_qa_checklist', JSON.stringify(dashboardChecklistState));
  updateChecklistUI();
  showToast('Đã đặt lại tiến độ nghiệm thu về 0/12 mục.', 'info');
}

function passAllChecklist() {
  dashboardChecklistState = [true, true, true, true, true, true, true, true, true, true, true, true];
  localStorage.setItem('dashboard_qa_checklist', JSON.stringify(dashboardChecklistState));
  updateChecklistUI();
  showToast('Xuất sắc! Tất cả 12/12 tiêu chí nghiệm thu Dashboard đã được thông qua.', 'success');
}

function updateChecklistUI() {
  const checkedCount = dashboardChecklistState.filter(Boolean).length;
  const total = dashboardChecklistState.length;
  const percent = Math.round((checkedCount / total) * 100);

  // Update Topbar badge
  const topBadge = document.getElementById('topChecklistBadge');
  if (topBadge) topBadge.innerText = `${checkedCount}/${total}`;

  // Update Modal progress
  const progressText = document.getElementById('checklistProgressText');
  if (progressText) progressText.innerText = `${checkedCount}/${total} mục (${percent}%)`;

  const progressFill = document.getElementById('checklistProgressFill');
  if (progressFill) progressFill.style.width = `${percent}%`;

  // Update rows & checkboxes
  for (let i = 0; i < total; i++) {
    const chk = document.getElementById(`chkItem_${i}`);
    const row = document.getElementById(`chkRow_${i}`);
    const isChecked = !!dashboardChecklistState[i];
    if (chk) chk.checked = isChecked;
    if (row) {
      if (isChecked) row.classList.add('checked');
      else row.classList.remove('checked');
    }
  }
}

// --------------------------------------------------------------------------
// SỔ TAY ĐỊNH NGHĨA CHỈ SỐ NGHIỆP VỤ (BA DATA DICTIONARY)
// --------------------------------------------------------------------------
function openMetricDictModal() {
  const modal = document.getElementById('metricDictModal');
  if (modal) modal.classList.add('active');
}

function openMetricDetailModal(metricKey) {
  openMetricDictModal();
}

function exportDashboardSummary() {
  const content = `BÁO CÁO TỔNG QUAN HỆ THỐNG LINGUAPAY (T10/2026 - MÚI GIỜ GMT+7)\n` +
    `========================================================================\n` +
    `1. Tổng tài khoản học viên (All-time): ${DASHBOARD_METRICS.totalUsers.toLocaleString('vi-VN')} (Free: 8.640, Premium: 3.840)\n` +
    `2. Người dùng hoạt động trong tháng (MAU): ${DASHBOARD_METRICS.activeUsersMAU.toLocaleString('vi-VN')} học viên (DAU: ${DASHBOARD_METRICS.activeUsersDAU.toLocaleString('vi-VN')})\n` +
    `3. Tổng số phiên học phát sinh trong kỳ: ${DASHBOARD_METRICS.totalSessions.toLocaleString('vi-VN')} phiên (Trung bình 5.6 phiên/học viên)\n` +
    `4. Tỷ lệ hoàn thành bài tập: ${DASHBOARD_METRICS.exerciseCompletionRate} (Điểm trung bình toàn hệ thống: 82/100)\n` +
    `5. Người dùng trả phí (Premium/VIP): ${DASHBOARD_METRICS.premiumSubscribers.toLocaleString('vi-VN')} (Tỷ lệ chuyển đổi: 30.8%)\n` +
    `6. Số giao dịch thành công: ${DASHBOARD_METRICS.successfulPayments.toLocaleString('vi-VN')} (Tỷ lệ thành công: ${DASHBOARD_METRICS.paymentSuccessRate})\n` +
    `7. Doanh thu Net thực thu trong kỳ: ${DASHBOARD_METRICS.revenueFormatted} (Đã khấu trừ 2 đơn hoàn tiền: 1.200.000 ₫)\n` +
    `8. Tình trạng vận hành AI & SLA: ${DASHBOARD_METRICS.aiUptime} (Mục tiêu cam kết SLA: ${DASHBOARD_METRICS.aiSlaTarget} - Cần theo dõi)\n` +
    `========================================================================\n` +
    `Tiến độ nghiệm thu Dashboard: ${dashboardChecklistState.filter(Boolean).length}/12 tiêu chí chất lượng hoàn thành.\n`;

  downloadFile('BaoCao_TongQuan_LinguaPay.txt', content, 'text/plain');
  showToast('Đã xuất báo cáo tổng quan hệ thống chuẩn định nghĩa BA!', 'success');
}

// ==========================================================================
// 5. MODULE 2: USER MANAGEMENT LOGIC
// ==========================================================================
function renderUserTable(users = APP_USERS) {
  renderCustomersTable();
  const tbody = document.getElementById('userTableBody') || document.getElementById('customerTableBody');
  if (!tbody) return;

  tbody.innerHTML = users.map(u => `
    <tr>
      <td><span class="mono-code">${u.id}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="user-avatar-circle" style="background:#e0e7ff;color:#3730a3;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">
            ${u.avatar || 'US'}
          </div>
          <div>
            <strong style="color:var(--text-primary);display:block;">${u.fullName}</strong>
            <span style="font-size:0.75rem;color:var(--text-muted);">${u.phone || ''}</span>
          </div>
        </div>
      </td>
      <td>${u.email}</td>
      <td>${u.registeredAt}</td>
      <td>
        <span class="badge-status ${u.status === 'ACTIVE' ? 'badge-success' : u.status === 'LOCKED' ? 'badge-danger' : 'badge-warning'}">
          ${u.status === 'ACTIVE' ? 'Hoạt động' : u.status === 'LOCKED' ? 'Bị khóa' : 'Chờ xác minh'}
        </span>
      </td>
      <td>
        <span class="badge-status ${u.planType === 'VIP' ? 'badge-warning' : u.planType === 'Premium' ? 'badge-info' : 'badge-neutral'}">
          ${u.planName}
        </span>
      </td>
      <td>${u.expiryDate}</td>
      <td style="font-size:0.78rem;color:var(--text-muted);">${u.lastActive}</td>
      <td style="text-align:right;">
        <button type="button" class="btn-action-icon" title="Xem chi tiết hồ sơ 6 tabs" onclick="openUserDetailModal('${u.id}')">
          <i class="fa-solid fa-eye"></i>
        </button>
        <button type="button" class="btn-action-icon" title="${u.status === 'LOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}" onclick="toggleUserLock('${u.id}')">
          <i class="fa-solid ${u.status === 'LOCKED' ? 'fa-lock-open' : 'fa-lock'}" style="color:${u.status === 'LOCKED' ? '#10b981' : '#ef4444'};"></i>
        </button>
      </td>
    </tr>
  `).join('');

  const countBadge = document.getElementById('usersCountBadge');
  if (countBadge) countBadge.innerText = `${users.length} users`;
}

function filterUserTable() {
  const keyword = (document.getElementById('userSearchInput')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('userFilterStatus')?.value || '';
  const planFilter = document.getElementById('userFilterPlan')?.value || '';

  const filtered = APP_USERS.filter(u => {
    const matchKey = u.id.toLowerCase().includes(keyword) ||
      u.fullName.toLowerCase().includes(keyword) ||
      u.email.toLowerCase().includes(keyword);

    const matchStatus = !statusFilter || u.status === statusFilter;
    const matchPlan = !planFilter || u.planType === planFilter;

    return matchKey && matchStatus && matchPlan;
  });

  renderUserTable(filtered);
}

function openUserDetailModal(userId) {
  const user = APP_USERS.find(u => u.id === userId);
  if (!user) return;

  const titleEl = document.getElementById('userDetailModalTitle');
  if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-user"></i> Hồ Sơ Học Viên: ${user.fullName} (${user.id})`;

  // Render tab mặc định: info
  renderUserDetailTabContent('info', user);

  // Mở modal
  const modal = document.getElementById('userDetailModal');
  if (modal) modal.classList.add('active');
}

function switchUserDetailTab(tabKey, btn) {
  document.querySelectorAll('#userDetailModal .module-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const userId = document.getElementById('userDetailModalTitle')?.innerText.match(/USR-\d+/)?.[0] || 'USR-1001';
  const user = APP_USERS.find(u => u.id === userId) || APP_USERS[0];

  renderUserDetailTabContent(tabKey, user);
}

function renderUserDetailTabContent(tabKey, user) {
  const container = document.getElementById('userDetailContentContainer');
  if (!container) return;

  if (tabKey === 'info') {
    container.innerHTML = `
      <div style="display:grid; grid-template-columns:140px 1fr; gap:20px; align-items:start;">
        <div style="width:120px;height:120px;border-radius:16px;background:#e0e7ff;color:#3730a3;display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:800;">
          ${user.avatar || 'US'}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div><span class="meta-label">Mã học viên:</span> <strong>${user.id}</strong></div>
          <div><span class="meta-label">Họ và tên:</span> <strong>${user.fullName}</strong></div>
          <div><span class="meta-label">Email:</span> <strong>${user.email}</strong></div>
          <div><span class="meta-label">Số điện thoại:</span> <strong>${user.phone || 'Chưa cung cấp'}</strong></div>
          <div><span class="meta-label">Ngày đăng ký:</span> <strong>${user.registeredAt}</strong></div>
          <div><span class="meta-label">Trạng thái:</span> <span class="badge-status ${user.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}">${user.status}</span></div>
          <div><span class="meta-label">Lần online cuối:</span> <strong>${user.lastActive}</strong></div>
          <div><span class="meta-label">Tổng giờ học:</span> <strong>${user.learningProgress?.totalStudyHours || 0} giờ</strong></div>
        </div>
      </div>
    `;
  } else if (tabKey === 'progress') {
    const prog = user.learningProgress || {};
    container.innerHTML = `
      <div class="stats-overview-grid" style="grid-template-columns:repeat(3, 1fr);margin-bottom:20px;">
        <div class="stat-card">
          <span class="stat-card-title">Từ vựng đã học</span>
          <div class="stat-card-value">${prog.wordsLearned || 0} từ</div>
        </div>
        <div class="stat-card">
          <span class="stat-card-title">Chủ đề hoàn thành</span>
          <div class="stat-card-value">${prog.topicsCompleted || 0} / ${prog.totalTopics || 8}</div>
        </div>
        <div class="stat-card">
          <span class="stat-card-title">Chuỗi Streak</span>
          <div class="stat-card-value" style="color:#f59e0b;">🔥 ${prog.currentStreakDays || 0} ngày</div>
        </div>
      </div>
      <div>
        <h4 style="font-size:0.9rem;margin-bottom:8px;">Điểm đánh giá phát âm AI trung bình: <strong>${prog.avgPronounceScore || 0}/100</strong></h4>
        <div class="stats-progress-bg" style="height:10px;">
          <div class="stats-progress-fill" style="width:${prog.avgPronounceScore || 0}%;"></div>
        </div>
      </div>
    `;
  } else if (tabKey === 'history') {
    const history = user.learningHistory || [];
    container.innerHTML = `
      <table class="admin-data-table">
        <thead>
          <tr>
            <th>Thời Gian</th>
            <th>Bài Tập / Dạng Học</th>
            <th>Điểm Số</th>
            <th>Thời Lượng</th>
          </tr>
        </thead>
        <tbody>
          ${history.length > 0 ? history.map(h => `
            <tr>
              <td>${h.date}</td>
              <td><strong>${h.exercise}</strong></td>
              <td><span class="badge-status badge-success">${h.score}</span></td>
              <td>${h.duration}</td>
            </tr>
          `).join('') : '<tr><td colspan="4" style="text-align:center;">Chưa có lịch sử học tập.</td></tr>'}
        </tbody>
      </table>
    `;
  } else if (tabKey === 'plan') {
    container.innerHTML = `
      <div style="background:#f8fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h4 style="font-size:1.1rem;color:#173d8f;margin-bottom:4px;">${user.planName}</h4>
          <p style="font-size:0.85rem;color:var(--text-muted);">Hạn sử dụng: <strong>${user.expiryDate}</strong></p>
        </div>
        <div>
          <button type="button" class="btn-action btn-primary" onclick="openExtendSubForUser('${user.id}')">
            <i class="fa-solid fa-calendar-plus"></i> Điều Chỉnh Gói / Gia Hạn
          </button>
        </div>
      </div>
    `;
  } else if (tabKey === 'audit') {
    const audits = user.auditLogs || [];
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${audits.length > 0 ? audits.map(a => `
          <div style="padding:10px 14px;background:#f8fafc;border-left:3px solid #2563eb;border-radius:4px;font-size:0.85rem;">
            <div style="display:flex;justify-content:space-between;color:var(--text-muted);font-size:0.75rem;margin-bottom:4px;">
              <span><strong>${a.admin}</strong></span>
              <span>${a.time}</span>
            </div>
            <div>${a.action}</div>
          </div>
        `).join('') : '<p style="color:var(--text-muted);">Chưa có lịch sử can thiệp quản trị.</p>'}
      </div>
    `;
  }
}

function toggleUserLock(userId) {
  const user = APP_USERS.find(u => u.id === userId);
  if (!user) return;

  const newStatus = user.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
  user.status = newStatus;

  // Ghi nhận Audit Log
  AUDIT_LOGS.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actor: `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`,
    module: 'USER_MANAGEMENT',
    action: newStatus === 'LOCKED' ? 'LOCK_USER' : 'UNLOCK_USER',
    target: `${user.id} (${user.fullName})`,
    severity: newStatus === 'LOCKED' ? 'WARNING' : 'INFO',
    status: 'SUCCESS',
    details: `${newStatus === 'LOCKED' ? 'Khóa' : 'Mở khóa'} tài khoản học viên qua giao diện quản trị.`
  });

  renderUserTable();
  renderAuditLogsTable();
  showToast(`Đã ${newStatus === 'LOCKED' ? 'khóa' : 'mở khóa'} tài khoản ${user.fullName}!`, 'success');
}

function exportUsersCsv() {
  let csv = 'User ID,Full Name,Email,Phone,Status,Plan,Expiry Date,Last Active\n';
  APP_USERS.forEach(u => {
    csv += `"${u.id}","${u.fullName}","${u.email}","${u.phone || ''}","${u.status}","${u.planType}","${u.expiryDate}","${u.lastActive}"\n`;
  });
  downloadFile('Linguapay_Users.csv', csv, 'text/csv;charset=utf-8;');
  showToast('Đã xuất danh sách học viên CSV!', 'success');
}

// ==========================================================================
// 6. MODULE 3: VOCABULARY MANAGEMENT LOGIC
// ==========================================================================
function populateTopicDropdowns() {
  const topicFilter = document.getElementById('vocabFilterTopic');
  const topicForm = document.getElementById('vocabInputTopic');

  if (topicFilter) {
    topicFilter.innerHTML = '<option value="">Tất cả chủ đề</option>' +
      VOCAB_TOPICS.map(t => `<option value="${t.id}">${t.nameVi} (${t.nameEn})</option>`).join('');
  }
  if (topicForm) {
    topicForm.innerHTML = VOCAB_TOPICS.map(t => `<option value="${t.id}">${t.nameVi} (${t.nameEn})</option>`).join('');
  }
}

function renderVocabTable(items = VOCAB_ITEMS) {
  const tbody = document.getElementById('vocabTableBody');
  if (!tbody) return;

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="13" style="text-align:center;padding:32px;color:var(--text-muted);"><i class="fa-solid fa-inbox" style="font-size:2rem;margin-bottom:8px;display:block;"></i>Không tìm thấy từ vựng phù hợp với bộ lọc</td></tr>`;
    const countBadge = document.getElementById('vocabCountBadge');
    if (countBadge) countBadge.innerText = `0 từ`;
    return;
  }

  tbody.innerHTML = items.map(v => `
    <tr>
      <td><span class="mono-code">${v.id}</span></td>
      <td>
        <strong style="font-size:0.95rem;color:var(--text-primary);">${v.word}</strong>
      </td>
      <td><span style="font-family:var(--font-mono);color:#6366f1;">${v.ipa}</span></td>
      <td>
        <span class="badge-status" style="background:#eef2ff;color:#4f46e5;font-family:var(--font-mono);font-size:0.78rem;font-weight:600;white-space:nowrap;letter-spacing:0.3px;">
          ${v.syllables || '—'}
        </span>
      </td>
      <td><span class="badge-status badge-neutral">${v.partOfSpeech}</span></td>
      <td style="max-width:200px;line-height:1.4;">${v.meaningVi}</td>
      <td style="max-width:220px;font-size:0.83rem;color:var(--text-secondary);line-height:1.4;" title="${v.definitionEn || ''}">
        ${v.definitionEn || '<span style="color:#94a3b8;">—</span>'}
      </td>
      <td style="max-width:240px;font-size:0.82rem;color:#475569;font-style:italic;line-height:1.4;" title="${v.exampleSentence || ''}">
        ${v.exampleSentence ? `“${v.exampleSentence}”` : '<span style="color:#94a3b8;">—</span>'}
      </td>
      <td><span class="badge-status badge-info">${v.topicName || v.topic}</span></td>
      <td>
        <span class="badge-status ${v.difficulty === 'Dễ' ? 'badge-success' : v.difficulty === 'Khó' ? 'badge-danger' : 'badge-warning'}">
          ${v.difficulty}
        </span>
      </td>
      <td>
        <button type="button" class="audio-play-btn" id="audioBtn_${v.id}" title="Nghe phát âm chuẩn" onclick="playAudioPreview('${v.id}', '${v.audioUrl}')">
          <i class="fa-solid fa-volume-high"></i>
        </button>
      </td>
      <td>
        <span class="badge-status ${v.status === 'PUBLISHED' ? 'badge-success' : v.status === 'DRAFT' ? 'badge-warning' : 'badge-danger'}">
          ${v.status === 'PUBLISHED' ? 'Đã xuất bản' : v.status === 'DRAFT' ? 'Bản nháp' : 'Ngừng dùng'}
        </span>
      </td>
      <td style="text-align:right;white-space:nowrap;">
        <button type="button" class="btn-action-icon" title="Xem bài tập liên kết" onclick="viewLinkedExercises('${v.id}')">
          <i class="fa-solid fa-link" style="color:#8b5cf6;"></i>
        </button>
        <button type="button" class="btn-action-icon" title="Chỉnh sửa từ vựng" onclick="openEditVocabModal('${v.id}')">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="btn-action-icon" title="${v.status === 'PUBLISHED' ? 'Chuyển về nháp' : 'Xuất bản'}" onclick="toggleVocabStatus('${v.id}')">
          <i class="fa-solid ${v.status === 'PUBLISHED' ? 'fa-eye-slash' : 'fa-circle-check'}" style="color:${v.status === 'PUBLISHED' ? '#f59e0b' : '#10b981'};"></i>
        </button>
      </td>
    </tr>
  `).join('');

  const countBadge = document.getElementById('vocabCountBadge');
  if (countBadge) countBadge.innerText = `${items.length} từ`;
}

function filterVocabTable() {
  const keyword = (document.getElementById('vocabSearchInput')?.value || '').toLowerCase().trim();
  const topicFilter = document.getElementById('vocabFilterTopic')?.value || '';
  const posFilter = document.getElementById('vocabFilterPos')?.value || '';
  const statusFilter = document.getElementById('vocabFilterStatus')?.value || '';
  const levelFilter = document.getElementById('vocabFilterLevel')?.value || '';
  const audioFilter = document.getElementById('vocabFilterAudio')?.value || '';

  const filtered = VOCAB_ITEMS.filter(v => {
    const matchKey = v.word.toLowerCase().includes(keyword) ||
      v.meaningVi.toLowerCase().includes(keyword) ||
      v.id.toLowerCase().includes(keyword) ||
      (v.ipa && v.ipa.toLowerCase().includes(keyword)) ||
      (v.syllables && v.syllables.toLowerCase().includes(keyword)) ||
      (v.definitionEn && v.definitionEn.toLowerCase().includes(keyword)) ||
      (v.exampleSentence && v.exampleSentence.toLowerCase().includes(keyword));

    const matchTopic = !topicFilter || v.topic === topicFilter;
    const matchPos = !posFilter || v.partOfSpeech === posFilter;
    const matchStatus = !statusFilter || v.status === statusFilter;
    const matchLevel = !levelFilter || v.difficultyLevel === levelFilter;
    const matchAudio = !audioFilter || (audioFilter === 'HAS_AUDIO' ? !!v.audioUrl : !v.audioUrl);

    return matchKey && matchTopic && matchPos && matchStatus && matchLevel && matchAudio;
  });

  renderVocabTable(filtered);
  const badge = document.getElementById('vocabFilterResultBadge');
  if (badge) badge.innerText = `${filtered.length} từ`;
}

function resetVocabFilters() {
  if (document.getElementById('vocabSearchInput')) document.getElementById('vocabSearchInput').value = '';
  if (document.getElementById('vocabFilterTopic')) document.getElementById('vocabFilterTopic').value = '';
  if (document.getElementById('vocabFilterPos')) document.getElementById('vocabFilterPos').value = '';
  if (document.getElementById('vocabFilterStatus')) document.getElementById('vocabFilterStatus').value = '';
  if (document.getElementById('vocabFilterLevel')) document.getElementById('vocabFilterLevel').value = '';
  if (document.getElementById('vocabFilterAudio')) document.getElementById('vocabFilterAudio').value = '';
  renderVocabTable(VOCAB_ITEMS);
  const badge = document.getElementById('vocabFilterResultBadge');
  if (badge) badge.innerText = `${VOCAB_ITEMS.length} từ`;
  showToast('Đã đặt lại bộ lọc từ vựng!', 'info');
}

function playAudioPreview(wordId, audioUrl) {
  const btn = document.getElementById(`audioBtn_${wordId}`);

  // Dừng audio cũ nếu đang phát
  if (activePlayingAudio) {
    activePlayingAudio.pause();
    document.querySelectorAll('.audio-play-btn').forEach(b => b.classList.remove('playing'));
  }

  if (btn) btn.classList.add('playing');

  // Thử phát bằng HTML5 Audio, nếu lỗi fallback sang SpeechSynthesis
  const audio = new Audio(audioUrl);
  activePlayingAudio = audio;

  audio.play().then(() => {
    audio.onended = () => {
      if (btn) btn.classList.remove('playing');
    };
  }).catch(() => {
    // Web Speech API fallback
    const wordObj = VOCAB_ITEMS.find(w => w.id === wordId);
    if ('speechSynthesis' in window && wordObj) {
      const utterance = new SpeechSynthesisUtterance(wordObj.word);
      utterance.lang = 'en-US';
      utterance.onend = () => {
        if (btn) btn.classList.remove('playing');
      };
      window.speechSynthesis.speak(utterance);
    } else {
      if (btn) btn.classList.remove('playing');
      showToast('Không thể phát tệp âm thanh.', 'error');
    }
  });
}

function openAddVocabModal() {
  document.getElementById('vocabModalTitle').innerHTML = '<i class="fa-solid fa-plus"></i> Thêm Từ Vựng Mới';
  document.getElementById('vocabForm').reset();
  document.getElementById('vocabFormId').value = '';
  if (document.getElementById('vocabInputSyllables')) document.getElementById('vocabInputSyllables').value = '';

  const modal = document.getElementById('vocabModal');
  if (modal) modal.classList.add('active');
}

function openEditVocabModal(id) {
  const item = VOCAB_ITEMS.find(v => v.id === id);
  if (!item) return;

  document.getElementById('vocabModalTitle').innerHTML = `<i class="fa-solid fa-pen"></i> Sửa Từ Vựng: ${item.word}`;
  document.getElementById('vocabFormId').value = item.id;
  document.getElementById('vocabInputWord').value = item.word;
  document.getElementById('vocabInputIpa').value = item.ipa;
  if (document.getElementById('vocabInputSyllables')) document.getElementById('vocabInputSyllables').value = item.syllables || '';
  document.getElementById('vocabInputPos').value = item.partOfSpeech;
  document.getElementById('vocabInputTopic').value = item.topic;
  document.getElementById('vocabInputMeaning').value = item.meaningVi;
  document.getElementById('vocabInputDef').value = item.definitionEn || '';
  document.getElementById('vocabInputExample').value = item.exampleSentence || '';
  document.getElementById('vocabInputDifficulty').value = item.difficulty;
  document.getElementById('vocabInputStatus').value = item.status;
  document.getElementById('vocabInputAudio').value = item.audioUrl || '';

  const modal = document.getElementById('vocabModal');
  if (modal) modal.classList.add('active');
}

function handleSaveVocab(e) {
  e.preventDefault();
  const id = document.getElementById('vocabFormId').value;
  const word = document.getElementById('vocabInputWord').value.trim();
  const topicId = document.getElementById('vocabInputTopic').value;
  const topicObj = VOCAB_TOPICS.find(t => t.id === topicId);

  const payload = {
    word: word,
    ipa: document.getElementById('vocabInputIpa').value.trim() || '/.../',
    syllables: document.getElementById('vocabInputSyllables')?.value.trim() || '',
    partOfSpeech: document.getElementById('vocabInputPos').value,
    topic: topicId,
    topicName: topicObj ? topicObj.nameEn : 'General',
    meaningVi: document.getElementById('vocabInputMeaning').value.trim(),
    definitionEn: document.getElementById('vocabInputDef').value.trim(),
    exampleSentence: document.getElementById('vocabInputExample').value.trim(),
    difficulty: document.getElementById('vocabInputDifficulty').value,
    status: document.getElementById('vocabInputStatus').value,
    audioUrl: document.getElementById('vocabInputAudio').value.trim() || `https://api.dictionaryapi.dev/media/pronunciations/en/${word.toLowerCase()}-us.mp3`
  };

  if (id) {
    // Update
    const idx = VOCAB_ITEMS.findIndex(v => v.id === id);
    if (idx !== -1) {
      VOCAB_ITEMS[idx] = { ...VOCAB_ITEMS[idx], ...payload };
      showToast(`Đã cập nhật từ vựng: ${word}!`, 'success');
    }
  } else {
    // Create new
    const newId = `voc-${String(VOCAB_ITEMS.length + 1).padStart(3, '0')}`;
    VOCAB_ITEMS.unshift({
      id: newId,
      ...payload,
      linkedExercises: [],
      timesReviewed: 0
    });
    showToast(`Đã thêm mới từ vựng: ${word}!`, 'success');
  }

  closeModal('vocabModal');
  renderVocabTable();
}

function toggleVocabStatus(id) {
  const item = VOCAB_ITEMS.find(v => v.id === id);
  if (!item) return;

  item.status = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
  renderVocabTable();
  showToast(`Đã chuyển trạng thái từ "${item.word}" sang: ${item.status}!`, 'info');
}

function viewLinkedExercises(wordId) {
  const item = VOCAB_ITEMS.find(v => v.id === wordId);
  if (!item) return;

  const linked = EXERCISE_ITEMS.filter(ex => item.linkedExercises?.includes(ex.id));
  const msg = linked.length > 0
    ? `Từ "${item.word}" đang xuất hiện trong ${linked.length} bài tập:\n` + linked.map(e => `• [${e.typeName}] ${e.title}`).join('\n')
    : `Từ "${item.word}" hiện chưa được liên kết trong bài tập nào.`;

  alert(msg);
}

function openImportVocabModal() {
  const input = prompt("Nhập từ vựng cần import (định dạng: Word,Meaning,Topic):", "Strategy,Chiến lược kinh doanh,top-business");
  if (!input) return;

  const parts = input.split(',');
  if (parts.length >= 2) {
    const word = parts[0].trim();
    const meaning = parts[1].trim();
    const topic = parts[2]?.trim() || 'top-business';

    // Duplicate check
    const dup = VOCAB_ITEMS.find(w => w.word.toLowerCase() === word.toLowerCase());
    if (dup) {
      alert(`CẢNH BÁO TRÙNG LẶP: Từ "${word}" đã tồn tại trong kho với ID ${dup.id}!`);
      return;
    }

    const newId = `voc-${String(VOCAB_ITEMS.length + 1).padStart(3, '0')}`;
    VOCAB_ITEMS.unshift({
      id: newId,
      word: word,
      ipa: `/${word.toLowerCase()}/`,
      syllables: word,
      partOfSpeech: 'noun',
      meaningVi: meaning,
      definitionEn: '',
      exampleSentence: '',
      topic: topic,
      topicName: 'Business',
      difficulty: 'Trung bình',
      audioUrl: `https://api.dictionaryapi.dev/media/pronunciations/en/${word.toLowerCase()}-us.mp3`,
      status: 'PUBLISHED',
      linkedExercises: [],
      timesReviewed: 0
    });

    renderVocabTable();
    showToast(`Đã import thành công từ "${word}"!`, 'success');
  }
}

function exportVocabCsv() {
  let csv = 'Word ID,Word,IPA,Syllables,Part of Speech,Meaning (VI),Definition (EN),Example Sentence,Topic,Difficulty,Status\n';
  VOCAB_ITEMS.forEach(v => {
    const defEn = (v.definitionEn || '').replace(/"/g, '""');
    const exSentence = (v.exampleSentence || '').replace(/"/g, '""');
    csv += `"${v.id}","${v.word}","${v.ipa}","${v.syllables || ''}","${v.partOfSpeech}","${v.meaningVi}","${defEn}","${exSentence}","${v.topic}","${v.difficulty}","${v.status}"\n`;
  });
  downloadFile('Linguapay_Vocabulary.csv', csv, 'text/csv;charset=utf-8;');
  showToast('Đã xuất kho từ vựng CSV!', 'success');
}

// ==========================================================================
// 7. MODULE 4: TOPIC MANAGEMENT LOGIC
// ==========================================================================
function renderTopicsGrid(topics = VOCAB_TOPICS) {
  const container = document.getElementById('topicsGridContainer');
  if (!container) return;

  container.innerHTML = topics.map(t => `
    <div class="topic-card-item">
      <div class="topic-card-thumb">
        <img src="${t.thumbnail}" alt="${t.nameVi}" loading="lazy">
        <span class="topic-badge-order">#${t.displayOrder}</span>
      </div>
      <div class="topic-card-body">
        <div class="topic-header-row">
          <span class="topic-title">${t.nameVi}</span>
          <span class="badge-status ${t.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}">${t.status}</span>
        </div>
        <div class="topic-subtitle">${t.nameEn} • <span style="color:#6366f1;">${t.difficulty}</span></div>
        <p class="topic-desc">${t.description}</p>
        <div class="topic-footer-meta">
          <span><i class="fa-solid fa-book"></i> <strong>${t.totalWords}</strong> từ vựng</span>
          <div style="display:flex;gap:6px;">
            <button type="button" class="btn-action-icon" title="Xem từ vựng trong topic" onclick="filterVocabByTopic('${t.id}')">
              <i class="fa-solid fa-list"></i>
            </button>
            <button type="button" class="btn-action-icon" title="Sửa chủ đề" onclick="openEditTopicModal('${t.id}')">
              <i class="fa-solid fa-pen"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  const countBadge = document.getElementById('topicCountBadge');
  if (countBadge) countBadge.innerText = `${topics.length} chủ đề`;
}

function filterTopicsGrid() {
  const q = (document.getElementById('topicSearchInput')?.value || '').toLowerCase().trim();
  const level = document.getElementById('topicFilterLevel')?.value || '';
  const wordCount = document.getElementById('topicFilterWordCount')?.value || '';
  const status = document.getElementById('topicFilterStatus')?.value || '';

  const filtered = VOCAB_TOPICS.filter(t => {
    const matchQ = t.nameVi.toLowerCase().includes(q) || t.nameEn.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q));
    const matchLevel = !level || (t.difficulty && t.difficulty.includes(level));
    let matchCount = true;
    if (wordCount === 'SMALL') matchCount = t.totalWords < 30;
    else if (wordCount === 'MEDIUM') matchCount = t.totalWords >= 30 && t.totalWords <= 50;
    else if (wordCount === 'LARGE') matchCount = t.totalWords > 50;
    const matchStatus = !status || t.status === status;
    return matchQ && matchLevel && matchCount && matchStatus;
  });

  renderTopicsGrid(filtered);
  const badge = document.getElementById('topicFilterResultBadge');
  if (badge) badge.innerText = `${filtered.length} chủ đề`;
}

function resetTopicFilters() {
  if (document.getElementById('topicSearchInput')) document.getElementById('topicSearchInput').value = '';
  if (document.getElementById('topicFilterLevel')) document.getElementById('topicFilterLevel').value = '';
  if (document.getElementById('topicFilterWordCount')) document.getElementById('topicFilterWordCount').value = '';
  if (document.getElementById('topicFilterStatus')) document.getElementById('topicFilterStatus').value = '';
  renderTopicsGrid(VOCAB_TOPICS);
  const badge = document.getElementById('topicFilterResultBadge');
  if (badge) badge.innerText = `${VOCAB_TOPICS.length} chủ đề`;
  showToast('Đã đặt lại bộ lọc chủ đề!', 'info');
}

function filterVocabByTopic(topicId) {
  switchAdminTab('vocab-list');
  const sel = document.getElementById('vocabFilterTopic');
  if (sel) {
    sel.value = topicId;
    filterVocabTable();
  }
}

function openAddTopicModal() {
  const nameVi = prompt("Nhập tên chủ đề tiếng Việt:");
  if (!nameVi) return;
  const nameEn = prompt("Nhập tên tiếng Anh:");

  const newTopic = {
    id: `top-${nameEn ? nameEn.toLowerCase().replace(/\s+/g, '-') : 'new'}`,
    nameEn: nameEn || nameVi,
    nameVi: nameVi,
    description: 'Bộ từ vựng mới bổ sung vào ứng dụng học tập.',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    totalWords: 0,
    difficulty: 'Trung bình (B1)',
    displayOrder: VOCAB_TOPICS.length + 1,
    status: 'ACTIVE'
  };

  VOCAB_TOPICS.push(newTopic);
  populateTopicDropdowns();
  renderTopicsGrid();
  showToast(`Đã tạo chủ đề mới: ${nameVi}!`, 'success');
}

function openEditTopicModal(topicId) {
  const topic = VOCAB_TOPICS.find(t => t.id === topicId);
  if (!topic) return;

  const newName = prompt(`Sửa tên tiếng Việt cho chủ đề "${topic.nameEn}":`, topic.nameVi);
  if (newName && newName !== topic.nameVi) {
    topic.nameVi = newName;
    renderTopicsGrid();
    populateTopicDropdowns();
    showToast('Đã cập nhật thông tin chủ đề!', 'success');
  }
}

// ==========================================================================
// 8. MODULE 5: EXERCISE MANAGEMENT LOGIC
// ==========================================================================
let currentExerciseTypeFilter = 'ALL';

function renderExercisesGrid(items = EXERCISE_ITEMS) {
  const container = document.getElementById('exercisesGridContainer');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#64748b;background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.6rem;margin-bottom:8px;display:block;"></i>Không tìm thấy bộ bài tập nào phù hợp với bộ lọc</div>`;
    return;
  }

  container.innerHTML = items.map(ex => `
    <div class="exercise-card">
      <div class="exercise-card-header">
        <div class="exercise-icon-box">
          <i class="fa-solid ${ex.typeIcon || 'fa-gamepad'}"></i>
        </div>
        <div style="flex:1;">
          <span class="exercise-type-tag">${ex.typeName}</span>
          <h4 style="font-size:0.95rem;margin:4px 0 2px;color:var(--text-primary);">${ex.title}</h4>
          <span style="font-size:0.75rem;color:var(--text-muted);">${ex.topicName} • ${ex.estimatedDuration}</span>
        </div>
      </div>

      <div class="exercise-stats-bar">
        <div class="stats-label-row">
          <span>Tỷ lệ hoàn thành: <strong>${ex.completionRate}%</strong></span>
          <span>Điểm TB: <strong>${ex.avgScore}/100</strong></span>
        </div>
        <div class="stats-progress-bg">
          <div class="stats-progress-fill" style="width:${ex.completionRate}%;"></div>
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid #f1f5f9;font-size:0.8rem;">
        <span><i class="fa-solid fa-list-ol"></i> ${ex.questionCount} câu hỏi</span>
        <button type="button" class="btn-action btn-purple" style="padding:6px 14px;font-size:0.78rem;" onclick="openExercisePreview('${ex.id}')">
          <i class="fa-solid fa-play"></i> Xem Trước &amp; Chơi Thử
        </button>
      </div>
    </div>
  `).join('');

  const countBadge = document.getElementById('exerciseCountBadge');
  if (countBadge) countBadge.innerText = `${items.length} bộ`;
}

function filterExerciseTab(typeKey, btn) {
  document.querySelectorAll('#viewExercises .module-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  currentExerciseTypeFilter = typeKey;
  filterExercisesGrid();
}

function filterExercisesGrid() {
  const q = (document.getElementById('exerciseSearchInput')?.value || '').toLowerCase().trim();
  const topic = document.getElementById('exerciseFilterTopic')?.value || '';
  const diff = document.getElementById('exerciseFilterDifficulty')?.value || '';

  const filtered = EXERCISE_ITEMS.filter(ex => {
    const matchType = currentExerciseTypeFilter === 'ALL' || ex.type === currentExerciseTypeFilter;
    const matchQ = ex.title.toLowerCase().includes(q) || ex.topicName.toLowerCase().includes(q);
    const matchTopic = !topic || ex.topicName.includes(topic);
    let matchDiff = true;
    if (diff === 'Dễ') matchDiff = ex.completionRate >= 80;
    else if (diff === 'Trung bình') matchDiff = ex.completionRate >= 65 && ex.completionRate < 80;
    else if (diff === 'Khó') matchDiff = ex.completionRate < 65;
    return matchType && matchQ && matchTopic && matchDiff;
  });

  renderExercisesGrid(filtered);
  const badge = document.getElementById('exerciseFilterResultBadge');
  if (badge) badge.innerText = `${filtered.length} bộ bài tập`;
}

function resetExerciseFilters() {
  if (document.getElementById('exerciseSearchInput')) document.getElementById('exerciseSearchInput').value = '';
  if (document.getElementById('exerciseFilterTopic')) document.getElementById('exerciseFilterTopic').value = '';
  if (document.getElementById('exerciseFilterDifficulty')) document.getElementById('exerciseFilterDifficulty').value = '';
  currentExerciseTypeFilter = 'ALL';
  const allTabBtn = document.querySelector('#viewExercises .module-tab-btn');
  if (allTabBtn) {
    document.querySelectorAll('#viewExercises .module-tab-btn').forEach(b => b.classList.remove('active'));
    allTabBtn.classList.add('active');
  }
  renderExercisesGrid(EXERCISE_ITEMS);
  const badge = document.getElementById('exerciseFilterResultBadge');
  if (badge) badge.innerText = `${EXERCISE_ITEMS.length} bộ bài tập`;
  showToast('Đã đặt lại bộ lọc bài tập!', 'info');
}

function openExercisePreview(exerciseId) {
  const ex = EXERCISE_ITEMS.find(e => e.id === exerciseId);
  if (!ex) return;

  const modal = document.getElementById('exercisePreviewModal');
  const titleEl = document.getElementById('exercisePreviewTitle');
  const bodyEl = document.getElementById('exercisePreviewBody');

  titleEl.innerHTML = `<i class="fa-solid ${ex.typeIcon}"></i> Xem Trước: ${ex.title}`;

  if (ex.type === 'WORD_MATCH') {
    // Game Ghép Thẻ Tương Tác
    bodyEl.innerHTML = `
      <div style="margin-bottom:14px;font-size:0.85rem;color:var(--text-muted);">
        Chạm chọn 1 thẻ tiếng Anh và 1 thẻ nghĩa tiếng Việt tương ứng để ghép cặp.
      </div>
      <div class="matching-pairs-grid" id="matchPairsGameGrid">
        ${ex.questions.map(q => `
          <div class="match-tile" data-val="${q.word}" onclick="handleMatchTileClick(this, '${q.word}', 'EN')">${q.word}</div>
          <div class="match-tile" data-val="${q.word}" onclick="handleMatchTileClick(this, '${q.word}', 'VI')">${q.match}</div>
        `).sort(() => Math.random() - 0.5).join('')}
      </div>
      <div style="margin-top:14px;text-align:center;font-size:0.85rem;" id="matchGameScore">
        Điểm số: <strong style="color:#10b981;">0</strong> / ${ex.questions.length * 10}
      </div>
    `;
    currentMatchingGame = { selected: null, score: 0, total: ex.questions.length };
  } else if (ex.type === 'PRONUNCIATION') {
    // Luyện Phát Âm
    bodyEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:14px;">
        ${ex.questions.map(q => `
          <div style="background:#f8fafc;padding:14px;border-radius:8px;border:1px solid #e2e8f0;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <strong style="font-size:1.1rem;color:#173d8f;">${q.word}</strong>
                <span style="font-family:var(--font-mono);color:#6366f1;margin-left:8px;">${q.ipa}</span>
              </div>
              <button type="button" class="btn-action btn-outline" onclick="playSampleAudio('${q.word}', '${q.audioSample}')">
                <i class="fa-solid fa-volume-high"></i> Nghe mẫu
              </button>
            </div>
            <p style="font-size:0.8rem;color:var(--text-muted);margin:6px 0;">Âm tiết: ${q.syllables} • ${q.tips}</p>
            <div style="display:flex;align-items:center;gap:10px;margin-top:10px;">
              <button type="button" class="btn-action btn-purple" style="font-size:0.8rem;" onclick="simulatePronounceCheck('${q.word}')">
                <i class="fa-solid fa-microphone"></i> Thử Thu Âm Giả Lập
              </button>
              <span id="scoreBadge_${q.word}" style="font-size:0.82rem;font-weight:700;"></span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (ex.type === 'DICTATION') {
    // Dictation Nghe & Viết
    bodyEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${ex.questions.map((q, idx) => `
          <div style="background:#f8fafc;padding:14px;border-radius:8px;border:1px solid #e2e8f0;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <span class="badge-status badge-info">Câu ${idx + 1}</span>
              <button type="button" class="btn-action btn-outline" onclick="playSampleAudio('sentence', '${q.audioUrl}')">
                <i class="fa-solid fa-play"></i> Nghe Audio Mẫu
              </button>
            </div>
            <input type="text" class="form-input" id="dictInput_${q.id}" placeholder="Gõ lại câu hoàn chỉnh bạn vừa nghe được...">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
              <button type="button" class="btn-action btn-primary" style="font-size:0.8rem;" onclick="checkDictationAnswer('${q.id}', '${q.correctText}')">
                Kiểm Tra Đáp Án
              </button>
              <span id="dictResult_${q.id}" style="font-size:0.85rem;font-weight:600;"></span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (ex.type === 'SENTENCE_ORDER') {
    // Sắp Xếp Câu
    bodyEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:14px;">
        ${ex.questions.map((q, idx) => `
          <div style="background:#f8fafc;padding:14px;border-radius:8px;border:1px solid #e2e8f0;">
            <span class="badge-status badge-warning" style="margin-bottom:8px;">Câu hỏi ${idx + 1}</span>
            <div class="sentence-word-bank" style="margin:10px 0;">
              ${q.scrambledWords.map(w => `
                <span class="match-tile" style="cursor:pointer;" onclick="appendWordToSentence('${q.id}', '${w}')">${w}</span>
              `).join('')}
            </div>
            <div style="background:#ffffff;border:1px dashed #cbd5e1;padding:10px;border-radius:6px;min-height:38px;font-size:0.9rem;" id="sentenceArea_${q.id}"></div>
            <div style="display:flex;justify-content:space-between;margin-top:10px;">
              <button type="button" class="btn-action btn-outline" style="font-size:0.78rem;" onclick="clearSentenceArea('${q.id}')">Làm lại</button>
              <button type="button" class="btn-action btn-primary" style="font-size:0.78rem;" onclick="checkSentenceOrder('${q.id}', '${q.correctSentence}')">Kiểm Tra</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (modal) modal.classList.add('active');
}

function handleMatchTileClick(tile, wordVal, lang) {
  if (tile.classList.contains('matched')) return;

  if (!currentMatchingGame.selected) {
    // Chọn thẻ thứ nhất
    document.querySelectorAll('.match-tile.selected').forEach(t => t.classList.remove('selected'));
    tile.classList.add('selected');
    currentMatchingGame.selected = { tile, wordVal, lang };
  } else {
    // Chọn thẻ thứ hai
    const prev = currentMatchingGame.selected;
    if (prev.tile === tile) {
      tile.classList.remove('selected');
      currentMatchingGame.selected = null;
      return;
    }

    if (prev.wordVal === wordVal && prev.lang !== lang) {
      // Ghép đúng!
      prev.tile.classList.remove('selected');
      prev.tile.classList.add('matched');
      tile.classList.add('matched');
      currentMatchingGame.score += 10;
      document.getElementById('matchGameScore').innerHTML = `Điểm số: <strong style="color:#10b981;">${currentMatchingGame.score}</strong>`;
      currentMatchingGame.selected = null;
    } else {
      // Ghép sai
      tile.classList.add('selected');
      setTimeout(() => {
        prev.tile.classList.remove('selected');
        tile.classList.remove('selected');
        currentMatchingGame.selected = null;
      }, 500);
    }
  }
}

function playSampleAudio(text, audioUrl) {
  const audio = new Audio(audioUrl);
  audio.play().catch(() => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  });
}

function simulatePronounceCheck(word) {
  const badge = document.getElementById(`scoreBadge_${word}`);
  if (badge) {
    badge.innerText = 'Đang phân tích âm tiết AI...';
    setTimeout(() => {
      const score = Math.floor(Math.random() * 15) + 85; // 85 - 99
      badge.innerHTML = `<span style="color:#10b981;"><i class="fa-solid fa-check"></i> Điểm AI: ${score}/100 (Xuất sắc)</span>`;
    }, 800);
  }
}

function checkDictationAnswer(id, correct) {
  const input = document.getElementById(`dictInput_${id}`)?.value.trim() || '';
  const result = document.getElementById(`dictResult_${id}`);
  if (!result) return;

  if (input.toLowerCase() === correct.toLowerCase()) {
    result.innerHTML = '<span style="color:#10b981;"><i class="fa-solid fa-circle-check"></i> Hoàn toàn chính xác! 100/100</span>';
  } else {
    result.innerHTML = `<span style="color:#ef4444;"><i class="fa-solid fa-circle-xmark"></i> Chưa đúng. Đáp án: "${correct}"</span>`;
  }
}

function appendWordToSentence(id, word) {
  const area = document.getElementById(`sentenceArea_${id}`);
  if (area) {
    const cur = area.innerText.trim();
    area.innerText = cur ? `${cur} ${word}` : word;
  }
}

function clearSentenceArea(id) {
  const area = document.getElementById(`sentenceArea_${id}`);
  if (area) area.innerText = '';
}

function checkSentenceOrder(id, correct) {
  const area = document.getElementById(`sentenceArea_${id}`);
  if (!area) return;
  const userText = area.innerText.trim();

  if (userText === correct) {
    showToast('Chính xác! Thứ tự câu hoàn hảo.', 'success');
  } else {
    showToast(`Chưa đúng! Đáp án chuẩn: "${correct}"`, 'error');
  }
}

function openCreateExerciseModal() {
  alert('Form tạo bộ câu hỏi Exercise mới sẽ mở ra để cấu hình danh sách Question, thời lượng và độ khó.');
}

// ==========================================================================
// 9. MODULE 6: CONTENT & MEDIA LOGIC
// ==========================================================================
function renderMediaLibrary(items = MEDIA_LIBRARY) {
  const container = document.getElementById('mediaGridContainer');
  if (!container) return;

  container.innerHTML = items.map(m => `
    <div class="media-card-item">
      <div class="media-thumb-box">
        ${m.type === 'IMAGE'
          ? `<img src="${m.url}" alt="${m.fileName}" loading="lazy">`
          : `<div class="media-audio-icon-wrap"><i class="fa-solid fa-music"></i></div>`
        }
        <span class="media-type-badge">${m.format}</span>
      </div>
      <div class="media-meta-box">
        <div class="media-filename" title="${m.fileName}">${m.fileName}</div>
        <div class="media-details">
          <span>${m.sizeFormatted}</span>
          <span>${m.duration || m.dimensions || ''}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
          <span class="media-safe-badge ${m.usageStatus === 'IN_USE' ? 'in-use' : 'unused'}">
            ${m.usageStatus === 'IN_USE' ? 'Đang dùng' : 'Chưa gán'}
          </span>
          <div style="display:flex;gap:4px;">
            <button type="button" class="btn-action-icon" title="Tra cứu liên kết sử dụng" onclick="viewMediaUsage('${m.id}')">
              <i class="fa-solid fa-link" style="color:#3b82f6;"></i>
            </button>
            <button type="button" class="btn-action-icon" title="Xóa tài nguyên an toàn" onclick="handleSafeDeleteMedia('${m.id}')">
              <i class="fa-solid fa-trash" style="color:${m.usageStatus === 'IN_USE' ? '#94a3b8' : '#ef4444'};"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  const countBadge = document.getElementById('mediaCountBadge');
  if (countBadge) countBadge.innerText = `${items.length} files`;
}

function filterMediaLibrary() {
  const keyword = (document.getElementById('mediaSearchInput')?.value || '').toLowerCase().trim();
  const typeFilter = document.getElementById('mediaFilterType')?.value || '';
  const usageFilter = document.getElementById('mediaFilterUsage')?.value || '';

  const filtered = MEDIA_LIBRARY.filter(m => {
    const matchKey = m.fileName.toLowerCase().includes(keyword) || (m.tags && m.tags.some(t => t.toLowerCase().includes(keyword)));
    const matchType = !typeFilter || m.type === typeFilter;
    const matchUsage = !usageFilter || m.usageStatus === usageFilter;
    return matchKey && matchType && matchUsage;
  });

  renderMediaLibrary(filtered);
  const badge = document.getElementById('mediaFilterCountBadge');
  if (badge) badge.innerText = `${filtered.length} tệp`;
}

function resetMediaFilters() {
  if (document.getElementById('mediaSearchInput')) document.getElementById('mediaSearchInput').value = '';
  if (document.getElementById('mediaFilterType')) document.getElementById('mediaFilterType').value = '';
  if (document.getElementById('mediaFilterUsage')) document.getElementById('mediaFilterUsage').value = '';
  renderMediaLibrary(MEDIA_LIBRARY);
  const badge = document.getElementById('mediaFilterCountBadge');
  if (badge) badge.innerText = `${MEDIA_LIBRARY.length} tệp`;
  showToast('Đã đặt lại bộ lọc thư viện media!', 'info');
}

function viewMediaUsage(mediaId) {
  const m = MEDIA_LIBRARY.find(item => item.id === mediaId);
  if (!m) return;

  if (m.references.length > 0) {
    const refs = m.references.map(r => `• [${r.type}] ${r.name} (${r.id})`).join('\n');
    alert(`Tài nguyên "${m.fileName}" đang được sử dụng ở:\n${refs}`);
  } else {
    alert(`Tài nguyên "${m.fileName}" hiện chưa được gán vào từ vựng hay bài tập nào. Có thể xóa an toàn.`);
  }
}

function handleSafeDeleteMedia(mediaId) {
  const m = MEDIA_LIBRARY.find(item => item.id === mediaId);
  if (!m) return;

  // QUY TẮC NGHIỆP VỤ BA: KHÔNG XÓA TÀI NGUYÊN ĐANG SỬ DỤNG
  if (m.references && m.references.length > 0) {
    alert(`KHÔNG THỂ XÓA!\nTài nguyên "${m.fileName}" đang được tham chiếu bởi ${m.references.length} đối tượng (Từ vựng/Bài tập). Hãy gỡ liên kết hoặc Thay thế (Replace) trước khi xóa.`);
    return;
  }

  if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tệp "${m.fileName}"?`)) {
    const idx = MEDIA_LIBRARY.findIndex(item => item.id === mediaId);
    if (idx !== -1) {
      MEDIA_LIBRARY.splice(idx, 1);
      renderMediaLibrary();
      showToast('Đã xóa tài nguyên an toàn!', 'success');
    }
  }
}

function openUploadMediaModal() {
  const fileName = prompt("Nhập tên tệp tải lên (Ví dụ: audio_lesson_01.mp3 hoặc banner.jpg):");
  if (!fileName) return;

  const isAudio = fileName.endsWith('.mp3') || fileName.endsWith('.wav');
  MEDIA_LIBRARY.unshift({
    id: `med-${Date.now().toString().slice(-3)}`,
    fileName: fileName,
    type: isAudio ? 'AUDIO' : 'IMAGE',
    format: fileName.split('.').pop().toUpperCase(),
    sizeBytes: 150000,
    sizeFormatted: '150 KB',
    dimensions: isAudio ? null : '1200 x 800',
    duration: isAudio ? '1.5s' : null,
    url: isAudio ? 'https://api.dictionaryapi.dev/media/pronunciations/en/revenue-us.mp3' : 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    uploadedAt: new Date().toISOString().substring(0, 10),
    uploadedBy: ADMIN_ACCOUNTS[0].fullName,
    usageStatus: 'UNUSED',
    references: []
  });

  renderMediaLibrary();
  showToast(`Đã tải lên tệp: ${fileName}!`, 'success');
}

// ==========================================================================
// 10. MODULE 7: AI CONFIGURATION LOGIC
// ==========================================================================
function toggleApiKeyMask() {
  const input = document.getElementById('aiApiKeyInput');
  const icon = document.getElementById('eyeIcon');
  if (input.type === 'password') {
    input.type = 'text';
    input.value = 'sk-proj-78kLm90xxxxxxxxxxxxxxxxxxxx38fA';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    input.value = 'sk-proj-78kLm90••••••••••••••••••••38fA';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

function handleSaveAiConfig(e) {
  e.preventDefault();
  const provider = document.getElementById('aiProviderSelect').value;
  const model = document.getElementById('aiModelSelect').value;

  AI_CONFIG.provider = provider;
  AI_CONFIG.model = model;

  AUDIT_LOGS.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actor: `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`,
    module: 'AI_CONFIG',
    action: 'UPDATE_MODEL_CONFIG',
    target: `${provider} / ${model}`,
    severity: 'INFO',
    status: 'SUCCESS',
    details: 'Cập nhật cấu hình mô hình AI sinh truyện học tập.'
  });

  renderAuditLogsTable();
  showToast(`Đã lưu cấu hình AI (${provider} - ${model}) thành công!`, 'success');
}

function runAiPlaygroundTest() {
  const topic = document.getElementById('playTopic')?.value || 'Business';
  const level = document.getElementById('playLevel')?.value || 'B1';
  const style = document.getElementById('playStyle')?.value || 'Hài hước';
  const words = document.getElementById('playWords')?.value || 'Revenue, Negotiate';

  const output = document.getElementById('aiPlaygroundOutput');
  const metrics = document.getElementById('aiPlaygroundMetrics');

  output.innerHTML = '<em><i class="fa-solid fa-spinner fa-spin"></i> Đang gọi OpenAI API để sinh câu chuyện tiếng Anh và bản dịch song ngữ...</em>';

  setTimeout(() => {
    output.innerHTML = `
      <p style="margin-bottom:8px;">
        Once upon a time in a bustling Silicon Valley office, two startup founders prepared to <strong>negotiate</strong> a crucial buyout.
        Their company's annual <strong>revenue</strong> had skyrocketed by 300%, leaving the investors astounded.
        To seal the deal, the CEO pulled out a freshly made batch of cookies and said: "Let's make a deal that brings everyone immense <strong>profit</strong>!"
      </p>
      <hr style="margin:10px 0;border:none;border-top:1px solid #e2e8f0;">
      <p style="color:#475569;font-size:0.85rem;font-style:italic;">
        <strong>Bản dịch:</strong> Ngày xửa ngày xưa tại một văn phòng nhộn nhịp ở Thung lũng Silicon, hai nhà sáng lập chuẩn bị <strong>thương lượng</strong> một thương vụ mua lại quan trọng.
        <strong>Doanh thu</strong> hàng năm của công ty họ đã tăng vọt 300%, khiến các nhà đầu tư kinh ngạc.
        Để chốt thỏa thuận, vị CEO mang ra một mẻ bánh quy mới nướng và mỉm cười: "Hãy tạo ra một thỏa thuận mang lại <strong>lợi nhuận</strong> to lớn cho tất cả chúng ta!"
      </p>
    `;

    if (metrics) metrics.style.display = 'flex';
    showToast('Tạo truyện AI thử nghiệm thành công!', 'success');
  }, 1000);
}

function renderAiExecutionLogsTable(logs = AI_EXECUTION_LOGS) {
  const tbody = document.getElementById('aiExecutionLogsTableBody');
  if (!tbody || typeof AI_EXECUTION_LOGS === 'undefined') return;

  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:32px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.4rem;margin-bottom:8px;display:block;"></i>Không tìm thấy nhật ký gọi AI phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = logs.map(l => `
    <tr>
      <td><span class="mono-code">${l.id}</span></td>
      <td><small style="color:var(--text-muted);">${l.timestamp}</small></td>
      <td>
        <span class="badge-status ${l.task === 'STORY_GEN' ? 'badge-purple' : l.task === 'PRONUNCIATION' ? 'badge-info' : 'badge-neutral'}">
          ${l.taskLabel}
        </span>
      </td>
      <td><strong>${l.model}</strong></td>
      <td><span class="mono-code">${l.userId}</span> <br><small style="color:var(--text-muted);">${l.sessionCode}</small></td>
      <td style="max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${l.promptSummary}">${l.promptSummary}</td>
      <td><span class="mono-code" style="font-weight:700;">${l.totalTokens.toLocaleString('vi-VN')}</span></td>
      <td><small>${l.latency}</small></td>
      <td><strong style="color:#059669;">${l.cost}</strong></td>
      <td>
        <span class="badge-status ${l.status === 'SUCCESS' ? 'badge-success' : l.status === 'RATE_LIMIT' ? 'badge-warning' : 'badge-danger'}">
          ${l.status === 'SUCCESS' ? '200 OK' : l.status === 'RATE_LIMIT' ? '429 RateLimit' : 'Timeout'}
        </span>
      </td>
    </tr>
  `).join('');
}

function filterAiLogs() {
  const q = (document.getElementById('aiLogSearchInput')?.value || '').toLowerCase().trim();
  const model = document.getElementById('aiLogFilterModel')?.value || '';
  const task = document.getElementById('aiLogFilterTask')?.value || '';
  const status = document.getElementById('aiLogFilterStatus')?.value || '';

  const filtered = AI_EXECUTION_LOGS.filter(l => {
    const matchQ = l.id.toLowerCase().includes(q) ||
      l.userId.toLowerCase().includes(q) ||
      l.promptSummary.toLowerCase().includes(q) ||
      l.sessionCode.toLowerCase().includes(q);
    const matchModel = !model || l.model.includes(model);
    const matchTask = !task || l.task === task;
    const matchStatus = !status || l.status === status;
    return matchQ && matchModel && matchTask && matchStatus;
  });

  renderAiExecutionLogsTable(filtered);
  const badge = document.getElementById('aiLogCountBadge');
  if (badge) badge.innerText = `${filtered.length} requests`;
}

function resetAiLogsFilter() {
  if (document.getElementById('aiLogSearchInput')) document.getElementById('aiLogSearchInput').value = '';
  if (document.getElementById('aiLogFilterModel')) document.getElementById('aiLogFilterModel').value = '';
  if (document.getElementById('aiLogFilterTask')) document.getElementById('aiLogFilterTask').value = '';
  if (document.getElementById('aiLogFilterStatus')) document.getElementById('aiLogFilterStatus').value = '';
  renderAiExecutionLogsTable(AI_EXECUTION_LOGS);
  const badge = document.getElementById('aiLogCountBadge');
  if (badge) badge.innerText = `${AI_EXECUTION_LOGS.length} requests`;
  showToast('Đã đặt lại bộ lọc nhật ký AI!', 'info');
}

function exportAiLogsCsv() {
  let csv = 'Request ID,Timestamp,Task,Model,User ID,Session Code,Prompt Summary,Tokens,Latency,Cost,Status\n';
  AI_EXECUTION_LOGS.forEach(l => {
    csv += `"${l.id}","${l.timestamp}","${l.taskLabel}","${l.model}","${l.userId}","${l.sessionCode}","${l.promptSummary.replace(/"/g, '""')}",${l.totalTokens},"${l.latency}","${l.cost}","${l.status}"\n`;
  });
  downloadFile('LinguaPay_AI_Logs.csv', csv, 'text/csv;charset=utf-8;');
  showToast('Đã xuất file nhật ký AI CSV!', 'success');
}

// ==========================================================================
// 11. MODULE 8: LEARNING ANALYTICS LOGIC
// ==========================================================================
function initDauChart() {
  const chartEl = document.getElementById('apexDauChart');
  if (!chartEl) return;

  const options = {
    series: LEARNING_ANALYTICS_DATA.dauTrendSeries,
    chart: {
      type: 'area',
      height: 300,
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false }
    },
    colors: ['#06b6d4', '#10b981'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: LEARNING_ANALYTICS_DATA.dates7Days },
    legend: { position: 'top' },
    grid: { borderColor: '#f1f5f9' }
  };

  adminDauChart = new ApexCharts(chartEl, options);
  adminDauChart.render();
}

function exportAnalyticsReport() {
  const content = `BÁO CÁO LEARNING ANALYTICS (T10/2026)\n` +
    `- DAU: ${LEARNING_ANALYTICS_DATA.kpis.dau}\n` +
    `- WAU: ${LEARNING_ANALYTICS_DATA.kpis.wau}\n` +
    `- MAU: ${LEARNING_ANALYTICS_DATA.kpis.mau}\n` +
    `- Thời lượng phiên TB: ${LEARNING_ANALYTICS_DATA.kpis.avgSessionMinutes} phút\n` +
    `- Tỷ lệ hoàn thành: ${LEARNING_ANALYTICS_DATA.kpis.completionRate}\n` +
    `- Cohort D30 Retention TB: 32%\n`;

  downloadFile('Learning_Analytics_Report.txt', content, 'text/plain');
  showToast('Đã xuất báo cáo phân tích học tập!', 'success');
}

function applyAnalyticsFilter() {
  const period = document.getElementById('analyticsFilterTime')?.value || '7days';
  const segment = document.getElementById('analyticsFilterSegment')?.value || '';
  const topic = document.getElementById('analyticsFilterTopic')?.value || '';

  showToast(`Đã áp dụng bộ lọc phân tích: Kỳ ${period} | Phân khúc: ${segment || 'Tất cả'} | Khóa: ${topic || 'Tất cả'}`, 'success');
}

function resetAnalyticsFilter() {
  if (document.getElementById('analyticsFilterTime')) document.getElementById('analyticsFilterTime').value = '7days';
  if (document.getElementById('analyticsFilterSegment')) document.getElementById('analyticsFilterSegment').value = '';
  if (document.getElementById('analyticsFilterTopic')) document.getElementById('analyticsFilterTopic').value = '';
  showToast('Đã đặt lại bộ lọc phân tích học tập!', 'info');
}

// ==========================================================================
// 12. MODULE 9: ADMIN & RBAC LOGIC
// ==========================================================================
function renderAdminAccountsTable() {
  const tbody = document.getElementById('adminAccountsTableBody');
  if (!tbody) return;

  tbody.innerHTML = ADMIN_ACCOUNTS.map(adm => {
    const roleObj = RBAC_ROLES[adm.roleId] || {};
    return `
      <tr>
        <td><span class="mono-code">${adm.id}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:32px;height:32px;border-radius:50%;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:#475569;">
              ${adm.avatar || 'AD'}
            </div>
            <strong>${adm.fullName}</strong>
          </div>
        </td>
        <td>${adm.email}</td>
        <td><span class="badge-status" style="background:${roleObj.color}20;color:${roleObj.color};">${roleObj.name || adm.roleId}</span></td>
        <td><span class="badge-status badge-success">Hoạt động</span></td>
        <td style="font-size:0.75rem;color:var(--text-muted);">${adm.lastLogin}</td>
        <td style="text-align:right;">
          <button type="button" class="btn-action-icon" title="Đổi vai trò quản trị" onclick="changeAdminRole('${adm.id}')">
            <i class="fa-solid fa-user-pen"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderRbacMatrixTable() {
  const table = document.getElementById('rbacMatrixTable');
  if (!table) return;

  const roleKeys = Object.keys(RBAC_ROLES);

  let html = `
    <thead>
      <tr>
        <th>Phân Hệ &amp; Hành Động</th>
        ${roleKeys.map(rk => `<th>${RBAC_ROLES[rk].name}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
  `;

  SYSTEM_PERMISSIONS_TREE.forEach(mod => {
    html += `
      <tr style="background:#f8fafc;font-weight:700;">
        <td colspan="${roleKeys.length + 1}" style="text-align:left;color:#173d8f;">${mod.moduleName}</td>
      </tr>
    `;

    mod.actions.forEach(act => {
      html += `
        <tr>
          <td style="text-align:left;padding-left:24px;">• ${act.name} (<span style="color:#94a3b8;font-family:var(--font-mono);">${act.key}</span>)</td>
          ${roleKeys.map(rk => {
            const hasPerm = RBAC_ROLES[rk].permissions[mod.moduleKey]?.[act.key] ?? false;
            return `
              <td>
                <input type="checkbox" class="tree-checkbox" ${hasPerm ? 'checked' : ''} ${rk === 'super_admin' ? 'disabled' : ''} onchange="toggleRbacCell('${rk}', '${mod.moduleKey}', '${act.key}', this.checked)">
              </td>
            `;
          }).join('')}
        </tr>
      `;
    });
  });

  html += '</tbody>';
  table.innerHTML = html;
}

function toggleRbacCell(roleKey, modKey, actKey, isChecked) {
  if (roleKey === 'super_admin') return;
  if (!RBAC_ROLES[roleKey].permissions[modKey]) {
    RBAC_ROLES[roleKey].permissions[modKey] = {};
  }
  RBAC_ROLES[roleKey].permissions[modKey][actKey] = isChecked;
}

function saveRbacMatrixState() {
  AUDIT_LOGS.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actor: `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`,
    module: 'ADMIN_RBAC',
    action: 'UPDATE_RBAC_MATRIX',
    target: 'Toàn bộ ma trận quyền',
    severity: 'WARNING',
    status: 'SUCCESS',
    details: 'Cập nhật phân quyền chi tiết cho các vai trò quản trị.'
  });

  renderAuditLogsTable();
  applyRolePermissions(currentRole);
  showToast('Đã lưu và áp dụng ma trận phân quyền mới!', 'success');
}

function changeAdminRole(admId) {
  const adm = ADMIN_ACCOUNTS.find(a => a.id === admId);
  if (!adm) return;

  if (adm.isSoleOwner) {
    alert('Tài khoản Super Admin tối cao không thể thay đổi vai trò.');
    return;
  }

  const newRole = prompt(`Chọn vai trò mới cho ${adm.fullName}:\n(content_manager, support, finance, analyst, ai_manager):`, adm.roleId);
  if (newRole && RBAC_ROLES[newRole]) {
    adm.roleId = newRole;
    renderAdminAccountsTable();
    showToast(`Đã đổi vai trò của ${adm.fullName} thành: ${RBAC_ROLES[newRole].name}`, 'success');
  }
}

function openCreateAdminModal() {
  const name = prompt("Họ và tên Quản trị viên mới:");
  if (!name) return;
  const email = prompt("Email quản trị:");

  ADMIN_ACCOUNTS.push({
    id: `ADM-00${ADMIN_ACCOUNTS.length + 1}`,
    fullName: name,
    email: email || 'admin@linguapay.edu.vn',
    roleId: 'content_manager',
    status: 'ACTIVE',
    lastLogin: 'Chưa đăng nhập',
    isSoleOwner: false,
    avatar: name.substring(0, 2).toUpperCase()
  });

  renderAdminAccountsTable();
  showToast(`Đã tạo tài khoản quản trị mới: ${name}!`, 'success');
}

function openRbacMatrixFull() {
  switchAdminTab('admin-rbac');
  document.getElementById('rbacMatrixTable')?.scrollIntoView({ behavior: 'smooth' });
}

function openRbacModal() {
  openRbacMatrixFull();
}

// ==========================================================================
// 12B. PHÂN HỆ QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN 3 MÀN HÌNH CHÍNH (CHUẨN SRS)
// Screen 1: Quản lý nhóm quyền (4 nhóm, Popup 2 tabs)
// Screen 2: Người dùng hệ thống (Phân cấp trên - dưới, Modal 4 tabs)
// Screen 3: Khách hàng học viên (App Learners, Modal 5 tabs)
// ==========================================================================

// --------------------------------------------------------------------------
// SCREEN 1: QUẢN LÝ NHÓM QUYỀN (PERMISSION GROUPS MANAGEMENT)
// --------------------------------------------------------------------------
let activeDetailGroupId = 'MANAGER';

function renderPermissionGroupsTable(groups = PERMISSION_GROUPS) {
  const tbody = document.getElementById('permissionGroupsTableBody');
  if (!tbody || typeof PERMISSION_GROUPS === 'undefined') return;

  if (groups.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:32px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.4rem;margin-bottom:8px;display:block;"></i>Không tìm thấy nhóm quyền phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = groups.map(g => {
    return `
      <tr>
        <td><span class="mono-code">${g.code}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:8px;">
            <i class="fa-solid ${g.code === 'SUPER_ADMIN' ? 'fa-crown text-emerald' : g.code === 'ADMIN' ? 'fa-user-shield text-primary' : g.code === 'MANAGER' ? 'fa-user-tie' : 'fa-headset'}" style="color:${g.code === 'SUPER_ADMIN' ? '#10b981' : g.code === 'ADMIN' ? '#2563eb' : g.code === 'MANAGER' ? '#8b5cf6' : '#f59e0b'};"></i>
            <strong>${g.name}</strong>
          </div>
        </td>
        <td>
          <span class="badge-status ${g.isImmutable ? 'badge-success' : 'badge-neutral'}">
            ${g.typeName}
          </span>
        </td>
        <td><span class="mono-code" style="font-weight:700;">${g.memberCount} tài khoản</span></td>
        <td><span style="color:#2563eb;font-weight:700;">${g.permCount} quyền</span></td>
        <td><span class="badge-status badge-success">${g.statusName}</span></td>
        <td>${g.updatedBy}</td>
        <td><small style="color:var(--text-muted);">${g.updatedAt}</small></td>
        <td style="text-align:right;">
          <div style="display:flex;justify-content:flex-end;gap:6px;">
            <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;" onclick="openGroupDetailModal('${g.id}', 'members')" title="Xem chi tiết nhóm">
              <i class="fa-solid fa-folder-open"></i> Chi Tiết
            </button>
            <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;" onclick="openGroupDetailModal('${g.id}', 'permissions')" title="Chỉnh sửa checkbox quyền nhóm">
              <i class="fa-solid fa-pen"></i> Sửa
            </button>
            ${g.isImmutable ? `
              <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;opacity:0.4;cursor:not-allowed;" title="Nhóm Super Admin cố định - Không thể vô hiệu hóa" disabled>
                <i class="fa-solid fa-ban"></i> Khóa
              </button>
            ` : `
              <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;" onclick="disablePermissionGroup('${g.id}')" title="Vô hiệu hóa nhóm">
                <i class="fa-solid fa-ban"></i> Khóa
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterPermissionGroupsTable() {
  const q = document.getElementById('groupSearchInput')?.value.toLowerCase().trim() || '';
  const type = document.getElementById('groupFilterType')?.value || '';
  const status = document.getElementById('groupFilterStatus')?.value || '';

  const filtered = PERMISSION_GROUPS.filter(g => {
    const matchQ = g.name.toLowerCase().includes(q) || g.code.toLowerCase().includes(q) || (g.desc && g.desc.toLowerCase().includes(q));
    const matchType = !type || (type === 'SYSTEM' ? (g.isImmutable || g.type === 'SYSTEM') : g.type === 'CUSTOM');
    const matchStatus = !status || g.status === status;
    return matchQ && matchType && matchStatus;
  });

  renderPermissionGroupsTable(filtered);
  const badge = document.getElementById('groupFilterCountBadge');
  if (badge) badge.innerText = `${filtered.length} nhóm`;
}

function resetPermissionGroupFilters() {
  if (document.getElementById('groupSearchInput')) document.getElementById('groupSearchInput').value = '';
  if (document.getElementById('groupFilterType')) document.getElementById('groupFilterType').value = '';
  if (document.getElementById('groupFilterStatus')) document.getElementById('groupFilterStatus').value = '';
  renderPermissionGroupsTable(PERMISSION_GROUPS);
  const badge = document.getElementById('groupFilterCountBadge');
  if (badge) badge.innerText = `${PERMISSION_GROUPS.length} nhóm`;
  showToast('Đã đặt lại bộ lọc nhóm quyền!', 'info');
}

function openGroupDetailModal(groupId, targetTab = "members") {
  activeDetailGroupId = groupId;
  const group = PERMISSION_GROUPS.find(g => g.id === groupId) || PERMISSION_GROUPS[0];
  if (!group) return;

  const titleElem = document.getElementById('groupDetailName');
  const codeElem = document.getElementById('groupDetailCode');
  const fixedBadge = document.getElementById('groupDetailFixedBadge');
  const memberBadge = document.getElementById('groupMemberCountBadge');
  const permBadge = document.getElementById('groupPermCountBadge');
  const scopeSelect = document.getElementById('groupDataScopeSelect');
  const immutableNotice = document.getElementById('groupImmutableNotice');
  const addBtn = document.getElementById('btnAddMemberToGroupBtn');

  if (titleElem) titleElem.textContent = group.name;
  if (codeElem) codeElem.textContent = group.code;
  if (fixedBadge) fixedBadge.style.display = group.isImmutable ? 'inline-block' : 'none';
  if (memberBadge) memberBadge.textContent = group.memberCount;
  if (permBadge) permBadge.textContent = group.permCount;
  if (scopeSelect) scopeSelect.value = group.dataScope || 'ALL';
  if (immutableNotice) immutableNotice.style.display = group.isImmutable ? 'flex' : 'none';
  if (addBtn) addBtn.style.display = (group.isImmutable && group.memberCount >= (group.maxMembers || 1)) ? 'none' : 'inline-flex';

  renderGroupMembersTable(groupId);
  renderGroupPermissionsTree(groupId);

  switchGroupModalTab(targetTab);
  openModal('modalGroupDetail');
}

function switchGroupModalTab(tabKey) {
  const btnMembers = document.getElementById('btnGroupTabMembers');
  const btnPerms = document.getElementById('btnGroupTabPermissions');
  const paneMembers = document.getElementById('groupPaneMembers');
  const panePerms = document.getElementById('groupPanePermissions');

  if (tabKey === 'members') {
    btnMembers?.classList.add('active');
    btnPerms?.classList.remove('active');
    paneMembers?.classList.add('active');
    panePerms?.classList.remove('active');
  } else {
    btnMembers?.classList.remove('active');
    btnPerms?.classList.add('active');
    paneMembers?.classList.remove('active');
    panePerms?.classList.add('active');
  }
}

function renderGroupMembersTable(groupId) {
  const tbody = document.getElementById('groupMembersTableBody');
  if (!tbody || typeof SYSTEM_USERS === 'undefined') return;

  const members = SYSTEM_USERS.filter(u => u.groupId === groupId);
  if (members.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:24px;">Chưa có thành viên nào thuộc nhóm này. Bấm "Thêm Người Vào Nhóm" để gán.</td></tr>`;
    return;
  }

  tbody.innerHTML = members.map(m => {
    return `
      <tr>
        <td><span class="mono-code">${m.id}</span></td>
        <td><strong>${m.fullName}</strong></td>
        <td>${m.email} <br><small style="color:var(--text-muted);">@${m.username}</small></td>
        <td><span class="badge-status badge-info">${m.roleLabel}</span></td>
        <td><span class="badge-status badge-neutral">${m.groupName}</span></td>
        <td><span class="badge-status ${m.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}">${m.statusLabel}</span></td>
        <td><small>${m.joinedGroupAt || '01/01/2026'}</small></td>
        <td><small>${m.addedBy || 'Quản trị viên'}</small></td>
        <td style="text-align:right;">
          <div style="display:flex;justify-content:flex-end;gap:4px;">
            <button type="button" class="btn-action btn-outline" style="padding:3px 7px;font-size:0.72rem;" onclick="closeModal('modalGroupDetail'); openSystemUserDetailModal('${m.id}')" title="Xem tài khoản">
              <i class="fa-solid fa-id-card"></i> Xem TK
            </button>
            ${!m.isSuperAdmin ? `
              <button type="button" class="btn-action btn-outline" style="padding:3px 7px;font-size:0.72rem;" onclick="transferGroupMember('${m.id}')" title="Chuyển nhóm">
                <i class="fa-solid fa-arrows-split-up-and-left"></i> Chuyển
              </button>
              <button type="button" class="btn-action btn-outline" style="padding:3px 7px;font-size:0.72rem;color:#ef4444;" onclick="removeMemberFromGroup('${m.id}')" title="Gỡ khỏi nhóm">
                <i class="fa-solid fa-user-minus"></i> Gỡ
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderGroupPermissionsTree(groupId) {
  const container = document.getElementById('groupPermTreeContainer');
  if (!container || typeof SYSTEM_PERMISSIONS_TREE === 'undefined') return;

  const group = PERMISSION_GROUPS.find(g => g.id === groupId) || PERMISSION_GROUPS[0];
  const isSuper = group.isImmutable;

  container.innerHTML = SYSTEM_PERMISSIONS_TREE.map(mod => {
    return `
      <div class="perm-module-card">
        <div class="perm-module-header">
          <div class="perm-module-title">
            <i class="fa-solid fa-cube" style="color:#173d8f;"></i> ${mod.moduleName}
          </div>
          <label style="font-size:0.76rem;color:var(--text-muted);display:flex;align-items:center;gap:4px;cursor:pointer;">
            <input type="checkbox" ${isSuper ? 'checked disabled' : ''} onchange="toggleModuleAllPerms(this, '${mod.moduleKey}')"> Chọn tất cả
          </label>
        </div>
        <div class="perm-actions-row" id="permActions_${mod.moduleKey}">
          ${mod.actions.map(act => {
            const isChecked = isSuper || (group.permissions && group.permissions[mod.moduleKey]?.includes(act.key));
            return `
              <label class="perm-checkbox-label">
                <input type="checkbox" name="perm_${mod.moduleKey}" value="${act.key}" ${isChecked ? 'checked' : ''} ${isSuper ? 'disabled' : ''}>
                <span>${act.name}</span>
                <small style="color:var(--text-muted);font-family:var(--font-mono);">(${act.key})</small>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function toggleModuleAllPerms(masterCheckbox, moduleKey) {
  const checkboxes = document.querySelectorAll(`input[name="perm_${moduleKey}"]`);
  checkboxes.forEach(cb => {
    if (!cb.disabled) cb.checked = masterCheckbox.checked;
  });
}

function saveGroupPermissionsChanges() {
  const group = PERMISSION_GROUPS.find(g => g.id === activeDetailGroupId);
  if (!group) return;

  if (group.isImmutable) {
    showToast('Nhóm Super Admin cố định: Toàn quyền hệ thống được bảo lưu tự động!', 'info');
    closeModal('modalGroupDetail');
    return;
  }

  // Hierarchy check: Chỉ Super Admin hoặc Admin mới được cấu hình nhóm quyền
  const actorLevel = ROLE_HIERARCHY_LEVELS[currentRole] || 1;
  if (actorLevel < 3) {
    alert('Từ chối: Chỉ Super Admin hoặc Admin mới có quyền điều chỉnh phân quyền nhóm!');
    return;
  }

  const scopeSelect = document.getElementById('groupDataScopeSelect');
  if (scopeSelect) {
    group.dataScope = scopeSelect.value;
    const scopeNames = {
      'ALL': 'Toàn hệ thống (Toàn bộ 12 module)',
      'BRANCH': 'Phân nhánh & chi nhánh được giao',
      'TEAM': 'Cây nhóm / Đội ngũ phụ trách',
      'PERSONAL': 'Chỉ dữ liệu cá nhân'
    };
    group.dataScopeName = scopeNames[group.dataScope] || group.dataScope;
  }

  // Thu thập quyền từ cây ma trận 12 module
  const newPerms = {};
  let totalCount = 0;
  SYSTEM_PERMISSIONS_TREE.forEach(mod => {
    const checked = Array.from(document.querySelectorAll(`input[name="perm_${mod.moduleKey}"]:checked`)).map(cb => cb.value);
    newPerms[mod.moduleKey] = checked;
    totalCount += checked.length;
  });

  group.permissions = newPerms;
  group.permCount = totalCount;
  group.updatedBy = `${currentRole.toUpperCase()}`;
  group.updatedAt = new Date().toLocaleString('vi-VN');

  renderPermissionGroupsTable();
  showToast(`Đã lưu cấu hình nhóm "${group.name}" (${totalCount} quyền cấp)!`, 'success');
  closeModal('modalGroupDetail');
}

function openAddMemberToGroupModal() {
  const group = PERMISSION_GROUPS.find(g => g.id === activeDetailGroupId);
  if (!group) return;

  if (group.isImmutable && group.memberCount >= (group.maxMembers || 1)) {
    alert('Quy tắc bảo mật: Nhóm Super Admin chỉ cho phép duy nhất 1 tài khoản! Không được tạo thêm tài khoản Super Admin thứ 2.');
    return;
  }

  document.getElementById('addMemberTargetGroupName').value = `${group.name} (${group.code})`;
  const select = document.getElementById('addMemberUserSelect');
  if (select) {
    const availableUsers = SYSTEM_USERS.filter(u => u.groupId !== activeDetailGroupId);
    select.innerHTML = availableUsers.map(u => `<option value="${u.id}">${u.fullName} (${u.id} - ${u.roleLabel} - Hiện ở: ${u.groupName})</option>`).join('');
  }

  openModal('modalAddMemberToGroup');
}

function submitAddMemberToGroup() {
  const select = document.getElementById('addMemberUserSelect');
  const userId = select?.value;
  const reason = document.getElementById('addMemberReason')?.value || 'Phân công nhân sự';

  const user = SYSTEM_USERS.find(u => u.id === userId);
  const targetGroup = PERMISSION_GROUPS.find(g => g.id === activeDetailGroupId);
  if (!user || !targetGroup) return;

  const oldGroup = user.groupName;
  user.groupId = targetGroup.id;
  user.groupName = targetGroup.name;
  user.joinedGroupAt = new Date().toLocaleDateString('vi-VN');
  user.addedBy = 'Super Admin';

  user.auditHistory.unshift({
    date: new Date().toLocaleString('vi-VN'),
    actor: 'Super Admin',
    action: `Chuyển nhóm từ "${oldGroup}" sang "${targetGroup.name}"`,
    reason: reason
  });

  PERMISSION_GROUPS.forEach(g => {
    g.memberCount = SYSTEM_USERS.filter(u => u.groupId === g.id).length;
  });

  renderPermissionGroupsTable();
  renderGroupMembersTable(activeDetailGroupId);
  closeModal('modalAddMemberToGroup');
  showToast(`Đã thêm ${user.fullName} vào nhóm ${targetGroup.name}!`, 'success');
}

function removeMemberFromGroup(userId) {
  const user = SYSTEM_USERS.find(u => u.id === userId);
  if (!user) return;
  if (user.isSuperAdmin) {
    alert('Không thể gỡ tài khoản Super Admin duy nhất khỏi nhóm Super Admin!');
    return;
  }

  if (confirm(`Bạn có chắc chắn muốn gỡ tài khoản ${user.fullName} khỏi nhóm này? Tài khoản sẽ chuyển về nhóm mặc định Nhân viên.`)) {
    user.groupId = 'STAFF_SALE';
    user.groupName = 'Nhân viên & Sale';
    user.auditHistory.unshift({
      date: new Date().toLocaleString('vi-VN'),
      actor: 'Super Admin',
      action: `Gỡ khỏi nhóm quyền và chuyển về Nhân viên & Sale`,
      reason: 'Gỡ thành viên theo yêu cầu quản trị'
    });

    PERMISSION_GROUPS.forEach(g => {
      g.memberCount = SYSTEM_USERS.filter(u => u.groupId === g.id).length;
    });

    renderPermissionGroupsTable();
    renderGroupMembersTable(activeDetailGroupId);
    showToast(`Đã gỡ ${user.fullName} khỏi nhóm!`, 'info');
  }
}

function transferGroupMember(userId) {
  openAddMemberToGroupModal();
}

function editPermissionGroup(groupId) {
  openGroupDetailModal(groupId, 'permissions');
}

function disablePermissionGroup(groupId) {
  const group = PERMISSION_GROUPS.find(g => g.id === groupId);
  if (!group) return;
  if (group.isImmutable) {
    alert('Không thể vô hiệu hóa nhóm Super Admin cố định!');
    return;
  }
  if (group.memberCount > 0) {
    alert(`Nhóm "${group.name}" hiện đang có ${group.memberCount} thành viên! Phải chuyển hoặc gỡ hết thành viên trước khi vô hiệu hóa nhóm.`);
    return;
  }
  showToast(`Đã vô hiệu hóa nhóm: ${group.name}`, 'warning');
}

function openCreateGroupModal() {
  const name = prompt("Nhập tên nhóm quyền mới muốn tạo:");
  if (!name) return;
  const code = name.toUpperCase().replace(/\s+/g, '_');
  PERMISSION_GROUPS.push({
    id: code,
    code: code,
    name: name,
    type: 'CUSTOM',
    typeName: 'Nhóm tùy chỉnh',
    description: `Nhóm phân quyền mở rộng: ${name}`,
    status: 'ACTIVE',
    statusName: 'Đang hoạt động',
    memberCount: 0,
    permCount: 10,
    isImmutable: false,
    allowDelete: true,
    updatedBy: 'Super Admin',
    updatedAt: new Date().toLocaleString('vi-VN'),
    dataScope: 'TEAM',
    permissions: {}
  });
  renderPermissionGroupsTable();
  showToast(`Đã tạo thành công nhóm mới: ${name}!`, 'success');
}

function openPermAuditModal() {
  switchAdminTab('settings-logs');
  switchSettingsSubtab('audit');
}

// --------------------------------------------------------------------------
// SCREEN 2: NGƯỜI DÙNG HỆ THỐNG (SYSTEM USERS / WEB ADMIN ACCOUNTS)
// --------------------------------------------------------------------------
let activeSystemUserId = 'SA-001';

const ROLE_HIERARCHY_LEVELS = {
  'super_admin': 4,
  'admin': 3,
  'manager': 2,
  'staff_sale': 1
};

function canManageUser(actorRole, targetUser) {
  if (actorRole === 'super_admin') return true;
  const actorLevel = ROLE_HIERARCHY_LEVELS[actorRole] || 0;
  const targetLevel = targetUser.roleLevel || (ROLE_HIERARCHY_LEVELS[targetUser.role] || 0);
  return actorLevel > targetLevel;
}

function renderSystemUsersTable(users = SYSTEM_USERS) {
  const tbody = document.getElementById('systemUsersTableBody');
  if (!tbody || typeof SYSTEM_USERS === 'undefined') return;

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:36px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.5rem;margin-bottom:8px;display:block;"></i>Không tìm thấy tài khoản quản trị nào phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => {
    const isManageable = canManageUser(currentRole, u);
    return `
      <tr style="${!isManageable && currentRole !== 'super_admin' ? 'background:#fafbfc;' : 'cursor:pointer;'}">
        <td><span class="mono-code">${u.id}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:32px;height:32px;border-radius:50%;background:#173d8f15;color:#173d8f;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;">
              ${u.fullName.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div>
              <strong>${u.fullName}</strong>
              ${u.isSuperAdmin ? `<span class="perm-group-badge-fixed" style="margin-left:4px;font-size:0.65rem;">Super Admin</span>` : ''}
              ${!isManageable && currentRole !== 'super_admin' ? `<span style="font-size:0.68rem;color:#94a3b8;margin-left:4px;" title="Cùng cấp hoặc cấp trên - Không thể chỉnh sửa"><i class="fa-solid fa-shield-halved"></i></span>` : ''}
            </div>
          </div>
        </td>
        <td>${u.email} <br><small style="color:var(--text-muted);">@${u.username}</small></td>
        <td><span class="badge-status ${u.role === 'super_admin' ? 'badge-success' : u.role === 'admin' ? 'badge-info' : u.role === 'manager' ? 'badge-purple' : 'badge-warning'}">${u.roleLabel}</span></td>
        <td><span class="badge-status badge-neutral">${u.groupName}</span></td>
        <td>
          <span class="manager-breadcrumb-tag">
            <i class="fa-solid fa-arrow-turn-up"></i> ${u.managerName || 'Root'}
          </span>
        </td>
        <td><span class="badge-status ${u.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}">${u.statusLabel}</span></td>
        <td><small style="color:var(--text-muted);">${u.lastLogin}</small></td>
        <td><small>${u.createdAt}</small></td>
        <td style="text-align:right;">
          <div style="display:flex;justify-content:flex-end;gap:4px;">
            <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;" onclick="openSystemUserDetailModal('${u.id}', 'perms')" title="Xem & chọn checkbox quyền">
              <i class="fa-solid fa-id-card"></i> Chi Tiết
            </button>
            ${isManageable ? `
              <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;" onclick="triggerEditSysUser('${u.id}')" title="Chỉnh sửa quyền">
                <i class="fa-solid fa-pen-to-square"></i> Sửa
              </button>
            ` : `
              <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;opacity:0.4;cursor:not-allowed;" title="Quy tắc phân cấp: Không có quyền sửa người ngang cấp hoặc cấp trên" onclick="alert('Từ chối: Bạn không có quyền chỉnh sửa tài khoản người ngang cấp hoặc cấp trên!')">
                <i class="fa-solid fa-lock"></i> Sửa
              </button>
            `}
            ${u.isSuperAdmin ? `
              <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;opacity:0.4;cursor:not-allowed;" title="Super Admin tối cao được bảo vệ" disabled>
                <i class="fa-solid fa-lock"></i>
              </button>
            ` : isManageable ? `
              <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;color:${u.status === 'ACTIVE' ? '#ef4444' : '#10b981'};" onclick="quickToggleLockSysUser('${u.id}')" title="${u.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}">
                <i class="fa-solid ${u.status === 'ACTIVE' ? 'fa-lock' : 'fa-lock-open'}"></i>
              </button>
            ` : `
              <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;opacity:0.3;cursor:not-allowed;" title="Không có quyền khóa người cùng cấp hoặc cấp trên" disabled>
                <i class="fa-solid fa-ban"></i>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterSystemUsersTable() {
  const query = document.getElementById('sysUserSearchInput')?.value.toLowerCase().trim() || '';
  const role = document.getElementById('sysUserFilterRole')?.value || '';
  const group = document.getElementById('sysUserFilterGroup')?.value || '';
  const manager = document.getElementById('sysUserFilterManager')?.value || '';
  const status = document.getElementById('sysUserFilterStatus')?.value || '';

  const filtered = SYSTEM_USERS.filter(user => {
    const matchesQ = user.fullName.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) || user.id.toLowerCase().includes(query) || (user.username && user.username.toLowerCase().includes(query));
    const matchesRole = !role || user.role === role;
    const matchesGroup = !group || user.groupId === group;
    const matchesManager = !manager || (manager === 'ROOT' ? !user.managerId : user.managerId === manager);
    const matchesStatus = !status || user.status === status;

    return matchesQ && matchesRole && matchesGroup && matchesManager && matchesStatus;
  });

  renderSystemUsersTable(filtered);
  const badge = document.getElementById('sysUserFilterCountBadge');
  if (badge) badge.innerText = `${filtered.length} tài khoản`;
}

function resetSystemUserFilters() {
  if (document.getElementById('sysUserSearchInput')) document.getElementById('sysUserSearchInput').value = '';
  if (document.getElementById('sysUserFilterRole')) document.getElementById('sysUserFilterRole').value = '';
  if (document.getElementById('sysUserFilterGroup')) document.getElementById('sysUserFilterGroup').value = '';
  if (document.getElementById('sysUserFilterManager')) document.getElementById('sysUserFilterManager').value = '';
  if (document.getElementById('sysUserFilterStatus')) document.getElementById('sysUserFilterStatus').value = '';
  renderSystemUsersTable(SYSTEM_USERS);
  const badge = document.getElementById('sysUserFilterCountBadge');
  if (badge) badge.innerText = `${SYSTEM_USERS.length} tài khoản`;
  showToast('Đã đặt lại bộ lọc tài khoản quản trị!', 'info');
}

function openSystemUserDetailModal(userId, initialTab = "perms") {
  activeSystemUserId = userId;
  const user = SYSTEM_USERS.find(u => u.id === userId) || SYSTEM_USERS[0];
  if (!user) return;

  // Hierarchy check: người cấp trên mới xem được quyền người cấp dưới
  if (!canManageUser(currentRole, user) && currentRole !== 'super_admin' && user.id !== 'SA-001') {
    alert(`Từ chối quyền truy cập: Bạn không có quyền xem chi tiết tài khoản của người ngang cấp hoặc cấp trên!`);
    return;
  }

  // Populate Header
  document.getElementById('sysUserDetailNameText').textContent = user.fullName;
  document.getElementById('sysUserDetailCode').textContent = user.id;
  const roleBadge = document.getElementById('sysUserDetailRoleBadge');
  const statusBadge = document.getElementById('sysUserDetailStatusBadge');
  if (roleBadge) roleBadge.textContent = user.roleLabel;
  if (statusBadge) {
    statusBadge.textContent = user.statusLabel;
    statusBadge.className = `badge-status ${user.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`;
  }

  // Tab 1: Info fields
  document.getElementById('sysUserInfoCode').value = user.id;
  document.getElementById('sysUserInfoUsername').value = user.username;
  document.getElementById('sysUserInfoFullName').value = user.fullName;
  document.getElementById('sysUserInfoEmail').value = user.email;
  document.getElementById('sysUserInfoRole').value = user.role;
  document.getElementById('sysUserInfoGroup').value = user.groupId;
  document.getElementById('sysUserInfoManager').value = user.managerName || 'Root (Không có)';
  document.getElementById('sysUserInfoStatus').value = user.status;
  document.getElementById('sysUserInfoCreatedAt').value = user.createdAt;
  document.getElementById('sysUserInfoLastLogin').value = user.lastLogin;

  // Giới hạn các tùy chọn vai trò theo cấp bậc của người thao tác (Hierarchy Ceiling)
  const roleSelect = document.getElementById('sysUserInfoRole');
  if (roleSelect) {
    const actorLevel = ROLE_HIERARCHY_LEVELS[currentRole] || 4;
    Array.from(roleSelect.options).forEach(opt => {
      const optLevel = ROLE_HIERARCHY_LEVELS[opt.value] || 1;
      opt.disabled = (optLevel >= actorLevel && currentRole !== 'super_admin');
    });
  }

  const btnLock = document.getElementById('btnToggleLockSysUser');
  if (btnLock) {
    if (user.isSuperAdmin) {
      btnLock.style.display = 'none';
    } else {
      btnLock.style.display = 'inline-flex';
      btnLock.innerHTML = user.status === 'ACTIVE' ? `<i class="fa-solid fa-lock"></i> Khóa Tài Khoản` : `<i class="fa-solid fa-lock-open"></i> Mở Khóa Tài Khoản`;
      btnLock.className = user.status === 'ACTIVE' ? 'btn-action btn-danger' : 'btn-action btn-emerald';
    }
  }

  // Tab 2: Effective perms
  document.getElementById('sysUserInheritGroupName').textContent = user.groupName;
  renderSysUserPermTree(user);

  // Tab 3: Data scope
  document.getElementById('sysUserScopeSelect').value = user.dataScope || 'PERSONAL';
  document.getElementById('sysUserScopeDescription').innerHTML = `Tài khoản này được cấu hình phạm vi dữ liệu: <strong>${user.dataScopeLabel || user.dataScope}</strong>.`;

  // Tab 4: Audit history
  renderSysUserAuditHistoryTable(user);

  switchSysUserModalTab(initialTab);
  openModal('modalSystemUserDetail');
}

function switchSysUserModalTab(tabKey) {
  const tabs = ['info', 'perms', 'scope', 'history'];
  tabs.forEach(t => {
    const btn = document.getElementById(`btnUserTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const pane = document.getElementById(`sysUserPane${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (t === tabKey) {
      btn?.classList.add('active');
      pane?.classList.add('active');
    } else {
      btn?.classList.remove('active');
      pane?.classList.remove('active');
    }
  });
}

const AVAILABLE_USER_OVERRIDES = [
  { key: 'vocab.export', label: 'Xuất dữ liệu kho từ vựng (Excel/CSV)' },
  { key: 'vocab.import', label: 'Import từ vựng từ tệp tin' },
  { key: 'users.adjust_plan', label: 'Điều chỉnh nâng/hạ gói cước học viên' },
  { key: 'users.export', label: 'Xuất danh sách học viên (CSV)' },
  { key: 'payment.refund', label: 'Tạo yêu cầu hoàn tiền cho học viên' },
  { key: 'payment.reconcile', label: 'Đối soát giao dịch ngân hàng' },
  { key: 'ai.test_playground', label: 'Thử nghiệm mô hình AI Playground' },
  { key: 'subscription.manual_extend', label: 'Gia hạn gói cước thủ công' },
  { key: 'settings.audit_view', label: 'Xem nhật ký kiểm toán hệ thống' }
];

function renderSysUserEffectivePermsTable(user) {
  const tbody = document.getElementById('sysUserEffectivePermsTableBody');
  if (!tbody || typeof SYSTEM_PERMISSIONS_TREE === 'undefined') return;

  const group = PERMISSION_GROUPS.find(g => g.id === user.groupId) || PERMISSION_GROUPS[0];
  const isSuper = user.isSuperAdmin;
  const userOverrides = user.customOverrides || [];

  tbody.innerHTML = SYSTEM_PERMISSIONS_TREE.map(mod => {
    const groupActions = isSuper ? mod.actions.map(a => a.name) : (group.permissions && group.permissions[mod.moduleKey] ? group.permissions[mod.moduleKey].map(k => mod.actions.find(a => a.key === k)?.name || k) : []);
    
    // Kiểm tra có quyền ngoại lệ nào thuộc module này không
    const moduleOverrides = userOverrides.filter(ov => ov.startsWith(mod.moduleKey + '.'));
    const overrideLabels = moduleOverrides.map(ov => {
      const actKey = ov.split('.')[1];
      const found = mod.actions.find(a => a.key === actKey);
      return `<span class="badge-status badge-purple" style="font-size:0.7rem;margin-left:4px;">+ ${found ? found.name : actKey} (Đặc cách)</span>`;
    }).join(' ');

    const actionText = groupActions.length > 0 ? groupActions.join(', ') : 'Chỉ xem cơ bản';

    return `
      <tr>
        <td><strong>${mod.moduleName}</strong></td>
        <td>
          <span style="color:#0f172a;">${actionText}</span>
          ${overrideLabels}
        </td>
        <td><span class="badge-status badge-info">Kế thừa (${user.groupName})</span></td>
        <td>${user.addedBy || 'Hệ thống'}</td>
        <td><span class="badge-status badge-success">Hiệu lực</span></td>
      </tr>
    `;
  }).join('');

  // Render Checkbox danh sách Quyền ngoại lệ riêng
  const overrideContainer = document.getElementById('sysUserOverridesCheckboxes');
  const overrideStatusBadge = document.getElementById('sysUserOverridesStatusBadge');
  const btnSaveOverrides = document.getElementById('btnSaveSysUserOverrides');
  const reasonInput = document.getElementById('sysUserOverrideReasonInput');

  if (overrideContainer) {
    if (isSuper) {
      overrideContainer.innerHTML = '<div style="grid-column:1/-1;color:#059669;font-weight:600;padding:8px 0;"><i class="fa-solid fa-crown"></i> Super Admin toàn quyền hệ thống tối cao - Không cần cấu hình quyền ngoại lệ.</div>';
      if (overrideStatusBadge) overrideStatusBadge.textContent = 'Toàn quyền';
      if (btnSaveOverrides) btnSaveOverrides.disabled = true;
      if (reasonInput) reasonInput.disabled = true;
    } else {
      const isManageable = canManageUser(currentRole, user);
      if (overrideStatusBadge) {
        overrideStatusBadge.textContent = isManageable ? 'Được phép chỉnh sửa' : 'Chỉ xem (Không có quyền)';
        overrideStatusBadge.className = `badge-status ${isManageable ? 'badge-info' : 'badge-neutral'}`;
      }
      if (btnSaveOverrides) btnSaveOverrides.disabled = !isManageable;
      if (reasonInput) reasonInput.disabled = !isManageable;

      overrideContainer.innerHTML = AVAILABLE_USER_OVERRIDES.map(ov => {
        const isChecked = userOverrides.includes(ov.key);
        return `
          <label style="display:flex;align-items:center;gap:8px;background:#ffffff;padding:8px 12px;border-radius:6px;border:1px solid #e2e8f0;cursor:${isManageable ? 'pointer' : 'not-allowed'};font-size:0.82rem;">
            <input type="checkbox" name="user_override_perm" value="${ov.key}" ${isChecked ? 'checked' : ''} ${!isManageable ? 'disabled' : ''}>
            <span>${ov.label}</span>
          </label>
        `;
      }).join('');
    }
  }
}

function saveSystemUserPermOverrides() {
  const user = SYSTEM_USERS.find(u => u.id === activeSystemUserId);
  if (!user) return;

  if (user.isSuperAdmin) {
    alert('Tài khoản Super Admin nắm giữ toàn quyền tối cao!');
    return;
  }

  if (!canManageUser(currentRole, user)) {
    alert('Từ chối: Bạn không có quyền cấp hoặc sửa quyền của người ngang cấp hoặc cấp trên!');
    return;
  }

  const reason = document.getElementById('sysUserOverrideReasonInput')?.value.trim() || 'Cấp quyền đặc cách cá nhân theo yêu cầu nghiệp vụ';
  const checkedBoxes = Array.from(document.querySelectorAll('input[name="user_override_perm"]:checked')).map(cb => cb.value);

  user.customOverrides = checkedBoxes;
  user.auditHistory.unshift({
    date: new Date().toLocaleString('vi-VN'),
    actor: `${currentRole.toUpperCase()}`,
    action: `Cập nhật ${checkedBoxes.length} quyền đặc cách cá nhân: [${checkedBoxes.join(', ') || 'Không có'}]`,
    reason: reason
  });

  renderSysUserEffectivePermsTable(user);
  renderSysUserAuditHistoryTable(user);
  showToast(`Đã lưu ${checkedBoxes.length} quyền đặc cách cho ${user.fullName}!`, 'success');
}


// ==========================================================================
// CÂY PHÂN QUYỀN 12 MODULE DÀNH CHO TÀI KHOẢN NGƯỜI DÙNG (CÓ CHECKBOX)
// ==========================================================================
function renderSysUserPermTree(user) {
  const container = document.getElementById('sysUserPermTreeContainer');
  const countBadge = document.getElementById('sysUserPermCountBadge');
  const manageableBadge = document.getElementById('sysUserPermManageableBadge');
  const actionBtns = document.getElementById('sysUserPermActionButtons');
  const btnSave = document.getElementById('btnSaveSysUserPermTree');
  const reasonInput = document.getElementById('sysUserPermChangeReasonInput');
  if (!container || typeof SYSTEM_PERMISSIONS_TREE === 'undefined') return;

  const group = PERMISSION_GROUPS.find(g => g.id === user.groupId) || PERMISSION_GROUPS[0];
  const isSuper = user.isSuperAdmin;
  const isManageable = canManageUser(currentRole, user) || currentRole === 'super_admin';

  // Nếu user chưa có permissions riêng, khởi tạo kế thừa từ nhóm
  if (!user.permissions) {
    user.permissions = JSON.parse(JSON.stringify(group.permissions || {}));
  }

  // Đếm tổng số quyền hiện có
  let currentPermCount = 0;
  if (isSuper) {
    currentPermCount = SYSTEM_PERMISSIONS_TREE.reduce((acc, m) => acc + m.actions.length, 0);
  } else {
    currentPermCount = Object.values(user.permissions).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
  }

  if (countBadge) countBadge.textContent = `${currentPermCount} quyền được cấp`;
  if (manageableBadge) {
    if (isSuper) {
      manageableBadge.textContent = 'Super Admin tối cao (Toàn quyền)';
      manageableBadge.className = 'badge-status badge-success';
    } else if (isManageable) {
      manageableBadge.textContent = 'Được phép chỉnh sửa quyền';
      manageableBadge.className = 'badge-status badge-info';
    } else {
      manageableBadge.textContent = 'Chỉ xem (Không có quyền sửa)';
      manageableBadge.className = 'badge-status badge-neutral';
    }
  }

  if (actionBtns) actionBtns.style.display = (isSuper || !isManageable) ? 'none' : 'flex';
  if (btnSave) btnSave.disabled = (isSuper || !isManageable);
  if (reasonInput) reasonInput.disabled = (isSuper || !isManageable);

  // Render 12 module card với checkbox
  container.innerHTML = SYSTEM_PERMISSIONS_TREE.map(mod => {
    const modPerms = user.permissions[mod.moduleKey] || [];
    const isAllChecked = isSuper || (mod.actions.length > 0 && mod.actions.every(a => modPerms.includes(a.key)));

    return `
      <div class="perm-module-card">
        <div class="perm-module-header">
          <div class="perm-module-title">
            <i class="fa-solid fa-cube" style="color:#173d8f;"></i> ${mod.moduleName}
          </div>
          <label style="font-size:0.76rem;color:var(--text-muted);display:flex;align-items:center;gap:4px;cursor:${isManageable && !isSuper ? 'pointer' : 'not-allowed'};">
            <input type="checkbox" ${isAllChecked ? 'checked' : ''} ${!isManageable || isSuper ? 'disabled' : ''} onchange="toggleModuleAllUserPerms(this, '${mod.moduleKey}')"> Chọn tất cả
          </label>
        </div>
        <div class="perm-actions-row" id="userPermActions_${mod.moduleKey}">
          ${mod.actions.map(act => {
            const isChecked = isSuper || modPerms.includes(act.key);
            const isGroupInherited = group.permissions && group.permissions[mod.moduleKey]?.includes(act.key);
            return `
              <label class="perm-checkbox-label" title="${isGroupInherited ? 'Quyền thuộc nhóm gốc ' + group.name : 'Quyền cấp riêng'}">
                <input type="checkbox" name="user_perm_${mod.moduleKey}" value="${act.key}" ${isChecked ? 'checked' : ''} ${!isManageable || isSuper ? 'disabled' : ''} onchange="updateUserPermCountLive()">
                <span>${act.name}</span>
                <small style="color:var(--text-muted);font-family:var(--font-mono);">(${act.key})</small>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function toggleModuleAllUserPerms(masterCheckbox, moduleKey) {
  const checkboxes = document.querySelectorAll(`input[name="user_perm_${moduleKey}"]`);
  checkboxes.forEach(cb => {
    if (!cb.disabled) cb.checked = masterCheckbox.checked;
  });
  updateUserPermCountLive();
}

function toggleAllUserPerms(checkAll) {
  const checkboxes = document.querySelectorAll('#sysUserPermTreeContainer input[type="checkbox"]');
  checkboxes.forEach(cb => {
    if (!cb.disabled) cb.checked = checkAll;
  });
  updateUserPermCountLive();
}

function resetUserPermsToGroup() {
  const user = SYSTEM_USERS.find(u => u.id === activeSystemUserId);
  if (!user) return;
  const group = PERMISSION_GROUPS.find(g => g.id === user.groupId) || PERMISSION_GROUPS[0];
  user.permissions = JSON.parse(JSON.stringify(group.permissions || {}));
  renderSysUserPermTree(user);
  showToast(`Đã khôi phục các checkbox quyền theo nhóm gốc "${group.name}"!`, 'info');
}

function updateUserPermCountLive() {
  const countBadge = document.getElementById('sysUserPermCountBadge');
  if (!countBadge) return;
  const checkedBoxes = document.querySelectorAll('#sysUserPermTreeContainer .perm-actions-row input[type="checkbox"]:checked');
  countBadge.textContent = `${checkedBoxes.length} quyền được chọn`;
}

function saveSystemUserPermTreeChanges() {
  const user = SYSTEM_USERS.find(u => u.id === activeSystemUserId);
  if (!user) return;

  if (user.isSuperAdmin) {
    showToast('Tài khoản Super Admin nắm giữ toàn bộ 48 quyền hệ thống tối cao!', 'info');
    closeModal('modalSystemUserDetail');
    return;
  }

  if (!canManageUser(currentRole, user) && currentRole !== 'super_admin') {
    alert('Từ chối: Bạn không có quyền chỉnh sửa quyền của tài khoản này!');
    return;
  }

  const reason = document.getElementById('sysUserPermChangeReasonInput')?.value.trim() || 'Cập nhật phân quyền tài khoản quản trị';

  const updatedPerms = {};
  let totalCount = 0;
  SYSTEM_PERMISSIONS_TREE.forEach(mod => {
    const checked = Array.from(document.querySelectorAll(`input[name="user_perm_${mod.moduleKey}"]:checked`)).map(cb => cb.value);
    updatedPerms[mod.moduleKey] = checked;
    totalCount += checked.length;
  });

  user.permissions = updatedPerms;
  user.permCount = totalCount;

  user.auditHistory.unshift({
    date: new Date().toLocaleString('vi-VN'),
    actor: `${currentRole.toUpperCase()}`,
    action: `Cập nhật cấu hình ${totalCount} quyền hành động chi tiết`,
    reason: reason
  });

  renderSystemUsersTable();
  showToast(`Đã lưu thành công ${totalCount} quyền cho tài khoản ${user.fullName}!`, 'success');
  closeModal('modalSystemUserDetail');
}

function renderSysUserAuditHistoryTable(user) {
  const tbody = document.getElementById('sysUserAuditHistoryTableBody');
  if (!tbody) return;

  const history = user.auditHistory || [];
  if (history.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">Chưa có bản ghi thay đổi quyền nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = history.map(h => {
    return `
      <tr>
        <td><small class="mono-code">${h.date}</small></td>
        <td><strong>${h.actor}</strong></td>
        <td>${h.action}</td>
        <td><em>${h.reason}</em></td>
      </tr>
    `;
  }).join('');
}

function saveSystemUserInfoChanges() {
  const user = SYSTEM_USERS.find(u => u.id === activeSystemUserId);
  if (!user) return;

  if (user.isSuperAdmin) {
    showToast('Tài khoản Super Admin tối cao không thể hạ quyền hoặc đổi vai trò!', 'warning');
    closeModal('modalSystemUserDetail');
    return;
  }

  user.fullName = document.getElementById('sysUserInfoFullName')?.value || user.fullName;
  user.email = document.getElementById('sysUserInfoEmail')?.value || user.email;
  const newRole = document.getElementById('sysUserInfoRole')?.value || user.role;
  const newGroup = document.getElementById('sysUserInfoGroup')?.value || user.groupId;

  const actorLevel = ROLE_HIERARCHY_LEVELS[currentRole] || 4;
  const newRoleLevel = ROLE_HIERARCHY_LEVELS[newRole] || 1;
  if (newRoleLevel > actorLevel) {
    alert(`Quy tắc cấp quyền không vượt cấp: Bạn không thể bổ nhiệm vai trò (${newRole}) cao hơn cấp bậc của chính bạn!`);
    return;
  }

  user.role = newRole;
  user.roleLabel = newRole === 'admin' ? 'Admin' : newRole === 'manager' ? 'Quản lý' : 'Nhân viên & Sale';
  user.roleLevel = newRoleLevel;
  user.groupId = newGroup;
  user.groupName = PERMISSION_GROUPS.find(g => g.id === newGroup)?.name || newGroup;

  user.auditHistory.unshift({
    date: new Date().toLocaleString('vi-VN'),
    actor: `${currentRole.toUpperCase()}`,
    action: `Cập nhật vai trò thành "${user.roleLabel}" và nhóm "${user.groupName}"`,
    reason: 'Quản trị viên điều chỉnh nhân sự'
  });

  renderSystemUsersTable();
  showToast(`Đã lưu cập nhật thông tin tài khoản: ${user.fullName}!`, 'success');
  closeModal('modalSystemUserDetail');
}

function toggleLockCurrentSystemUser() {
  quickToggleLockSysUser(activeSystemUserId);
  closeModal('modalSystemUserDetail');
}

function quickToggleLockSysUser(userId) {
  const user = SYSTEM_USERS.find(u => u.id === userId);
  if (!user) return;
  if (user.isSuperAdmin) {
    alert('Không thể khóa tài khoản Super Admin tối cao duy nhất!');
    return;
  }

  if (!canManageUser(currentRole, user)) {
    alert('Từ chối: Bạn không có quyền khóa tài khoản người ngang cấp hoặc cấp trên!');
    return;
  }

  const isLocking = user.status === 'ACTIVE';
  user.status = isLocking ? 'LOCKED' : 'ACTIVE';
  user.statusLabel = isLocking ? 'Tạm khóa' : 'Hoạt động';

  user.auditHistory.unshift({
    date: new Date().toLocaleString('vi-VN'),
    actor: `${currentRole.toUpperCase()}`,
    action: isLocking ? 'Tạm khóa tài khoản' : 'Mở khóa tài khoản',
    reason: isLocking ? 'Yêu cầu kiểm tra an ninh / nghỉ phép' : 'Hoàn tất rà soát an ninh'
  });

  renderSystemUsersTable();
  showToast(`${isLocking ? 'Đã tạm khóa' : 'Đã mở khóa'} tài khoản ${user.fullName}!`, isLocking ? 'warning' : 'success');
}

function triggerEditSysUser(userId) {
  openSystemUserDetailModal(userId, 'perms');
}

function saveSystemUserDataScope() {
  const user = SYSTEM_USERS.find(u => u.id === activeSystemUserId);
  if (!user) return;

  const select = document.getElementById('sysUserScopeSelect');
  if (select) {
    user.dataScope = select.value;
    const scopeMap = {
      'ALL': 'Toàn hệ thống',
      'BRANCH': 'Theo phân nhánh chi nhánh',
      'TEAM': 'Cây nhóm phụ trách',
      'PERSONAL': 'Chỉ dữ liệu cá nhân'
    };
    user.dataScopeLabel = scopeMap[user.dataScope] || user.dataScope;
    user.auditHistory.unshift({
      date: new Date().toLocaleString('vi-VN'),
      actor: `${currentRole.toUpperCase()}`,
      action: `Điều chỉnh phạm vi dữ liệu thành: ${user.dataScopeLabel}`,
      reason: 'Cập nhật phân quyền truy cập'
    });
  }

  showToast('Đã lưu thay đổi phạm vi dữ liệu tài khoản!', 'success');
  closeModal('modalSystemUserDetail');
}

function openCreateSystemUserModal() {
  document.getElementById('newSysUserCode').value = `ST-00${SYSTEM_USERS.length + 1}`;
  document.getElementById('newSysUserUsername').value = '';
  document.getElementById('newSysUserFullName').value = '';
  document.getElementById('newSysUserEmail').value = '';
  document.getElementById('newSysUserReason').value = '';
  openModal('modalCreateSystemUser');
}

function syncNewSysUserGroup() {
  const role = document.getElementById('newSysUserRole')?.value;
  const groupSelect = document.getElementById('newSysUserGroup');
  if (!groupSelect) return;
  if (role === 'admin') groupSelect.value = 'ADMIN';
  else if (role === 'manager') groupSelect.value = 'MANAGER';
  else groupSelect.value = 'STAFF_SALE';
}

function submitCreateSystemUser() {
  const username = document.getElementById('newSysUserUsername')?.value.trim();
  const fullName = document.getElementById('newSysUserFullName')?.value.trim();
  const email = document.getElementById('newSysUserEmail')?.value.trim();
  const role = document.getElementById('newSysUserRole')?.value || 'staff_sale';
  const groupId = document.getElementById('newSysUserGroup')?.value || 'STAFF_SALE';
  const managerId = document.getElementById('newSysUserManager')?.value || 'MG-003';
  const reason = document.getElementById('newSysUserReason')?.value.trim() || 'Nhân sự mới bổ nhiệm';

  if (!username || !fullName || !email) {
    alert('Vui lòng điền đầy đủ tên đăng nhập, họ tên và email!');
    return;
  }

  const actorLevel = ROLE_HIERARCHY_LEVELS[currentRole] || 4;
  const targetLevel = ROLE_HIERARCHY_LEVELS[role] || 1;
  if (targetLevel >= actorLevel && currentRole !== 'super_admin') {
    alert('Từ chối: Bạn không thể tạo tài khoản có cấp bậc ngang bằng hoặc cao hơn bạn!');
    return;
  }

  const manager = SYSTEM_USERS.find(u => u.id === managerId);
  const group = PERMISSION_GROUPS.find(g => g.id === groupId);

  const newUser = {
    id: document.getElementById('newSysUserCode')?.value || `ST-00${SYSTEM_USERS.length + 1}`,
    username: username,
    fullName: fullName,
    email: email,
    role: role,
    roleLabel: role === 'admin' ? 'Admin' : role === 'manager' ? 'Quản lý' : 'Nhân viên & Sale',
    roleLevel: targetLevel,
    groupId: groupId,
    groupName: group ? group.name : 'Nhân viên & Sale',
    managerId: managerId,
    managerName: manager ? `${manager.fullName} (${manager.id})` : 'Quản lý',
    status: 'ACTIVE',
    statusLabel: 'Hoạt động',
    dataScope: role === 'admin' ? 'BRANCH' : role === 'manager' ? 'TEAM' : 'PERSONAL',
    dataScopeLabel: role === 'admin' ? 'Chi nhánh' : role === 'manager' ? 'Cây nhóm' : 'Cá nhân',
    lastLogin: 'Chưa đăng nhập',
    createdAt: new Date().toLocaleDateString('vi-VN'),
    isSuperAdmin: false,
    joinedGroupAt: new Date().toLocaleDateString('vi-VN'),
    addedBy: `${currentRole.toUpperCase()}`,
    customOverrides: [],
    auditHistory: [
      { date: new Date().toLocaleString('vi-VN'), actor: `${currentRole.toUpperCase()}`, action: 'Tạo mới tài khoản quản trị', reason: reason }
    ]
  };

  SYSTEM_USERS.push(newUser);
  PERMISSION_GROUPS.forEach(g => {
    g.memberCount = SYSTEM_USERS.filter(u => u.groupId === g.id).length;
  });

  renderSystemUsersTable();
  renderPermissionGroupsTable();
  closeModal('modalCreateSystemUser');
  showToast(`Đã tạo tài khoản quản trị thành công: ${fullName}!`, 'success');
}

function exportSystemUsersCsv() {
  showToast('Đang kết xuất danh sách nhân sự quản trị hệ thống (CSV)...', 'info');
}

// --------------------------------------------------------------------------
// SCREEN 3: KHÁCH HÀNG (CUSTOMER MANAGEMENT - HỌC VIÊN APP TIẾNG ANH)
// --------------------------------------------------------------------------
let activeCustomerId = 'CUST-1001';

function renderCustomersTable(customers = CUSTOMER_USERS) {
  const tbody = document.getElementById('customerTableBody');
  if (!tbody || typeof CUSTOMER_USERS === 'undefined') return;

  if (customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:36px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.5rem;margin-bottom:8px;display:block;"></i>Không tìm thấy học viên nào phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = customers.map(c => {
    return `
      <tr>
        <td><span class="mono-code">${c.id}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:32px;height:32px;border-radius:50%;background:#0284c715;color:#0284c7;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;">
              ${c.fullName.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <strong>${c.fullName}</strong>
          </div>
        </td>
        <td>${c.email} <br><small style="color:var(--text-muted);"><i class="fa-solid fa-phone" style="font-size:0.68rem;"></i> ${c.phone}</small></td>
        <td><small>${c.registeredAt}</small></td>
        <td>
          <span class="badge-status ${c.status === 'ACTIVE' ? 'badge-success' : c.status === 'LOCKED' ? 'badge-danger' : 'badge-warning'}">
            ${c.statusLabel}
          </span>
        </td>
        <td>
          <span class="badge-status ${c.planType === 'VIP' ? 'badge-purple' : c.planType === 'Premium' ? 'badge-warning' : 'badge-neutral'}">
            ${c.planType}
          </span>
        </td>
        <td>
          <span class="badge-status ${c.planStatus === 'ACTIVE' ? 'badge-success' : 'badge-danger'}">
            ${c.planStatusLabel}
          </span>
        </td>
        <td><small style="color:${c.planStatus === 'ACTIVE' ? '#059669' : '#dc2626'};font-weight:600;">${c.expiryDate}</small></td>
        <td><small style="color:var(--text-muted);">${c.lastActive}</small></td>
        <td style="text-align:right;">
          <div style="display:flex;justify-content:flex-end;gap:4px;">
            <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;" onclick="openCustomerDetailModal('${c.id}')" title="Xem chi tiết (5 tab)">
              <i class="fa-solid fa-user-graduate"></i> Chi Tiết
            </button>
            <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;color:${c.status === 'ACTIVE' ? '#ef4444' : '#10b981'};" onclick="quickToggleLockCustomer('${c.id}')" title="${c.status === 'ACTIVE' ? 'Khóa học viên' : 'Mở khóa'}">
              <i class="fa-solid ${c.status === 'ACTIVE' ? 'fa-lock' : 'fa-lock-open'}"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterCustomerTable() {
  const query = document.getElementById('customerSearchInput')?.value.toLowerCase().trim() || '';
  const status = document.getElementById('customerFilterStatus')?.value || '';
  const plan = document.getElementById('customerFilterPlan')?.value || '';
  const planStatus = document.getElementById('customerFilterPlanStatus')?.value || '';
  const activity = document.getElementById('customerFilterActivity')?.value || '';

  const filtered = CUSTOMER_USERS.filter(cust => {
    const matchesQ = cust.fullName.toLowerCase().includes(query) || cust.email.toLowerCase().includes(query) || cust.phone.includes(query) || cust.id.toLowerCase().includes(query);
    const matchesStatus = !status || cust.status === status;
    const matchesPlan = !plan || cust.planType === plan;
    const matchesPlanStatus = !planStatus || cust.planStatus === planStatus;
    let matchesAct = true;
    if (activity === 'TODAY') matchesAct = cust.lastActive.includes('11/10/2026') || cust.lastActive.includes('10 phút') || cust.lastActive.includes('25 phút') || cust.lastActive.includes('2 giờ');
    else if (activity === 'RECENT') matchesAct = !cust.lastActive.includes('20 ngày') && !cust.lastActive.includes('35 ngày');
    else if (activity === 'INACTIVE') matchesAct = cust.lastActive.includes('20 ngày') || cust.lastActive.includes('35 ngày');
    return matchesQ && matchesStatus && matchesPlan && matchesPlanStatus && matchesAct;
  });

  renderCustomersTable(filtered);
  const badge = document.getElementById('customerFilterCount');
  if (badge) badge.innerText = `${filtered.length} học viên`;
}

function resetCustomerFilters() {
  if (document.getElementById('customerSearchInput')) document.getElementById('customerSearchInput').value = '';
  if (document.getElementById('customerFilterStatus')) document.getElementById('customerFilterStatus').value = '';
  if (document.getElementById('customerFilterPlan')) document.getElementById('customerFilterPlan').value = '';
  if (document.getElementById('customerFilterPlanStatus')) document.getElementById('customerFilterPlanStatus').value = '';
  if (document.getElementById('customerFilterActivity')) document.getElementById('customerFilterActivity').value = '';
  renderCustomersTable(CUSTOMER_USERS);
  const badge = document.getElementById('customerFilterCount');
  if (badge) badge.innerText = `${CUSTOMER_USERS.length} học viên`;
  showToast('Đã đặt lại bộ lọc học viên!', 'info');
}

function openCustomerDetailModal(custId) {
  activeCustomerId = custId;
  const cust = CUSTOMER_USERS.find(c => c.id === custId) || CUSTOMER_USERS[0];
  if (!cust) return;

  // Header
  document.getElementById('custDetailNameText').textContent = cust.fullName;
  document.getElementById('custDetailCode').textContent = cust.id;
  const planBadge = document.getElementById('custDetailPlanBadge');
  const statusBadge = document.getElementById('custDetailStatusBadge');
  if (planBadge) planBadge.textContent = `Gói ${cust.planType}`;
  if (statusBadge) {
    statusBadge.textContent = cust.statusLabel;
    statusBadge.className = `badge-status ${cust.status === 'ACTIVE' ? 'badge-success' : cust.status === 'LOCKED' ? 'badge-danger' : 'badge-warning'}`;
  }

  // Tab 1: Profile
  document.getElementById('custProfileCode').value = cust.id;
  document.getElementById('custProfileName').value = cust.fullName;
  document.getElementById('custProfileEmail').value = cust.email;
  document.getElementById('custProfilePhone').value = cust.phone;
  document.getElementById('custProfileRegisteredAt').value = cust.registeredAt;
  document.getElementById('custProfileStatus').value = cust.status;

  const btnLock = document.getElementById('btnToggleLockCustomer');
  if (btnLock) {
    btnLock.innerHTML = cust.status === 'ACTIVE' ? `<i class="fa-solid fa-lock"></i> Khóa Học Viên` : `<i class="fa-solid fa-lock-open"></i> Mở Khóa Học Viên`;
    btnLock.className = cust.status === 'ACTIVE' ? 'btn-action btn-danger' : 'btn-action btn-emerald';
  }

  // Tab 2: Learning progress
  const lp = cust.learningProgress || { topicsLearned: 0, wordsMastered: 0, exercisesDone: 0, streakDays: 0, scoreAvg: '0%' };
  document.getElementById('custStatTopics').textContent = `${lp.topicsLearned}/8`;
  document.getElementById('custStatWords').textContent = `${lp.wordsMastered} từ`;
  document.getElementById('custStatExercises').textContent = `${lp.exercisesDone} bài`;
  document.getElementById('custStatStreak').textContent = `${lp.streakDays} ngày 🔥`;
  document.getElementById('custStatScore').textContent = `${lp.scoreAvg} (Khá - Tốt)`;

  // Tab 3: Plan
  document.getElementById('custPlanNameText').textContent = `Gói ${cust.planType} Học Tiếng Anh`;
  document.getElementById('custPlanStatusText').textContent = cust.planStatusLabel;
  document.getElementById('custPlanStartDate').textContent = cust.registeredAt;
  document.getElementById('custPlanExpiryDate').textContent = cust.expiryDate;

  // Tab 4: Payments
  renderCustPaymentsTable(cust);

  // Tab 5: Support notes
  renderCustSupportTable(cust);

  switchCustModalTab('profile');
  openModal('modalCustomerDetail');
}

function switchCustModalTab(tabKey) {
  const tabs = ['profile', 'learning', 'plan', 'payments', 'support'];
  tabs.forEach(t => {
    const btn = document.getElementById(`btnCustTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const pane = document.getElementById(`custPane${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (t === tabKey) {
      btn?.classList.add('active');
      pane?.classList.add('active');
    } else {
      btn?.classList.remove('active');
      pane?.classList.remove('active');
    }
  });
}

function renderCustPaymentsTable(cust) {
  const tbody = document.getElementById('custPaymentsTableBody');
  if (!tbody) return;

  const payments = cust.paymentHistory || [];
  if (payments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:18px;">Chưa có giao dịch thanh toán nào được ghi nhận.</td></tr>`;
    return;
  }

  tbody.innerHTML = payments.map(p => {
    return `
      <tr>
        <td><span class="mono-code">${p.orderCode}</span></td>
        <td>${p.date}</td>
        <td><strong>${p.plan}</strong></td>
        <td><strong style="color:#059669;">${p.amount}</strong></td>
        <td>${p.channel}</td>
        <td><span class="badge-status badge-success">Thành công</span></td>
      </tr>
    `;
  }).join('');
}

function renderCustSupportTable(cust) {
  const tbody = document.getElementById('custSupportTableBody');
  if (!tbody) return;

  const notes = cust.supportNotes || [];
  if (notes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:18px;">Chưa có lịch sử hỗ trợ nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = notes.map(n => {
    return `
      <tr>
        <td><small class="mono-code">${n.date}</small></td>
        <td><strong>${n.staff}</strong></td>
        <td>${n.content}</td>
      </tr>
    `;
  }).join('');
}

function saveCustomerProfileChanges() {
  const cust = CUSTOMER_USERS.find(c => c.id === activeCustomerId);
  if (!cust) return;

  cust.fullName = document.getElementById('custProfileName')?.value || cust.fullName;
  cust.email = document.getElementById('custProfileEmail')?.value || cust.email;
  cust.phone = document.getElementById('custProfilePhone')?.value || cust.phone;
  cust.status = document.getElementById('custProfileStatus')?.value || cust.status;
  cust.statusLabel = cust.status === 'ACTIVE' ? 'Hoạt động' : cust.status === 'LOCKED' ? 'Bị khóa' : 'Chờ xác minh';

  renderCustomersTable();
  showToast(`Đã lưu thay đổi thông tin học viên: ${cust.fullName}!`, 'success');
  closeModal('modalCustomerDetail');
}

function toggleLockCurrentCustomer() {
  quickToggleLockCustomer(activeCustomerId);
  closeModal('modalCustomerDetail');
}

function quickToggleLockCustomer(custId) {
  const cust = CUSTOMER_USERS.find(c => c.id === custId);
  if (!cust) return;

  const isLocking = cust.status === 'ACTIVE';
  cust.status = isLocking ? 'LOCKED' : 'ACTIVE';
  cust.statusLabel = isLocking ? 'Bị khóa' : 'Hoạt động';

  renderCustomersTable();
  showToast(`${isLocking ? 'Đã khóa' : 'Đã mở khóa'} tài khoản học viên ${cust.fullName}!`, isLocking ? 'warning' : 'success');
}

function addCustomerSupportNote() {
  const cust = CUSTOMER_USERS.find(c => c.id === activeCustomerId);
  if (!cust) return;

  const input = document.getElementById('custNewSupportNoteInput');
  const text = input?.value.trim();
  if (!text) {
    alert('Vui lòng nhập nội dung ghi chú hỗ trợ!');
    return;
  }

  if (!cust.supportNotes) cust.supportNotes = [];
  cust.supportNotes.unshift({
    date: new Date().toLocaleDateString('vi-VN'),
    staff: `${currentRole.toUpperCase()}`,
    content: text
  });

  input.value = '';
  renderCustSupportTable(cust);
  showToast('Đã thêm ghi chú hỗ trợ nội bộ thành công!', 'success');
}

function exportCustomersCsv() {
  showToast('Đang kết xuất danh sách học viên ứng dụng (CSV)...', 'info');
}

// ==========================================================================
// 13. MODULE 10: SETTINGS & AUDIT LOGS LOGIC
// ==========================================================================
function switchSettingsSubtab(tabKey, btn) {
  document.querySelectorAll('#viewSettingsLogs .module-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#viewSettingsLogs .module-tab-panel').forEach(p => p.classList.remove('active'));

  if (btn) btn.classList.add('active');

  if (tabKey === 'settings') {
    document.getElementById('subpanelSettings')?.classList.add('active');
  } else {
    document.getElementById('subpanelAudit')?.classList.add('active');
  }
}

function saveAppSettings() {
  const appName = document.getElementById('cfgAppName')?.value;
  const hotline = document.getElementById('cfgHotline')?.value;
  const email = document.getElementById('cfgEmail')?.value;

  SYSTEM_SETTINGS.appInfo.appName = appName;
  SYSTEM_SETTINGS.appInfo.supportHotline = hotline;
  SYSTEM_SETTINGS.appInfo.supportEmail = email;

  showToast('Đã lưu cấu hình thông tin ứng dụng!', 'success');
}

function renderAuditLogsTable(logs = AUDIT_LOGS) {
  const tbody = document.getElementById('auditLogsTableBody');
  if (!tbody) return;

  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:32px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.4rem;margin-bottom:8px;display:block;"></i>Không tìm thấy bản ghi kiểm toán phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = logs.map(l => `
    <tr>
      <td><span class="mono-code">${l.id}</span></td>
      <td style="font-size:0.78rem;">${l.timestamp}</td>
      <td><strong>${l.actor}</strong></td>
      <td><span class="badge-status badge-info">${l.module}</span></td>
      <td><span style="font-family:var(--font-mono);font-size:0.75rem;">${l.action}</span></td>
      <td>${l.target}</td>
      <td>
        <span class="badge-status ${l.severity === 'CRITICAL' ? 'badge-danger' : l.severity === 'WARNING' ? 'badge-warning' : 'badge-neutral'}">
          ${l.severity}
        </span>
      </td>
      <td style="max-width:260px;font-size:0.8rem;">${l.details}</td>
      <td style="text-align:right;">
        <button type="button" class="btn-action-icon" title="Xem Diff chi tiết trước/sau" onclick="openAuditDiffModal('${l.id}')">
          <i class="fa-solid fa-code-compare"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filterAuditLogs() {
  const keyword = (document.getElementById('auditSearchInput')?.value || '').toLowerCase().trim();
  const moduleFilter = document.getElementById('auditFilterModule')?.value || '';
  const severityFilter = document.getElementById('auditFilterSeverity')?.value || '';
  const timeFilter = document.getElementById('auditFilterTime')?.value || '';

  const filtered = AUDIT_LOGS.filter(l => {
    const matchKey = l.id.toLowerCase().includes(keyword) ||
      l.actor.toLowerCase().includes(keyword) ||
      l.module.toLowerCase().includes(keyword) ||
      l.action.toLowerCase().includes(keyword) ||
      l.target.toLowerCase().includes(keyword) ||
      (l.details && l.details.toLowerCase().includes(keyword));

    const matchModule = !moduleFilter || l.module.includes(moduleFilter);
    const matchSev = !severityFilter || l.severity === severityFilter;
    let matchTime = true;
    if (timeFilter === 'TODAY') matchTime = l.timestamp.includes('2026-10-11');
    else if (timeFilter === '7DAYS') matchTime = true;
    else if (timeFilter === '30DAYS') matchTime = true;
    return matchKey && matchModule && matchSev && matchTime;
  });

  renderAuditLogsTable(filtered);
  const badge = document.getElementById('auditLogCountBadge');
  if (badge) badge.innerText = `${filtered.length} bản ghi`;
}

function resetAuditFilters() {
  if (document.getElementById('auditSearchInput')) document.getElementById('auditSearchInput').value = '';
  if (document.getElementById('auditFilterModule')) document.getElementById('auditFilterModule').value = '';
  if (document.getElementById('auditFilterSeverity')) document.getElementById('auditFilterSeverity').value = '';
  if (document.getElementById('auditFilterTime')) document.getElementById('auditFilterTime').value = '';
  renderAuditLogsTable(AUDIT_LOGS);
  const badge = document.getElementById('auditLogCountBadge');
  if (badge) badge.innerText = `${AUDIT_LOGS.length} bản ghi`;
  showToast('Đã đặt lại bộ lọc nhật ký kiểm toán!', 'info');
}

function openAuditDiffModal(logId) {
  const log = AUDIT_LOGS.find(l => l.id === logId);
  if (!log) return;

  document.getElementById('auditDiffMeta').innerHTML = `
    Mã: <strong>${log.id}</strong> | Hành động: <strong>${log.action}</strong> | Đối tượng: <strong>${log.target}</strong>
  `;

  document.getElementById('diffBeforeBox').innerText = JSON.stringify(log.diffBefore || { message: 'Bản ghi tạo mới' }, null, 2);
  document.getElementById('diffAfterBox').innerText = JSON.stringify(log.diffAfter || { status: 'Hoàn thành' }, null, 2);

  const modal = document.getElementById('auditDiffModal');
  if (modal) modal.classList.add('active');
}

function exportAuditCsv() {
  let csv = 'Log ID,Timestamp,Actor,Module,Action,Target,Severity,Details\n';
  AUDIT_LOGS.forEach(l => {
    csv += `"${l.id}","${l.timestamp}","${l.actor}","${l.module}","${l.action}","${l.target}","${l.severity}","${l.details}"\n`;
  });
  downloadFile('Linguapay_Audit_Logs.csv', csv, 'text/csv;charset=utf-8;');
  showToast('Đã xuất nhật ký kiểm toán CSV!', 'success');
}

// ==========================================================================
// 14. MODULE 11: SUBSCRIPTION & PLAN LOGIC
// ==========================================================================
function switchSubPlanSubtab(tabKey, btn) {
  document.querySelectorAll('#viewSubscriptions .module-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#viewSubscriptions .module-tab-panel').forEach(p => p.classList.remove('active'));

  if (btn) btn.classList.add('active');

  if (tabKey === 'plans') {
    document.getElementById('subpanelPlans')?.classList.add('active');
  } else {
    document.getElementById('subpanelSubscriptions')?.classList.add('active');
  }
}

function renderPlanCardsGrid(plans = SUBSCRIPTION_PLANS) {
  const container = document.getElementById('planCardsGrid');
  if (!container) return;

  container.innerHTML = plans.map(p => `
    <div class="plan-card ${p.id.includes('vip') ? 'highlight' : ''}">
      ${p.discountBadge ? `<span class="plan-discount-badge">${p.discountBadge}</span>` : ''}
      <h3 style="font-size:1.15rem;color:var(--text-primary);">${p.name}</h3>
      <p style="font-size:0.8rem;color:var(--text-muted);min-height:36px;">${p.description}</p>
      <div class="plan-price-num">${p.priceFormatted}</div>
      <div class="plan-period-text">Chu kỳ: ${p.billingPeriod}</div>

      <ul class="plan-features-list">
        ${p.features.map(f => `<li><i class="fa-solid fa-check"></i> <span>${f}</span></li>`).join('')}
      </ul>

      <div style="background:#f8fafc;padding:10px;border-radius:6px;font-size:0.75rem;margin-bottom:14px;">
        <div>AI Stories: <strong>${p.limits.aiStoriesPerDay}/ngày</strong></div>
        <div>Chủ đề mở khóa: <strong>${p.limits.unlockedTopics} chủ đề</strong></div>
        <div>Chấm phát âm AI: <strong>${p.limits.pronounceAiCheck ? 'Có' : 'Không'}</strong></div>
      </div>

      <div style="display:flex;gap:8px;margin-top:auto;">
        <button type="button" class="btn-action btn-outline" style="flex:1;justify-content:center;font-size:0.8rem;" onclick="editPlanPrice('${p.id}')">
          <i class="fa-solid fa-pen"></i> Đổi Giá
        </button>
        <button type="button" class="btn-action ${p.status === 'ACTIVE' ? 'btn-primary' : 'btn-outline'}" style="flex:1;justify-content:center;font-size:0.8rem;" onclick="togglePlanStatus('${p.id}')">
          ${p.status === 'ACTIVE' ? 'Đang Bán' : 'Tạm Dừng'}
        </button>
      </div>
    </div>
  `).join('');
}

function editPlanPrice(planId) {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  if (!plan) return;

  const newPrice = prompt(`Nhập giá mới (VNĐ) cho "${plan.name}":`, plan.price);
  if (newPrice && !isNaN(newPrice)) {
    plan.price = parseInt(newPrice);
    plan.priceFormatted = parseInt(newPrice).toLocaleString('vi-VN') + ' ₫';
    renderPlanCardsGrid();
    showToast(`Đã cập nhật giá niêm yết cho gói ${plan.name}!`, 'success');
  }
}

function togglePlanStatus(planId) {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  if (!plan) return;

  plan.status = plan.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  renderPlanCardsGrid();
  showToast(`Đã chuyển trạng thái bán của gói ${plan.name}!`, 'info');
}

function renderUserSubscriptionsTable(subs = USER_SUBSCRIPTIONS) {
  const tbody = document.getElementById('userSubscriptionsTableBody');
  if (!tbody) return;

  if (subs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:32px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.4rem;margin-bottom:8px;display:block;"></i>Không tìm thấy thuê bao học viên phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = subs.map(s => `
    <tr>
      <td><span class="mono-code">${s.id}</span></td>
      <td><strong>${s.userName}</strong></td>
      <td>${s.userEmail}</td>
      <td><span class="badge-status badge-info">${s.planName}</span></td>
      <td>${s.startDate}</td>
      <td><strong>${s.endDate}</strong></td>
      <td>
        <span class="badge-status ${s.autoRenew ? 'badge-success' : 'badge-neutral'}">
          ${s.autoRenew ? 'Bật (Auto)' : 'Tắt'}
        </span>
      </td>
      <td>
        <span class="badge-status ${s.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}">${s.status}</span>
      </td>
      <td style="text-align:right;">
        <button type="button" class="btn-action-icon" title="Gia hạn thủ công" onclick="openExtendSubModal('${s.id}')">
          <i class="fa-solid fa-calendar-plus" style="color:#2563eb;"></i>
        </button>
        <button type="button" class="btn-action-icon" title="Hủy thuê bao" onclick="cancelSubscription('${s.id}')">
          <i class="fa-solid fa-ban" style="color:#ef4444;"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filterSubTable() {
  const keyword = (document.getElementById('subSearchInput')?.value || '').toLowerCase().trim();
  const planFilter = document.getElementById('subFilterPlan')?.value || '';
  const statusFilter = document.getElementById('subFilterStatus')?.value || '';
  const autoFilter = document.getElementById('subFilterAutoRenew')?.value || '';

  const filtered = USER_SUBSCRIPTIONS.filter(s => {
    const matchKey = s.id.toLowerCase().includes(keyword) ||
      s.userName.toLowerCase().includes(keyword) ||
      s.userEmail.toLowerCase().includes(keyword);

    const matchPlan = !planFilter || s.planName.includes(planFilter);
    const matchStatus = !statusFilter || s.status === statusFilter;
    const matchAuto = !autoFilter || String(s.autoRenew) === autoFilter;
    return matchKey && matchPlan && matchStatus && matchAuto;
  });

  renderUserSubscriptionsTable(filtered);
  const badge = document.getElementById('subFilterCountBadge');
  if (badge) badge.innerText = `${filtered.length} đăng ký`;
}

function resetSubFilters() {
  if (document.getElementById('subSearchInput')) document.getElementById('subSearchInput').value = '';
  if (document.getElementById('subFilterPlan')) document.getElementById('subFilterPlan').value = '';
  if (document.getElementById('subFilterStatus')) document.getElementById('subFilterStatus').value = '';
  if (document.getElementById('subFilterAutoRenew')) document.getElementById('subFilterAutoRenew').value = '';
  renderUserSubscriptionsTable(USER_SUBSCRIPTIONS);
  const badge = document.getElementById('subFilterCountBadge');
  if (badge) badge.innerText = `${USER_SUBSCRIPTIONS.length} đăng ký`;
  showToast('Đã đặt lại bộ lọc gói cước & thuê bao!', 'info');
}

function openExtendSubModal(subId) {
  const sub = USER_SUBSCRIPTIONS.find(s => s.id === subId);
  if (!sub) return;

  document.getElementById('extendSubId').value = sub.id;
  document.getElementById('extendUserName').value = `${sub.userName} (${sub.userEmail})`;
  document.getElementById('extendPlanName').value = sub.planName;
  document.getElementById('extendReasonInput').value = '';

  const modal = document.getElementById('extendSubModal');
  if (modal) modal.classList.add('active');
}

function openExtendSubForUser(userId) {
  const sub = USER_SUBSCRIPTIONS.find(s => s.userId === userId) || USER_SUBSCRIPTIONS[0];
  openExtendSubModal(sub.id);
}

function handleManualExtend(e) {
  e.preventDefault();
  const subId = document.getElementById('extendSubId').value;
  const days = parseInt(document.getElementById('extendDaysSelect').value);
  const reason = document.getElementById('extendReasonInput').value;

  const sub = USER_SUBSCRIPTIONS.find(s => s.id === subId);
  if (!sub) return;

  sub.endDate = `2026-11-${String(Math.floor(Math.random() * 20) + 10)}`;

  AUDIT_LOGS.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actor: `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`,
    module: 'SUBSCRIPTION',
    action: 'MANUAL_EXTEND',
    target: `${sub.id} (${sub.userName})`,
    severity: 'WARNING',
    status: 'SUCCESS',
    details: `Gia hạn thêm ${days} ngày. Lý do: ${reason}`
  });

  closeModal('extendSubModal');
  renderUserSubscriptionsTable();
  renderAuditLogsTable();
  showToast(`Đã gia hạn thành công cho học viên ${sub.userName}!`, 'success');
}

function cancelSubscription(subId) {
  const sub = USER_SUBSCRIPTIONS.find(s => s.id === subId);
  if (!sub) return;

  if (confirm(`Bạn có chắc chắn muốn hủy gói cước của học viên ${sub.userName}?`)) {
    sub.status = 'CANCELLED';
    sub.autoRenew = false;
    renderUserSubscriptionsTable();
    showToast(`Đã hủy đăng ký của học viên ${sub.userName}!`, 'info');
  }
}

// ==========================================================================
// 15. MODULE 12: PAYMENT & RECONCILIATION LOGIC
// ==========================================================================
// ==========================================================================
// 15. PHÂN HỆ TÀI CHÍNH & THANH TOÁN (MODULE 12 CHUẨN BA/PM)
// 9 CHỨC NĂNG CON: DASHBOARD, GIAO DỊCH, TIỀN VÀO, TIỀN RA, HOÀN TIỀN,
// ĐỐI SOÁT NGÂN HÀNG, KÊNH THANH TOÁN, BÁO CÁO, KIỂM SOÁT & AUDIT LOG
// ==========================================================================

function switchFinanceSubtab(tabKey, btn) {
  // Bật active cho button tương ứng trong 9 subtabs
  document.querySelectorAll('#viewTransactions .fin-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    const btnIdMap = {
      'fin-dashboard': 'btnFinTab_dashboard',
      'fin-transactions': 'btnFinTab_transactions',
      'fin-money-in': 'btnFinTab_money_in',
      'fin-money-out': 'btnFinTab_money_out',
      'fin-refunds': 'btnFinTab_refunds',
      'fin-reconciliation': 'btnFinTab_reconciliation',
      'fin-channels': 'btnFinTab_channels',
      'fin-reports': 'btnFinTab_reports',
      'fin-audit': 'btnFinTab_audit'
    };
    const targetBtn = document.getElementById(btnIdMap[tabKey]);
    if (targetBtn) targetBtn.classList.add('active');
  }

  // Ẩn/Hiện panel tương ứng
  document.querySelectorAll('#viewTransactions .module-tab-panel').forEach(p => p.classList.remove('active'));

  const panelIdMap = {
    'fin-dashboard': 'panelFinDashboard',
    'fin-transactions': 'panelFinTransactions',
    'fin-money-in': 'panelFinMoneyIn',
    'fin-money-out': 'panelFinMoneyOut',
    'fin-refunds': 'panelFinRefunds',
    'fin-reconciliation': 'panelFinReconciliation',
    'fin-channels': 'panelFinChannels',
    'fin-reports': 'panelFinReports',
    'fin-audit': 'panelFinAudit'
  };

  const panelId = panelIdMap[tabKey] || 'panelFinDashboard';
  const targetPanel = document.getElementById(panelId);
  if (targetPanel) targetPanel.classList.add('active');

  // Khởi chạy render dữ liệu
  if (tabKey === 'fin-dashboard') renderFinanceDashboard();
  else if (tabKey === 'fin-transactions') renderPaymentTxnTable();
  else if (tabKey === 'fin-money-in') renderMoneyInTable();
  else if (tabKey === 'fin-money-out') renderMoneyOutTable();
  else if (tabKey === 'fin-refunds') renderRefundsTable();
  else if (tabKey === 'fin-reconciliation') {
    renderReconciliationSessions();
    renderReconcileDiffTable();
  }
  else if (tabKey === 'fin-channels') renderPaymentChannels();
  else if (tabKey === 'fin-reports') renderFinancialReports();
  else if (tabKey === 'fin-audit') renderFinancialAuditTable();
}

// --------------------------------------------------------------------------
// 12.1. FINANCIAL DASHBOARD
// --------------------------------------------------------------------------
function renderFinanceDashboard() {
  if (typeof FINANCIAL_OVERVIEW === 'undefined') return;

  const kpiIn = document.getElementById('kpiGrossIn');
  if (kpiIn) kpiIn.innerText = FINANCIAL_OVERVIEW.totalGrossInFormatted;

  const kpiRef = document.getElementById('kpiRefund');
  if (kpiRef) kpiRef.innerText = FINANCIAL_OVERVIEW.totalRefundedFormatted;

  const kpiFee = document.getElementById('kpiFees');
  if (kpiFee) kpiFee.innerText = FINANCIAL_OVERVIEW.totalGatewayFeesFormatted;

  const kpiNet = document.getElementById('kpiNetReceived');
  if (kpiNet) kpiNet.innerText = FINANCIAL_OVERVIEW.netEstimatedReceivedFormatted;
}

function applyFinanceDashboardFilter() {
  const channel = document.getElementById('finFilterChannel')?.value;
  showToast(`Đang lọc dữ liệu tài chính theo kênh: ${channel || 'Tất cả'}`, 'info');
}

// --------------------------------------------------------------------------
// 12.2. TRANSACTION MANAGEMENT
// --------------------------------------------------------------------------
function renderPaymentTxnTable(txns = PAYMENT_TRANSACTIONS) {
  const tbody = document.getElementById('paymentTxnTableBody');
  if (!tbody) return;

  if (txns.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:32px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.4rem;margin-bottom:8px;display:block;"></i>Không tìm thấy giao dịch tài chính nào phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = txns.map(t => `
    <tr>
      <td><span class="mono-code">${t.id}</span></td>
      <td><strong>${t.orderCode}</strong></td>
      <td>
        <div><strong>${t.userName}</strong></div>
        <span style="font-size:0.75rem;color:var(--text-muted);">${t.userEmail}</span>
      </td>
      <td>${t.planName}</td>
      <td><strong style="color:#173d8f;">${t.amountFormatted}</strong></td>
      <td>
        <div>${t.paymentMethod}</div>
        <span style="font-size:0.72rem;color:var(--text-muted);">${t.paymentMethod.includes('MB') ? 'MB Bank' : t.paymentMethod.includes('PayOS') ? 'PayOS' : 'Cổng đối tác'}</span>
      </td>
      <td><span class="mono-code" style="color:#6366f1;">${t.providerTxnId || '--'}</span></td>
      <td>
        <span class="badge-status ${t.status === 'SUCCESS' ? 'badge-success' : t.status === 'REFUNDED' ? 'badge-danger' : t.status === 'AMOUNT_MISMATCH' || t.status === 'CODE_MISMATCH' ? 'badge-warning' : 'badge-neutral'}">
          ${t.status === 'SUCCESS' ? 'Thành công' : t.status === 'REFUNDED' ? 'Đã hoàn tiền' : t.status === 'AMOUNT_MISMATCH' ? 'Lệch số tiền' : t.status === 'CODE_MISMATCH' ? 'Sai cú pháp' : t.status}
        </span>
      </td>
      <td style="font-size:0.75rem;color:var(--text-muted);">${t.paidAt || t.createdAt}</td>
      <td style="text-align:right;white-space:nowrap;">
        <button type="button" class="btn-action-icon" title="Xem chi tiết 4 khu vực (A-B-C-D)" onclick="openTxnDetailModal('${t.id}')">
          <i class="fa-solid fa-eye"></i>
        </button>
        <button type="button" class="btn-action-icon" title="Kiểm tra lại với nhà cung cấp (API Check)" onclick="checkSingleTxnStatus('${t.id}')">
          <i class="fa-solid fa-arrows-rotate" style="color:#10b981;"></i>
        </button>
        ${t.status === 'SUCCESS' ? `
          <button type="button" class="btn-action-icon" title="Tạo yêu cầu hoàn tiền" onclick="openCreateRefundModal('${t.id}')">
            <i class="fa-solid fa-rotate-left" style="color:#ef4444;"></i>
          </button>
        ` : ''}
      </td>
    </tr>
  `).join('');
}

function filterTxnTable() {
  const keyword = (document.getElementById('txnSearchInput')?.value || '').toLowerCase().trim();
  const channelFilter = document.getElementById('txnFilterChannel')?.value || '';
  const planFilter = document.getElementById('txnFilterPlan')?.value || '';
  const statusFilter = document.getElementById('txnFilterStatus')?.value || '';

  const filtered = PAYMENT_TRANSACTIONS.filter(t => {
    const matchKey = t.id.toLowerCase().includes(keyword) ||
      t.orderCode.toLowerCase().includes(keyword) ||
      t.userName.toLowerCase().includes(keyword) ||
      t.userEmail.toLowerCase().includes(keyword);

    const matchChannel = !channelFilter || t.paymentMethod.toLowerCase().includes(channelFilter.toLowerCase());
    const matchPlan = !planFilter || t.planName.toLowerCase().includes(planFilter.toLowerCase());
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchKey && matchChannel && matchPlan && matchStatus;
  });

  renderPaymentTxnTable(filtered);
  const badge = document.getElementById('txnFilterCountBadge');
  if (badge) badge.innerText = `${filtered.length} giao dịch`;
}

function resetTxnFilters() {
  if (document.getElementById('txnSearchInput')) document.getElementById('txnSearchInput').value = '';
  if (document.getElementById('txnFilterChannel')) document.getElementById('txnFilterChannel').value = '';
  if (document.getElementById('txnFilterPlan')) document.getElementById('txnFilterPlan').value = '';
  if (document.getElementById('txnFilterStatus')) document.getElementById('txnFilterStatus').value = '';
  renderPaymentTxnTable(PAYMENT_TRANSACTIONS);
  const badge = document.getElementById('txnFilterCountBadge');
  if (badge) badge.innerText = `${PAYMENT_TRANSACTIONS.length} giao dịch`;
  showToast('Đã đặt lại bộ lọc giao dịch!', 'info');
}

// Modal xem chi tiết giao dịch 4 khu vực chuẩn BA (A, B, C, D)
function openTxnDetailModal(txnId) {
  const txn = PAYMENT_TRANSACTIONS.find(t => t.id === txnId);
  if (!txn) return;

  const modalBody = document.getElementById('txnDetailModalBody');
  if (!modalBody) return;

  const fee = Math.round(txn.amount * 0.01);
  const netSettlement = txn.amount - fee;

  modalBody.innerHTML = `
    <div class="txn-detail-zones">
      <!-- KHU VỰC A: THÔNG TIN GIAO DỊCH -->
      <div class="txn-zone-card">
        <h4><i class="fa-solid fa-receipt"></i> A. Thông Tin Giao Dịch</h4>
        <div class="txn-zone-fields">
          <div class="txn-zone-field"><span class="field-lbl">Mã giao dịch nội bộ:</span><span class="field-val mono-code">${txn.id}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Mã đơn hàng liên kết:</span><span class="field-val">${txn.orderCode}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Trạng thái hiện tại:</span><span class="field-val"><span class="badge-status ${txn.status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}">${txn.status}</span></span></div>
          <div class="txn-zone-field"><span class="field-lbl">Số tiền giao dịch:</span><span class="field-val" style="color:#173d8f;font-weight:700;">${txn.amountFormatted}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Kênh thanh toán:</span><span class="field-val">${txn.paymentMethod}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Mã giao dịch NCC:</span><span class="field-val mono-code" style="color:#6366f1;">${txn.providerTxnId || '--'}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Thời điểm khởi tạo:</span><span class="field-val">${txn.createdAt}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Thời điểm xác nhận:</span><span class="field-val">${txn.paidAt || 'Chưa thanh toán'}</span></div>
        </div>
      </div>

      <!-- KHU VỰC B: NGƯỜI DÙNG & ĐƠN HÀNG -->
      <div class="txn-zone-card">
        <h4><i class="fa-solid fa-user-tag"></i> B. Người Dùng &amp; Đơn Hàng</h4>
        <div class="txn-zone-fields">
          <div class="txn-zone-field"><span class="field-lbl">User ID học viên:</span><span class="field-val mono-code">${txn.userId}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Họ tên học viên:</span><span class="field-val">${txn.userName}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Email tài khoản:</span><span class="field-val">${txn.userEmail}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Gói cước đã mua:</span><span class="field-val"><strong>${txn.planName}</strong></span></div>
          <div class="txn-zone-field"><span class="field-lbl">Mã Subscription:</span><span class="field-val mono-code">SUB-${txn.orderCode}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Thời gian sử dụng:</span><span class="field-val">30 ngày kể từ lúc kích hoạt</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Ghi chú đối soát:</span><span class="field-val" style="font-size:0.75rem;color:#64748b;">${txn.notes}</span></div>
        </div>
      </div>

      <!-- KHU VỰC C: CHI TIẾT DÒNG TIỀN -->
      <div class="txn-zone-card">
        <h4><i class="fa-solid fa-sack-dollar"></i> C. Chi Tiết Dòng Tiền</h4>
        <div class="txn-zone-fields">
          <div class="txn-zone-field"><span class="field-lbl">Tiền khách thanh toán:</span><span class="field-val" style="color:#059669;font-weight:700;">${txn.amountFormatted}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Số tiền hoàn (nếu có):</span><span class="field-val" style="color:#ef4444;">${txn.status === 'REFUNDED' ? txn.amountFormatted : '0 ₫'}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Phí cổng thanh toán:</span><span class="field-val">${fee.toLocaleString('vi-VN')} ₫ (1%)</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Tiền quyết toán thực nhận:</span><span class="field-val" style="color:#173d8f;font-weight:700;">${netSettlement.toLocaleString('vi-VN')} ₫</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Mã tham chiếu đối soát:</span><span class="field-val mono-code">REC-MB-${txn.id.slice(-4)}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Trạng thái quyết toán:</span><span class="field-val"><span class="badge-status badge-success">Đã quyết toán về MB</span></span></div>
        </div>
      </div>

      <!-- KHU VỰC D: LỊCH SỬ XỬ LÝ & AUDIT TRACE -->
      <div class="txn-zone-card">
        <h4><i class="fa-solid fa-clock-rotate-left"></i> D. Lịch Sử Xử Lý &amp; Audit Trace</h4>
        <div class="txn-zone-fields">
          <div class="txn-zone-field"><span class="field-lbl">Webhook IPN:</span><span class="field-val">Nhận lúc ${txn.paidAt || txn.createdAt} (200 OK)</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Xác nhận chữ ký số:</span><span class="field-val"><i class="fa-solid fa-shield-check" style="color:#10b981;"></i> Hợp lệ (HMAC-SHA256)</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Tự động kích hoạt:</span><span class="field-val">Kích hoạt tức thì trong 280ms</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Can thiệp thủ công:</span><span class="field-val">${txn.status.includes('MISMATCH') ? 'Admin đã khớp lệnh thủ công' : 'Không có'}</span></div>
          <div class="txn-zone-field"><span class="field-lbl">Người thao tác gần nhất:</span><span class="field-val">Hệ thống tự động (Webhook Daemon)</span></div>
        </div>
      </div>
    </div>
  `;

  const footer = document.getElementById('txnDetailModalFooter');
  if (footer) {
    footer.innerHTML = `
      <button type="button" class="btn-action btn-outline" onclick="closeModal('txnDetailModal')">Đóng</button>
      <button type="button" class="btn-action btn-outline" onclick="checkSingleTxnStatus('${txn.id}')">
        <i class="fa-solid fa-arrows-rotate"></i> Kiểm tra API Nhà Cung Cấp
      </button>
      ${txn.status === 'SUCCESS' ? `
        <button type="button" class="btn-action btn-danger" onclick="closeModal('txnDetailModal'); openCreateRefundModal('${txn.id}');">
          <i class="fa-solid fa-rotate-left"></i> Tạo Yêu Cầu Hoàn Tiền
        </button>
      ` : ''}
    `;
  }

  const modal = document.getElementById('txnDetailModal');
  if (modal) modal.classList.add('active');
}

function checkSingleTxnStatus(txnId) {
  const txn = PAYMENT_TRANSACTIONS.find(t => t.id === txnId);
  if (!txn) return;
  showToast(`Đang kết nối API ${txn.paymentMethod} để xác minh giao dịch ${txn.orderCode}...`, 'info');
  setTimeout(() => {
    showToast(`Xác minh thành công với nhà cung cấp: Trạng thái ${txn.status}, Ref: ${txn.providerTxnId || 'MB8921'}!`, 'success');
  }, 900);
}

function checkProviderStatusMock() {
  showToast('Đang đồng bộ trạng thái giao dịch với MB Bank và PayOS...', 'info');
  setTimeout(() => {
    showToast('Đồng bộ hoàn tất: Toàn bộ 7 giao dịch đã được cập nhật trạng thái mới nhất!', 'success');
  }, 1000);
}

// --------------------------------------------------------------------------
// 12.3. MONEY IN
// --------------------------------------------------------------------------
function renderMoneyInTable(items = MONEY_IN_RECORDS) {
  const tbody = document.getElementById('moneyInTableBody');
  if (!tbody || typeof MONEY_IN_RECORDS === 'undefined') return;

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" style="text-align:center;padding:32px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.4rem;margin-bottom:8px;display:block;"></i>Không tìm thấy khoản tiền vào phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(m => `
    <tr>
      <td><span class="mono-code">${m.id}</span></td>
      <td><strong>${m.source}</strong></td>
      <td><span class="mono-code">${m.txnId}</span> (${m.orderCode})</td>
      <td>
        <div><strong>${m.payer}</strong></div>
        <span style="font-size:0.75rem;color:var(--text-muted);">${m.payerEmail}</span>
      </td>
      <td><strong style="color:#059669;">${m.grossAmountFormatted}</strong></td>
      <td style="color:#f59e0b;">${m.gatewayFeeFormatted}</td>
      <td><strong style="color:#173d8f;">${m.netAmountFormatted}</strong></td>
      <td>${m.channel}</td>
      <td>
        <span class="badge-status ${m.status === 'SETTLED' ? 'badge-success' : m.status === 'PENDING_SETTLEMENT' ? 'badge-warning' : m.status === 'MISMATCH' ? 'badge-danger' : 'badge-neutral'}">
          ${m.statusLabel}
        </span>
      </td>
      <td style="font-size:0.75rem;color:var(--text-muted);">${m.paidAt}</td>
      <td style="font-size:0.75rem;color:var(--text-muted);">${m.settledAt}</td>
      <td style="text-align:right;">
        <button type="button" class="btn-action-icon" title="Xem giao dịch gốc" onclick="openTxnDetailModal('${m.txnId}')">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filterMoneyInTable() {
  const q = (document.getElementById('moneyInSearchInput')?.value || '').toLowerCase().trim();
  const channel = document.getElementById('moneyInFilterChannel')?.value || '';
  const status = document.getElementById('moneyInFilterStatus')?.value || '';

  const filtered = MONEY_IN_RECORDS.filter(m => {
    const matchQ = m.id.toLowerCase().includes(q) ||
      m.orderCode.toLowerCase().includes(q) ||
      m.payer.toLowerCase().includes(q) ||
      m.payerEmail.toLowerCase().includes(q) ||
      m.txnId.toLowerCase().includes(q);
    const matchChannel = !channel || m.channel.toLowerCase().includes(channel.toLowerCase());
    const matchStatus = !status || m.status === status;
    return matchQ && matchChannel && matchStatus;
  });

  renderMoneyInTable(filtered);
  const badge = document.getElementById('moneyInCountBadge');
  if (badge) badge.innerText = `${filtered.length} khoản thu`;
}

function resetMoneyInFilters() {
  if (document.getElementById('moneyInSearchInput')) document.getElementById('moneyInSearchInput').value = '';
  if (document.getElementById('moneyInFilterChannel')) document.getElementById('moneyInFilterChannel').value = '';
  if (document.getElementById('moneyInFilterStatus')) document.getElementById('moneyInFilterStatus').value = '';
  renderMoneyInTable(MONEY_IN_RECORDS);
  const badge = document.getElementById('moneyInCountBadge');
  if (badge) badge.innerText = `${MONEY_IN_RECORDS.length} khoản thu`;
  showToast('Đã đặt lại bộ lọc Tiền Vào!', 'info');
}

function exportMoneyInCsv() {
  let csv = 'Money In ID,Source,Transaction ID,Order Code,Payer,Email,Gross Amount,Gateway Fee,Net Amount,Channel,Status,Paid At,Settled At\n';
  MONEY_IN_RECORDS.forEach(m => {
    csv += `"${m.id}","${m.source}","${m.txnId}","${m.orderCode}","${m.payer}","${m.payerEmail}",${m.grossAmount},${m.gatewayFee},${m.netAmount},"${m.channel}","${m.statusLabel}","${m.paidAt}","${m.settledAt}"\n`;
  });
  downloadFile('Linguapay_Money_In.csv', csv, 'text/csv;charset=utf-8;');
  showToast('Đã xuất báo cáo chi tiết Tiền Vào (Money In) CSV!', 'success');
}

// --------------------------------------------------------------------------
// 12.4. MONEY OUT & OPERATING EXPENSES
// --------------------------------------------------------------------------
function renderMoneyOutTable(items = MONEY_OUT_RECORDS) {
  const tbody = document.getElementById('moneyOutTableBody');
  if (!tbody || typeof MONEY_OUT_RECORDS === 'undefined') return;

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;padding:32px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.4rem;margin-bottom:8px;display:block;"></i>Không tìm thấy khoản tiền ra phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(o => `
    <tr>
      <td><span class="mono-code">${o.id}</span></td>
      <td>
        <span class="badge-status ${o.type === 'REFUND' ? 'badge-danger' : o.type === 'GATEWAY_FEE' ? 'badge-warning' : 'badge-neutral'}">
          ${o.typeLabel}
        </span>
      </td>
      <td><strong>${o.recipient}</strong></td>
      <td><span class="mono-code">${o.relatedTxnId}</span></td>
      <td><strong style="color:#ef4444;">${o.amountFormatted}</strong></td>
      <td>${o.method}</td>
      <td>
        <span class="badge-status ${o.status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}">
          ${o.statusLabel}
        </span>
      </td>
      <td style="font-size:0.75rem;color:var(--text-muted);">${o.createdAt}</td>
      <td style="font-size:0.75rem;color:var(--text-muted);">${o.paidAt || '--'}</td>
      <td style="font-size:0.78rem;">
        <div>${o.creator}</div>
        <small style="color:var(--text-muted);">${o.approver}</small>
      </td>
      <td style="text-align:right;">
        <button type="button" class="btn-action-icon" title="Chi tiết khoản chi" onclick="alert('Chi tiết khoản chi ${o.id}:\\nLý do: ${o.notes}\\nSố tiền: ${o.amountFormatted}')">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filterMoneyOutTable() {
  const q = (document.getElementById('moneyOutSearchInput')?.value || '').toLowerCase().trim();
  const type = document.getElementById('moneyOutFilterType')?.value || '';
  const status = document.getElementById('moneyOutFilterStatus')?.value || '';

  const filtered = MONEY_OUT_RECORDS.filter(o => {
    const matchQ = o.id.toLowerCase().includes(q) ||
      o.recipient.toLowerCase().includes(q) ||
      o.relatedTxnId.toLowerCase().includes(q) ||
      (o.notes && o.notes.toLowerCase().includes(q));
    const matchType = !type || o.type === type;
    const matchStatus = !status || (status === 'PAID' ? o.status === 'SUCCESS' : o.status === 'PENDING');
    return matchQ && matchType && matchStatus;
  });

  renderMoneyOutTable(filtered);
  const badge = document.getElementById('moneyOutCountBadge');
  if (badge) badge.innerText = `${filtered.length} khoản chi`;
}

function resetMoneyOutFilters() {
  if (document.getElementById('moneyOutSearchInput')) document.getElementById('moneyOutSearchInput').value = '';
  if (document.getElementById('moneyOutFilterType')) document.getElementById('moneyOutFilterType').value = '';
  if (document.getElementById('moneyOutFilterStatus')) document.getElementById('moneyOutFilterStatus').value = '';
  renderMoneyOutTable(MONEY_OUT_RECORDS);
  const badge = document.getElementById('moneyOutCountBadge');
  if (badge) badge.innerText = `${MONEY_OUT_RECORDS.length} khoản chi`;
  showToast('Đã đặt lại bộ lọc Tiền Ra!', 'info');
}

function openCreateExpenseModal() {
  const modal = document.getElementById('createExpenseModal');
  if (modal) modal.classList.add('active');
}

function handleCreateExpense(e) {
  e.preventDefault();
  const type = document.getElementById('expenseTypeSelect').value;
  const amount = parseInt(document.getElementById('expenseAmountInput').value);
  const recipient = document.getElementById('expenseRecipientInput').value;
  const purpose = document.getElementById('expensePurposeInput').value;
  const method = document.getElementById('expenseMethodSelect').value;
  const refCode = document.getElementById('expenseRefCodeInput').value || `REF-EXP-${Date.now().toString().slice(-4)}`;

  const newRecord = {
    id: `OUT-${Date.now().toString().slice(-4)}`,
    type: type,
    typeLabel: type === 'GATEWAY_FEE' ? 'Phí cổng thanh toán' : type === 'CLOUD_INFRA' ? 'Hạ tầng Cloud AWS' : type === 'AI_SERVICES' ? 'Chi phí OpenAI API' : 'Chi phí vận hành',
    recipient: recipient,
    relatedTxnId: refCode,
    amount: amount,
    amountFormatted: `${amount.toLocaleString('vi-VN')} ₫`,
    method: method,
    status: 'SUCCESS',
    statusLabel: 'Đã chi thành công',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    paidAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    creator: `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`,
    approver: 'Super Admin Tuấn',
    notes: purpose
  };

  MONEY_OUT_RECORDS.unshift(newRecord);

  FINANCIAL_AUDIT_LOGS.unshift({
    id: `FIN-LOG-${Date.now().toString().slice(-4)}`,
    actor: `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`,
    action: 'Tạo đề nghị chi vận hành (CREATE_EXPENSE)',
    object: `${newRecord.id} (${newRecord.amountFormatted})`,
    oldValue: '--',
    newValue: `Đã chi: ${purpose}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    result: 'SUCCESS',
    reason: purpose,
    correlationId: refCode
  });

  closeModal('createExpenseModal');
  renderMoneyOutTable();
  renderFinancialAuditTable();
  showToast(`Đã ghi nhận thành công khoản chi ${newRecord.amountFormatted} cho ${recipient}!`, 'success');
}

function exportMoneyOutCsv() {
  let csv = 'Expense ID,Type,Recipient,Reference,Amount,Method,Status,Created At,Paid At,Creator,Approver,Notes\n';
  MONEY_OUT_RECORDS.forEach(o => {
    csv += `"${o.id}","${o.typeLabel}","${o.recipient}","${o.relatedTxnId}",${o.amount},"${o.method}","${o.statusLabel}","${o.createdAt}","${o.paidAt || ''}","${o.creator}","${o.approver}","${o.notes}"\n`;
  });
  downloadFile('Linguapay_Money_Out.csv', csv, 'text/csv;charset=utf-8;');
  showToast('Đã xuất báo cáo Tiền Ra (Money Out) CSV!', 'success');
}

// --------------------------------------------------------------------------
// 12.5. REFUND MANAGEMENT
// --------------------------------------------------------------------------
function renderRefundsTable(items = REFUND_REQUESTS) {
  const tbody = document.getElementById('refundsTableBody');
  if (!tbody || typeof REFUND_REQUESTS === 'undefined') return;

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;padding:32px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.4rem;margin-bottom:8px;display:block;"></i>Không tìm thấy yêu cầu hoàn tiền nào phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(r => `
    <tr>
      <td><span class="mono-code">${r.id}</span></td>
      <td>
        <span class="mono-code">${r.originalTxnId}</span>
        <div style="font-size:0.75rem;color:var(--text-muted);">${r.orderCode}</div>
      </td>
      <td>
        <div><strong>${r.requester}</strong></div>
        <span style="font-size:0.75rem;color:var(--text-muted);">${r.userEmail}</span>
      </td>
      <td>${r.originalAmountFormatted}</td>
      <td><strong style="color:#ef4444;">${r.refundAmountFormatted}</strong></td>
      <td>
        <div>${r.reason}</div>
        <span class="badge-status badge-neutral" style="font-size:0.68rem;">${r.reasonCategory}</span>
      </td>
      <td>
        <span class="badge-status ${r.status === 'SUCCESS' ? 'badge-success' : r.status === 'APPROVED' ? 'badge-purple' : r.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}">
          ${r.statusLabel}
        </span>
      </td>
      <td>${r.approver}</td>
      <td style="font-size:0.75rem;color:var(--text-muted);">${r.createdAt}</td>
      <td style="font-size:0.75rem;color:var(--text-muted);">${r.completedAt || '--'}</td>
      <td style="text-align:right;white-space:nowrap;">
        ${r.status === 'PENDING' ? `
          <button type="button" class="btn-action btn-primary" style="padding:4px 8px;font-size:0.75rem;" onclick="approveRefund('${r.id}')">
            <i class="fa-solid fa-check"></i> Duyệt
          </button>
          <button type="button" class="btn-action btn-danger" style="padding:4px 8px;font-size:0.75rem;" onclick="rejectRefund('${r.id}')">
            <i class="fa-solid fa-xmark"></i> Từ chối
          </button>
        ` : r.status === 'APPROVED' ? `
          <button type="button" class="btn-action btn-purple" style="padding:4px 8px;font-size:0.75rem;" onclick="executeRefundViaGateway('${r.id}')">
            <i class="fa-solid fa-paper-plane"></i> Hoàn qua Cổng
          </button>
        ` : `
          <button type="button" class="btn-action-icon" title="Xem bằng chứng hoàn tiền" onclick="alert('${r.proofNote}')">
            <i class="fa-solid fa-file-circle-check" style="color:#10b981;"></i>
          </button>
        `}
      </td>
    </tr>
  `).join('');
}

function filterRefundsTable() {
  const q = (document.getElementById('refundSearchInput')?.value || '').toLowerCase().trim();
  const reason = document.getElementById('refundFilterReason')?.value || '';
  const status = document.getElementById('refundFilterStatus')?.value || '';

  const filtered = REFUND_REQUESTS.filter(r => {
    const matchQ = r.id.toLowerCase().includes(q) ||
      r.originalTxnId.toLowerCase().includes(q) ||
      r.orderCode.toLowerCase().includes(q) ||
      r.requester.toLowerCase().includes(q) ||
      r.userEmail.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q);
    const matchReason = !reason || r.reason.includes(reason) || r.reasonCategory.includes(reason);
    let matchStatus = true;
    if (status === 'PENDING') matchStatus = r.status === 'PENDING';
    else if (status === 'COMPLETED') matchStatus = r.status === 'SUCCESS' || r.status === 'APPROVED';
    else if (status === 'REJECTED') matchStatus = r.status === 'REJECTED';
    return matchQ && matchReason && matchStatus;
  });

  renderRefundsTable(filtered);
  const badge = document.getElementById('refundCountBadge');
  if (badge) badge.innerText = `${filtered.length} yêu cầu`;
}

function resetRefundFilters() {
  if (document.getElementById('refundSearchInput')) document.getElementById('refundSearchInput').value = '';
  if (document.getElementById('refundFilterReason')) document.getElementById('refundFilterReason').value = '';
  if (document.getElementById('refundFilterStatus')) document.getElementById('refundFilterStatus').value = '';
  renderRefundsTable(REFUND_REQUESTS);
  const badge = document.getElementById('refundCountBadge');
  if (badge) badge.innerText = `${REFUND_REQUESTS.length} yêu cầu`;
  showToast('Đã đặt lại bộ lọc hoàn tiền!', 'info');
}

function openCreateRefundModal(prefillTxnId = null) {
  const select = document.getElementById('refundSelectTxn');
  if (select) {
    select.innerHTML = '<option value="">-- Chọn giao dịch cần hoàn tiền --</option>' +
      PAYMENT_TRANSACTIONS.filter(t => t.status === 'SUCCESS' || t.status === 'AMOUNT_MISMATCH').map(t => `
        <option value="${t.id}" ${t.id === prefillTxnId ? 'selected' : ''}>
          ${t.id} - ${t.orderCode} (${t.userName} - ${t.amountFormatted})
        </option>
      `).join('');
  }

  if (prefillTxnId) {
    handleSelectRefundTxn(prefillTxnId);
  } else {
    document.getElementById('refundFormOriginalAmt').value = '';
    document.getElementById('refundFormReqAmt').value = '';
  }

  const modal = document.getElementById('createRefundModal');
  if (modal) modal.classList.add('active');
}

function handleSelectRefundTxn(txnId) {
  const txn = PAYMENT_TRANSACTIONS.find(t => t.id === txnId);
  if (!txn) return;
  document.getElementById('refundFormOriginalAmt').value = txn.amountFormatted;
  document.getElementById('refundFormReqAmt').value = txn.amount;
  document.getElementById('refundFormReqAmt').max = txn.amount;
}

function handleCreateRefundRequest(e) {
  e.preventDefault();
  const txnId = document.getElementById('refundSelectTxn').value;
  const refundAmt = parseInt(document.getElementById('refundFormReqAmt').value);
  const reasonCat = document.getElementById('refundFormReasonCategory').value;
  const note = document.getElementById('refundFormNote').value;

  const txn = PAYMENT_TRANSACTIONS.find(t => t.id === txnId);
  if (!txn) return;

  if (refundAmt > txn.amount) {
    alert(`Số tiền hoàn (${refundAmt.toLocaleString('vi-VN')} ₫) không được vượt quá số tiền gốc (${txn.amountFormatted})!`);
    return;
  }

  const newRefund = {
    id: `REF-202610-${String(REFUND_REQUESTS.length + 1).padStart(2, '0')}`,
    originalTxnId: txn.id,
    orderCode: txn.orderCode,
    requester: `${txn.userName} (Học viên)`,
    userEmail: txn.userEmail,
    originalAmount: txn.amount,
    originalAmountFormatted: txn.amountFormatted,
    refundAmount: refundAmt,
    refundAmountFormatted: `${refundAmt.toLocaleString('vi-VN')} ₫`,
    reason: note || reasonCat,
    reasonCategory: reasonCat,
    status: 'PENDING',
    statusLabel: 'Chờ duyệt',
    approver: 'Finance Manager Trang',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    completedAt: null,
    proofNote: 'Đang xếp hàng phê duyệt rủi ro tài chính'
  };

  REFUND_REQUESTS.unshift(newRefund);

  FINANCIAL_AUDIT_LOGS.unshift({
    id: `FIN-LOG-${Date.now().toString().slice(-4)}`,
    actor: `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`,
    action: 'Tạo yêu cầu hoàn tiền (CREATE_REFUND_REQ)',
    object: `${newRefund.id} (${txn.orderCode})`,
    oldValue: '--',
    newValue: `Đề nghị hoàn: ${newRefund.refundAmountFormatted}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    result: 'SUCCESS',
    reason: reasonCat,
    correlationId: `REQ-REF-${txn.id}`
  });

  closeModal('createRefundModal');
  renderRefundsTable();
  renderFinancialAuditTable();
  showToast(`Đã tạo thành công yêu cầu hoàn tiền ${newRefund.id}!`, 'success');
}

function approveRefund(refundId) {
  const r = REFUND_REQUESTS.find(req => req.id === refundId);
  if (!r) return;

  r.status = 'APPROVED';
  r.statusLabel = 'Đã duyệt';
  r.approver = `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`;

  FINANCIAL_AUDIT_LOGS.unshift({
    id: `FIN-LOG-${Date.now().toString().slice(-4)}`,
    actor: `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`,
    action: 'Phê duyệt yêu cầu hoàn tiền (REFUND_APPROVED)',
    object: `${r.id} (${r.orderCode})`,
    oldValue: 'Trạng thái: CHỜ DUYỆT',
    newValue: 'Trạng thái: ĐÃ DUYỆT',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    result: 'SUCCESS',
    reason: 'Đã xác minh đầy đủ điều kiện theo chính sách hoàn tiền',
    correlationId: `APP-REF-${r.id}`
  });

  renderRefundsTable();
  renderFinancialAuditTable();
  showToast(`Đã duyệt yêu cầu hoàn tiền ${r.id}! Có thể chuyển hoàn qua cổng.`, 'success');
}

function rejectRefund(refundId) {
  const r = REFUND_REQUESTS.find(req => req.id === refundId);
  if (!r) return;

  const reason = prompt('Nhập lý do từ chối yêu cầu hoàn tiền:', 'Không đủ điều kiện bảo hành 7 ngày');
  if (!reason) return;

  r.status = 'REJECTED';
  r.statusLabel = 'Từ chối';
  r.proofNote = `Lý do từ chối: ${reason}`;

  renderRefundsTable();
  showToast(`Đã từ chối yêu cầu hoàn tiền ${r.id}!`, 'info');
}

function executeRefundViaGateway(refundId) {
  const r = REFUND_REQUESTS.find(req => req.id === refundId);
  if (!r) return;

  showToast(`Đang kết nối API ngân hàng / VietQR để hoàn ${r.refundAmountFormatted}...`, 'info');
  setTimeout(() => {
    r.status = 'SUCCESS';
    r.statusLabel = 'Thành công';
    r.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    r.proofNote = `Mã đối chiếu chuyển hoàn MB-REF-${Date.now().toString().slice(-4)} (200 OK)`;

    // Cập nhật giao dịch gốc
    const txn = PAYMENT_TRANSACTIONS.find(t => t.id === r.originalTxnId);
    if (txn) txn.status = 'REFUNDED';

    renderRefundsTable();
    renderPaymentTxnTable();
    showToast(`Đã hoàn tiền ${r.refundAmountFormatted} thành công cho học viên qua cổng VietQR!`, 'success');
  }, 1000);
}

function exportRefundsCsv() {
  let csv = 'Refund ID,Txn ID,Order Code,Requester,Email,Original Amount,Refund Amount,Reason,Status,Approver,Created At,Completed At\n';
  REFUND_REQUESTS.forEach(r => {
    csv += `"${r.id}","${r.originalTxnId}","${r.orderCode}","${r.requester}","${r.userEmail}",${r.originalAmount},${r.refundAmount},"${r.reason}","${r.statusLabel}","${r.approver}","${r.createdAt}","${r.completedAt || ''}"\n`;
  });
  downloadFile('Linguapay_Refunds.csv', csv, 'text/csv;charset=utf-8;');
  showToast('Đã xuất danh sách hoàn tiền CSV!', 'success');
}

// --------------------------------------------------------------------------
// 12.6. RECONCILIATION
// --------------------------------------------------------------------------
function renderReconciliationSessions(sessions = RECONCILIATION_SESSIONS) {
  const tbody = document.getElementById('reconciliationSessionsTableBody');
  if (!tbody || typeof RECONCILIATION_SESSIONS === 'undefined') return;

  if (sessions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" style="text-align:center;padding:28px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.3rem;margin-bottom:8px;display:block;"></i>Không tìm thấy phiên đối soát nào phù hợp</td></tr>`;
    return;
  }

  tbody.innerHTML = sessions.map(s => `
    <tr>
      <td><span class="mono-code">${s.id}</span></td>
      <td><strong>${s.channel}</strong></td>
      <td>${s.period}</td>
      <td><span class="mono-code">${s.internalCount}</span></td>
      <td><span class="mono-code">${s.providerCount}</span></td>
      <td>${s.internalAmountFormatted}</td>
      <td>${s.providerAmountFormatted}</td>
      <td><span style="color:#10b981;font-weight:700;">${s.matchedCount}</span></td>
      <td>
        <span style="color:${s.diffCount > 0 ? '#ef4444' : '#10b981'};font-weight:700;">
          ${s.diffCount > 0 ? `${s.diffCount} lệch` : '0 khớp'}
        </span>
      </td>
      <td>
        <span class="badge-status ${s.status === 'COMPLETED' ? 'badge-success' : 'badge-danger'}">
          ${s.statusLabel}
        </span>
      </td>
      <td>${s.auditor}</td>
      <td style="text-align:right;">
        <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;" onclick="showToast('Phiên ${s.id}: ${s.statusLabel}', 'info')">
          <i class="fa-solid fa-list-check"></i> Xem Phiên
        </button>
      </td>
    </tr>
  `).join('');
}

function filterReconSessions() {
  const channel = document.getElementById('reconSessionFilterChannel')?.value || '';
  const status = document.getElementById('reconSessionFilterStatus')?.value || '';

  const filtered = RECONCILIATION_SESSIONS.filter(s => {
    const matchChannel = !channel || s.channel.toLowerCase().includes(channel.toLowerCase()) || channel === 'Toàn bộ';
    const matchStatus = !status || s.statusLabel.toLowerCase().includes(status.toLowerCase());
    return matchChannel && matchStatus;
  });

  renderReconciliationSessions(filtered);
}

function resetReconSessionFilters() {
  if (document.getElementById('reconSessionFilterChannel')) document.getElementById('reconSessionFilterChannel').value = '';
  if (document.getElementById('reconSessionFilterStatus')) document.getElementById('reconSessionFilterStatus').value = '';
  renderReconciliationSessions(RECONCILIATION_SESSIONS);
  showToast('Đã đặt lại bộ lọc phiên đối soát!', 'info');
}

function renderReconcileDiffTable(items = null) {
  const tbody = document.getElementById('reconcileDiffTableBody');
  if (!tbody || typeof RECONCILIATION_SESSIONS === 'undefined' || !RECONCILIATION_SESSIONS[0]) return;

  const diffs = items !== null ? items : (RECONCILIATION_SESSIONS[0].differences || []);
  if (diffs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;padding:28px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.3rem;margin-bottom:8px;display:block;"></i>Không tìm thấy chênh lệch nào phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = diffs.map(d => `
    <tr>
      <td><span class="mono-code">${d.id}</span></td>
      <td><span class="mono-code">${d.internalTxn}</span></td>
      <td><span class="mono-code" style="color:#6366f1;">${d.providerTxn}</span></td>
      <td><strong>${d.orderCode}</strong></td>
      <td>${d.internalAmount.toLocaleString('vi-VN')} ₫</td>
      <td>${d.providerAmount.toLocaleString('vi-VN')} ₫</td>
      <td>
        <strong style="color:${d.diffAmount < 0 ? '#ef4444' : d.diffAmount > 0 ? '#10b981' : '#64748b'};">
          ${d.diffAmount > 0 ? `+${d.diffAmount.toLocaleString('vi-VN')} ₫` : `${d.diffAmount.toLocaleString('vi-VN')} ₫`}
        </strong>
      </td>
      <td><span class="badge-status badge-warning" style="font-size:0.72rem;">${d.type}</span></td>
      <td>
        <span class="badge-status ${d.status === 'Đã khớp thủ công' || d.status === 'Đã giải quyết' ? 'badge-success' : 'badge-neutral'}">
          ${d.status}
        </span>
      </td>
      <td style="font-size:0.78rem;">
        <div>${d.actionTaken}</div>
        <small style="color:var(--text-muted);">${d.handler}</small>
      </td>
      <td style="text-align:right;">
        <button type="button" class="btn-action btn-outline" style="padding:4px 8px;font-size:0.75rem;" onclick="resolveDiscrepancy('${d.id}')">
          <i class="fa-solid fa-wrench"></i> Xử lý
        </button>
      </td>
    </tr>
  `).join('');
}

function filterReconDiff() {
  const q = (document.getElementById('reconDiffSearchInput')?.value || '').toLowerCase().trim();
  const type = document.getElementById('reconDiffFilterType')?.value || '';
  const status = document.getElementById('reconDiffFilterStatus')?.value || '';

  const allDiffs = RECONCILIATION_SESSIONS[0]?.differences || [];
  const filtered = allDiffs.filter(d => {
    const matchQ = d.id.toLowerCase().includes(q) ||
      d.internalTxn.toLowerCase().includes(q) ||
      d.providerTxn.toLowerCase().includes(q) ||
      d.orderCode.toLowerCase().includes(q);
    const matchType = !type || d.type.toLowerCase().includes(type.toLowerCase());
    const matchStatus = !status || d.status.toLowerCase().includes(status.toLowerCase());
    return matchQ && matchType && matchStatus;
  });

  renderReconcileDiffTable(filtered);
  const badge = document.getElementById('reconDiffCountBadge');
  if (badge) badge.innerText = `${filtered.length} bản ghi`;
}

function resetReconDiffFilters() {
  if (document.getElementById('reconDiffSearchInput')) document.getElementById('reconDiffSearchInput').value = '';
  if (document.getElementById('reconDiffFilterType')) document.getElementById('reconDiffFilterType').value = '';
  if (document.getElementById('reconDiffFilterStatus')) document.getElementById('reconDiffFilterStatus').value = '';
  renderReconcileDiffTable(null);
  const allDiffs = RECONCILIATION_SESSIONS[0]?.differences || [];
  const badge = document.getElementById('reconDiffCountBadge');
  if (badge) badge.innerText = `${allDiffs.length} bản ghi`;
  showToast('Đã đặt lại bộ lọc chênh lệch đối soát!', 'info');
}

function resolveDiscrepancy(diffId) {
  const session = RECONCILIATION_SESSIONS[0];
  const diff = session?.differences.find(d => d.id === diffId);
  if (!diff) return;

  const resolution = prompt(`Ghi nhận kết luận xử lý cho chênh lệch ${diff.id} (${diff.orderCode}):`, diff.actionTaken);
  if (!resolution) return;

  diff.status = 'Đã giải quyết';
  diff.actionTaken = resolution;
  diff.handler = `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`;

  FINANCIAL_AUDIT_LOGS.unshift({
    id: `FIN-LOG-${Date.now().toString().slice(-4)}`,
    actor: `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`,
    action: 'Xử lý chênh lệch đối soát (RECONCILE_RESOLVE)',
    object: `${diff.id} (${diff.orderCode})`,
    oldValue: 'Chờ giải quyết',
    newValue: resolution,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    result: 'SUCCESS',
    reason: resolution,
    correlationId: `DIFF-${diff.id}`
  });

  renderReconcileDiffTable();
  renderFinancialAuditTable();
  showToast(`Đã ghi nhận kết quả xử lý cho chênh lệch ${diff.id}!`, 'success');
}

function runFinanceReconcileQuick() {
  showToast('Đang kết nối cổng Bank Gateway và PayOS đối soát tự động...', 'info');
  setTimeout(() => {
    showToast('Đối soát hoàn tất: 42 giao dịch (Khớp 38, Cần xử lý thủ công 4 bản ghi chênh lệch).', 'success');
  }, 1000);
}

function triggerImportReconcileFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv, .xlsx';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      showToast(`Đang nhập file đối soát "${file.name}"... Đã nhận 42 bản ghi sao kê từ ngân hàng!`, 'success');
    }
  };
  input.click();
}

// --------------------------------------------------------------------------
// 12.7. PAYMENT CHANNELS
// --------------------------------------------------------------------------
function renderPaymentChannels(channels = PAYMENT_CHANNELS) {
  const container = document.getElementById('paymentChannelsGrid');
  if (!container || typeof PAYMENT_CHANNELS === 'undefined') return;

  if (channels.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:36px;color:#64748b;background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.5rem;margin-bottom:8px;display:block;"></i>Không tìm thấy kênh thanh toán nào phù hợp với bộ lọc</div>`;
    return;
  }

  container.innerHTML = channels.map(c => `
    <div class="channel-card">
      <div>
        <div class="channel-card-top">
          <div class="channel-identity">
            <div class="channel-icon-avatar">
              <i class="fa-solid ${c.type === 'BANK_DIRECT' ? 'fa-building-columns' : c.type === 'GATEWAY_WEBHOOK' ? 'fa-qrcode' : c.type === 'E_WALLET' ? 'fa-wallet' : 'fa-credit-card'}"></i>
            </div>
            <div class="channel-title">
              <h4>${c.name}</h4>
              <span>${c.provider}</span>
            </div>
          </div>
          <span class="badge-status ${c.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}">
            ${c.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
          </span>
        </div>

        <div class="channel-meta-row">
          <div class="channel-meta-item">
            <span>Loại tích hợp:</span>
            <strong>${c.typeLabel}</strong>
          </div>
          <div class="channel-meta-item">
            <span>Môi trường:</span>
            <span class="badge-status badge-purple" style="font-size:0.68rem;padding:1px 6px;">${c.environment}</span>
          </div>
          <div class="channel-meta-item">
            <span>Biểu phí cổng:</span>
            <strong style="color:#059669;">${c.feeRate}</strong>
          </div>
          <div class="channel-meta-item">
            <span>Tài khoản / Ref:</span>
            <span class="mono-code">${c.accountNumber}</span>
          </div>
          <div class="channel-meta-item">
            <span>Secret API Key:</span>
            <span class="mono-code" style="color:#64748b;">${c.maskedKey}</span>
          </div>
          <div class="channel-meta-item">
            <span>SLA Uptime:</span>
            <strong style="color:#10b981;">${c.uptime}</strong>
          </div>
        </div>
      </div>

      <div class="channel-card-bottom">
        <div style="display:flex;align-items:center;gap:8px;">
          <label class="switch-toggle" title="Bật/Tắt kênh">
            <input type="checkbox" ${c.status === 'ACTIVE' ? 'checked' : ''} onchange="toggleChannelStatus('${c.id}', this.checked)">
            <span class="switch-slider"></span>
          </label>
          <span style="font-size:0.75rem;color:var(--text-muted);">${c.status === 'ACTIVE' ? 'Đang mở' : 'Đã khóa'}</span>
        </div>
        <div style="display:flex;gap:6px;">
          <button type="button" class="btn-action btn-outline" style="padding:5px 9px;font-size:0.74rem;" onclick="pingChannelTest('${c.id}')">
            <i class="fa-solid fa-satellite-dish"></i> Ping Test
          </button>
          <button type="button" class="btn-action btn-outline" style="padding:5px 9px;font-size:0.74rem;" onclick="showToast('Cấu hình API Key được quản lý an toàn tại Backend Vault', 'info')">
            <i class="fa-solid fa-gear"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterPaymentChannels() {
  const q = (document.getElementById('channelSearchInput')?.value || '').toLowerCase().trim();
  const type = document.getElementById('channelFilterType')?.value || '';
  const status = document.getElementById('channelFilterStatus')?.value || '';

  const filtered = PAYMENT_CHANNELS.filter(c => {
    const matchQ = c.name.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.accountNumber.toLowerCase().includes(q);
    let matchType = true;
    if (type === 'BANK_TRANSFER') matchType = c.type === 'BANK_DIRECT' || c.type === 'GATEWAY_WEBHOOK';
    else if (type === 'E_WALLET') matchType = c.type === 'E_WALLET';
    else if (type === 'CREDIT_CARD') matchType = c.type === 'GATEWAY_CARD';
    const matchStatus = !status || c.status === status;
    return matchQ && matchType && matchStatus;
  });

  renderPaymentChannels(filtered);
}

function resetChannelFilters() {
  if (document.getElementById('channelSearchInput')) document.getElementById('channelSearchInput').value = '';
  if (document.getElementById('channelFilterType')) document.getElementById('channelFilterType').value = '';
  if (document.getElementById('channelFilterStatus')) document.getElementById('channelFilterStatus').value = '';
  renderPaymentChannels(PAYMENT_CHANNELS);
  showToast('Đã đặt lại bộ lọc kênh thanh toán!', 'info');
}

function filterFinReports() {
  const q = (document.getElementById('reportSearchInput')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('reportFilterCategory')?.value || '';

  const cards = document.querySelectorAll('#panelFinReports .fin-report-card');
  cards.forEach(card => {
    const title = card.querySelector('.fin-report-title')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.fin-report-desc')?.textContent.toLowerCase() || '';
    const matchQ = title.includes(q) || desc.includes(q);

    let matchCat = true;
    if (cat === 'REVENUE') matchCat = title.includes('thu tiền') || title.includes('doanh thu');
    else if (cat === 'REFUND') matchCat = title.includes('hoàn tiền') || title.includes('tiền ra');
    else if (cat === 'RECON') matchCat = title.includes('đối soát');
    else if (cat === 'PLAN') matchCat = title.includes('gói cước') || title.includes('kênh');

    card.style.display = (matchQ && matchCat) ? 'flex' : 'none';
  });
}

function resetFinReportFilters() {
  if (document.getElementById('reportSearchInput')) document.getElementById('reportSearchInput').value = '';
  if (document.getElementById('reportFilterCategory')) document.getElementById('reportFilterCategory').value = '';
  document.querySelectorAll('#panelFinReports .fin-report-card').forEach(c => c.style.display = 'flex');
  showToast('Đã đặt lại bộ lọc mẫu báo cáo!', 'info');
}

function toggleChannelStatus(channelId, isChecked) {
  const channel = PAYMENT_CHANNELS.find(c => c.id === channelId);
  if (!channel) return;

  channel.status = isChecked ? 'ACTIVE' : 'INACTIVE';

  FINANCIAL_AUDIT_LOGS.unshift({
    id: `FIN-LOG-${Date.now().toString().slice(-4)}`,
    actor: `${ADMIN_ACCOUNTS[0].fullName} (${currentRole})`,
    action: isChecked ? 'Kích hoạt kênh thanh toán (ENABLE_CHANNEL)' : 'Tạm dừng kênh thanh toán (DISABLE_CHANNEL)',
    object: `${channel.id} (${channel.name})`,
    oldValue: isChecked ? 'INACTIVE' : 'ACTIVE',
    newValue: channel.status,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    result: 'SUCCESS',
    reason: 'Thay đổi trạng thái cổng từ giao diện quản trị',
    correlationId: `CFG-${channel.id}`
  });

  renderPaymentChannels();
  renderFinancialAuditTable();
  showToast(`Đã ${isChecked ? 'mở' : 'tắt'} thành công kênh ${channel.name}!`, isChecked ? 'success' : 'info');
}

function pingChannelTest(channelId) {
  const channel = PAYMENT_CHANNELS.find(c => c.id === channelId);
  if (!channel) return;

  showToast(`Đang gửi gói tin kiểm tra kết nối (Ping Health Check) tới ${channel.name}...`, 'info');
  setTimeout(() => {
    channel.lastPing = new Date().toISOString().replace('T', ' ').substring(0, 19);
    showToast(`Kết nối API tới ${channel.name} hoàn hảo! Phản hồi 200 OK (Độ trễ: 42ms)`, 'success');
  }, 700);
}

function openAddPaymentChannelModal() {
  showToast('Chức năng thêm kênh kết nối Gateway mới: Đang hỗ trợ chuẩn VietQR, PayOS, VNPay & Stripe.', 'info');
}

// --------------------------------------------------------------------------
// 12.8. FINANCIAL REPORTS
// --------------------------------------------------------------------------
function renderFinancialReports() {
  // Static 8 cards already present in HTML
}

function previewReport(type) {
  const map = {
    'REV_PERIOD': 'Báo Cáo Thu Tiền Theo Kỳ',
    'REFUND_RISK': 'Báo Cáo Hoàn Tiền & Rủi Ro',
    'MONEY_OUT': 'Báo Cáo Tiền Ra & Phí Cổng',
    'ACCRUAL_REV': 'Báo Cáo Doanh Thu Ghi Nhận',
    'TXN_DETAIL': 'Báo Cáo Chi Tiết Giao Dịch',
    'RECON_DIFF': 'Báo Cáo Đối Soát & Lệch Số',
    'PLAN_SALES': 'Báo Cáo Doanh Số Gói Cước',
    'CHANNEL_PERF': 'Báo Cáo Hiệu Quả Kênh Thanh Toán'
  };
  showToast(`Đang tải dữ liệu bản xem trước của "${map[type]}"...`, 'info');
}

function exportSingleReport(type) {
  const map = {
    'REV_PERIOD': 'Bao_Cao_Thu_Tien_Theo_Ky.csv',
    'REFUND_RISK': 'Bao_Cao_Hoan_Tien_Rui_Ro.csv',
    'MONEY_OUT': 'Bao_Cao_Tien_Ra_Phi_Cong.csv',
    'ACCRUAL_REV': 'Bao_Cao_Doanh_Thu_Ghi_Nhan.csv',
    'TXN_DETAIL': 'Bao_Cao_Chi_Tiet_Giao_Dich.csv',
    'RECON_DIFF': 'Bao_Cao_Doi_Soat_Lech_So.csv',
    'PLAN_SALES': 'Bao_Cao_Doanh_So_Goi_Cuoc.csv',
    'CHANNEL_PERF': 'Bao_Cao_Hieu_Qua_Kenh_Thanh_Toan.csv'
  };
  const filename = map[type] || 'Bao_Cao_Tai_Chinh.csv';
  let csv = 'Report Name,Period,Generated By,Role,Timestamp\n';
  csv += `"${filename}","01/10/2026 - 31/10/2026","${ADMIN_ACCOUNTS[0].fullName}","${currentRole}","${new Date().toISOString()}"\n`;
  downloadFile(filename, csv, 'text/csv;charset=utf-8;');
  showToast(`Đã kết xuất và tải xuống "${filename}"!`, 'success');
}

function exportFinanceOverviewReport() {
  let csv = 'Metric,Value,Explanation,Period\n';
  csv += `"Tiền thu thành công","125.000.000 ₫","Tổng tiền mua/gia hạn gói được xác nhận","01/10/2026 - 31/10/2026"\n`;
  csv += `"Tiền hoàn","5.000.000 ₫","Các khoản hoàn tiền học viên thành công","01/10/2026 - 31/10/2026"\n`;
  csv += `"Phí thanh toán","2.000.000 ₫","Phí đối soát từ ngân hàng và cổng PayOS","01/10/2026 - 31/10/2026"\n`;
  csv += `"Tiền thực nhận ước tính","118.000.000 ₫","Thu - Hoàn - Phí","01/10/2026 - 31/10/2026"\n`;
  csv += `"Doanh thu ghi nhận","120.000.000 ₫","Doanh thu theo chuẩn phân bổ kế toán","01/10/2026 - 31/10/2026"\n`;
  csv += `"Số dư khả dụng","42.500.000 ₫","Số tiền có thể sử dụng tại tài khoản","01/10/2026 - 31/10/2026"\n`;
  downloadFile('Linguapay_Finance_Overview_10_2026.csv', csv, 'text/csv;charset=utf-8;');
  showToast('Đã xuất báo cáo tổng quan tài chính CSV!', 'success');
}

// --------------------------------------------------------------------------
// 12.9. FINANCIAL CONTROLS & AUDIT
// --------------------------------------------------------------------------
function renderFinancialAuditTable(logs = FINANCIAL_AUDIT_LOGS) {
  const tbody = document.getElementById('financialAuditTableBody');
  if (!tbody || typeof FINANCIAL_AUDIT_LOGS === 'undefined') return;

  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:32px;color:#64748b;"><i class="fa-solid fa-magnifying-glass" style="font-size:1.4rem;margin-bottom:8px;display:block;"></i>Không tìm thấy nhật ký tài chính phù hợp với bộ lọc</td></tr>`;
    return;
  }

  tbody.innerHTML = logs.map(l => `
    <tr>
      <td><span class="mono-code">${l.id}</span></td>
      <td><strong>${l.actor}</strong></td>
      <td>
        <span class="badge-status badge-purple" style="font-size:0.75rem;">
          ${l.action}
        </span>
      </td>
      <td><strong>${l.object}</strong></td>
      <td style="font-size:0.78rem;">
        <span style="color:#ef4444;">${l.oldValue}</span> → <strong style="color:#10b981;">${l.newValue}</strong>
      </td>
      <td style="font-size:0.75rem;color:var(--text-muted);">${l.timestamp}</td>
      <td>
        <span class="badge-status badge-success">
          ${l.result}
        </span>
      </td>
      <td style="font-size:0.75rem;">
        <div>${l.reason}</div>
        <small class="mono-code" style="color:var(--text-muted);">${l.correlationId}</small>
      </td>
    </tr>
  `).join('');
}

function filterFinancialAuditTable() {
  const q = (document.getElementById('finAuditSearchInput')?.value || '').toLowerCase().trim();
  const action = document.getElementById('finAuditFilterAction')?.value || '';
  const result = document.getElementById('finAuditFilterResult')?.value || '';

  const filtered = FINANCIAL_AUDIT_LOGS.filter(l => {
    const matchQ = l.id.toLowerCase().includes(q) ||
      l.actor.toLowerCase().includes(q) ||
      l.object.toLowerCase().includes(q) ||
      l.reason.toLowerCase().includes(q) ||
      l.correlationId.toLowerCase().includes(q);

    let matchAction = true;
    if (action === 'APPROVE_REFUND') matchAction = l.action.includes('REFUND');
    else if (action === 'RECONCILE_RESOLVE') matchAction = l.action.includes('RECONCILE');
    else if (action === 'CHANGE_WEBHOOK') matchAction = l.action.includes('CHANNEL');
    else if (action === 'MANUAL_ACTIVATE') matchAction = l.action.includes('ACTIVATE');
    else if (action === 'EXPORT_REPORT') matchAction = l.action.includes('REPORT');

    const matchResult = !result || l.result === result;
    return matchQ && matchAction && matchResult;
  });

  renderFinancialAuditTable(filtered);
  const badge = document.getElementById('finAuditCountBadge');
  if (badge) badge.innerText = `${filtered.length} bản ghi`;
}

function resetFinAuditFilters() {
  if (document.getElementById('finAuditSearchInput')) document.getElementById('finAuditSearchInput').value = '';
  if (document.getElementById('finAuditFilterAction')) document.getElementById('finAuditFilterAction').value = '';
  if (document.getElementById('finAuditFilterResult')) document.getElementById('finAuditFilterResult').value = '';
  renderFinancialAuditTable(FINANCIAL_AUDIT_LOGS);
  const badge = document.getElementById('finAuditCountBadge');
  if (badge) badge.innerText = `${FINANCIAL_AUDIT_LOGS.length} bản ghi`;
  showToast('Đã đặt lại bộ lọc nhật ký tài chính!', 'info');
}

function exportFinanceAuditCsv() {
  let csv = 'Log ID,Actor,Action,Object,Old Value,New Value,Timestamp,Result,Reason,Correlation ID\n';
  FINANCIAL_AUDIT_LOGS.forEach(l => {
    csv += `"${l.id}","${l.actor}","${l.action}","${l.object}","${l.oldValue}","${l.newValue}","${l.timestamp}","${l.result}","${l.reason}","${l.correlationId}"\n`;
  });
  downloadFile('Linguapay_Financial_Audit_Trail.csv', csv, 'text/csv;charset=utf-8;');
  showToast('Đã xuất toàn bộ nhật ký tài chính (Financial Audit Trail) CSV!', 'success');
}

function openFinanceDictionaryModal() {
  const modal = document.getElementById('financeDictModal');
  if (modal) modal.classList.add('active');
}

function exportTransactionsCsv() {
  let csv = 'Transaction ID,Order Code,User Name,Email,Plan,Amount,Payment Method,Provider Ref,Status,Time\n';
  PAYMENT_TRANSACTIONS.forEach(t => {
    csv += `"${t.id}","${t.orderCode}","${t.userName}","${t.userEmail}","${t.planName}",${t.amount},"${t.paymentMethod}","${t.providerTxnId || ''}","${t.status}","${t.paidAt || t.createdAt}"\n`;
  });
  downloadFile('Linguapay_Transactions.csv', csv, 'text/csv;charset=utf-8;');
  showToast('Đã xuất file giao dịch tài chính CSV!', 'success');
}

// ==========================================================================
// 16. TIỆN ÍCH HỆ THỐNG & MODALS
// ==========================================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    console.warn('Modal not found:', modalId);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}


function showToast(message, type = 'info') {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `admin-toast-item ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function openQuickAddModal() {
  const choice = prompt("Chọn tác vụ thêm nhanh:\n1. Thêm từ vựng mới\n2. Tạo chủ đề mới\n3. Tạo bộ bài tập\n4. Tải lên media\nNhập số (1-4):", "1");
  if (choice === '1') openAddVocabModal();
  else if (choice === '2') openAddTopicModal();
  else if (choice === '3') openCreateExerciseModal();
  else if (choice === '4') openUploadMediaModal();
}

function openSystemAlertsModal() {
  switchAdminTab('dashboard');
  document.getElementById('dashboardAlertsContainer')?.scrollIntoView({ behavior: 'smooth' });
}

function setupGlobalSearch() {
  const input = document.getElementById('globalSearchInput');
  if (!input) return;

  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim().toLowerCase();
      if (!q) return;

      // Tìm từ vựng
      const foundVocab = VOCAB_ITEMS.find(v => v.word.toLowerCase().includes(q));
      if (foundVocab) {
        switchAdminTab('vocab-list');
        document.getElementById('vocabSearchInput').value = q;
        filterVocabTable();
        return;
      }

      // Tìm học viên
      const foundUser = APP_USERS.find(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      if (foundUser) {
        switchAdminTab('users');
        document.getElementById('userSearchInput').value = q;
        filterUserTable();
        return;
      }

      // Tìm giao dịch
      const foundTxn = PAYMENT_TRANSACTIONS.find(t => t.orderCode.toLowerCase().includes(q));
      if (foundTxn) {
        switchAdminTab('transactions');
        document.getElementById('txnSearchInput').value = q;
        filterTxnTable();
        return;
      }

      showToast(`Không tìm thấy kết quả phù hợp cho "${q}"`, 'info');
    }
  });
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
