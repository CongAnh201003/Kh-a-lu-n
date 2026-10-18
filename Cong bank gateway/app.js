/**
 * PAYGATE PAYMENT GATEWAY DASHBOARD - JAVASCRIPT
 * Xử lý biểu đồ ApexCharts (Doanh thu, Donut Trạng thái, Gói cước)
 * và tương tác Phễu chuyển đổi (Funnel Chart 4 bước) kèm Drop-off rate
 */

// ==========================================================================
// 1. DỮ LIỆU MẪU ĐA THỜI GIAN (DATA STORE)
// ==========================================================================
const dashboardData = {
  sep2026: {
    totalRevenue: '425,800,000 ₫',
    totalTransactions: '20,540',
    successRate: '74.4%',
    funnelRate: '41.2%',
    revenue: {
      categories: ['1/9', '5/9', '10/9', '15/9', '20/9', '25/9', '30/9'],
      data: [19500000, 24800000, 31200000, 28900000, 42100000, 48500000, 39400000]
    },
    status: {
      series: [15280, 3760, 1500],
      labels: ['Thành công', 'Chờ xử lý', 'Lỗi'],
      percentages: ['74.4%', '18.3%', '7.3%'],
      counts: ['15,280 GD', '3,760 GD', '1,500 GD']
    },
    packages: {
      categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9'],
      series: [
        {
          name: 'Gói VIP',
          data: [50000000, 48500000, 54000000, 52000000, 58500000, 63000000, 67500000, 72000000, 75500000]
        },
        {
          name: 'Gói Premium',
          data: [45200000, 42000000, 47500000, 46000000, 51200000, 55000000, 58400000, 61500000, 64200000]
        }
      ],
      yMax: 80000000,
      tickAmount: 4
    },
    funnel: [
      { step: 1, name: '1. Xem màn hình bảng giá / gói VIP', count: 100000, basePct: '100%', nextConv: '62.5%', dropPct: '37.5%', note: 'Khách hàng truy cập trang xem bảng giá và so sánh quyền lợi các gói VIP.' },
      { step: 2, name: '2. Bấm "Mua ngay" & chọn phương thức', count: 62500, basePct: '62.5%', nextConv: '74.9%', dropPct: '25.1%', note: 'Khách hàng nhấn Mua ngay và lựa chọn phương thức thanh toán phù hợp.' },
      { step: 3, name: '3. Mở mã QR / Chuyển sang App ngân hàng', count: 46800, basePct: '46.8%', nextConv: '88.0%', dropPct: '12.0%', note: 'Khách hàng mở mã VietQR hoặc chuyển sang ứng dụng Mobile Banking.' },
      { step: 4, name: '4. Thanh toán Thành công (Kích hoạt VIP)', count: 41200, basePct: '41.2%', nextConv: '100%', isFinal: true, note: 'Giao dịch quyết toán thành công, hệ thống tự động kích hoạt tài khoản VIP.' }
    ]
  },
  last7days: {
    totalRevenue: '112,400,000 ₫',
    totalTransactions: '5,320',
    successRate: '76.8%',
    funnelRate: '43.5%',
    revenue: {
      categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      data: [14200000, 16800000, 15500000, 18900000, 21400000, 28500000, 24100000]
    },
    status: {
      series: [4085, 890, 345],
      labels: ['Thành công', 'Chờ xử lý', 'Lỗi'],
      percentages: ['76.8%', '16.7%', '6.5%'],
      counts: ['4,085 GD', '890 GD', '345 GD']
    },
    packages: {
      categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      series: [
        {
          name: 'Gói VIP',
          data: [8500000, 10200000, 9400000, 11500000, 13200000, 17500000, 14800000]
        },
        {
          name: 'Gói Premium',
          data: [6800000, 8100000, 7500000, 9200000, 10500000, 14200000, 11800000]
        }
      ],
      yMax: 20000000,
      tickAmount: 4
    },
    funnel: [
      { step: 1, name: '1. Xem màn hình bảng giá / gói VIP', count: 25000, basePct: '100%', nextConv: '64.8%', dropPct: '35.2%', note: 'Khách hàng truy cập trang xem bảng giá và so sánh quyền lợi các gói VIP.' },
      { step: 2, name: '2. Bấm "Mua ngay" & chọn phương thức', count: 16200, basePct: '64.8%', nextConv: '76.5%', dropPct: '23.5%', note: 'Khách hàng nhấn Mua ngay và lựa chọn phương thức thanh toán phù hợp.' },
      { step: 3, name: '3. Mở mã QR / Chuyển sang App ngân hàng', count: 12400, basePct: '49.6%', nextConv: '87.7%', dropPct: '12.3%', note: 'Khách hàng mở mã VietQR hoặc chuyển sang ứng dụng Mobile Banking.' },
      { step: 4, name: '4. Thanh toán Thành công (Kích hoạt VIP)', count: 10875, basePct: '43.5%', nextConv: '100%', isFinal: true, note: 'Giao dịch quyết toán thành công, hệ thống tự động kích hoạt tài khoản VIP.' }
    ]
  },
  last30days: {
    totalRevenue: '448,200,000 ₫',
    totalTransactions: '21,800',
    successRate: '75.1%',
    funnelRate: '40.8%',
    revenue: {
      categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      data: [98000000, 114000000, 126000000, 110200000]
    },
    status: {
      series: [16370, 3810, 1620],
      labels: ['Thành công', 'Chờ xử lý', 'Lỗi'],
      percentages: ['75.1%', '17.5%', '7.4%'],
      counts: ['16,370 GD', '3,810 GD', '1,620 GD']
    },
    packages: {
      categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      series: [
        {
          name: 'Gói VIP',
          data: [58000000, 68000000, 75000000, 66000000]
        },
        {
          name: 'Gói Premium',
          data: [48000000, 56000000, 62000000, 54000000]
        }
      ],
      yMax: 80000000,
      tickAmount: 4
    },
    funnel: [
      { step: 1, name: '1. Xem màn hình bảng giá / gói VIP', count: 105000, basePct: '100%', nextConv: '61.9%', dropPct: '38.1%', note: 'Khách hàng truy cập xem bảng giá và so sánh quyền lợi các gói VIP.' },
      { step: 2, name: '2. Bấm "Mua ngay" & chọn phương thức', count: 65000, basePct: '61.9%', nextConv: '73.8%', dropPct: '26.2%', note: 'Khách hàng nhấn Mua ngay và lựa chọn phương thức thanh toán phù hợp.' },
      { step: 3, name: '3. Mở mã QR / Chuyển sang App ngân hàng', count: 48000, basePct: '45.7%', nextConv: '89.2%', dropPct: '10.8%', note: 'Khách hàng mở mã VietQR hoặc chuyển sang ứng dụng Mobile Banking.' },
      { step: 4, name: '4. Thanh toán Thành công (Kích hoạt VIP)', count: 42840, basePct: '40.8%', nextConv: '100%', isFinal: true, note: 'Giao dịch quyết toán thành công, hệ thống tự động kích hoạt tài khoản VIP.' }
    ]
  },
  today: {
    totalRevenue: '18,650,000 ₫',
    totalTransactions: '920',
    successRate: '78.2%',
    funnelRate: '44.6%',
    revenue: {
      categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
      data: [850000, 420000, 2600000, 4800000, 5200000, 3780000, 1000000]
    },
    status: {
      series: [720, 142, 58],
      labels: ['Thành công', 'Chờ xử lý', 'Lỗi'],
      percentages: ['78.2%', '15.4%', '6.4%'],
      counts: ['720 GD', '142 GD', '58 GD']
    },
    packages: {
      categories: ['04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
      series: [
        {
          name: 'Gói VIP',
          data: [600000, 1500000, 2800000, 3100000, 2200000, 650000]
        },
        {
          name: 'Gói Premium',
          data: [450000, 1200000, 2200000, 2400000, 1750000, 500000]
        }
      ],
      yMax: 4000000,
      tickAmount: 4
    },
    funnel: [
      { step: 1, name: '1. Xem màn hình bảng giá / gói VIP', count: 4200, basePct: '100%', nextConv: '65.2%', dropPct: '34.8%', note: 'Khách hàng truy cập xem bảng giá và so sánh quyền lợi các gói VIP.' },
      { step: 2, name: '2. Bấm "Mua ngay" & chọn phương thức', count: 2740, basePct: '65.2%', nextConv: '78.5%', dropPct: '21.5%', note: 'Khách hàng nhấn Mua ngay và lựa chọn phương thức thanh toán phù hợp.' },
      { step: 3, name: '3. Mở mã QR / Chuyển sang App ngân hàng', count: 2150, basePct: '51.2%', nextConv: '87.1%', dropPct: '12.9%', note: 'Khách hàng mở mã VietQR hoặc chuyển sang ứng dụng Mobile Banking.' },
      { step: 4, name: '4. Thanh toán Thành công (Kích hoạt VIP)', count: 1873, basePct: '44.6%', nextConv: '100%', isFinal: true, note: 'Giao dịch quyết toán thành công, hệ thống tự động kích hoạt tài khoản VIP.' }
    ]
  }
};

// Global Chart Instances
let revenueChart = null;
let statusDonutChart = null;
let packageBarChart = null;

// ==========================================================================
// 2. KHỞI TẠO BIỂU ĐỒ (INITIALIZATION)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initRevenueChart();
  initStatusDonutChart();
  initPackageBarChart();
  setupEventListeners();
  updateFunnelUI(dashboardData.sep2026.funnel);
});

// --------------------------------------------------------------------------
// 2.1 BIỂU ĐỒ 1: XU HƯỚNG DOANH THU (Line / Spline Area Chart)
// --------------------------------------------------------------------------
function initRevenueChart() {
  const current = dashboardData.sep2026.revenue;

  const options = {
    series: [{
      name: 'Doanh thu ngày',
      data: current.data
    }],
    chart: {
      type: 'area',
      height: 290,
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#a855f7'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.55,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          { offset: 0, color: '#c026d3', opacity: 0.6 },
          { offset: 60, color: '#9333ea', opacity: 0.2 },
          { offset: 100, color: '#79007c', opacity: 0.0 }
        ]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3.5,
      colors: ['#c026d3']
    },
    dataLabels: { enabled: false },
    markers: {
      size: 4,
      colors: ['#ffffff'],
      strokeColors: '#c026d3',
      strokeWidth: 2.5,
      hover: { size: 7 }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.07)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 10, bottom: 0, left: 10 }
    },
    xaxis: {
      categories: current.categories,
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '11px',
          fontFamily: 'Plus Jakarta Sans'
        }
      },
      axisBorder: { color: 'rgba(255, 255, 255, 0.1)' },
      axisTicks: { color: 'rgba(255, 255, 255, 0.1)' }
    },
    yaxis: {
      min: 15000000,
      max: 50000000,
      tickAmount: 7,
      labels: {
        formatter: (val) => val.toLocaleString('vi-VN'),
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontFamily: 'Plus Jakarta Sans'
        }
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val.toLocaleString('vi-VN')} VNĐ`
      }
    }
  };

  const chartElement = document.querySelector('#revenueChart');
  if (chartElement) {
    revenueChart = new ApexCharts(chartElement, options);
    revenueChart.render();
  }
}

// --------------------------------------------------------------------------
// 2.2 BIỂU ĐỒ 2: TỶ LỆ TRẠNG THÁI (DONUT CHART THEO YÊU CẦU CỦA USER)
// --------------------------------------------------------------------------
function initStatusDonutChart() {
  const current = dashboardData.sep2026.status;

  const options = {
    series: current.series,
    labels: current.labels,
    chart: {
      type: 'donut',
      height: 270,
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 700
      }
    },
    // Khớp 3 màu chuẩn: Thành công (Xanh), Chờ (Cam/Vàng), Lỗi (Đỏ)
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: '74%',
          background: 'transparent',
          labels: {
            show: false // Ta dùng custom HTML overlay ở tâm cho độ nét và thẩm mỹ hoàn hảo
          }
        }
      }
    },
    stroke: {
      show: true,
      colors: ['#141c3a'],
      width: 3
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false // Dùng custom HTML Legend List bên phải để thể hiện chi tiết
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val, opts) => {
          const total = opts.globals.seriesTotals.reduce((a, b) => a + b, 0);
          const pct = ((val / total) * 100).toFixed(1);
          return `${val.toLocaleString('vi-VN')} giao dịch (${pct}%)`;
        }
      }
    }
  };

  const chartElement = document.querySelector('#statusDonutChart');
  if (chartElement) {
    statusDonutChart = new ApexCharts(chartElement, options);
    statusDonutChart.render();
  }
}

// --------------------------------------------------------------------------
// 2.3 BIỂU ĐỒ 3: CƠ CẤU THEO GÓI CƯỚC (Grouped Bar: VIP & Premium qua các mốc thời gian)
// --------------------------------------------------------------------------
function initPackageBarChart() {
  const current = dashboardData.sep2026.packages;

  const options = {
    series: current.series,
    chart: {
      type: 'bar',
      height: 290,
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 750
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        borderRadiusApplication: 'end'
      }
    },
    // Gói VIP: Tím tím sang trọng (#9333ea), Gói Premium: Vàng kim hổ phách (#f59e0b)
    colors: ['#9333ea', '#f59e0b'],
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: ['#c084fc', '#fbbf24'],
        inverseColors: false,
        opacityFrom: 0.95,
        opacityTo: 0.8,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: 600,
      labels: {
        colors: '#94a3b8'
      },
      markers: {
        width: 10,
        height: 10,
        radius: 3
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.07)',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      categories: current.categories,
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '11px',
          fontFamily: 'Plus Jakarta Sans'
        }
      },
      axisBorder: { color: 'rgba(255, 255, 255, 0.1)' },
      axisTicks: { color: 'rgba(255, 255, 255, 0.1)' }
    },
    // Định dạng tiền tệ theo bội số: 0, 20 Tr, 40 Tr, 60 Tr, 80 Tr...
    yaxis: {
      min: 0,
      max: current.yMax || 80000000,
      tickAmount: current.tickAmount || 4,
      labels: {
        formatter: (val) => `${(val / 1000000).toFixed(0)} Tr`,
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontFamily: 'Plus Jakarta Sans'
        }
      }
    },
    tooltip: {
      theme: 'dark',
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${(val / 1000000).toFixed(1)} Tr (${val.toLocaleString('vi-VN')} ₫)`
      }
    }
  };

  const chartElement = document.querySelector('#packageBarChart');
  if (chartElement) {
    packageBarChart = new ApexCharts(chartElement, options);
    packageBarChart.render();
  }
}

// --------------------------------------------------------------------------
// 2.4 BIỂU ĐỒ 4: CẬP NHẬT PHỄU 3D SALES FUNNEL (FUNNEL CHART UI)
// --------------------------------------------------------------------------
let currentFunnelData = dashboardData.sep2026.funnel;

const tierColors = {
  1: '#eb3858',
  2: '#f25335',
  3: '#f7b731',
  4: '#10b981'
};

function updateFunnelUI(funnelData) {
  if (!funnelData || !Array.isArray(funnelData)) return;
  currentFunnelData = funnelData;

  funnelData.forEach((item) => {
    const countEl = document.getElementById(`funnelCount${item.step}`);
    const pctEl = document.getElementById(`funnelPct${item.step}`);
    const dropEl = document.getElementById(`funnelDrop${item.step}`);

    if (countEl) {
      countEl.textContent = item.count.toLocaleString('vi-VN');
    }
    if (pctEl) {
      if (item.step === 4) {
        pctEl.textContent = `(${item.basePct} 🎉)`;
      } else {
        pctEl.textContent = `(${item.basePct})`;
      }
    }
    if (dropEl && item.dropPct) {
      dropEl.textContent = item.step === 3 ? `▼ ${item.dropPct}` : `▼ Drop ${item.dropPct}`;
    }
  });
}

function setupSalesFunnelInteractions() {
  const canvasWrapper = document.getElementById('funnelCanvasWrapper');
  const tooltip = document.getElementById('funnelHoverTooltip');
  const tooltipBar = document.getElementById('tooltipBar');
  const tooltipTitle = document.getElementById('tooltipTitle');
  const tooltipSub = document.getElementById('tooltipSub');
  const tooltipUsers = document.getElementById('tooltipUsers');
  const tooltipRate = document.getElementById('tooltipRate');
  const tooltipDrop = document.getElementById('tooltipDrop');
  const tooltipDropCol = document.getElementById('tooltipDropCol');
  const tooltipNote = document.getElementById('tooltipNote');

  // Hover trên từng tầng của nón 3D hoặc từng dòng chỉ dẫn
  const interactiveElements = document.querySelectorAll('.tier-interactive-group, .stage-guide-item');
  interactiveElements.forEach((el) => {
    const tier = parseInt(el.getAttribute('data-tier'), 10);
    
    el.addEventListener('mouseenter', () => {
      const stageData = currentFunnelData.find(s => s.step === tier);
      if (!stageData) return;

      if (tooltipBar) tooltipBar.style.background = tierColors[tier] || '#ffffff';
      if (tooltipTitle) tooltipTitle.textContent = stageData.name;
      if (tooltipSub) tooltipSub.textContent = `Giai đoạn ${tier} / 4 (${tier === 4 ? 'Kích hoạt VIP Thành công' : 'Phễu thanh toán'})`;
      if (tooltipUsers) tooltipUsers.textContent = stageData.count.toLocaleString('vi-VN');
      if (tooltipRate) tooltipRate.textContent = stageData.basePct;
      
      if (tooltipDrop) {
        if (stageData.dropPct && stageData.dropPct !== '0%') {
          tooltipDrop.textContent = `-${stageData.dropPct}`;
          if (tooltipDropCol) tooltipDropCol.style.display = 'flex';
        } else {
          if (tooltipDropCol) tooltipDropCol.style.display = 'none';
        }
      }
      
      if (tooltipNote) tooltipNote.textContent = stageData.note || 'Thông tin bước thanh toán.';

      if (tooltip) tooltip.classList.add('active');
    });
  });

  if (canvasWrapper && tooltip) {
    canvasWrapper.addEventListener('mouseleave', () => {
      tooltip.classList.remove('active');
    });
  }

  // Đảm bảo phễu luôn ở chế độ đầy đủ số liệu & tỷ lệ drop
  if (canvasWrapper) {
    canvasWrapper.classList.remove('classic-mode');
  }

  // Nút phóng to / thu nhỏ biểu đồ phễu
  const toggleExpandBtn = document.getElementById('toggleExpandFunnelBtn');
  const cardFunnel = document.getElementById('cardFunnel');

  if (toggleExpandBtn && cardFunnel) {
    toggleExpandBtn.addEventListener('click', () => {
      cardFunnel.classList.toggle('expanded-card');
      const isExpanded = cardFunnel.classList.contains('expanded-card');
      
      const icon = toggleExpandBtn.querySelector('i');
      if (icon) {
        if (isExpanded) {
          icon.className = 'fa-solid fa-down-left-and-up-right-to-center';
          toggleExpandBtn.title = 'Thu nhỏ biểu đồ về 2 cột';
          showToast('Đã mở rộng biểu đồ phễu toàn màn hình', 'info');
        } else {
          icon.className = 'fa-solid fa-up-right-and-down-left-from-center';
          toggleExpandBtn.title = 'Phóng to biểu đồ';
        }
      }
    });
  }
}

// ==========================================================================
// 3. TƯƠNG TÁC NGƯỜI DÙNG & SỰ KIỆN (EVENT LISTENERS)
// ==========================================================================
function setupEventListeners() {
  // 3.1 Bộ lọc thời gian (Time Range Select)
  const timeRangeSelect = document.getElementById('timeRangeSelect');
  if (timeRangeSelect) {
    timeRangeSelect.addEventListener('change', (e) => {
      const selectedRange = e.target.value;
      const data = dashboardData[selectedRange] || dashboardData.sep2026;
      applyTimeRangeData(data, selectedRange);
      showToast(`Đã tải dữ liệu theo: ${e.target.options[e.target.selectedIndex].text}`, 'info');
    });
  }

  // Khởi tạo tương tác biểu đồ phễu
  setupSalesFunnelInteractions();

  // 3.2 Nút Làm mới (Refresh)
  const btnRefresh = document.getElementById('btnRefresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      btnRefresh.classList.add('spinning');
      setTimeout(() => {
        btnRefresh.classList.remove('spinning');
        showToast('Dữ liệu biểu đồ đã được cập nhật thời gian thực!', 'success');
      }, 700);
    });
  }

  // 3.3 Nút Xuất dữ liệu
  const btnExport = document.getElementById('btnExport');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      openReportModal();
    });
  }

  // 3.4 Nút Báo cáo (Header)
  const btnReport = document.getElementById('btnReport');
  if (btnReport) {
    btnReport.addEventListener('click', () => {
      openReportModal();
    });
  }

  // 3.5 Modal Báo cáo
  const reportModalBackdrop = document.getElementById('reportModalBackdrop');
  const closeReportModalBtn = document.getElementById('closeReportModal');
  const cancelReportModalBtn = document.getElementById('cancelReportModal');
  const confirmExportBtn = document.getElementById('confirmExportBtn');

  if (closeReportModalBtn) closeReportModalBtn.addEventListener('click', closeReportModal);
  if (cancelReportModalBtn) cancelReportModalBtn.addEventListener('click', closeReportModal);
  
  if (reportModalBackdrop) {
    reportModalBackdrop.addEventListener('click', (e) => {
      if (e.target === reportModalBackdrop) closeReportModal();
    });
  }

  if (confirmExportBtn) {
    confirmExportBtn.addEventListener('click', () => {
      const selectedFormat = document.querySelector('input[name="exportFormat"]:checked')?.value || 'PDF';
      closeReportModal();
      showToast(`Đang khởi tạo file ${selectedFormat.toUpperCase()}... Tải xuống thành công!`, 'success');
    });
  }

  // 3.6 User Profile Dropdown
  const userProfileDropdown = document.getElementById('userProfileDropdown');
  const userProfileBtn = document.getElementById('userProfileBtn');

  if (userProfileBtn && userProfileDropdown) {
    userProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userProfileDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!userProfileDropdown.contains(e.target)) {
        userProfileDropdown.classList.remove('open');
      }
    });
  }

  // 3.7 Mobile Sidebar Toggle
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  if (menuToggleBtn && sidebar) {
    menuToggleBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
  }

  if (sidebarCloseBtn && sidebar) {
    sidebarCloseBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  // 3.8 Chuyển đổi màn hình: Biểu đồ & KPI vs Bảng Giao Dịch Thu vs Bảng Đối Soát vs Cài Đặt
  const dashboardView = document.getElementById('dashboardView');
  const transactionThuView = document.getElementById('transactionThuView');
  const transactionChiView = document.getElementById('transactionChiView');
  const doiSoatView = document.getElementById('doiSoatView');
  const caiDatView = document.getElementById('caiDatView');
  const navCharts = document.getElementById('navCharts');
  const navKpi = document.getElementById('navKpi');
  const navThu = document.getElementById('navThu');
  const navChi = document.getElementById('navChi');
  const navDoiSoat = document.getElementById('navDoiSoat');
  const navCaiDat = document.getElementById('navCaiDat');
  const navLinks = document.querySelectorAll('.nav-link');

  function switchView(viewName) {
    navLinks.forEach(l => l.classList.remove('active'));

    if (viewName === 'thu') {
      if (dashboardView) dashboardView.style.display = 'none';
      if (doiSoatView) doiSoatView.style.display = 'none';
      if (caiDatView) caiDatView.style.display = 'none';
      if (transactionChiView) transactionChiView.style.display = 'none';
      if (transactionThuView) transactionThuView.style.display = 'flex';
      if (navThu) navThu.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Đang hiển thị: Bảng Giao Dịch Thu', 'info');
    } else if (viewName === 'chi') {
      if (dashboardView) dashboardView.style.display = 'none';
      if (doiSoatView) doiSoatView.style.display = 'none';
      if (caiDatView) caiDatView.style.display = 'none';
      if (transactionThuView) transactionThuView.style.display = 'none';
      if (transactionChiView) transactionChiView.style.display = 'flex';
      if (navChi) navChi.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Đang hiển thị: Bảng Giao Dịch Chi', 'info');
    } else if (viewName === 'doi-soat') {
      if (dashboardView) dashboardView.style.display = 'none';
      if (transactionThuView) transactionThuView.style.display = 'none';
      if (transactionChiView) transactionChiView.style.display = 'none';
      if (caiDatView) caiDatView.style.display = 'none';
      if (doiSoatView) doiSoatView.style.display = 'flex';
      if (navDoiSoat) navDoiSoat.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Đang hiển thị: Bảng Đối Soát Giao Dịch (PayGate vs Ngân hàng)', 'info');
    } else if (viewName === 'cai-dat' || viewName === 'cau-hinh' || viewName === 'setting') {
      if (dashboardView) dashboardView.style.display = 'none';
      if (transactionThuView) transactionThuView.style.display = 'none';
      if (transactionChiView) transactionChiView.style.display = 'none';
      if (doiSoatView) doiSoatView.style.display = 'none';
      if (caiDatView) caiDatView.style.display = 'flex';
      if (navCaiDat) navCaiDat.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Đang hiển thị: Cấu hình Tài khoản Thụ hưởng & VietQR', 'info');
    } else {
      if (transactionThuView) transactionThuView.style.display = 'none';
      if (transactionChiView) transactionChiView.style.display = 'none';
      if (doiSoatView) doiSoatView.style.display = 'none';
      if (caiDatView) caiDatView.style.display = 'none';
      if (dashboardView) dashboardView.style.display = 'flex';
      if (viewName === 'kpi') {
        if (navKpi) navKpi.classList.add('active');
        const kpiGrid = document.querySelector('.kpi-mini-grid');
        if (kpiGrid) kpiGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        if (navCharts) navCharts.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  if (navThu) {
    navThu.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('thu');
      if (sidebar) sidebar.classList.remove('open');
    });
  }

  if (navDoiSoat) {
    navDoiSoat.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('doi-soat');
      if (sidebar) sidebar.classList.remove('open');
    });
  }

  if (navCaiDat) {
    navCaiDat.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('cai-dat');
      if (sidebar) sidebar.classList.remove('open');
    });
  }

  if (navCharts) {
    navCharts.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('charts');
      if (sidebar) sidebar.classList.remove('open');
    });
  }

  if (navKpi) {
    navKpi.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('kpi');
      if (sidebar) sidebar.classList.remove('open');
    });
  }

  // Các menu phụ khác (Chi)
  if (navChi) {
    navChi.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('chi');
      if (sidebar) sidebar.classList.remove('open');
    });
  }

  // Tương tác tìm kiếm, lọc & xuất dữ liệu cho Bảng Giao Dịch Thu
  setupThuTableInteractions();

  // Tương tác tìm kiếm, lọc trạng thái, chênh lệch & thao tác Bảng Đối Soát
  setupDoiSoatInteractions();

  // Tương tác form Cài đặt tài khoản thụ hưởng & Sinh mã VietQR
  setupCaiDatInteractions();

  // Kiểm tra hash trên URL khi load trang
  if (window.location.hash === '#thu') {
    switchView('thu');
  } else if (window.location.hash === '#chi') {
    switchView('chi');
  } else if (window.location.hash === '#doi-soat') {
    switchView('doi-soat');
  } else if (window.location.hash === '#cai-dat' || window.location.hash === '#cau-hinh' || window.location.hash === '#setting') {
    switchView('cai-dat');
  }
}

// --------------------------------------------------------------------------
// 3.8.1 TƯƠNG TÁC BẢNG GIAO DỊCH THU
// --------------------------------------------------------------------------
function setupThuTableInteractions() {
  const searchInput = document.getElementById('thuSearchInput');
  const statusFilter = document.getElementById('thuStatusFilter');
  const dateInput = document.getElementById('thuDateInput');
  const tableBody = document.getElementById('thuTableBody');
  const tableInfo = document.getElementById('thuTableInfo');
  const btnExport = document.getElementById('btnThuExport');

  function filterTable() {
    if (!tableBody) return;
    const query = (searchInput?.value || '').toLowerCase().trim();
    const status = statusFilter?.value || 'all';
    const rows = tableBody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
      const searchData = (row.getAttribute('data-search') || '').toLowerCase();
      const rowStatus = row.getAttribute('data-status') || '';
      
      const matchQuery = !query || searchData.includes(query);
      const matchStatus = status === 'all' || rowStatus === status;

      if (matchQuery && matchStatus) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (tableInfo) {
      tableInfo.textContent = `Hiển thị ${visibleCount} / ${rows.length} giao dịch`;
    }
  }

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (statusFilter) statusFilter.addEventListener('change', filterTable);
  if (dateInput) dateInput.addEventListener('change', filterTable);

  if (btnExport) {
    btnExport.addEventListener('click', () => {
      showToast('Đã xuất thành công bảng giao dịch thu ra file Excel (PayGate_GiaoDichThu.xlsx)', 'success');
    });
  }
}

// --------------------------------------------------------------------------
// 3.8.2 TƯƠNG TÁC BẢNG ĐỐI SOÁT GIAO DỊCH (RECONCILIATION)
// --------------------------------------------------------------------------
function setupDoiSoatInteractions() {
  const searchInput = document.getElementById('doiSoatSearchInput');
  const statusFilter = document.getElementById('doiSoatStatusFilter');
  const diffFilter = document.getElementById('doiSoatDiffFilter');
  const dateInput = document.getElementById('doiSoatDateInput');
  const tableBody = document.getElementById('doiSoatTableBody');
  const tableInfo = document.getElementById('doiSoatTableInfo');
  const btnExport = document.getElementById('btnExportReconcile');
  const btnRunReconcile = document.getElementById('btnRunReconcile');

  function filterDoiSoatTable() {
    if (!tableBody) return;
    const query = (searchInput?.value || '').toLowerCase().trim();
    const status = statusFilter?.value || 'all';
    const diff = diffFilter?.value || 'all';
    const rows = tableBody.querySelectorAll('tr');
    let visibleCount = 0;

    rows.forEach(row => {
      const searchData = (row.getAttribute('data-search') || '').toLowerCase();
      const rowStatus = row.getAttribute('data-status') || '';
      const rowDiff = row.getAttribute('data-diff') || '';

      const matchQuery = !query || searchData.includes(query);
      const matchStatus = status === 'all' || rowStatus === status;

      let matchDiff = true;
      if (diff === 'has_diff') {
        matchDiff = rowDiff === 'negative' || rowDiff === 'positive';
      } else if (diff === 'no_diff') {
        matchDiff = rowDiff === 'no_diff';
      } else if (diff === 'negative') {
        matchDiff = rowDiff === 'negative';
      } else if (diff === 'positive') {
        matchDiff = rowDiff === 'positive';
      }

      if (matchQuery && matchStatus && matchDiff) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (tableInfo) {
      tableInfo.textContent = `Hiển thị ${visibleCount} / ${rows.length} phiên đối soát`;
    }
  }

  if (searchInput) searchInput.addEventListener('input', filterDoiSoatTable);
  if (statusFilter) statusFilter.addEventListener('change', filterDoiSoatTable);
  if (diffFilter) diffFilter.addEventListener('change', filterDoiSoatTable);
  if (dateInput) dateInput.addEventListener('change', filterDoiSoatTable);

  if (btnExport) {
    btnExport.addEventListener('click', () => {
      showToast('Đã xuất thành công Báo cáo Đối soát ra file Excel (PayGate_DoiSoat_202609.xlsx)', 'success');
    });
  }

  if (btnRunReconcile) {
    btnRunReconcile.addEventListener('click', () => {
      const icon = btnRunReconcile.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-spinner fa-spin';
      btnRunReconcile.disabled = true;
      showToast('Đang kết nối cổng PayOS & Ngân hàng đối chiếu dữ liệu...', 'info');

      setTimeout(() => {
        if (icon) icon.className = 'fa-solid fa-bolt';
        btnRunReconcile.disabled = false;
        showToast('Đối soát hoàn tất! Toàn bộ 1,280 giao dịch đã được đồng bộ chuẩn xác.', 'success');
      }, 1200);
    });
  }
}

// --------------------------------------------------------------------------
// 3.8.3 CÁC HÀM THAO TÁC XỬ LÝ ĐỐI SOÁT (KHỚP THỦ CÔNG, HOÀN TIỀN/HỦY, CHI TIẾT)
// --------------------------------------------------------------------------
let currentActiveRec = null;

window.handleManualMatch = function(orderId, recId, btnElement) {
  const row = btnElement ? btnElement.closest('tr') : document.querySelector(`tr[data-search*="${recId}"]`);

  if (confirm(`Bạn có chắc chắn muốn CƯỠNG CHẾ KHỚP THỦ CÔNG & KÍCH HOẠT GÓI VIP cho đơn [${orderId}] (Phiên ${recId}) không?`)) {
    if (row) {
      row.setAttribute('data-status', 'MATCHED');
      row.setAttribute('data-diff', 'no_diff');

      const orderCell = row.querySelector('.cell-app-code');
      if (orderCell) {
        orderCell.className = 'cell-app-code';
        orderCell.textContent = orderId === 'MỚI' ? 'INV-1004 (Đã tạo)' : orderId.replace(' (?)', '');
      }

      const statusBadge = row.querySelector('.rec-badge');
      if (statusBadge) {
        statusBadge.className = 'rec-badge badge-matched';
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> MATCHED';
      }

      const diffTag = row.querySelector('.diff-tag');
      if (diffTag) {
        diffTag.className = 'diff-tag neutral';
        diffTag.textContent = '0 đ (Đã duyệt)';
      }

      if (btnElement) {
        btnElement.disabled = true;
        btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Đã khớp';
        btnElement.style.background = 'rgba(16, 185, 129, 0.2)';
        btnElement.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        btnElement.style.color = '#34d399';
      }
    }

    if (currentActiveRec && currentActiveRec.recId === recId) {
      const modalBadge = document.getElementById('modalRecStatusBadge');
      if (modalBadge) {
        modalBadge.className = 'rec-badge badge-matched';
        modalBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> MATCHED';
      }
      const modalDiff = document.getElementById('modalDiffAmount');
      if (modalDiff) {
        modalDiff.className = 'diff-tag neutral';
        modalDiff.textContent = '0 đ (Đã duyệt)';
      }
      const noteBox = document.getElementById('modalAnalysisNote');
      if (noteBox) {
        noteBox.textContent = 'Giao dịch đã được người vận hành cưỡng chế khớp thủ công và kích hoạt VIP thành công!';
      }
      const modalActionMatchBtn = document.getElementById('modalActionMatchBtn');
      if (modalActionMatchBtn) {
        modalActionMatchBtn.disabled = true;
        modalActionMatchBtn.innerHTML = '<i class="fa-solid fa-check"></i> Đã kích hoạt VIP';
      }
    }

    showToast(`[${recId}] Cưỡng chế khớp thành công! Tài khoản VIP đã được kích hoạt ngay lập tức.`, 'success');
  }
};

window.handleRefundOrder = function(orderId, recId) {
  if (confirm(`Tạo lệnh HOÀN TIỀN / HỦY GIAO DỊCH cho phiên đối soát [${recId}] (Đơn: ${orderId})?`)) {
    showToast(`[${recId}] Đã tạo phiếu yêu cầu hoàn tiền về ngân hàng của khách. Đơn đã được đánh dấu hủy thủ công.`, 'info');

    const noteBox = document.getElementById('modalAnalysisNote');
    if (noteBox && currentActiveRec && currentActiveRec.recId === recId) {
      noteBox.textContent = 'Lệnh hoàn tiền / Hủy giao dịch đã được ghi nhận. Chờ kế toán thực hiện UNC chuyển khoản lại cho khách.';
    }
  }
};

window.openReconcileDetail = function(recId, orderId, bankCode, sysAmt, realAmt, diff, rawContent, status, time, note) {
  currentActiveRec = { recId, orderId, bankCode, sysAmt, realAmt, diff, rawContent, status, time, note };

  const modal = document.getElementById('reconcileDetailModal');
  if (!modal) return;

  const modalRecId = document.getElementById('modalRecId');
  const modalRecTime = document.getElementById('modalRecTime');
  const modalRecStatusBadge = document.getElementById('modalRecStatusBadge');
  const modalDiffAmount = document.getElementById('modalDiffAmount');
  const modalAnalysisNote = document.getElementById('modalAnalysisNote');
  const modalAppOrderId = document.getElementById('modalAppOrderId');
  const modalSysAmount = document.getElementById('modalSysAmount');
  const modalBankRef = document.getElementById('modalBankRef');
  const modalRealAmount = document.getElementById('modalRealAmount');
  const modalRawContent = document.getElementById('modalRawContent');
  const modalBankTime = document.getElementById('modalBankTime');
  const modalGuidanceText = document.getElementById('modalGuidanceText');
  const modalActionMatchBtn = document.getElementById('modalActionMatchBtn');
  const modalActionRefundBtn = document.getElementById('modalActionRefundBtn');

  if (modalRecId) modalRecId.textContent = recId;
  if (modalRecTime) modalRecTime.textContent = time;
  if (modalAppOrderId) modalAppOrderId.textContent = orderId;
  if (modalSysAmount) modalSysAmount.textContent = sysAmt;
  if (modalBankRef) modalBankRef.textContent = bankCode;
  if (modalRealAmount) modalRealAmount.textContent = realAmt;
  if (modalRawContent) modalRawContent.textContent = rawContent;
  if (modalBankTime) modalBankTime.textContent = time;
  if (modalAnalysisNote) modalAnalysisNote.textContent = note;

  // Cập nhật Badge trạng thái
  if (modalRecStatusBadge) {
    modalRecStatusBadge.className = 'rec-badge';
    let icon = 'fa-circle-check';
    if (status === 'MATCHED') {
      modalRecStatusBadge.classList.add('badge-matched');
      icon = 'fa-circle-check';
    } else if (status === 'AMOUNT_MISMATCH') {
      modalRecStatusBadge.classList.add('badge-amount-mismatch');
      icon = 'fa-triangle-exclamation';
    } else if (status === 'CODE_MISMATCH') {
      modalRecStatusBadge.classList.add('badge-code-mismatch');
      icon = 'fa-font';
    } else if (status === 'MISSING_IN_APP') {
      modalRecStatusBadge.classList.add('badge-missing-app');
      icon = 'fa-circle-xmark';
    } else if (status === 'PENDING') {
      modalRecStatusBadge.classList.add('badge-pending');
      icon = 'fa-clock';
    }
    modalRecStatusBadge.innerHTML = `<i class="fa-solid ${icon}"></i> ${status}`;
  }

  // Cập nhật Thẻ chênh lệch
  if (modalDiffAmount) {
    modalDiffAmount.className = 'diff-tag';
    if (diff.startsWith('-')) {
      modalDiffAmount.classList.add('negative');
    } else if (diff.startsWith('+')) {
      modalDiffAmount.classList.add('positive');
    } else {
      modalDiffAmount.classList.add('neutral');
    }
    modalDiffAmount.textContent = diff;
  }

  // Hướng dẫn xử lý cụ thể theo trạng thái
  if (modalGuidanceText) {
    if (status === 'MATCHED') {
      modalGuidanceText.innerHTML = 'Giao dịch đã <strong>khớp hoàn toàn cả tiền và mã đơn</strong>. Hệ thống PayGate đã tự động kích hoạt tài khoản VIP, không cần can thiệp thủ công.';
    } else if (status === 'AMOUNT_MISMATCH') {
      modalGuidanceText.innerHTML = `Chênh lệch <strong>${diff}</strong>. Nếu chuyển thiếu ít, bạn có thể bấm <strong>[Khớp thủ công]</strong> để kích hoạt dịch vụ cho khách; nếu sai lệch lớn, hãy tạo lệnh <strong>[Hoàn tiền / Hủy]</strong>.`;
    } else if (status === 'CODE_MISMATCH') {
      modalGuidanceText.innerHTML = 'Khách hàng chuyển <strong>đúng tiền nhưng gõ sai hoặc thiếu mã đơn</strong> trong nội dung CK. Bạn hãy kiểm tra tên và bấm <strong>[Khớp thủ công]</strong> để gán mã đơn chính xác.';
    } else if (status === 'MISSING_IN_APP') {
      modalGuidanceText.innerHTML = 'Tiền đã báo có tại ngân hàng nhưng <strong>App chưa kịp tạo đơn hàng</strong>. Bấm <strong>[Khớp thủ công]</strong> để tạo đơn mới và kích hoạt VIP, hoặc <strong>[Hoàn tiền / Hủy]</strong> để trả lại tiền.';
    } else if (status === 'PENDING') {
      modalGuidanceText.innerHTML = 'Giao dịch đang chờ chu kỳ đối soát tự động tiếp theo. Bạn có thể bấm <strong>[Khớp ngay]</strong> để hoàn tất tức thì.';
    }
  }

  // Nút hành động trong modal
  if (modalActionMatchBtn) {
    if (status === 'MATCHED') {
      modalActionMatchBtn.style.display = 'none';
    } else {
      modalActionMatchBtn.style.display = 'inline-flex';
      modalActionMatchBtn.disabled = false;
      modalActionMatchBtn.innerHTML = '<i class="fa-solid fa-handshake"></i> Khớp thủ công & Kích hoạt VIP';
      modalActionMatchBtn.onclick = () => {
        window.handleManualMatch(orderId, recId, null);
      };
    }
  }

  if (modalActionRefundBtn) {
    if (status === 'MATCHED') {
      modalActionRefundBtn.style.display = 'none';
    } else {
      modalActionRefundBtn.style.display = 'inline-flex';
      modalActionRefundBtn.onclick = () => {
        window.handleRefundOrder(orderId, recId);
      };
    }
  }

  modal.classList.add('active');
};

window.closeReconcileDetail = function() {
  const modal = document.getElementById('reconcileDetailModal');
  if (modal) modal.classList.remove('active');
};

// --------------------------------------------------------------------------
// 3.8.4 TƯƠNG TÁC CẤU HÌNH TÀI KHOẢN THỤ HƯỞNG & VIETQR (KHỚP ẢNH MẪU)
// --------------------------------------------------------------------------
function setupCaiDatInteractions() {
  const btnSaveVietQr = document.getElementById('btnSaveVietQr');
  const bankSelect = document.getElementById('settingBankSelect');
  const accNumberInput = document.getElementById('settingAccountNumber');
  const accHolderInput = document.getElementById('settingAccountHolder');
  const prefixInput = document.getElementById('settingPrefix');
  const previewBox = document.getElementById('vietQrPreviewBox');
  const previewQrImg = document.getElementById('previewQrImage');
  const previewBankName = document.getElementById('previewBankName');
  const previewAccNum = document.getElementById('previewAccNum');
  const previewAccHolder = document.getElementById('previewAccHolder');
  const previewSyntaxBadge = document.getElementById('previewSyntaxBadge');

  if (!btnSaveVietQr) return;

  btnSaveVietQr.addEventListener('click', () => {
    const bankCode = bankSelect?.value || 'MB';
    const bankName = bankSelect?.options[bankSelect.selectedIndex]?.text || 'MBBank - Ngân hàng Quân Đội';
    const accNumber = (accNumberInput?.value || '').trim();
    const accHolder = (accHolderInput?.value || '').trim().toUpperCase();
    const prefix = (prefixInput?.value || '').trim().toUpperCase().replace(/\s+/g, '') || 'VOCAB';

    if (!accNumber) {
      showToast('Vui lòng nhập số tài khoản nhận tiền!', 'error');
      accNumberInput?.focus();
      return;
    }

    if (!accHolder) {
      showToast('Vui lòng nhập tên chủ tài khoản (In hoa không dấu)!', 'error');
      accHolderInput?.focus();
      return;
    }

    // Hiệu ứng đang sinh mã
    const btnIcon = btnSaveVietQr.querySelector('i');
    if (btnIcon) btnIcon.className = 'fa-solid fa-spinner fa-spin';
    btnSaveVietQr.disabled = true;

    // Sinh mã QR qua chuẩn VietQR API thực tế
    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accNumber}-compact2.png?amount=60000&addInfo=${encodeURIComponent(prefix + ' INV1001')}&accountName=${encodeURIComponent(accHolder)}`;

    setTimeout(() => {
      if (previewBankName) previewBankName.textContent = bankName;
      if (previewAccNum) previewAccNum.textContent = accNumber;
      if (previewAccHolder) previewAccHolder.textContent = accHolder;
      if (previewSyntaxBadge) previewSyntaxBadge.textContent = `${prefix} INV1001`;
      if (previewQrImg) previewQrImg.src = qrUrl;

      if (previewBox) {
        previewBox.style.display = 'block';
        previewBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (btnIcon) btnIcon.className = 'fa-solid fa-qrcode';
      btnSaveVietQr.disabled = false;

      showToast(`Đã lưu cấu hình tài khoản ${bankCode} - ${accNumber} & kích hoạt mã VietQR thành công!`, 'success');
    }, 600);
  });
}

function copySettingText(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || 'Đã sao chép vào bộ nhớ tạm!', 'success');
    });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'Đã sao chép vào bộ nhớ tạm!', 'success');
    } catch (e) {
      showToast('Không thể sao chép, vui lòng copy thủ công', 'info');
    }
    document.body.removeChild(textArea);
  }
}

// --------------------------------------------------------------------------
// 3.9 HÀM ÁP DỤNG DỮ LIỆU KHI ĐỔI BỘ LỌC THỜI GIAN
// --------------------------------------------------------------------------
function applyTimeRangeData(data, rangeKey) {
  // Cập nhật Top KPI cards
  const kpiTotalRevenue = document.getElementById('kpiTotalRevenue');
  const kpiTotalTransactions = document.getElementById('kpiTotalTransactions');
  const kpiSuccessRate = document.getElementById('kpiSuccessRate');
  const kpiFunnelRate = document.getElementById('kpiFunnelRate');

  if (kpiTotalRevenue) kpiTotalRevenue.textContent = data.totalRevenue;
  if (kpiTotalTransactions) kpiTotalTransactions.textContent = data.totalTransactions;
  if (kpiSuccessRate) kpiSuccessRate.textContent = data.successRate;
  if (kpiFunnelRate) kpiFunnelRate.textContent = data.funnelRate;

  // Cập nhật tâm của Donut
  const donutTotalNumber = document.querySelector('.donut-total-number');
  if (donutTotalNumber) donutTotalNumber.textContent = data.totalTransactions;

  // Cập nhật số liệu Legend Donut
  const legendPercentages = document.querySelectorAll('.legend-percentage');
  const legendCounts = document.querySelectorAll('.legend-count');
  if (legendPercentages.length >= 3 && legendCounts.length >= 3) {
    legendPercentages[0].textContent = data.status.percentages[0];
    legendCounts[0].textContent = data.status.counts[0];

    legendPercentages[1].textContent = data.status.percentages[1];
    legendCounts[1].textContent = data.status.counts[1];

    legendPercentages[2].textContent = data.status.percentages[2];
    legendCounts[2].textContent = data.status.counts[2];
  }

  // Cập nhật ApexCharts
  if (revenueChart) {
    revenueChart.updateOptions({
      xaxis: { categories: data.revenue.categories },
      series: [{ data: data.revenue.data }]
    });
  }

  if (statusDonutChart) {
    statusDonutChart.updateSeries(data.status.series);
  }

  if (packageBarChart && data.packages) {
    packageBarChart.updateOptions({
      xaxis: { categories: data.packages.categories },
      series: data.packages.series,
      yaxis: {
        min: 0,
        max: data.packages.yMax || 80000000,
        tickAmount: data.packages.tickAmount || 4,
        labels: {
          formatter: (val) => `${(val / 1000000).toFixed(0)} Tr`,
          style: {
            colors: '#64748b',
            fontSize: '11px',
            fontFamily: 'Plus Jakarta Sans'
          }
        }
      }
    });

    const pkgStatVip = document.getElementById('pkgStatVip');
    const pkgStatPremium = document.getElementById('pkgStatPremium');
    const packageTopBadge = document.getElementById('packageTopBadge');

    if (data.packages.series && data.packages.series.length >= 2) {
      const vipData = data.packages.series[0].data;
      const premData = data.packages.series[1].data;
      const totalVip = vipData.reduce((a, b) => a + b, 0);
      const totalPrem = premData.reduce((a, b) => a + b, 0);
      const totalAll = totalVip + totalPrem;
      const vipPct = totalAll > 0 ? ((totalVip / totalAll) * 100).toFixed(1) : '0';
      const premPct = totalAll > 0 ? ((totalPrem / totalAll) * 100).toFixed(1) : '0';

      if (pkgStatVip) {
        pkgStatVip.innerHTML = `Tổng VIP: <strong>${(totalVip / 1000000).toFixed(1)} Tr ₫</strong> (${vipPct}%)`;
      }
      if (pkgStatPremium) {
        pkgStatPremium.innerHTML = `Tổng Premium: <strong>${(totalPrem / 1000000).toFixed(1)} Tr ₫</strong> (${premPct}%)`;
      }
      if (packageTopBadge) {
        const topName = totalVip >= totalPrem ? 'Gói VIP' : 'Gói Premium';
        const topPct = totalVip >= totalPrem ? vipPct : premPct;
        packageTopBadge.innerHTML = `<i class="fa-solid fa-crown"></i> ${topName} dẫn đầu (${topPct}%)`;
      }
    }
  }

  // Cập nhật Funnel Chart
  updateFunnelUI(data.funnel);
}

// --------------------------------------------------------------------------
// 3.10 MODAL & TOAST HELPERS
// --------------------------------------------------------------------------
function openReportModal() {
  const modal = document.getElementById('reportModalBackdrop');
  if (modal) modal.classList.add('active');
}

function closeReportModal() {
  const modal = document.getElementById('reportModalBackdrop');
  if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';

  toast.innerHTML = `
    <i class="fa-solid ${icon} toast-icon"></i>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
