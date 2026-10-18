/**
 * LINGUAPAY ADMIN PORTAL - DATA STORE CHO 12 MODULES
 * Phân tích chuẩn BA cho Ứng dụng Học Từ Vựng Tiếng Anh & Cổng Bank Gateway
 * Bao gồm đầy đủ 12 Modules, Ma trận Phân quyền RBAC 6 Vai trò, và Dữ liệu Mẫu Thực Tế.
 */

// ==========================================================================
// 1. MA TRẬN PHÂN QUYỀN RBAC 6 VAI TRÒ (MODULE 9: ADMIN & PERMISSIONS)
// ==========================================================================
const RBAC_ROLES = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Admin',
    badge: '👑 Super Admin',
    color: '#10b981',
    description: 'Chủ sở hữu hệ thống - Toàn quyền quản trị tất cả 12 module, cấu hình tối cao và phân quyền nhân sự.',
    permissions: {
      dashboard: { view: true, export: true },
      users: { view: true, lock: true, adjust_plan: true, export: true },
      vocab: { view: true, create: true, update: true, delete: true, publish: true, import: true, export: true },
      topic: { view: true, create: true, update: true, delete: true, assign_vocab: true },
      exercise: { view: true, create: true, update: true, delete: true, publish: true, preview: true },
      media: { view: true, upload: true, replace: true, delete: true },
      ai: { view: true, config_model: true, manage_prompt: true, test_playground: true, view_usage: true },
      analytics: { view: true, export: true },
      admin: { view: true, create: true, update_role: true, manage_permissions: true },
      settings: { view: true, update: true, audit_view: true, audit_export: true },
      subscription: { view: true, create_plan: true, update_price: true, manual_extend: true, cancel: true },
      payment: { view: true, reconcile: true, refund: true, export: true }
    }
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    badge: '🛡️ Admin Quản Trị',
    level: 3,
    color: '#2563eb',
    description: 'Quản trị viên hệ thống cấp cao - Quản trị nội dung, cấu hình vận hành và quản lý cấp dưới trong phân nhánh.',
    permissions: {
      dashboard: { view: true, export: true },
      users: { view: true, lock: true, adjust_plan: true, export: true },
      vocab: { view: true, create: true, update: true, delete: true, publish: true, import: true, export: true },
      topic: { view: true, create: true, update: true, delete: true, assign_vocab: true },
      exercise: { view: true, create: true, update: true, delete: true, publish: true, preview: true },
      media: { view: true, upload: true, replace: true, delete: true },
      ai: { view: true, config_model: false, manage_prompt: true, test_playground: true, view_usage: true },
      analytics: { view: true, export: true },
      admin: { view: true, create: true, update_role: true, manage_permissions: false },
      settings: { view: true, update: false, audit_view: true, audit_export: true },
      subscription: { view: true, create_plan: true, update_price: true, manual_extend: true, cancel: false },
      payment: { view: true, reconcile: true, refund: true, export: true }
    }
  },
  manager: {
    id: 'manager',
    name: 'Quản lý',
    badge: '👔 Quản Lý Đội Ngũ',
    level: 2,
    color: '#8b5cf6',
    description: 'Quản lý đội ngũ & chi nhánh - Điều hành nhân viên & sale, kiểm duyệt nội dung và hỗ trợ học viên.',
    permissions: {
      dashboard: { view: true, export: false },
      users: { view: true, lock: false, adjust_plan: true, export: true },
      vocab: { view: true, create: true, update: true, delete: false, publish: true, import: true, export: true },
      topic: { view: true, create: true, update: true, delete: false, assign_vocab: true },
      exercise: { view: true, create: true, update: true, delete: false, publish: true, preview: true },
      media: { view: true, upload: true, replace: true, delete: false },
      ai: { view: true, config_model: false, manage_prompt: false, test_playground: true, view_usage: false },
      analytics: { view: true, export: true },
      admin: { view: true, create: false, update_role: false, manage_permissions: false },
      settings: { view: false, update: false, audit_view: true, audit_export: false },
      subscription: { view: true, create_plan: false, update_price: false, manual_extend: true, cancel: false },
      payment: { view: true, reconcile: false, refund: false, export: false }
    }
  },
  staff_sale: {
    id: 'staff_sale',
    name: 'Nhân viên & Sale',
    badge: '🎧 Nhân Viên & Sale',
    level: 1,
    color: '#f59e0b',
    description: 'Nhân viên nghiệp vụ & tư vấn bán gói - Chăm sóc khách hàng, tư vấn học viên và tạo yêu cầu hỗ trợ.',
    permissions: {
      dashboard: { view: true, export: false },
      users: { view: true, lock: false, adjust_plan: false, export: false },
      vocab: { view: true, create: false, update: false, delete: false, publish: false, import: false, export: false },
      topic: { view: true, create: false, update: false, delete: false, assign_vocab: false },
      exercise: { view: true, create: false, update: false, delete: false, publish: false, preview: true },
      media: { view: true, upload: false, replace: false, delete: false },
      ai: { view: false, config_model: false, manage_prompt: false, test_playground: false, view_usage: false },
      analytics: { view: false, export: false },
      admin: { view: false, create: false, update_role: false, manage_permissions: false },
      settings: { view: false, update: false, audit_view: false, audit_export: false },
      subscription: { view: true, create_plan: false, update_price: false, manual_extend: false, cancel: false },
      payment: { view: false, reconcile: false, refund: false, export: false }
    }
  },
  content_manager: {
    id: 'content_manager',
    name: 'Content Manager',
    badge: '📚 Content Manager',
    color: '#8b5cf6',
    description: 'Quản lý nội dung học tập - Toàn quyền từ vựng, chủ đề, bài tập và thư viện media; không có quyền tài chính.',
    permissions: {
      dashboard: { view: true, export: false },
      users: { view: false, lock: false, adjust_plan: false, export: false },
      vocab: { view: true, create: true, update: true, delete: true, publish: true, import: true, export: true },
      topic: { view: true, create: true, update: true, delete: true, assign_vocab: true },
      exercise: { view: true, create: true, update: true, delete: true, publish: true, preview: true },
      media: { view: true, upload: true, replace: true, delete: true },
      ai: { view: true, config_model: false, manage_prompt: true, test_playground: true, view_usage: false },
      analytics: { view: true, export: false },
      admin: { view: false, create: false, update_role: false, manage_permissions: false },
      settings: { view: false, update: false, audit_view: false, audit_export: false },
      subscription: { view: false, create_plan: false, update_price: false, manual_extend: false, cancel: false },
      payment: { view: false, reconcile: false, refund: false, export: false }
    }
  },
  support: {
    id: 'support',
    name: 'Customer Support',
    badge: '🎧 Customer Support',
    color: '#ec4899',
    description: 'Hỗ trợ khách hàng & học viên - Tra cứu thông tin người dùng, lịch sử học tập, hỗ trợ reset mật khẩu.',
    permissions: {
      dashboard: { view: true, export: false },
      users: { view: true, lock: true, adjust_plan: true, export: false },
      vocab: { view: true, create: false, update: false, delete: false, publish: false, import: false, export: false },
      topic: { view: true, create: false, update: false, delete: false, assign_vocab: false },
      exercise: { view: true, create: false, update: false, delete: false, publish: false, preview: true },
      media: { view: true, upload: false, replace: false, delete: false },
      ai: { view: false, config_model: false, manage_prompt: false, test_playground: false, view_usage: false },
      analytics: { view: false, export: false },
      admin: { view: false, create: false, update_role: false, manage_permissions: false },
      settings: { view: false, update: false, audit_view: true, audit_export: false },
      subscription: { view: true, create_plan: false, update_price: false, manual_extend: true, cancel: false },
      payment: { view: true, reconcile: false, refund: false, export: false }
    }
  },
  finance: {
    id: 'finance',
    name: 'Finance Manager',
    badge: '💳 Finance Manager',
    color: '#f59e0b',
    description: 'Quản lý tài chính - Quản lý gói cước, giao dịch, đối soát ngân hàng Bank Gateway và duyệt hoàn tiền.',
    permissions: {
      dashboard: { view: true, export: true },
      users: { view: true, lock: false, adjust_plan: false, export: true },
      vocab: { view: false, create: false, update: false, delete: false, publish: false, import: false, export: false },
      topic: { view: false, create: false, update: false, delete: false, assign_vocab: false },
      exercise: { view: false, create: false, update: false, delete: false, publish: false, preview: false },
      media: { view: false, upload: false, replace: false, delete: false },
      ai: { view: false, config_model: false, manage_prompt: false, test_playground: false, view_usage: true },
      analytics: { view: true, export: true },
      admin: { view: false, create: false, update_role: false, manage_permissions: false },
      settings: { view: false, update: false, audit_view: true, audit_export: false },
      subscription: { view: true, create_plan: true, update_price: true, manual_extend: true, cancel: true },
      payment: { view: true, reconcile: true, refund: true, export: true }
    }
  },
  analyst: {
    id: 'analyst',
    name: 'Product Analyst',
    badge: '📊 Product Analyst',
    color: '#06b6d4',
    description: 'Phân tích dữ liệu & sản phẩm - Xem Dashboard, báo cáo hành vi học tập, tỷ lệ duy trì và xuất báo cáo.',
    permissions: {
      dashboard: { view: true, export: true },
      users: { view: true, lock: false, adjust_plan: false, export: true },
      vocab: { view: true, create: false, update: false, delete: false, publish: false, import: false, export: true },
      topic: { view: true, create: false, update: false, delete: false, assign_vocab: false },
      exercise: { view: true, create: false, update: false, delete: false, publish: false, preview: true },
      media: { view: false, upload: false, replace: false, delete: false },
      ai: { view: true, config_model: false, manage_prompt: false, test_playground: false, view_usage: true },
      analytics: { view: true, export: true },
      admin: { view: false, create: false, update_role: false, manage_permissions: false },
      settings: { view: false, update: false, audit_view: true, audit_export: false },
      subscription: { view: true, create_plan: false, update_price: false, manual_extend: false, cancel: false },
      payment: { view: true, reconcile: false, refund: false, export: true }
    }
  },
  ai_manager: {
    id: 'ai_manager',
    name: 'AI Operations Manager',
    badge: '🤖 AI Manager',
    color: '#3b82f6',
    description: 'Quản lý tính năng AI - Cấu hình mô hình sinh truyện, tinh chỉnh prompts, theo dõi token và chi phí API.',
    permissions: {
      dashboard: { view: true, export: false },
      users: { view: false, lock: false, adjust_plan: false, export: false },
      vocab: { view: true, create: false, update: false, delete: false, publish: false, import: false, export: false },
      topic: { view: true, create: false, update: false, delete: false, assign_vocab: false },
      exercise: { view: true, create: false, update: false, delete: false, publish: false, preview: true },
      media: { view: false, upload: false, replace: false, delete: false },
      ai: { view: true, config_model: true, manage_prompt: true, test_playground: true, view_usage: true },
      analytics: { view: true, export: false },
      admin: { view: false, create: false, update_role: false, manage_permissions: false },
      settings: { view: false, update: false, audit_view: true, audit_export: false },
      subscription: { view: false, create_plan: false, update_price: false, manual_extend: false, cancel: false },
      payment: { view: false, reconcile: false, refund: false, export: false }
    }
  }
};

// ==========================================================================
// 2. CÂY PHÂN QUYỀN HỆ THỐNG CHI TIẾT (SYSTEM PERMISSIONS FOR RBAC MATRIX)
// ==========================================================================
const SYSTEM_PERMISSIONS_TREE = [
  {
    moduleKey: 'dashboard',
    moduleName: '1. Dashboard (Tổng quan)',
    actions: [
      { key: 'view', name: 'Xem tổng quan KPI' },
      { key: 'export', name: 'Xuất báo cáo tổng quan' }
    ]
  },
  {
    moduleKey: 'users',
    moduleName: '2. User Management (Học viên)',
    actions: [
      { key: 'view', name: 'Xem danh sách & chi tiết' },
      { key: 'lock', name: 'Khóa / Mở khóa tài khoản' },
      { key: 'adjust_plan', name: 'Điều chỉnh gói dịch vụ' },
      { key: 'export', name: 'Xuất danh sách học viên' }
    ]
  },
  {
    moduleKey: 'vocab',
    moduleName: '3. Vocabulary (Từ vựng)',
    actions: [
      { key: 'view', name: 'Xem kho từ vựng' },
      { key: 'create', name: 'Thêm từ vựng mới' },
      { key: 'update', name: 'Chỉnh sửa từ vựng' },
      { key: 'delete', name: 'Xóa từ vựng' },
      { key: 'publish', name: 'Xuất bản / Ngừng xuất bản' },
      { key: 'import', name: 'Import Excel/CSV' },
      { key: 'export', name: 'Export dữ liệu từ vựng' }
    ]
  },
  {
    moduleKey: 'topic',
    moduleName: '4. Topic Management (Chủ đề)',
    actions: [
      { key: 'view', name: 'Xem danh sách chủ đề' },
      { key: 'create', name: 'Tạo mới chủ đề' },
      { key: 'update', name: 'Sửa thông tin chủ đề' },
      { key: 'delete', name: 'Ngừng hoạt động / Xóa' },
      { key: 'assign_vocab', name: 'Gán / Bỏ từ vựng vào chủ đề' }
    ]
  },
  {
    moduleKey: 'exercise',
    moduleName: '5. Exercise Management (Bài tập)',
    actions: [
      { key: 'view', name: 'Xem danh sách bài tập' },
      { key: 'create', name: 'Tạo bài tập mới' },
      { key: 'update', name: 'Chỉnh sửa câu hỏi & cấu hình' },
      { key: 'delete', name: 'Ngừng hoạt động / Xóa' },
      { key: 'publish', name: 'Xuất bản bài tập' },
      { key: 'preview', name: 'Xem trước (Preview) bài tập' }
    ]
  },
  {
    moduleKey: 'media',
    moduleName: '6. Content & Media (Tài nguyên)',
    actions: [
      { key: 'view', name: 'Xem thư viện tài nguyên' },
      { key: 'upload', name: 'Tải lên âm thanh / hình ảnh' },
      { key: 'replace', name: 'Thay thế tệp đang dùng' },
      { key: 'delete', name: 'Xóa tài nguyên (Safe Delete)' }
    ]
  },
  {
    moduleKey: 'ai',
    moduleName: '7. AI Configuration (Cấu hình AI)',
    actions: [
      { key: 'view', name: 'Xem thông số AI' },
      { key: 'config_model', name: 'Đổi Provider / Model / Params' },
      { key: 'manage_prompt', name: 'Quản lý System & Story Prompt' },
      { key: 'test_playground', name: 'Thử nghiệm sinh truyện trực tiếp' },
      { key: 'view_usage', name: 'Xem thống kê tokens & chi phí' }
    ]
  },
  {
    moduleKey: 'analytics',
    moduleName: '8. Learning Analytics (Thống kê)',
    actions: [
      { key: 'view', name: 'Xem báo cáo DAU, Cohort, Drop-off' },
      { key: 'export', name: 'Xuất dữ liệu báo cáo phân tích' }
    ]
  },
  {
    moduleKey: 'admin',
    moduleName: '9. Admin & Permissions (Quản trị viên)',
    actions: [
      { key: 'view', name: 'Xem danh sách Admin' },
      { key: 'create', name: 'Tạo tài khoản quản trị mới' },
      { key: 'update_role', name: 'Thay đổi vai trò quản trị' },
      { key: 'manage_permissions', name: 'Cấu hình ma trận phân quyền' }
    ]
  },
  {
    moduleKey: 'settings',
    moduleName: '10. Settings & Audit Logs (Cấu hình & Log)',
    actions: [
      { key: 'view', name: 'Xem cài đặt hệ thống' },
      { key: 'update', name: 'Cập nhật cấu hình app & bảo mật' },
      { key: 'audit_view', name: 'Xem nhật ký kiểm toán Audit' },
      { key: 'audit_export', name: 'Xuất file nhật ký kiểm toán' }
    ]
  },
  {
    moduleKey: 'subscription',
    moduleName: '11. Subscription & Plan (Gói cước)',
    actions: [
      { key: 'view', name: 'Xem danh mục gói & đăng ký' },
      { key: 'create_plan', name: 'Tạo / Sửa gói bán' },
      { key: 'update_price', name: 'Thay đổi giá niêm yết' },
      { key: 'manual_extend', name: 'Gia hạn thủ công cho học viên' },
      { key: 'cancel', name: 'Hủy đăng ký gói' }
    ]
  },
  {
    moduleKey: 'payment',
    moduleName: '12. Payment & Transaction (Thanh toán)',
    actions: [
      { key: 'view', name: 'Xem giao dịch thu' },
      { key: 'reconcile', name: 'Đối soát 10 cột Bank Gateway' },
      { key: 'refund', name: 'Xử lý hoàn tiền học viên' },
      { key: 'export', name: 'Xuất file giao dịch tài chính' }
    ]
  }
];

// ==========================================================================
// 3. DANH SÁCH TÀI KHOẢN ADMIN (MODULE 9: ADMIN MANAGEMENT)
// ==========================================================================
let ADMIN_ACCOUNTS = [
  {
    id: 'ADM-001',
    fullName: 'Nguyễn Quốc Bảo',
    email: 'bao.nq@linguapay.edu.vn',
    roleId: 'super_admin',
    status: 'ACTIVE',
    lastLogin: '2026-10-10 10:45:12',
    isSoleOwner: true,
    avatar: 'AD'
  },
  {
    id: 'ADM-002',
    fullName: 'Đặng Thu Hiền',
    email: 'hien.dang@linguapay.edu.vn',
    roleId: 'content_manager',
    status: 'ACTIVE',
    lastLogin: '2026-10-10 09:12:00',
    isSoleOwner: false,
    avatar: 'TH'
  },
  {
    id: 'ADM-003',
    fullName: 'Nguyễn Bích Ngọc',
    email: 'ngoc.support@linguapay.edu.vn',
    roleId: 'support',
    status: 'ACTIVE',
    lastLogin: '2026-10-10 08:30:15',
    isSoleOwner: false,
    avatar: 'BN'
  },
  {
    id: 'ADM-004',
    fullName: 'Phạm Đức Long',
    email: 'long.pd@linguapay.edu.vn',
    roleId: 'finance',
    status: 'ACTIVE',
    lastLogin: '2026-10-09 17:40:50',
    isSoleOwner: false,
    avatar: 'ĐL'
  },
  {
    id: 'ADM-005',
    fullName: 'Trần Anh Tuấn',
    email: 'tuan.ta@linguapay.edu.vn',
    roleId: 'analyst',
    status: 'ACTIVE',
    lastLogin: '2026-10-09 14:15:20',
    isSoleOwner: false,
    avatar: 'AT'
  },
  {
    id: 'ADM-006',
    fullName: 'Vũ Hoàng Nam',
    email: 'nam.vh@linguapay.edu.vn',
    roleId: 'ai_manager',
    status: 'ACTIVE',
    lastLogin: '2026-10-10 10:02:44',
    isSoleOwner: false,
    avatar: 'HN'
  }
];

// ==========================================================================
// 3B. PHÂN HỆ QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN THEO NHÓM (3 MÀN HÌNH CHÍNH)
// Screen 1: Quản lý nhóm quyền (4 nhóm, Popup 2 tabs)
// Screen 2: Người dùng hệ thống (Phân cấp trên - dưới, Modal 4 tabs)
// Screen 3: Khách hàng ứng dụng (App Learners, Modal 5 tabs)
// ==========================================================================

let PERMISSION_GROUPS = [
  {
    id: 'SUPER_ADMIN',
    code: 'SUPER_ADMIN',
    name: 'Super Admin',
    type: 'SYSTEM_FIXED',
    typeName: 'Nhóm cố định (1 tài khoản duy nhất)',
    description: 'Toàn quyền quản trị hệ thống, bất biến',
    status: 'ACTIVE',
    statusName: 'Đang hoạt động',
    memberCount: 1,
    permCount: 48,
    isImmutable: true,
    allowDelete: false,
    maxMembers: 1,
    updatedBy: 'Hệ thống khởi tạo',
    updatedAt: '01/10/2026 08:00',
    dataScope: 'ALL',
    dataScopeName: 'Toàn hệ thống (Toàn bộ 12 module)',
    permissions: {
      dashboard: ['view', 'export'],
      users: ['view', 'lock', 'adjust_plan', 'export'],
      vocab: ['view', 'create', 'update', 'delete', 'publish', 'import', 'export'],
      topic: ['view', 'create', 'update', 'delete', 'assign_vocab'],
      exercise: ['view', 'create', 'update', 'delete', 'publish', 'preview'],
      media: ['view', 'upload', 'replace', 'delete'],
      ai: ['view', 'config_model', 'manage_prompt', 'test_playground', 'view_usage'],
      analytics: ['view', 'export'],
      admin: ['view', 'create', 'update_role', 'manage_permissions'],
      settings: ['view', 'update', 'audit_view', 'audit_export'],
      subscription: ['view', 'create_plan', 'update_price', 'manual_extend', 'cancel'],
      payment: ['view', 'reconcile', 'refund', 'export']
    }
  },
  {
    id: 'ADMIN',
    code: 'ADMIN',
    name: 'Admin',
    type: 'SYSTEM',
    typeName: 'Nhóm hệ thống',
    description: 'Quản trị các module được cấp trong phạm vi',
    status: 'ACTIVE',
    statusName: 'Đang hoạt động',
    memberCount: 3,
    permCount: 36,
    isImmutable: false,
    allowDelete: false,
    updatedBy: 'Super Admin Tuấn',
    updatedAt: '05/10/2026 14:30',
    dataScope: 'BRANCH',
    dataScopeName: 'Phân nhánh & chi nhánh được giao',
    permissions: {
      dashboard: ['view', 'export'],
      users: ['view', 'lock', 'adjust_plan', 'export'],
      vocab: ['view', 'create', 'update', 'publish', 'import', 'export'],
      topic: ['view', 'create', 'update', 'assign_vocab'],
      exercise: ['view', 'create', 'update', 'publish', 'preview'],
      media: ['view', 'upload', 'replace'],
      ai: ['view', 'manage_prompt', 'test_playground', 'view_usage'],
      analytics: ['view', 'export'],
      admin: ['view', 'create', 'update_role'],
      settings: ['view', 'audit_view', 'audit_export'],
      subscription: ['view', 'create_plan', 'update_price', 'manual_extend'],
      payment: ['view', 'reconcile', 'export']
    }
  },
  {
    id: 'MANAGER',
    code: 'MANAGER',
    name: 'Quản lý',
    type: 'SYSTEM',
    typeName: 'Nhóm hệ thống',
    description: 'Quản lý nhân sự và dữ liệu trong phạm vi phụ trách',
    status: 'ACTIVE',
    statusName: 'Đang hoạt động',
    memberCount: 8,
    permCount: 22,
    isImmutable: false,
    allowDelete: false,
    updatedBy: 'Super Admin Tuấn',
    updatedAt: '08/10/2026 09:15',
    dataScope: 'TEAM',
    dataScopeName: 'Cây nhóm / Đội ngũ phụ trách',
    permissions: {
      dashboard: ['view'],
      users: ['view', 'adjust_plan', 'export'],
      vocab: ['view', 'create', 'update', 'publish'],
      topic: ['view', 'create', 'update'],
      exercise: ['view', 'create', 'update', 'preview'],
      media: ['view', 'upload'],
      ai: ['view', 'test_playground'],
      analytics: ['view', 'export'],
      admin: ['view'],
      settings: ['view'],
      subscription: ['view', 'manual_extend'],
      payment: ['view']
    }
  },
  {
    id: 'STAFF_SALE',
    code: 'STAFF_SALE',
    name: 'Nhân viên & Sale',
    type: 'SYSTEM',
    typeName: 'Nhóm hệ thống',
    description: 'Thực hiện nghiệp vụ được phân công, hỗ trợ học viên',
    status: 'ACTIVE',
    statusName: 'Đang hoạt động',
    memberCount: 15,
    permCount: 14,
    isImmutable: false,
    allowDelete: false,
    updatedBy: 'Manager Trang',
    updatedAt: '10/10/2026 16:45',
    dataScope: 'PERSONAL',
    dataScopeName: 'Chỉ dữ liệu cá nhân',
    permissions: {
      dashboard: ['view'],
      users: ['view'],
      vocab: ['view'],
      topic: ['view'],
      exercise: ['view', 'preview'],
      media: ['view'],
      ai: [],
      analytics: [],
      admin: [],
      settings: [],
      subscription: ['view'],
      payment: []
    }
  }
];

let SYSTEM_USERS = [
  {
    id: 'SA-001',
    username: 'superadmin',
    fullName: 'Super Admin Tuấn',
    email: 'superadmin@example.com',
    role: 'super_admin',
    roleLabel: 'Super Admin',
    roleLevel: 4,
    groupId: 'SUPER_ADMIN',
    groupName: 'Super Admin',
    managerId: null,
    managerName: 'Root (Cấp cao nhất)',
    status: 'ACTIVE',
    statusLabel: 'Hoạt động',
    dataScope: 'ALL',
    dataScopeLabel: 'Toàn hệ thống',
    lastLogin: '11/10/2026 10:45:12',
    createdAt: '01/01/2026',
    isSuperAdmin: true,
    joinedGroupAt: '01/01/2026',
    addedBy: 'Hệ thống khởi tạo',
    customOverrides: ['Toàn quyền không giới hạn', 'Bảo vệ chống xóa / hạ quyền'],
    auditHistory: [
      { date: '01/01/2026 00:00', actor: 'SYSTEM', action: 'Khởi tạo Super Admin duy nhất', reason: 'System Initial Boot' }
    ]
  },
  {
    id: 'AD-002',
    username: 'an.nm',
    fullName: 'Nguyễn Minh An',
    email: 'an@example.com',
    role: 'admin',
    roleLabel: 'Admin',
    roleLevel: 3,
    groupId: 'ADMIN',
    groupName: 'Admin',
    managerId: 'SA-001',
    managerName: 'Super Admin Tuấn (SA-001)',
    status: 'ACTIVE',
    statusLabel: 'Hoạt động',
    dataScope: 'BRANCH',
    dataScopeLabel: 'Chi nhánh Miền Bắc',
    lastLogin: '11/10/2026 09:12:00',
    createdAt: '15/01/2026',
    isSuperAdmin: false,
    joinedGroupAt: '15/01/2026',
    addedBy: 'Super Admin Tuấn',
    customOverrides: ['Duyệt khuyến mãi học viên'],
    auditHistory: [
      { date: '15/01/2026 08:30', actor: 'Super Admin Tuấn', action: 'Gán vào nhóm Admin', reason: 'Bổ nhiệm Admin Vận hành Miền Bắc' }
    ]
  },
  {
    id: 'MG-003',
    username: 'ha.tt',
    fullName: 'Trần Thu Hà',
    email: 'ha@example.com',
    role: 'manager',
    roleLabel: 'Quản lý',
    roleLevel: 2,
    groupId: 'MANAGER',
    groupName: 'Quản lý',
    managerId: 'AD-002',
    managerName: 'Nguyễn Minh An (AD-002)',
    status: 'ACTIVE',
    statusLabel: 'Hoạt động',
    dataScope: 'TEAM',
    dataScopeLabel: 'Khối Quản Lý Vận Hành & Sale',
    lastLogin: '11/10/2026 08:30:15',
    createdAt: '10/02/2026',
    isSuperAdmin: false,
    joinedGroupAt: '10/02/2026',
    addedBy: 'Nguyễn Minh An',
    customOverrides: [],
    auditHistory: [
      { date: '10/02/2026 09:00', actor: 'Nguyễn Minh An', action: 'Tạo tài khoản và gán vào nhóm Quản lý', reason: 'Quản lý nhóm Vận hành & Hỗ trợ' }
    ]
  },
  {
    id: 'ST-004',
    username: 'bao.lq',
    fullName: 'Lê Quốc Bảo',
    email: 'bao@example.com',
    role: 'staff_sale',
    roleLabel: 'Nhân viên & Sale',
    roleLevel: 1,
    groupId: 'STAFF_SALE',
    groupName: 'Nhân viên & Sale',
    managerId: 'MG-003',
    managerName: 'Trần Thu Hà (MG-003)',
    status: 'LOCKED',
    statusLabel: 'Tạm khóa',
    dataScope: 'PERSONAL',
    dataScopeLabel: 'Chỉ dữ liệu cá nhân',
    lastLogin: '08/10/2026 17:40:50',
    createdAt: '01/03/2026',
    isSuperAdmin: false,
    joinedGroupAt: '01/03/2026',
    addedBy: 'Trần Thu Hà',
    customOverrides: [],
    auditHistory: [
      { date: '01/03/2026 10:00', actor: 'Trần Thu Hà', action: 'Gán vào nhóm Nhân viên & Sale', reason: 'Nhân viên phụ trách tư vấn học viên' },
      { date: '08/10/2026 18:00', actor: 'Trần Thu Hà', action: 'Tạm khóa tài khoản', reason: 'Tạm nghỉ phép và rà soát thiết bị bàn giao' }
    ]
  },
  {
    id: 'ST-005',
    username: 'chau.vm',
    fullName: 'Vũ Minh Châu',
    email: 'chau.vm@example.com',
    role: 'staff_sale',
    roleLabel: 'Nhân viên & Sale',
    roleLevel: 1,
    groupId: 'STAFF_SALE',
    groupName: 'Nhân viên & Sale',
    managerId: 'MG-003',
    managerName: 'Trần Thu Hà (MG-003)',
    status: 'ACTIVE',
    statusLabel: 'Hoạt động',
    dataScope: 'PERSONAL',
    dataScopeLabel: 'Chỉ dữ liệu cá nhân',
    lastLogin: '11/10/2026 11:20:00',
    createdAt: '15/03/2026',
    isSuperAdmin: false,
    joinedGroupAt: '15/03/2026',
    addedBy: 'Trần Thu Hà',
    customOverrides: [],
    auditHistory: [
      { date: '15/03/2026 14:00', actor: 'Trần Thu Hà', action: 'Gán vào nhóm Nhân viên & Sale', reason: 'Nhân sự hỗ trợ học tập' }
    ]
  }
];

// Aliasing and enhancing CUSTOMER_USERS from APP_USERS
let CUSTOMER_USERS = [
  {
    id: 'CUST-1001',
    fullName: 'Hoàng Minh Tuấn',
    email: 'tuan.hm@gmail.com',
    phone: '0982348123',
    status: 'ACTIVE',
    statusLabel: 'Hoạt động',
    registeredAt: '01/10/2026',
    planType: 'Premium',
    planStatus: 'ACTIVE',
    planStatusLabel: 'Còn hạn',
    expiryDate: '01/10/2027',
    lastActive: '10 phút trước',
    learningProgress: { topicsLearned: 5, wordsMastered: 385, exercisesDone: 82, streakDays: 24, scoreAvg: '88%' },
    paymentHistory: [
      { orderCode: 'INV-1001', date: '01/10/2026', plan: 'Premium 1 Năm', amount: '450.000 ₫', channel: 'VietQR MB Bank', status: 'SUCCESS' }
    ],
    supportNotes: [
      { date: '02/10/2026', staff: 'Vũ Minh Châu', content: 'Hỗ trợ kích hoạt gói học viên trên thiết bị iPad' }
    ]
  },
  {
    id: 'CUST-1002',
    fullName: 'Trần Thị Mai Hương',
    email: 'huong.ttm@outlook.com',
    phone: '0913456789',
    status: 'ACTIVE',
    statusLabel: 'Hoạt động',
    registeredAt: '28/09/2026',
    planType: 'VIP',
    planStatus: 'ACTIVE',
    planStatusLabel: 'Còn hạn',
    expiryDate: '28/09/2027',
    lastActive: '1 giờ trước',
    learningProgress: { topicsLearned: 7, wordsMastered: 520, exercisesDone: 110, streakDays: 32, scoreAvg: '94%' },
    paymentHistory: [
      { orderCode: 'INV-1002', date: '28/09/2026', plan: 'VIP Trọn Gói', amount: '600.000 ₫', channel: 'VietQR PayOS', status: 'SUCCESS' }
    ],
    supportNotes: [
      { date: '29/09/2026', staff: 'Lê Quốc Bảo', content: 'Hướng dẫn tham gia bài thi đánh giá trình độ B2' }
    ]
  },
  {
    id: 'CUST-1003',
    fullName: 'Lê Quốc Hùng',
    email: 'hung.lq@gmail.com',
    phone: '0908123456',
    status: 'LOCKED',
    statusLabel: 'Tạm khóa',
    registeredAt: '15/09/2026',
    planType: 'Free',
    planStatus: 'EXPIRED',
    planStatusLabel: 'Hết hạn',
    expiryDate: '15/10/2026',
    lastActive: '2 ngày trước',
    learningProgress: { topicsLearned: 1, wordsMastered: 45, exercisesDone: 8, streakDays: 0, scoreAvg: '65%' },
    paymentHistory: [],
    supportNotes: [
      { date: '09/10/2026', staff: 'Trần Thu Hà', content: 'Khóa tài khoản tạm thời do nghi ngờ chia sẻ tài khoản cho nhiều IP bất thường' }
    ]
  },
  {
    id: 'CUST-1004',
    fullName: 'Phạm Quỳnh Nga',
    email: 'nga.pq@yahoo.com',
    phone: '0977889900',
    status: 'PENDING_VERIFICATION',
    statusLabel: 'Chờ xác minh',
    registeredAt: '05/10/2026',
    planType: 'Free',
    planStatus: 'PENDING',
    planStatusLabel: 'Chờ kích hoạt',
    expiryDate: '05/11/2026',
    lastActive: '3 giờ trước',
    learningProgress: { topicsLearned: 0, wordsMastered: 10, exercisesDone: 2, streakDays: 1, scoreAvg: '70%' },
    paymentHistory: [],
    supportNotes: [
      { date: '05/10/2026', staff: 'Hệ thống tự động', content: 'Đã gửi mã OTP xác thực email nhưng chưa hoàn tất xác nhận' }
    ]
  },
  {
    id: 'CUST-1005',
    fullName: 'Đặng Tuấn Kiệt',
    email: 'kiet.dt@gmail.com',
    phone: '0934567890',
    status: 'ACTIVE',
    statusLabel: 'Hoạt động',
    registeredAt: '02/10/2026',
    planType: 'Premium',
    planStatus: 'ACTIVE',
    planStatusLabel: 'Còn hạn',
    expiryDate: '02/04/2027',
    lastActive: '30 phút trước',
    learningProgress: { topicsLearned: 3, wordsMastered: 190, exercisesDone: 42, streakDays: 9, scoreAvg: '82%' },
    paymentHistory: [
      { orderCode: 'INV-1006', date: '02/10/2026', plan: 'Premium 6 Tháng', amount: '250.000 ₫', channel: 'VietQR MB Bank', status: 'SUCCESS' }
    ],
    supportNotes: []
  }
];

// ==========================================================================
// 4. DANH SÁCH CHỦ ĐỀ HỌC TẬP (MODULE 4: TOPIC MANAGEMENT)
// ==========================================================================
let VOCAB_TOPICS = [
  {
    id: 'top-business',
    code: 'BUSINESS',
    nameEn: 'Business & Finance',
    nameVi: 'Kinh doanh & Tài chính',
    description: 'Từ vựng thương mại, tài chính doanh nghiệp, đầu tư, doanh thu và đàm phán hợp đồng.',
    icon: 'fa-briefcase',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
    totalWords: 52,
    difficulty: 'Trung bình - Khó (B1-B2)',
    displayOrder: 1,
    status: 'ACTIVE',
    createdAt: '2026-01-15',
    updatedAt: '2026-10-05'
  },
  {
    id: 'top-travel',
    code: 'TRAVEL',
    nameEn: 'Travel & Exploration',
    nameVi: 'Du lịch & Di chuyển',
    description: 'Đặt vé máy bay, thủ tục hải quan, hỏi đường, khách sạn và văn hóa địa phương.',
    icon: 'fa-plane-departure',
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80',
    totalWords: 48,
    difficulty: 'Dễ - Trung bình (A2-B1)',
    displayOrder: 2,
    status: 'ACTIVE',
    createdAt: '2026-01-18',
    updatedAt: '2026-09-28'
  },
  {
    id: 'top-technology',
    code: 'TECHNOLOGY',
    nameEn: 'Technology & AI',
    nameVi: 'Công nghệ & Trí tuệ nhân tạo',
    description: 'Thuật toán phần mềm, an ninh mạng, điện toán đám mây và xu hướng công nghệ tương lai.',
    icon: 'fa-microchip',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    totalWords: 64,
    difficulty: 'Khó (B2-C1)',
    displayOrder: 3,
    status: 'ACTIVE',
    createdAt: '2026-02-01',
    updatedAt: '2026-10-02'
  },
  {
    id: 'top-environment',
    code: 'ENVIRONMENT',
    nameEn: 'Environment & Nature',
    nameVi: 'Môi trường & Sinh thái',
    description: 'Bảo vệ tài nguyên, biến đổi khí hậu, năng lượng tái tạo và đa dạng sinh học.',
    icon: 'fa-leaf',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
    totalWords: 42,
    difficulty: 'Trung bình (B1)',
    displayOrder: 4,
    status: 'ACTIVE',
    createdAt: '2026-02-10',
    updatedAt: '2026-09-15'
  },
  {
    id: 'top-animals',
    code: 'ANIMALS',
    nameEn: 'Animals & Wildlife',
    nameVi: 'Động vật thế giới',
    description: 'Các loài động vật hoang dã, thú cưng, môi trường sống và tập tính sinh học.',
    icon: 'fa-paw',
    thumbnail: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&q=80',
    totalWords: 56,
    difficulty: 'Dễ (A1-A2)',
    displayOrder: 5,
    status: 'ACTIVE',
    createdAt: '2026-02-12',
    updatedAt: '2026-08-20'
  },
  {
    id: 'top-food',
    code: 'FOOD',
    nameEn: 'Food & Culinary',
    nameVi: 'Ẩm thực & Đồ uống',
    description: 'Nguyên liệu nấu ăn, văn hóa ẩm thực, cách gọi món và dinh dưỡng lành mạnh.',
    icon: 'fa-utensils',
    thumbnail: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
    totalWords: 45,
    difficulty: 'Dễ (A1-A2)',
    displayOrder: 6,
    status: 'ACTIVE',
    createdAt: '2026-02-15',
    updatedAt: '2026-08-25'
  },
  {
    id: 'top-daily',
    code: 'DAILY_LIFE',
    nameEn: 'Daily Routine & Life',
    nameVi: 'Đời sống thường nhật',
    description: 'Thói quen sinh hoạt mỗi ngày, gia đình, sở thích cá nhân và giao tiếp cơ bản.',
    icon: 'fa-sun',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    totalWords: 38,
    difficulty: 'Dễ (A1)',
    displayOrder: 7,
    status: 'ACTIVE',
    createdAt: '2026-03-01',
    updatedAt: '2026-07-10'
  },
  {
    id: 'top-education',
    code: 'EDUCATION',
    nameEn: 'Education & Career',
    nameVi: 'Giáo dục & Sự nghiệp',
    description: 'Trường học, bằng cấp, học thuật, phát triển bản thân và định hướng nghề nghiệp.',
    icon: 'fa-graduation-cap',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80',
    totalWords: 40,
    difficulty: 'Trung bình (B1-B2)',
    displayOrder: 8,
    status: 'ACTIVE',
    createdAt: '2026-03-10',
    updatedAt: '2026-09-01'
  }
];

// ==========================================================================
// 5. KHO TỪ VỰNG CHI TIẾT (MODULE 3: VOCABULARY MANAGEMENT)
// ==========================================================================
let VOCAB_ITEMS = [
  {
    id: 'voc-001',
    word: 'Revenue',
    ipa: '/ˈrev.ə.nuː/',
    partOfSpeech: 'noun',
    meaningVi: 'Doanh thu, tổng tiền thu được từ bán hàng hoặc dịch vụ',
    definitionEn: 'Income generated from business activities before subtracting expenses.',
    exampleSentence: "The company's annual revenue reached 50 million dollars this quarter.",
    topic: 'top-business',
    topicName: 'Business & Finance',
    difficulty: 'Trung bình',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/revenue-us.mp3',
    syllables: 'Rev - e - nue',
    status: 'PUBLISHED',
    linkedExercises: ['ex-001', 'ex-002', 'ex-004'],
    timesReviewed: 1420
  },
  {
    id: 'voc-002',
    word: 'Parrot',
    ipa: '/ˈper.ət/',
    partOfSpeech: 'noun',
    meaningVi: 'Con vẹt (loài chim nhiều màu có thể nhại giọng người)',
    definitionEn: 'A tropical bird with bright feathers and the ability to mimic human speech.',
    exampleSentence: 'Tom has a funny parrot named Max who likes to imitate people.',
    topic: 'top-animals',
    topicName: 'Animals & Wildlife',
    difficulty: 'Dễ',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/parrot-us.mp3',
    syllables: 'Par - rot',
    status: 'PUBLISHED',
    linkedExercises: ['ex-001', 'ex-002'],
    timesReviewed: 2890
  },
  {
    id: 'voc-003',
    word: 'Banana',
    ipa: '/bəˈnæn.ə/',
    partOfSpeech: 'noun',
    meaningVi: 'Quả chuối chín vàng ngọt',
    definitionEn: 'A long, curved fruit with a yellow skin and soft sweet flesh.',
    exampleSentence: 'Eating a banana before working out provides great natural energy.',
    topic: 'top-food',
    topicName: 'Food & Culinary',
    difficulty: 'Dễ',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/banana-us.mp3',
    syllables: 'Ba - nan - a',
    status: 'PUBLISHED',
    linkedExercises: ['ex-001'],
    timesReviewed: 3100
  },
  {
    id: 'voc-004',
    word: 'Elephant',
    ipa: '/ˈel.ə.fənt/',
    partOfSpeech: 'noun',
    meaningVi: 'Con voi, loài thú có vòi lớn nhất trên cạn',
    definitionEn: 'A very large grey mammal that has a trunk with which it can pick things up.',
    exampleSentence: 'The elephant is eating leaves peacefully in the natural sanctuary.',
    topic: 'top-animals',
    topicName: 'Animals & Wildlife',
    difficulty: 'Dễ',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/elephant-us.mp3',
    syllables: 'El - e - phant',
    status: 'PUBLISHED',
    linkedExercises: ['ex-001', 'ex-002'],
    timesReviewed: 2450
  },
  {
    id: 'voc-005',
    word: 'Environment',
    ipa: '/ɪnˈvaɪ.rən.mənt/',
    partOfSpeech: 'noun',
    meaningVi: 'Môi trường tự nhiên xung quanh',
    definitionEn: 'The air, water, and land in or on which people, animals, and plants live.',
    exampleSentence: 'We must protect our environment from toxic industrial waste.',
    topic: 'top-environment',
    topicName: 'Environment & Nature',
    difficulty: 'Trung bình',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/environment-us.mp3',
    syllables: 'En - vi - ron - ment',
    status: 'PUBLISHED',
    linkedExercises: ['ex-003', 'ex-004'],
    timesReviewed: 1980
  },
  {
    id: 'voc-006',
    word: 'Pollution',
    ipa: '/pəˈluː.ʃən/',
    partOfSpeech: 'noun',
    meaningVi: 'Sự ô nhiễm (không khí, nguồn nước...)',
    definitionEn: 'Damage caused to water, air, or soil by harmful toxic substances.',
    exampleSentence: 'Air pollution in major metropolitan cities has reached hazardous levels.',
    topic: 'top-environment',
    topicName: 'Environment & Nature',
    difficulty: 'Trung bình',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/pollution-us.mp3',
    syllables: 'Pol - lu - tion',
    status: 'PUBLISHED',
    linkedExercises: ['ex-003'],
    timesReviewed: 1650
  },
  {
    id: 'voc-007',
    word: 'Itinerary',
    ipa: '/aɪˈtɪn.ə.rer.i/',
    partOfSpeech: 'noun',
    meaningVi: 'Lịch trình, lộ trình chi tiết chuyến đi du lịch',
    definitionEn: 'A detailed plan or designated route of a travel journey.',
    exampleSentence: 'Our travel itinerary includes visits to ancient pagodas and islands.',
    topic: 'top-travel',
    topicName: 'Travel & Exploration',
    difficulty: 'Khó',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/itinerary-us.mp3',
    syllables: 'I - tin - er - ar - y',
    status: 'PUBLISHED',
    linkedExercises: ['ex-004'],
    timesReviewed: 980
  },
  {
    id: 'voc-008',
    word: 'Algorithm',
    ipa: '/ˈæl.ɡə.rɪ.ðəm/',
    partOfSpeech: 'noun',
    meaningVi: 'Thuật toán tính toán của máy tính',
    definitionEn: 'A set of mathematical instructions or rules designed to solve a problem.',
    exampleSentence: 'Modern search engines use complex neural machine learning algorithms.',
    topic: 'top-technology',
    topicName: 'Technology & AI',
    difficulty: 'Khó',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/algorithm-us.mp3',
    syllables: 'Al - go - rithm',
    status: 'PUBLISHED',
    linkedExercises: ['ex-002', 'ex-004'],
    timesReviewed: 1240
  },
  {
    id: 'voc-009',
    word: 'Negotiate',
    ipa: '/nəˈɡoʊ.ʃi.eɪt/',
    partOfSpeech: 'verb',
    meaningVi: 'Thương lượng, đàm phán hợp đồng',
    definitionEn: 'To have formal discussions with someone in order to reach an agreement.',
    exampleSentence: 'Both parties sat down to negotiate a mutually beneficial contract.',
    topic: 'top-business',
    topicName: 'Business & Finance',
    difficulty: 'Khó',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/negotiate-us.mp3',
    syllables: 'Ne - go - ti - ate',
    status: 'PUBLISHED',
    linkedExercises: ['ex-004'],
    timesReviewed: 870
  },
  {
    id: 'voc-010',
    word: 'Biodiversity',
    ipa: '/ˌbaɪ.oʊ.daɪˈvɝː.sə.t̬i/',
    partOfSpeech: 'noun',
    meaningVi: 'Đa dạng sinh học trong tự nhiên',
    definitionEn: 'The variety of plant and animal life in the world or in a particular habitat.',
    exampleSentence: 'Preserving biodiversity is essential for human survival and climate stability.',
    topic: 'top-environment',
    topicName: 'Environment & Nature',
    difficulty: 'Khó',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/biodiversity-us.mp3',
    syllables: 'Bi - o - di - ver - si - ty',
    status: 'DRAFT',
    linkedExercises: [],
    timesReviewed: 120
  },
  {
    id: 'voc-011',
    word: 'Departure',
    ipa: '/dɪˈpɑːr.tʃɚ/',
    partOfSpeech: 'noun',
    meaningVi: 'Sự khởi hành, giờ xuất phát chuyến bay/tàu',
    definitionEn: 'The action of leaving, especially on a trip or journey.',
    exampleSentence: 'Passengers must check in at least two hours prior to departure.',
    topic: 'top-travel',
    topicName: 'Travel & Exploration',
    difficulty: 'Trung bình',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/departure-us.mp3',
    syllables: 'De - par - ture',
    status: 'PUBLISHED',
    linkedExercises: ['ex-003'],
    timesReviewed: 1540
  },
  {
    id: 'voc-012',
    word: 'Delicious',
    ipa: '/dɪˈlɪʃ.əs/',
    partOfSpeech: 'adjective',
    meaningVi: 'Ngon miệng, hương vị tuyệt vời',
    definitionEn: 'Having a very pleasant taste or smell.',
    exampleSentence: 'This traditional Vietnamese noodle soup is absolutely delicious.',
    topic: 'top-food',
    topicName: 'Food & Culinary',
    difficulty: 'Dễ',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/delicious-us.mp3',
    syllables: 'De - li - cious',
    status: 'PUBLISHED',
    linkedExercises: ['ex-001'],
    timesReviewed: 2320
  }
];

// ==========================================================================
// 6. DANH SÁCH BÀI TẬP 4 DẠNG (MODULE 5: EXERCISE MANAGEMENT)
// ==========================================================================
let EXERCISE_ITEMS = [
  {
    id: 'ex-001',
    title: 'Game Ghép Thẻ Từ Vựng & Nghĩa (Word Matching)',
    type: 'WORD_MATCH',
    typeName: 'Game Ghép Từ',
    typeIcon: 'fa-gamepad',
    topicId: 'top-animals',
    topicName: 'Animals & Food',
    difficulty: 'Dễ',
    questionCount: 6,
    estimatedDuration: '3 phút',
    status: 'PUBLISHED',
    completionRate: 88.5,
    attemptsCount: 14200,
    avgScore: 92,
    questions: [
      { id: 'q1', word: 'Parrot', match: 'Con vẹt' },
      { id: 'q2', word: 'Elephant', match: 'Con voi' },
      { id: 'q3', word: 'Banana', match: 'Quả chuối' },
      { id: 'q4', word: 'Delicious', match: 'Ngon miệng' },
      { id: 'q5', word: 'Environment', match: 'Môi trường' },
      { id: 'q6', word: 'Revenue', match: 'Doanh thu' }
    ],
    config: {
      cardCount: 12,
      timeLimitSeconds: 120,
      pointsPerMatch: 10,
      penaltyForMistake: 2
    }
  },
  {
    id: 'ex-002',
    title: 'Luyện Phát Âm Chuẩn IPA & Đánh Giá AI (Pronunciation)',
    type: 'PRONUNCIATION',
    typeName: 'Luyện Phát Âm',
    typeIcon: 'fa-microphone',
    topicId: 'top-business',
    topicName: 'Business & Finance',
    difficulty: 'Trung bình',
    questionCount: 4,
    estimatedDuration: '4 phút',
    status: 'PUBLISHED',
    completionRate: 82.1,
    attemptsCount: 9800,
    avgScore: 84,
    questions: [
      {
        id: 'p1',
        word: 'Revenue',
        ipa: '/ˈrev.ə.nuː/',
        syllables: 'Rev - e - nue',
        audioSample: 'https://api.dictionaryapi.dev/media/pronunciations/en/revenue-us.mp3',
        passingScore: 80,
        tips: 'Nhấn mạnh trọng âm ở âm tiết thứ nhất "Rev".'
      },
      {
        id: 'p2',
        word: 'Algorithm',
        ipa: '/ˈæl.ɡə.rɪ.ðəm/',
        syllables: 'Al - go - rithm',
        audioSample: 'https://api.dictionaryapi.dev/media/pronunciations/en/algorithm-us.mp3',
        passingScore: 80,
        tips: 'Lưu ý âm cuối "thm" phát âm dạng hữu thanh.'
      },
      {
        id: 'p3',
        word: 'Parrot',
        ipa: '/ˈper.ət/',
        syllables: 'Par - rot',
        audioSample: 'https://api.dictionaryapi.dev/media/pronunciations/en/parrot-us.mp3',
        passingScore: 80,
        tips: 'Âm /p/ bật hơi dứt khoát.'
      },
      {
        id: 'p4',
        word: 'Elephant',
        ipa: '/ˈel.ə.fənt/',
        syllables: 'El - e - phant',
        audioSample: 'https://api.dictionaryapi.dev/media/pronunciations/en/elephant-us.mp3',
        passingScore: 80,
        tips: 'Trọng âm rơi vào "El".'
      }
    ]
  },
  {
    id: 'ex-003',
    title: 'Nghe Chép Chính Tả Theo Audio (Listening / Dictation)',
    type: 'DICTATION',
    typeName: 'Nghe & Viết (Dictation)',
    typeIcon: 'fa-headphones',
    topicId: 'top-environment',
    topicName: 'Environment & Nature',
    difficulty: 'Trung bình',
    questionCount: 3,
    estimatedDuration: '5 phút',
    status: 'PUBLISHED',
    completionRate: 76.4,
    attemptsCount: 7420,
    avgScore: 78,
    questions: [
      {
        id: 'd1',
        audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/pollution-us.mp3',
        correctText: 'Air pollution causes serious respiratory illness in urban areas.',
        acceptedVariants: [
          'Air pollution causes serious respiratory illness in urban areas',
          'air pollution causes serious respiratory illness in urban areas.'
        ],
        hint: 'Nghe kỹ từ khóa "pollution" và "respiratory".',
        maxListens: 3
      },
      {
        id: 'd2',
        audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/environment-us.mp3',
        correctText: 'We must protect our natural environment for future generations.',
        acceptedVariants: [
          'We must protect our natural environment for future generations',
          'we must protect our natural environment for future generations.'
        ],
        hint: 'Bắt đầu bằng đại từ "We".',
        maxListens: 3
      },
      {
        id: 'd3',
        audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/departure-us.mp3',
        correctText: 'The flight departure was delayed by thirty minutes.',
        acceptedVariants: [
          'The flight departure was delayed by thirty minutes',
          'The flight departure was delayed by 30 minutes.'
        ],
        hint: 'Nhớ chia động từ "was delayed".',
        maxListens: 3
      }
    ]
  },
  {
    id: 'ex-004',
    title: 'Sắp Xếp Từ Khóa Thành Câu Hoàn Chỉnh (Sentence Ordering)',
    type: 'SENTENCE_ORDER',
    typeName: 'Sắp Xếp Câu',
    typeIcon: 'fa-arrow-down-a-z',
    topicId: 'top-business',
    topicName: 'Business & Finance',
    difficulty: 'Khó',
    questionCount: 3,
    estimatedDuration: '4 phút',
    status: 'PUBLISHED',
    completionRate: 71.8,
    attemptsCount: 6150,
    avgScore: 74,
    questions: [
      {
        id: 's1',
        scrambledWords: ['Company', 'revenue', 'last', 'by', 'rose', '25%', 'year.'],
        correctSentence: 'Company revenue rose by 25% last year.',
        punctuationCheck: true,
        hint: 'Chủ ngữ là "Company revenue".'
      },
      {
        id: 's2',
        scrambledWords: ['search', 'engines', 'complex', 'algorithms.', 'Modern', 'use'],
        correctSentence: 'Modern search engines use complex algorithms.',
        punctuationCheck: true,
        hint: 'Bắt đầu bằng tính từ "Modern".'
      },
      {
        id: 's3',
        scrambledWords: ['parties', 'to', 'mutually', 'beneficial', 'negotiate', 'contract.', 'Both', 'sat', 'down', 'a'],
        correctSentence: 'Both parties sat down to negotiate a mutually beneficial contract.',
        punctuationCheck: true,
        hint: 'Chủ ngữ "Both parties".'
      }
    ]
  }
];

// ==========================================================================
// 7. THƯ VIỆN NỘI DUNG & TÀI NGUYÊN (MODULE 6: CONTENT & MEDIA)
// ==========================================================================
let MEDIA_LIBRARY = [
  {
    id: 'med-001',
    fileName: 'revenue_chart_vector.png',
    type: 'IMAGE',
    format: 'PNG',
    sizeBytes: 245000,
    sizeFormatted: '245 KB',
    dimensions: '800 x 600',
    duration: null,
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    uploadedAt: '2026-08-10',
    uploadedBy: 'Đặng Thu Hiền',
    usageStatus: 'IN_USE',
    references: [
      { type: 'VOCAB', id: 'voc-001', name: 'Revenue' },
      { type: 'EXERCISE', id: 'ex-001', name: 'Game Ghép Thẻ' }
    ]
  },
  {
    id: 'med-002',
    fileName: 'parrot_tropical_feathers.jpg',
    type: 'IMAGE',
    format: 'JPG',
    sizeBytes: 412000,
    sizeFormatted: '412 KB',
    dimensions: '1200 x 800',
    duration: null,
    url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&q=80',
    uploadedAt: '2026-08-12',
    uploadedBy: 'Đặng Thu Hiền',
    usageStatus: 'IN_USE',
    references: [
      { type: 'VOCAB', id: 'voc-002', name: 'Parrot' }
    ]
  },
  {
    id: 'med-003',
    fileName: 'audio_revenue_us.mp3',
    type: 'AUDIO',
    format: 'MP3',
    sizeBytes: 68000,
    sizeFormatted: '68 KB',
    dimensions: null,
    duration: '1.2s',
    url: 'https://api.dictionaryapi.dev/media/pronunciations/en/revenue-us.mp3',
    uploadedAt: '2026-08-14',
    uploadedBy: 'Đặng Thu Hiền',
    usageStatus: 'IN_USE',
    references: [
      { type: 'VOCAB', id: 'voc-001', name: 'Revenue' },
      { type: 'EXERCISE', id: 'ex-002', name: 'Luyện Phát Âm' }
    ]
  },
  {
    id: 'med-004',
    fileName: 'audio_algorithm_us.mp3',
    type: 'AUDIO',
    format: 'MP3',
    sizeBytes: 82000,
    sizeFormatted: '82 KB',
    dimensions: null,
    duration: '1.5s',
    url: 'https://api.dictionaryapi.dev/media/pronunciations/en/algorithm-us.mp3',
    uploadedAt: '2026-08-15',
    uploadedBy: 'Đặng Thu Hiền',
    usageStatus: 'IN_USE',
    references: [
      { type: 'VOCAB', id: 'voc-008', name: 'Algorithm' },
      { type: 'EXERCISE', id: 'ex-002', name: 'Luyện Phát Âm' }
    ]
  },
  {
    id: 'med-005',
    fileName: 'travel_plane_sky.jpg',
    type: 'IMAGE',
    format: 'JPG',
    sizeBytes: 520000,
    sizeFormatted: '520 KB',
    dimensions: '1920 x 1080',
    duration: null,
    url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80',
    uploadedAt: '2026-08-20',
    uploadedBy: 'Đặng Thu Hiền',
    usageStatus: 'IN_USE',
    references: [
      { type: 'TOPIC', id: 'top-travel', name: 'Chủ đề Travel' }
    ]
  },
  {
    id: 'med-006',
    fileName: 'banana_fresh_yellow.jpg',
    type: 'IMAGE',
    format: 'JPG',
    sizeBytes: 310000,
    sizeFormatted: '310 KB',
    dimensions: '800 x 600',
    duration: null,
    url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
    uploadedAt: '2026-08-25',
    uploadedBy: 'Đặng Thu Hiền',
    usageStatus: 'IN_USE',
    references: [
      { type: 'VOCAB', id: 'voc-003', name: 'Banana' }
    ]
  },
  {
    id: 'med-007',
    fileName: 'temp_sound_effect_success.mp3',
    type: 'AUDIO',
    format: 'MP3',
    sizeBytes: 45000,
    sizeFormatted: '45 KB',
    dimensions: null,
    duration: '0.8s',
    url: 'https://api.dictionaryapi.dev/media/pronunciations/en/delicious-us.mp3',
    uploadedAt: '2026-09-02',
    uploadedBy: 'Đặng Thu Hiền',
    usageStatus: 'UNUSED',
    references: [] // Có thể xóa an toàn
  }
];

// ==========================================================================
// 8. CẤU HÌNH AI & PROMPT STORY CREATOR (MODULE 7: AI CONFIGURATION)
// ==========================================================================
let AI_CONFIG = {
  provider: 'openai',
  providerName: 'OpenAI (API Official)',
  model: 'gpt-4o-mini',
  apiKeyMasked: 'sk-proj-78kLm90••••••••••••••••••••38fA',
  temperature: 0.7,
  maxOutputTokens: 600,
  timeoutSeconds: 20,
  maxRetries: 2,
  isFeatureEnabled: true,
  dailyLimits: {
    freeUser: 3,
    premiumUser: 25,
    vipUser: 100
  },
  allowedLevels: ['A1', 'A2', 'B1', 'B2', 'C1'],
  writingStyles: [
    { id: 'humor', name: 'Hài hước dí dỏm', desc: 'Cốt truyện nhẹ nhàng, tình huống bất ngờ gây cười.' },
    { id: 'detective', name: 'Trinh thám & Kịch tính', desc: 'Tìm kiếm manh mối, giải mã câu đố bí ẩn.' },
    { id: 'fairytale', name: 'Cổ tích & Thần thoại', desc: 'Thế giới động vật nhân hóa, bài học ý nghĩa.' },
    { id: 'scifi', name: 'Khoa học viễn tưởng', desc: 'Du hành vũ trụ, công nghệ tương lai và người máy.' },
    { id: 'daily', name: 'Đời sống thường nhật', desc: 'Giao tiếp gần gũi, công việc văn phòng và gia đình.' }
  ],
  systemPrompt: `You are an elite bilingual English tutor specialized in creating engaging contextual stories for vocabulary acquisition.
Given a target CEFR level, chosen theme, writing style, and a list of target English words, compose a coherent story of 150-250 words.
Rules:
1. Every target word MUST appear naturally in the story in its correct context.
2. Bold each target word using **word** syntax.
3. Keep sentence structures and grammar strictly suitable for the target CEFR level.
4. Provide a parallel high-quality Vietnamese translation immediately beneath the English story.
5. List the target vocabulary summary at the end with phonetic IPA and part of speech.`,
  storyTemplates: {
    A1: 'Simple short sentences, present tense, everyday basic vocabulary. (Max 120 words)',
    A2: 'Past simple, basic compound sentences with and/but/because. (Max 160 words)',
    B1: 'Complex sentences, relative clauses, conditional sentences. (Max 220 words)',
    B2: 'Rich idioms, nuanced vocabulary, advanced linking expressions. (Max 280 words)'
  },
  usageStats: {
    totalCallsMonth: 48920,
    successfulCalls: 48610,
    failedCalls: 310,
    successRate: '99.4%',
    avgLatencySeconds: 1.34,
    totalTokensConsumed: 12450000,
    estimatedCostUsd: 18.67
  }
};

// ==========================================================================
// 9. DANH MỤC GÓI CƯỚC & ĐĂNG KÝ (MODULE 11: SUBSCRIPTION & PLAN)
// ==========================================================================
let SUBSCRIPTION_PLANS = [
  {
    id: 'plan_free',
    code: 'PLAN_FREE',
    name: 'Gói Free (Học Cơ Bản)',
    description: 'Dành cho người mới bắt đầu làm quen với app.',
    price: 0,
    priceFormatted: 'Miễn phí',
    currency: 'VND',
    billingPeriod: 'Vĩnh viễn',
    durationDays: 9999,
    status: 'ACTIVE',
    displayOrder: 1,
    features: [
      'Học 100 từ vựng cơ bản theo 2 chủ đề Daily & Animals',
      'Flashcard ôn tập cơ bản',
      '3 lượt tạo truyện học AI / ngày',
      'Có hiển thị quảng cáo trong ứng dụng'
    ],
    limits: {
      aiStoriesPerDay: 3,
      unlockedTopics: 2,
      audioOffline: false,
      pronounceAiCheck: false
    }
  },
  {
    id: 'plan_premium_1m',
    code: 'PREMIUM_1M',
    name: 'Gói Premium / 1 Tháng',
    description: 'Mở khóa toàn bộ từ vựng và bài tập thông minh.',
    price: 45000,
    priceFormatted: '45.000 ₫',
    currency: 'VND',
    billingPeriod: '1 Tháng (30 ngày)',
    durationDays: 30,
    status: 'ACTIVE',
    displayOrder: 2,
    discountBadge: 'Tiết kiệm 25%',
    features: [
      'Mở khóa toàn bộ hơn 3.000 từ vựng và 8 chủ đề học tập',
      'Flashcard Spaced Repetition thông minh',
      'Game Ghép từ & Nghe chép chính tả không giới hạn',
      '25 lượt tạo truyện AI / ngày',
      'Không quảng cáo làm phiền',
      'Đồng bộ trên 2 thiết bị'
    ],
    limits: {
      aiStoriesPerDay: 25,
      unlockedTopics: 8,
      audioOffline: true,
      pronounceAiCheck: false
    }
  },
  {
    id: 'plan_vip_1m',
    code: 'VIP_1M',
    name: 'Gói VIP / 1 Tháng',
    description: 'Trải nghiệm đỉnh cao với Chấm Điểm Phát Âm AI & Trợ Lý Gia Sư 1-1.',
    price: 60000,
    priceFormatted: '60.000 ₫',
    currency: 'VND',
    billingPeriod: '1 Tháng (30 ngày)',
    durationDays: 30,
    status: 'ACTIVE',
    displayOrder: 3,
    discountBadge: 'Phổ biến nhất 🔥',
    features: [
      'Bao gồm toàn bộ quyền lợi của gói Premium',
      'Công nghệ AI chấm phát âm chuẩn xác từng âm tiết',
      '100 lượt tạo truyện học từ vựng bằng AI / ngày',
      'Tải trọn bộ Audio chuẩn phát âm người bản xứ',
      'Được ưu tiên hỗ trợ học thuật bởi đội ngũ chuyên gia',
      'Đồng bộ không giới hạn thiết bị'
    ],
    limits: {
      aiStoriesPerDay: 100,
      unlockedTopics: 8,
      audioOffline: true,
      pronounceAiCheck: true
    }
  },
  {
    id: 'plan_vip_1y',
    code: 'VIP_1Y',
    name: 'Gói VIP Trọn Gói / 1 Năm',
    description: 'Cam kết thành thạo từ vựng tiếng Anh trong 12 tháng.',
    price: 599000,
    priceFormatted: '599.000 ₫',
    currency: 'VND',
    billingPeriod: '1 Năm (365 ngày)',
    durationDays: 365,
    status: 'ACTIVE',
    displayOrder: 4,
    discountBadge: 'Tiết kiệm 58% ⚡',
    features: [
      'Toàn quyền VIP không giới hạn trong suốt 365 ngày',
      'Cam kết ghi nhớ 5.000 từ vựng và thi chứng chỉ',
      'Không giới hạn lượt gọi AI Learning Story',
      'Tặng kèm bộ tài liệu ngữ pháp độc quyền LinguaPay'
    ],
    limits: {
      aiStoriesPerDay: 999,
      unlockedTopics: 8,
      audioOffline: true,
      pronounceAiCheck: true
    }
  }
];

// Danh sách Thuê Bao của Người Dùng (User Subscriptions)
let USER_SUBSCRIPTIONS = [
  {
    id: 'SUB-202610-001',
    userId: 'USR-1001',
    userName: 'Hoàng Minh Tuấn',
    userEmail: 'tuan.hm@gmail.com',
    planId: 'plan_vip_1m',
    planName: 'Gói VIP / 1 Tháng',
    startDate: '2026-09-22',
    endDate: '2026-10-22',
    status: 'ACTIVE',
    autoRenew: true,
    latestTxnId: 'TXN-1001',
    createdAt: '2026-09-22 10:05:14'
  },
  {
    id: 'SUB-202610-002',
    userId: 'USR-1002',
    userName: 'Lê Thị Mai',
    userEmail: 'maile.edu@gmail.com',
    planId: 'plan_premium_1m',
    planName: 'Gói Premium / 1 Tháng',
    startDate: '2026-09-18',
    endDate: '2026-10-18',
    status: 'ACTIVE',
    autoRenew: true,
    latestTxnId: 'TXN-1002',
    createdAt: '2026-09-18 10:14:30'
  },
  {
    id: 'SUB-202610-003',
    userId: 'USR-1007',
    userName: 'Phạm Minh Tuấn',
    userEmail: 'minhtuan.pham@yahoo.com',
    planId: 'plan_premium_1m',
    planName: 'Gói Premium / 1 Tháng',
    startDate: '2026-09-22',
    endDate: '2026-10-22',
    status: 'ACTIVE',
    autoRenew: false,
    latestTxnId: 'TXN-1006',
    createdAt: '2026-09-22 11:10:20'
  },
  {
    id: 'SUB-202610-004',
    userId: 'USR-1008',
    userName: 'Đặng Thu Hiền (Học viên)',
    userEmail: 'thuhien.student@gmail.com',
    planId: 'plan_vip_1m',
    planName: 'Gói VIP / 1 Tháng',
    startDate: '2026-09-22',
    endDate: '2026-10-22',
    status: 'ACTIVE',
    autoRenew: true,
    latestTxnId: 'TXN-1007',
    createdAt: '2026-09-22 11:30:15'
  },
  {
    id: 'SUB-202610-005',
    userId: 'USR-1003',
    userName: 'Trần Văn Dũng',
    userEmail: 'dung.tran@outlook.com',
    planId: 'plan_free',
    planName: 'Gói Free (Học Cơ Bản)',
    startDate: '2026-09-01',
    endDate: 'Vĩnh viễn',
    status: 'ACTIVE',
    autoRenew: false,
    latestTxnId: null,
    createdAt: '2026-09-01 08:00:00'
  }
];

// ==========================================================================
// 10. DANH SÁCH GIAO DỊCH & ĐỐI SOÁT (MODULE 12: PAYMENT & TRANSACTIONS)
// ==========================================================================
let PAYMENT_TRANSACTIONS = [
  {
    id: 'TXN-1001',
    orderCode: 'INV-1001',
    userId: 'USR-1001',
    userName: 'Hoàng Minh Tuấn',
    userEmail: 'tuan.hm@gmail.com',
    planId: 'plan_vip_1m',
    planName: 'Gói VIP / 1 Tháng',
    amount: 60000,
    amountFormatted: '60.000 ₫',
    currency: 'VND',
    paymentMethod: 'VietQR (MB Bank)',
    providerTxnId: 'MB758930',
    status: 'AMOUNT_MISMATCH',
    createdAt: '2026-09-22 10:00:00',
    paidAt: '2026-09-22 10:05:14',
    notes: 'Thực nhận 50.000 đ (thiếu 10.000 đ) - Cần liên hệ học viên bổ sung hoặc hoàn tiền.'
  },
  {
    id: 'TXN-1002',
    orderCode: 'INV-1002',
    userId: 'USR-1002',
    userName: 'Lê Thị Mai',
    userEmail: 'maile.edu@gmail.com',
    planId: 'plan_premium_1m',
    planName: 'Gói Premium / 1 Tháng',
    amount: 45000,
    amountFormatted: '45.000 ₫',
    currency: 'VND',
    paymentMethod: 'VietQR (MB Bank)',
    providerTxnId: 'MB823219',
    status: 'CODE_MISMATCH',
    createdAt: '2026-09-22 10:10:00',
    paidAt: '2026-09-22 10:14:30',
    notes: 'Khớp số tiền 45.000 đ nhưng sai cú pháp mã đơn, đã xác minh khớp lệnh thủ công.'
  },
  {
    id: 'TXN-1003',
    orderCode: 'INV-1003',
    userId: 'USR-1004',
    userName: 'Nguyễn Văn A',
    userEmail: 'nguyenvana.tech@gmail.com',
    planId: 'plan_vip_1m',
    planName: 'Gói VIP / 1 Tháng',
    amount: 60000,
    amountFormatted: '60.000 ₫',
    currency: 'VND',
    paymentMethod: 'VietQR PayOS',
    providerTxnId: 'MB346391',
    status: 'SUCCESS',
    createdAt: '2026-09-22 10:18:00',
    paidAt: '2026-09-22 10:20:00',
    notes: 'Khớp 100% tự động qua Webhook PayOS. Đã kích hoạt gói VIP.'
  },
  {
    id: 'TXN-1004',
    orderCode: 'INV-1005',
    userId: 'USR-1005',
    userName: 'Nguyễn Hoàng Yến',
    userEmail: 'hoangyen.nguyen@gmail.com',
    planId: 'plan_premium_1m',
    planName: 'Gói Premium / 1 Tháng',
    amount: 45000,
    amountFormatted: '45.000 ₫',
    currency: 'VND',
    paymentMethod: 'VietQR (MB Bank)',
    providerTxnId: 'MB456947',
    status: 'PENDING',
    createdAt: '2026-09-22 10:40:00',
    paidAt: null,
    notes: 'Đang trong hàng đợi kiểm tra đối soát chu kỳ 15 phút.'
  },
  {
    id: 'TXN-1005',
    orderCode: 'INV-1006',
    userId: 'USR-1007',
    userName: 'Phạm Minh Tuấn',
    userEmail: 'minhtuan.pham@yahoo.com',
    planId: 'plan_premium_1m',
    planName: 'Gói Premium / 1 Tháng',
    amount: 45000,
    amountFormatted: '45.000 ₫',
    currency: 'VND',
    paymentMethod: 'VietQR (VCB)',
    providerTxnId: 'VCB91823',
    status: 'SUCCESS',
    createdAt: '2026-09-22 11:05:00',
    paidAt: '2026-09-22 11:10:20',
    notes: 'Chuyển thừa 5.000 đ (thực chuyển 50.000 đ), đã kích hoạt gói và hoàn dư 5k.'
  },
  {
    id: 'TXN-1006',
    orderCode: 'INV-1007',
    userId: 'USR-1008',
    userName: 'Đặng Thu Hiền (Học viên)',
    userEmail: 'thuhien.student@gmail.com',
    planId: 'plan_vip_1m',
    planName: 'Gói VIP / 1 Tháng',
    amount: 60000,
    amountFormatted: '60.000 ₫',
    currency: 'VND',
    paymentMethod: 'VietQR (TCB)',
    providerTxnId: 'TCB18293',
    status: 'SUCCESS',
    createdAt: '2026-09-22 11:28:00',
    paidAt: '2026-09-22 11:30:15',
    notes: 'Thanh toán thành công qua mã QR Techcombank.'
  },
  {
    id: 'TXN-1007',
    orderCode: 'INV-1008',
    userId: 'USR-1009',
    userName: 'Lê Văn Hoàng',
    userEmail: 'hoangle.vn@gmail.com',
    planId: 'plan_vip_1y',
    planName: 'Gói VIP Trọn Gói / 1 Năm',
    amount: 599000,
    amountFormatted: '599.000 ₫',
    currency: 'VND',
    paymentMethod: 'Thẻ Quốc Tế (Visa)',
    providerTxnId: 'STRIPE-98214',
    status: 'REFUNDED',
    createdAt: '2026-09-20 09:12:00',
    paidAt: '2026-09-20 09:15:00',
    notes: 'Đã hoàn tiền thành công theo chính sách hoàn tiền 7 ngày. Mã tham chiếu REF-98214.'
  }
];

// Bảng đối soát ngân hàng 10 cột đặc trưng LinguaPay
let BANK_RECONCILIATION_LOGS = [
  {
    recId: 'REC-20260922-01',
    orderId: 'INV-1001',
    bankRef: 'MB758930',
    packageName: 'Gói VIP / 1 Tháng',
    sysAmount: 60000,
    sysAmountFormatted: '60.000 ₫',
    realAmount: 50000,
    realAmountFormatted: '50.000 ₫',
    diff: -10000,
    diffFormatted: '-10.000 ₫',
    diffType: 'negative',
    rawContent: 'INV1001 THANH TOAN GOI VIP',
    status: 'AMOUNT_MISMATCH',
    time: '2026-09-22 10:05:14',
    customerName: 'Hoàng Minh Tuấn',
    note: 'Chuyển thiếu 10.000 đ so với giá gói 60k. Cú pháp đúng INV-1001.'
  },
  {
    recId: 'REC-20260922-02',
    orderId: 'INV-1002',
    bankRef: 'MB823219',
    packageName: 'Gói Premium / 1 Tháng',
    sysAmount: 45000,
    sysAmountFormatted: '45.000 ₫',
    realAmount: 45000,
    realAmountFormatted: '45.000 ₫',
    diff: 0,
    diffFormatted: '0 ₫',
    diffType: 'neutral',
    rawContent: 'LE THI MAI CK PREMIUM APP TIENG ANH',
    status: 'CODE_MISMATCH',
    time: '2026-09-22 10:14:30',
    customerName: 'Lê Thị Mai',
    note: 'Đủ 45.000 đ nhưng quên nhập mã đơn INV-1002.'
  },
  {
    recId: 'REC-20260922-03',
    orderId: 'INV-1003',
    bankRef: 'MB346391',
    packageName: 'Gói VIP / 1 Tháng',
    sysAmount: 60000,
    sysAmountFormatted: '60.000 ₫',
    realAmount: 60000,
    realAmountFormatted: '60.000 ₫',
    diff: 0,
    diffFormatted: '0 ₫',
    diffType: 'neutral',
    rawContent: 'INV-1003 NGUYEN VAN A THANH TOAN VIP',
    status: 'MATCHED',
    time: '2026-09-22 10:20:00',
    customerName: 'Nguyễn Văn A',
    note: 'Khớp 100% tự động. PayOS đã tự động kích hoạt VIP.'
  },
  {
    recId: 'REC-20260922-04',
    orderId: 'CHƯA CÓ ĐƠN',
    bankRef: 'MB772248',
    packageName: 'Gói VIP / 1 Tháng',
    sysAmount: 0,
    sysAmountFormatted: '0 ₫',
    realAmount: 60000,
    realAmountFormatted: '60.000 ₫',
    diff: 60000,
    diffFormatted: '+60.000 ₫',
    diffType: 'positive',
    rawContent: 'TRAN VAN DUNG DANG KY VIP THIEU DON',
    status: 'MISSING_IN_APP',
    time: '2026-09-22 10:35:12',
    customerName: 'Trần Văn Dũng',
    note: 'Tiền đã vào MB nhưng app chưa nhận đơn hàng (rớt mạng khi quét).'
  },
  {
    recId: 'REC-20260922-05',
    orderId: 'INV-1005',
    bankRef: 'MB456947',
    packageName: 'Gói Premium / 1 Tháng',
    sysAmount: 45000,
    sysAmountFormatted: '45.000 ₫',
    realAmount: 45000,
    realAmountFormatted: '45.000 ₫',
    diff: 0,
    diffFormatted: '0 ₫',
    diffType: 'neutral',
    rawContent: 'INV1005 HOANG YEN PREMIUM',
    status: 'PENDING',
    time: '2026-09-22 10:45:00',
    customerName: 'Nguyễn Hoàng Yến',
    note: 'Đang trong hàng đợi đối soát chu kỳ 15 phút.'
  },
  {
    recId: 'REC-20260922-06',
    orderId: 'INV-1006',
    bankRef: 'VCB91823',
    packageName: 'Gói Premium / 1 Tháng',
    sysAmount: 45000,
    sysAmountFormatted: '45.000 ₫',
    realAmount: 50000,
    realAmountFormatted: '50.000 ₫',
    diff: 5000,
    diffFormatted: '+5.000 ₫',
    diffType: 'positive',
    rawContent: 'INV-1006 PHAM MINH TUAN CHUYEN THUA 5K',
    status: 'AMOUNT_MISMATCH',
    time: '2026-09-22 11:10:20',
    customerName: 'Phạm Minh Tuấn',
    note: 'Chuyển thừa 5.000 đ so với giá gói Premium 45k.'
  },
  {
    recId: 'REC-20260922-07',
    orderId: 'INV-1007',
    bankRef: 'TCB18293',
    packageName: 'Gói VIP / 1 Tháng',
    sysAmount: 60000,
    sysAmountFormatted: '60.000 ₫',
    realAmount: 60000,
    realAmountFormatted: '60.000 ₫',
    diff: 0,
    diffFormatted: '0 ₫',
    diffType: 'neutral',
    rawContent: 'INV1007 DANG THU HIEN VIP 1M',
    status: 'MATCHED',
    time: '2026-09-22 11:30:15',
    customerName: 'Đặng Thu Hiền (Học viên)',
    note: 'Đối soát khớp 100%. Gói VIP đã kích hoạt.'
  }
];

// ==========================================================================
// 10.B. HỆ THỐNG DỮ LIỆU TÀI CHÍNH & THANH TOÁN (MODULE 12 CHUẨN BA/PM)
// Phân biệt rõ: Tiền vào, Tiền hoàn, Phí cổng, Tiền thực nhận, Doanh thu, Số dư
// ==========================================================================
const FINANCIAL_OVERVIEW = {
  period: '01/10/2026 – 31/10/2026',
  totalGrossIn: 125000000,
  totalGrossInFormatted: '125.000.000 ₫',
  totalRefunded: 5000000,
  totalRefundedFormatted: '5.000.000 ₫',
  totalGatewayFees: 2000000,
  totalGatewayFeesFormatted: '2.000.000 ₫',
  netEstimatedReceived: 118000000,
  netEstimatedReceivedFormatted: '118.000.000 ₫',
  recognizedRevenue: 120000000,
  recognizedRevenueFormatted: '120.000.000 ₫',
  availableBalance: 42500000,
  availableBalanceFormatted: '42.500.000 ₫',
  pendingUnmatchedCount: 4,
  pendingConfirmationCount: 3,
  channelBreakdown: [
    { channel: 'VietQR (MB Bank trực tiếp)', amount: 62500000, percentage: 50, txns: 1040 },
    { channel: 'VietQR PayOS Gateway', amount: 37500000, percentage: 30, txns: 625 },
    { channel: 'Ví MoMo Business', amount: 12500000, percentage: 10, txns: 250 },
    { channel: 'Cổng VNPAY-QR', amount: 8750000, percentage: 7, txns: 160 },
    { channel: 'Thẻ Quốc Tế (Visa/Mastercard)', amount: 3750000, percentage: 3, txns: 45 }
  ]
};

let MONEY_IN_RECORDS = [
  {
    id: 'IN-202610-001',
    source: 'Mua mới gói VIP 1 Năm',
    sourceType: 'NEW_PURCHASE',
    txnId: 'TXN-1007',
    orderCode: 'INV-1008',
    payer: 'Lê Văn Hoàng',
    payerEmail: 'hoangle.vn@gmail.com',
    grossAmount: 599000,
    grossAmountFormatted: '599.000 ₫',
    gatewayFee: 5990,
    gatewayFeeFormatted: '5.990 ₫',
    netAmount: 593010,
    netAmountFormatted: '593.010 ₫',
    channel: 'Thẻ Quốc Tế (Visa)',
    status: 'SETTLED',
    statusLabel: 'Đã quyết toán',
    paidAt: '2026-10-08 09:15:00',
    settledAt: '2026-10-09 14:30:00',
    bankRef: 'STRIPE-98214'
  },
  {
    id: 'IN-202610-002',
    source: 'Mua mới gói VIP 1 Tháng',
    sourceType: 'NEW_PURCHASE',
    txnId: 'TXN-1003',
    orderCode: 'INV-1003',
    payer: 'Nguyễn Văn A',
    payerEmail: 'nguyenvana.tech@gmail.com',
    grossAmount: 60000,
    grossAmountFormatted: '60.000 ₫',
    gatewayFee: 600,
    gatewayFeeFormatted: '600 ₫',
    netAmount: 59400,
    netAmountFormatted: '59.400 ₫',
    channel: 'VietQR PayOS',
    status: 'SETTLED',
    statusLabel: 'Đã quyết toán',
    paidAt: '2026-10-10 10:20:00',
    settledAt: '2026-10-11 08:00:00',
    bankRef: 'MB346391'
  },
  {
    id: 'IN-202610-003',
    source: 'Gia hạn gói Premium 1 Tháng',
    sourceType: 'RENEWAL',
    txnId: 'TXN-1005',
    orderCode: 'INV-1006',
    payer: 'Phạm Minh Tuấn',
    payerEmail: 'minhtuan.pham@yahoo.com',
    grossAmount: 45000,
    grossAmountFormatted: '45.000 ₫',
    gatewayFee: 450,
    gatewayFeeFormatted: '450 ₫',
    netAmount: 44550,
    netAmountFormatted: '44.550 ₫',
    channel: 'VietQR (VCB)',
    status: 'PENDING_SETTLEMENT',
    statusLabel: 'Chờ quyết toán',
    paidAt: '2026-10-10 11:10:20',
    settledAt: '--',
    bankRef: 'VCB91823'
  },
  {
    id: 'IN-202610-004',
    source: 'Gia hạn gói VIP 1 Tháng',
    sourceType: 'RENEWAL',
    txnId: 'TXN-1006',
    orderCode: 'INV-1007',
    payer: 'Đặng Thu Hiền (Học viên)',
    payerEmail: 'thuhien.student@gmail.com',
    grossAmount: 60000,
    grossAmountFormatted: '60.000 ₫',
    gatewayFee: 600,
    gatewayFeeFormatted: '600 ₫',
    netAmount: 59400,
    netAmountFormatted: '59.400 ₫',
    channel: 'VietQR (TCB)',
    status: 'SETTLED',
    statusLabel: 'Đã quyết toán',
    paidAt: '2026-10-10 11:30:15',
    settledAt: '2026-10-11 08:00:00',
    bankRef: 'TCB18293'
  },
  {
    id: 'IN-202610-005',
    source: 'Mua mới gói VIP 1 Tháng (Lệch thiếu 10k)',
    sourceType: 'NEW_PURCHASE',
    txnId: 'TXN-1001',
    orderCode: 'INV-1001',
    payer: 'Hoàng Minh Tuấn',
    payerEmail: 'tuan.hm@gmail.com',
    grossAmount: 50000,
    grossAmountFormatted: '50.000 ₫',
    gatewayFee: 500,
    gatewayFeeFormatted: '500 ₫',
    netAmount: 49500,
    netAmountFormatted: '49.500 ₫',
    channel: 'VietQR (MB Bank)',
    status: 'MISMATCH',
    statusLabel: 'Có chênh lệch',
    paidAt: '2026-10-09 10:05:14',
    settledAt: '2026-10-10 08:00:00',
    bankRef: 'MB758930'
  },
  {
    id: 'IN-202610-006',
    source: 'Mua mới gói Premium 1 Tháng',
    sourceType: 'NEW_PURCHASE',
    txnId: 'TXN-1004',
    orderCode: 'INV-1005',
    payer: 'Nguyễn Hoàng Yến',
    payerEmail: 'hoangyen.nguyen@gmail.com',
    grossAmount: 45000,
    grossAmountFormatted: '45.000 ₫',
    gatewayFee: 450,
    gatewayFeeFormatted: '450 ₫',
    netAmount: 44550,
    netAmountFormatted: '44.550 ₫',
    channel: 'VietQR (MB Bank)',
    status: 'PAID',
    statusLabel: 'Đã thanh toán',
    paidAt: '2026-10-11 10:40:00',
    settledAt: '--',
    bankRef: 'MB456947'
  }
];

let MONEY_OUT_RECORDS = [
  {
    id: 'OUT-202610-001',
    type: 'REFUND',
    typeLabel: 'Hoàn tiền học viên',
    recipient: 'Lê Văn Hoàng (hoangle.vn@gmail.com)',
    relatedTxnId: 'TXN-1007',
    amount: 599000,
    amountFormatted: '599.000 ₫',
    method: 'VietQR Chuyển hoàn',
    status: 'SUCCESS',
    statusLabel: 'Đã chi thành công',
    createdAt: '2026-10-08 14:00:00',
    paidAt: '2026-10-08 14:15:20',
    creator: 'Finance Manager Trang',
    approver: 'Super Admin Tuấn',
    notes: 'Hoàn 100% gói 1 năm do học viên đăng ký nhầm lớp theo chính sách 7 ngày.'
  },
  {
    id: 'OUT-202610-002',
    type: 'GATEWAY_FEE',
    typeLabel: 'Phí cổng thanh toán VietQR / PayOS',
    recipient: 'Cổ phần Công nghệ PayOS',
    relatedTxnId: 'BATCH-202610-W1',
    amount: 850000,
    amountFormatted: '850.000 ₫',
    method: 'Khấu trừ tự động kỳ đối soát W1',
    status: 'SUCCESS',
    statusLabel: 'Đã chi thành công',
    createdAt: '2026-10-07 00:00:00',
    paidAt: '2026-10-07 01:00:00',
    creator: 'Hệ thống tự động',
    approver: 'Đối soát PayOS',
    notes: 'Phí xử lý giao dịch 0.8% trên tổng doanh số tuần 1 tháng 10.'
  },
  {
    id: 'OUT-202610-003',
    type: 'CLOUD_INFRA',
    typeLabel: 'Hạ tầng Cloud & Server Backend',
    recipient: 'Amazon Web Services (AWS)',
    relatedTxnId: 'INV-AWS-202610',
    amount: 3200000,
    amountFormatted: '3.200.000 ₫',
    method: 'Thẻ Doanh Nghiệp (Visa Corp)',
    status: 'SUCCESS',
    statusLabel: 'Đã chi thành công',
    createdAt: '2026-10-05 09:00:00',
    paidAt: '2026-10-05 09:30:00',
    creator: 'DevOps Lead',
    approver: 'Super Admin Tuấn',
    notes: 'Chi phí cụm máy chủ EC2, RDS PostgreSQL và lưu trữ S3 audio từ vựng.'
  },
  {
    id: 'OUT-202610-004',
    type: 'AI_SERVICES',
    typeLabel: 'Chi phí OpenAI API (GPT-4o & TTS)',
    recipient: 'OpenAI, LLC',
    relatedTxnId: 'INV-OPENAI-202610',
    amount: 1950000,
    amountFormatted: '1.950.000 ₫',
    method: 'Thẻ Doanh Nghiệp (Visa Corp)',
    status: 'SUCCESS',
    statusLabel: 'Đã chi thành công',
    createdAt: '2026-10-04 15:00:00',
    paidAt: '2026-10-04 15:10:00',
    creator: 'AI Engineer',
    approver: 'Super Admin Tuấn',
    notes: 'Chi phí sinh câu chuyện song ngữ AI Story và phát âm Text-to-Speech.'
  },
  {
    id: 'OUT-202610-005',
    type: 'REFUND',
    typeLabel: 'Hoàn tiền học viên (Chuyển thừa)',
    recipient: 'Phạm Minh Tuấn (minhtuan.pham@yahoo.com)',
    relatedTxnId: 'TXN-1005',
    amount: 5000,
    amountFormatted: '5.000 ₫',
    method: 'VietQR MB Bank',
    status: 'PENDING_APPROVAL',
    statusLabel: 'Chờ duyệt',
    createdAt: '2026-10-10 11:15:00',
    paidAt: null,
    creator: 'Support Agent Minh',
    approver: 'Finance Manager Trang',
    notes: 'Học viên chuyển 50.000 đ cho gói 45k, yêu cầu hoàn phần tiền thừa 5.000 đ.'
  }
];

let REFUND_REQUESTS = [
  {
    id: 'REF-202610-01',
    originalTxnId: 'TXN-1007',
    orderCode: 'INV-1008',
    requester: 'Lê Văn Hoàng (Học viên)',
    userEmail: 'hoangle.vn@gmail.com',
    originalAmount: 599000,
    originalAmountFormatted: '599.000 ₫',
    refundAmount: 599000,
    refundAmountFormatted: '599.000 ₫',
    reason: 'Khách hàng yêu cầu hủy trong 7 ngày theo chính sách cam kết',
    reasonCategory: 'Khách hàng yêu cầu',
    status: 'SUCCESS',
    statusLabel: 'Thành công',
    approver: 'Super Admin Tuấn',
    createdAt: '2026-10-08 10:15:00',
    completedAt: '2026-10-08 14:15:20',
    proofNote: 'Mã hoàn Stripe REF-98214 - Hoàn tiền trực tiếp vào thẻ'
  },
  {
    id: 'REF-202610-02',
    originalTxnId: 'TXN-1005',
    orderCode: 'INV-1006',
    requester: 'Phạm Minh Tuấn (Học viên)',
    userEmail: 'minhtuan.pham@yahoo.com',
    originalAmount: 45000,
    originalAmountFormatted: '45.000 ₫',
    refundAmount: 5000,
    refundAmountFormatted: '5.000 ₫',
    reason: 'Thanh toán thừa tiền (Chuyển 50k cho gói 45k)',
    reasonCategory: 'Thanh toán trùng / Thừa tiền',
    status: 'PENDING',
    statusLabel: 'Chờ duyệt',
    approver: 'Finance Manager Trang',
    createdAt: '2026-10-10 11:15:00',
    completedAt: null,
    proofNote: 'Đã kiểm tra sao kê VCB91823 nhận 50.000 đ'
  },
  {
    id: 'REF-202610-03',
    originalTxnId: 'TXN-1001',
    orderCode: 'INV-1001',
    requester: 'Hoàng Minh Tuấn',
    userEmail: 'tuan.hm@gmail.com',
    originalAmount: 60000,
    originalAmountFormatted: '60.000 ₫',
    refundAmount: 50000,
    refundAmountFormatted: '50.000 ₫',
    reason: 'Chuyển thiếu tiền, khách không muốn bù thêm, yêu cầu hoàn lại',
    reasonCategory: 'Khách hàng yêu cầu',
    status: 'APPROVED',
    statusLabel: 'Đã duyệt',
    approver: 'Super Admin Tuấn',
    createdAt: '2026-10-10 09:00:00',
    completedAt: null,
    proofNote: 'Đang xếp hàng gửi API chuyển hoàn VietQR MB Bank'
  },
  {
    id: 'REF-202610-04',
    originalTxnId: 'TXN-0992',
    orderCode: 'INV-0992',
    requester: 'Trần Thị Thúy',
    userEmail: 'thuytran@outlook.com',
    originalAmount: 180000,
    originalAmountFormatted: '180.000 ₫',
    refundAmount: 180000,
    refundAmountFormatted: '180.000 ₫',
    reason: 'Lỗi trùng giao dịch (Hệ thống trừ tiền 2 lần)',
    reasonCategory: 'Lỗi dịch vụ',
    status: 'SUCCESS',
    statusLabel: 'Thành công',
    approver: 'Finance Manager Trang',
    createdAt: '2026-10-02 16:30:00',
    completedAt: '2026-10-02 17:05:00',
    proofNote: 'Đã hoàn qua VietQR PayOS REF-0992-DUP'
  }
];

let RECONCILIATION_SESSIONS = [
  {
    id: 'REC-SES-202610-01',
    channel: 'VietQR (MB Bank & PayOS)',
    period: '01/10/2026 – 10/10/2026',
    internalCount: 42,
    providerCount: 42,
    internalAmount: 48500000,
    internalAmountFormatted: '48.500.000 ₫',
    providerAmount: 48500000,
    providerAmountFormatted: '48.500.000 ₫',
    matchedCount: 38,
    diffCount: 4,
    status: 'DISCREPANCY',
    statusLabel: 'Có chênh lệch (4)',
    createdAt: '2026-10-11 08:00:00',
    completedAt: null,
    auditor: 'Finance Manager Trang',
    differences: [
      {
        id: 'DIFF-001',
        internalTxn: 'TXN-1001',
        providerTxn: 'MB758930',
        orderCode: 'INV-1001',
        internalAmount: 60000,
        providerAmount: 50000,
        diffAmount: -10000,
        type: 'Khác số tiền (Chuyển thiếu 10.000 ₫)',
        status: 'Chờ giải quyết',
        actionTaken: 'Đã tạo yêu cầu hoàn tiền REF-202610-03 cho khách',
        handler: 'Finance Manager Trang'
      },
      {
        id: 'DIFF-002',
        internalTxn: 'TXN-1002',
        providerTxn: 'MB823219',
        orderCode: 'INV-1002',
        internalAmount: 45000,
        providerAmount: 45000,
        diffAmount: 0,
        type: 'Sai cú pháp nội dung chuyển khoản',
        status: 'Đã khớp thủ công',
        actionTaken: 'Admin xác nhận biên lai, đã kích hoạt gói Premium',
        handler: 'Support Agent Minh'
      },
      {
        id: 'DIFF-003',
        internalTxn: 'TXN-1006',
        providerTxn: 'VCB91823',
        orderCode: 'INV-1006',
        internalAmount: 45000,
        providerAmount: 50000,
        diffAmount: 5000,
        type: 'Khác số tiền (Chuyển thừa 5.000 ₫)',
        status: 'Chờ giải quyết',
        actionTaken: 'Đã duyệt kích hoạt gói, đang tạo hoàn dư 5k',
        handler: 'Finance Manager Trang'
      },
      {
        id: 'DIFF-004',
        internalTxn: 'TXN-1004',
        providerTxn: 'MB456947',
        orderCode: 'INV-1005',
        internalAmount: 45000,
        providerAmount: 0,
        diffAmount: -45000,
        type: 'Tiền quyết toán chưa về tài khoản',
        status: 'Đang theo dõi T+1',
        actionTaken: 'Chờ phiên quyết toán sáng 12/10 của cổng',
        handler: 'Hệ thống tự động'
      }
    ]
  },
  {
    id: 'REC-SES-202609-02',
    channel: 'Toàn bộ kênh thanh toán',
    period: '16/09/2026 – 30/09/2026',
    internalCount: 156,
    providerCount: 156,
    internalAmount: 82400000,
    internalAmountFormatted: '82.400.000 ₫',
    providerAmount: 82400000,
    providerAmountFormatted: '82.400.000 ₫',
    matchedCount: 156,
    diffCount: 0,
    status: 'COMPLETED',
    statusLabel: 'Hoàn tất (100% khớp)',
    createdAt: '2026-10-01 08:30:00',
    completedAt: '2026-10-01 11:00:00',
    auditor: 'Super Admin Tuấn',
    differences: []
  }
];

let PAYMENT_CHANNELS = [
  {
    id: 'CHN-MB-DIRECT',
    name: 'VietQR - MB Bank Pro (API Trực tiếp)',
    provider: 'Ngân hàng TMCP Quân Đội (MB Bank)',
    type: 'BANK_DIRECT',
    typeLabel: 'Ngân hàng trực tiếp',
    status: 'ACTIVE',
    environment: 'Production',
    feeRate: '0.0% (Miễn phí)',
    maskedKey: 'mb_sec_live_************98f4',
    accountNumber: '0389281982',
    accountName: 'CONG TY CP CONG NGHE LINGUAPAY',
    lastPing: '2026-10-11 17:55:00',
    pingStatus: 'SUCCESS',
    uptime: '99.98%'
  },
  {
    id: 'CHN-PAYOS',
    name: 'VietQR - PayOS Webhook Gateway',
    provider: 'PayOS Tech JSC',
    type: 'GATEWAY_WEBHOOK',
    typeLabel: 'Cổng Webhook QR',
    status: 'ACTIVE',
    environment: 'Production',
    feeRate: '0.8% / GD thành công',
    maskedKey: 'payos_api_key_************412b',
    accountNumber: 'Tích hợp qua Webhook',
    accountName: 'LinguaPay Vietnam',
    lastPing: '2026-10-11 17:58:12',
    pingStatus: 'SUCCESS',
    uptime: '99.95%'
  },
  {
    id: 'CHN-VNPAY',
    name: 'VNPAY-QR & Ví Điện Tử',
    provider: 'VNPAY Corporation',
    type: 'PAYMENT_GATEWAY',
    typeLabel: 'Cổng thanh toán quốc gia',
    status: 'ACTIVE',
    environment: 'Production',
    feeRate: '1.2% / GD',
    maskedKey: 'vnp_hash_secret_************66a1',
    accountNumber: 'VNPAY_MERCHANT_LINGUA',
    accountName: 'CONG TY CP CONG NGHE LINGUAPAY',
    lastPing: '2026-10-11 17:50:30',
    pingStatus: 'SUCCESS',
    uptime: '99.90%'
  },
  {
    id: 'CHN-MOMO',
    name: 'Ví Điện Tử MoMo Business',
    provider: 'M-Service (MoMo)',
    type: 'E_WALLET',
    typeLabel: 'Ví điện tử',
    status: 'ACTIVE',
    environment: 'Production',
    feeRate: '1.5% / GD',
    maskedKey: 'momo_secret_************55bc',
    accountNumber: 'MOMO_PARTNER_0982',
    accountName: 'LinguaPay MoMo Store',
    lastPing: '2026-10-11 17:52:00',
    pingStatus: 'SUCCESS',
    uptime: '99.92%'
  },
  {
    id: 'CHN-STRIPE-INTL',
    name: 'Thẻ Quốc Tế (Visa / Mastercard - Stripe)',
    provider: 'Stripe Payments Singapore',
    type: 'INTERNATIONAL_CARD',
    typeLabel: 'Thẻ thanh toán quốc tế',
    status: 'ACTIVE',
    environment: 'Production',
    feeRate: '2.9% + 0.30 USD',
    maskedKey: 'sk_live_************38ef',
    accountNumber: 'acct_1NZLinguaPay',
    accountName: 'LinguaPay Global Ltd',
    lastPing: '2026-10-11 17:45:00',
    pingStatus: 'SUCCESS',
    uptime: '99.99%'
  }
];

let FINANCIAL_AUDIT_LOGS = [
  {
    id: 'FIN-LOG-9001',
    actor: 'Super Admin Tuấn (super_admin)',
    action: 'Duyệt hoàn tiền (REFUND_APPROVED)',
    object: 'REF-202610-01 (INV-1008 - 599.000 ₫)',
    oldValue: 'Trạng thái: CHỜ DUYỆT',
    newValue: 'Trạng thái: THÀNH CÔNG',
    timestamp: '2026-10-08 14:15:20',
    result: 'SUCCESS',
    reason: 'Đủ điều kiện hoàn tiền trong 7 ngày theo cam kết',
    correlationId: 'REQ-STRP-98214'
  },
  {
    id: 'FIN-LOG-9002',
    actor: 'Finance Manager Trang (finance_manager)',
    action: 'Xử lý chênh lệch đối soát (RECONCILE_RESOLVE)',
    object: 'DIFF-002 (INV-1002 - Lê Thị Mai)',
    oldValue: 'Trạng thái: SAI CÚ PHÁP',
    newValue: 'Trạng thái: ĐÃ KHỚP THỦ CÔNG',
    timestamp: '2026-10-09 11:30:00',
    result: 'SUCCESS',
    reason: 'Học viên chuyển đúng 45k, đối chiếu mã giao dịch MB823219 trùng khớp',
    correlationId: 'REC-MB-823219'
  },
  {
    id: 'FIN-LOG-9003',
    actor: 'Super Admin Tuấn (super_admin)',
    action: 'Cập nhật cấu hình kênh thanh toán',
    object: 'CHN-PAYOS (PayOS Webhook Gateway)',
    oldValue: 'Webhook URL: https://old-api.linguapay.vn',
    newValue: 'Webhook URL: https://api.linguapay.vn/v1/payos/ipn',
    timestamp: '2026-10-07 16:45:10',
    result: 'SUCCESS',
    reason: 'Nâng cấp cụm server IPN chịu tải cao',
    correlationId: 'CFG-PAYOS-01'
  },
  {
    id: 'FIN-LOG-9004',
    actor: 'Finance Manager Trang (finance_manager)',
    action: 'Xuất báo cáo tài chính đối soát (EXPORT_REPORT)',
    object: 'Báo cáo đối soát kỳ 01/10 - 10/10/2026 (CSV)',
    oldValue: '--',
    newValue: 'Xuất 42 bản ghi giao dịch',
    timestamp: '2026-10-10 17:00:00',
    result: 'SUCCESS',
    reason: 'Gửi ban giám đốc họp định kỳ tài chính',
    correlationId: 'EXP-FIN-202610'
  },
  {
    id: 'FIN-LOG-9005',
    actor: 'Support Agent Minh (support)',
    action: 'Tạo đề nghị hoàn tiền (CREATE_REFUND_REQ)',
    object: 'REF-202610-02 (INV-1006 - Phạm Minh Tuấn)',
    oldValue: '--',
    newValue: 'Số tiền đề nghị hoàn: 5.000 ₫',
    timestamp: '2026-10-10 11:15:00',
    result: 'SUCCESS',
    reason: 'Học viên chuyển thừa tiền so với giá niêm yết',
    correlationId: 'REQ-REF-VCB91'
  }
];

// ==========================================================================
// 11. DANH SÁCH NGƯỜI DÙNG & HỌC VIÊN (MODULE 2: USER MANAGEMENT)
// ==========================================================================
let APP_USERS = [
  {
    id: 'USR-1001',
    fullName: 'Hoàng Minh Tuấn',
    email: 'tuan.hm@gmail.com',
    phone: '0982348123',
    status: 'ACTIVE',
    registeredAt: '2026-08-10',
    planType: 'VIP',
    planName: 'Gói VIP (60.000 ₫)',
    expiryDate: '2026-10-22',
    lastActive: '2026-10-10 09:30:14',
    avatar: 'HT',
    learningProgress: {
      topicsCompleted: 5,
      totalTopics: 8,
      wordsLearned: 385,
      exercisesFinished: 82,
      currentStreakDays: 24,
      avgPronounceScore: 88,
      totalStudyHours: 32.5
    },
    learningHistory: [
      { date: '2026-10-10 09:15', exercise: 'Game Ghép Từ Animals', score: '100/100', duration: '2p 45s' },
      { date: '2026-10-09 20:30', exercise: 'Luyện Phát Âm Business', score: '88/100', duration: '3p 10s' },
      { date: '2026-10-08 21:00', exercise: 'Dictation Environment', score: '90/100', duration: '4p 20s' }
    ],
    auditLogs: [
      { time: '2026-09-22 10:06', admin: 'Nguyễn Bích Ngọc', action: 'Kích hoạt tạm thời gói VIP sau khi học viên liên hệ bổ sung tiền.' },
      { time: '2026-08-10 09:00', admin: 'System', action: 'Tạo tài khoản và gửi email xác nhận.' }
    ]
  },
  {
    id: 'USR-1002',
    fullName: 'Lê Thị Mai',
    email: 'maile.edu@gmail.com',
    phone: '0912445889',
    status: 'ACTIVE',
    registeredAt: '2026-08-15',
    planType: 'Premium',
    planName: 'Gói Premium (45.000 ₫)',
    expiryDate: '2026-10-18',
    lastActive: '2026-10-09 21:10:00',
    avatar: 'LM',
    learningProgress: {
      topicsCompleted: 4,
      totalTopics: 8,
      wordsLearned: 210,
      exercisesFinished: 54,
      currentStreakDays: 12,
      avgPronounceScore: 76,
      totalStudyHours: 18.2
    },
    learningHistory: [
      { date: '2026-10-09 21:00', exercise: 'Sentence Ordering Business', score: '85/100', duration: '3p 40s' },
      { date: '2026-10-07 19:30', exercise: 'Game Ghép Từ Food', score: '95/100', duration: '2p 15s' }
    ],
    auditLogs: [
      { time: '2026-09-22 10:15', admin: 'Phạm Đức Long', action: 'Khớp lệnh thủ công mã đơn INV-1002 do chuyển khoản quên mã.' }
    ]
  },
  {
    id: 'USR-1003',
    fullName: 'Trần Văn Dũng',
    email: 'dung.tran@outlook.com',
    phone: '0903881223',
    status: 'ACTIVE',
    registeredAt: '2026-09-01',
    planType: 'Free',
    planName: 'Gói Free (Học cơ bản)',
    expiryDate: 'Vĩnh viễn',
    lastActive: '2026-10-08 14:20:00',
    avatar: 'TD',
    learningProgress: {
      topicsCompleted: 1,
      totalTopics: 8,
      wordsLearned: 45,
      exercisesFinished: 12,
      currentStreakDays: 3,
      avgPronounceScore: 62,
      totalStudyHours: 4.5
    },
    learningHistory: [
      { date: '2026-10-08 14:10', exercise: 'Game Ghép Từ Animals', score: '70/100', duration: '4p 10s' }
    ],
    auditLogs: [
      { time: '2026-09-01 08:00', admin: 'System', action: 'Đăng ký tài khoản Free.' }
    ]
  },
  {
    id: 'USR-1004',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana.tech@gmail.com',
    phone: '0938112233',
    status: 'ACTIVE',
    registeredAt: '2026-09-10',
    planType: 'VIP',
    planName: 'Gói VIP (60.000 ₫)',
    expiryDate: '2026-10-22',
    lastActive: '2026-10-10 10:15:00',
    avatar: 'NA',
    learningProgress: {
      topicsCompleted: 6,
      totalTopics: 8,
      wordsLearned: 420,
      exercisesFinished: 95,
      currentStreakDays: 30,
      avgPronounceScore: 92,
      totalStudyHours: 41.0
    },
    learningHistory: [
      { date: '2026-10-10 10:00', exercise: 'Dictation Environment', score: '95/100', duration: '3p 05s' }
    ],
    auditLogs: [
      { time: '2026-09-22 10:20', admin: 'System PayOS', action: 'Kích hoạt tự động gói VIP sau đối soát khớp 100%.' }
    ]
  },
  {
    id: 'USR-1005',
    fullName: 'Nguyễn Hoàng Yến',
    email: 'hoangyen.nguyen@gmail.com',
    phone: '0977889900',
    status: 'PENDING_VERIFICATION',
    registeredAt: '2026-09-20',
    planType: 'Free',
    planName: 'Gói Free (Chờ xác minh)',
    expiryDate: 'Chưa có',
    lastActive: '2026-09-22 10:45:00',
    avatar: 'HY',
    learningProgress: {
      topicsCompleted: 0,
      totalTopics: 8,
      wordsLearned: 15,
      exercisesFinished: 3,
      currentStreakDays: 1,
      avgPronounceScore: 58,
      totalStudyHours: 1.2
    },
    learningHistory: [],
    auditLogs: []
  },
  {
    id: 'USR-1006',
    fullName: 'Đỗ Mạnh Cường',
    email: 'cuong.do@viettel.vn',
    phone: '0988114422',
    status: 'LOCKED',
    registeredAt: '2026-07-10',
    planType: 'Free',
    planName: 'Bị khóa tài khoản',
    expiryDate: 'Hết hạn',
    lastActive: '2026-09-05 11:00:00',
    avatar: 'MC',
    learningProgress: {
      topicsCompleted: 2,
      totalTopics: 8,
      wordsLearned: 85,
      exercisesFinished: 18,
      currentStreakDays: 0,
      avgPronounceScore: 65,
      totalStudyHours: 7.0
    },
    learningHistory: [],
    auditLogs: [
      { time: '2026-09-05 11:30', admin: 'Trần Anh Tuấn', action: 'Khóa tài khoản do phát hiện dấu hiệu spam API luyện phát âm tự động.' }
    ]
  }
];

// ==========================================================================
// 12. BÁO CÁO PHÂN TÍCH HỌC TẬP (MODULE 8: LEARNING ANALYTICS)
// ==========================================================================
const LEARNING_ANALYTICS_DATA = {
  kpis: {
    dau: 3450,
    wau: 6120,
    mau: 8620,
    dauGrowth: '+14.2%',
    avgSessionMinutes: 14.8,
    completionRate: '84.6%',
    avgStreakDays: 7.2,
    aiStoryEngagementRate: '78.5%'
  },
  dauTrendSeries: [
    { name: 'DAU (Người dùng tích cực / ngày)', data: [2800, 2950, 3100, 3250, 3180, 3390, 3450] },
    { name: 'Số phiên học (Sessions / ngày)', data: [6200, 6800, 7100, 7450, 7200, 7900, 8120] }
  ],
  dates7Days: ['04/10', '05/10', '06/10', '07/10', '08/10', '09/10', '10/10'],
  exercisePerformance: [
    { type: 'Game Ghép Từ', completionRate: 88.5, avgScore: 92, dropOffRate: 11.5 },
    { type: 'Luyện Phát Âm AI', completionRate: 82.1, avgScore: 84, dropOffRate: 17.9 },
    { type: 'Nghe Chép Dictation', completionRate: 76.4, avgScore: 78, dropOffRate: 23.6 },
    { type: 'Sắp Xếp Câu', completionRate: 71.8, avgScore: 74, dropOffRate: 28.2 }
  ],
  topWordsReviewed: [
    { word: 'Banana', times: 3100, correctRate: '94%' },
    { word: 'Parrot', times: 2890, correctRate: '91%' },
    { word: 'Elephant', times: 2450, correctRate: '89%' },
    { word: 'Delicious', times: 2320, correctRate: '87%' },
    { word: 'Environment', times: 1980, correctRate: '78%' }
  ],
  retentionMatrix: [
    { cohort: 'Tuần 1 (01 - 07/09)', size: 850, d1: '68%', d7: '48%', d14: '38%', d30: '29%' },
    { cohort: 'Tuần 2 (08 - 14/09)', size: 920, d1: '72%', d7: '52%', d14: '41%', d30: '32%' },
    { cohort: 'Tuần 3 (15 - 21/09)', size: 1040, d1: '75%', d7: '55%', d14: '44%', d30: '35%' },
    { cohort: 'Tuần 4 (22 - 28/09)', size: 1150, d1: '78%', d7: '58%', d14: '47%', d30: 'Chờ số liệu' }
  ],
  peakHours: [
    { hour: '06:00 - 08:00', percent: '18%', label: 'Buổi sáng trước giờ đi học/làm' },
    { hour: '12:00 - 13:30', percent: '22%', label: 'Giờ nghỉ trưa' },
    { hour: '19:30 - 22:30', percent: '48%', label: 'Khung giờ vàng buổi tối 🔥' },
    { hour: 'Khác', percent: '12%', label: 'Rải rác trong ngày' }
  ]
};

// ==========================================================================
// 13. CẤU HÌNH HỆ THỐNG & AUDIT LOGS (MODULE 10: SETTINGS & AUDIT LOGS)
// ==========================================================================
let SYSTEM_SETTINGS = {
  appInfo: {
    appName: 'LinguaPay English Learning',
    supportHotline: '1900 6868',
    supportEmail: 'support@linguapay.edu.vn',
    appVersion: 'v2.4.2 (Build 20261010)',
    maintenanceMode: false
  },
  learningConfig: {
    dailyWordsGoalDefault: 10,
    passingExerciseScorePercent: 80,
    autoPlayAudioOnCardFlip: true,
    spacedRepetitionIntervalDays: [1, 3, 7, 14, 30]
  },
  securityConfig: {
    requireEmailVerification: true,
    maxSimultaneousDevices: 2,
    adminSessionTimeoutMinutes: 60,
    enforceStrongPassword: true
  },
  notificationConfig: {
    dailyStreakReminderTime: '20:00',
    subscriptionExpiryAlertDaysBefore: 3,
    pushMarketingCampaigns: true
  }
};

let AUDIT_LOGS = [
  {
    id: 'LOG-8910',
    timestamp: '2026-10-10 10:35:12',
    actor: 'Nguyễn Quốc Bảo (Super Admin)',
    module: 'ADMIN_RBAC',
    action: 'UPDATE_ROLE',
    target: 'ADM-004 (Phạm Đức Long)',
    severity: 'WARNING',
    status: 'SUCCESS',
    details: 'Cấp thêm quyền finance.refund cho Quản lý tài chính.',
    diffBefore: { role: 'finance', canRefund: false },
    diffAfter: { role: 'finance', canRefund: true }
  },
  {
    id: 'LOG-8909',
    timestamp: '2026-10-10 09:42:00',
    actor: 'Nguyễn Bích Ngọc (Support)',
    module: 'USER_MANAGEMENT',
    action: 'LOCK_USER',
    target: 'USR-1006 (Đỗ Mạnh Cường)',
    severity: 'WARNING',
    status: 'SUCCESS',
    details: 'Khóa tài khoản do nghi vấn bot tự động.',
    diffBefore: { status: 'ACTIVE' },
    diffAfter: { status: 'LOCKED', reason: 'Nghi vấn bot tự động cào API' }
  },
  {
    id: 'LOG-8908',
    timestamp: '2026-10-10 09:15:30',
    actor: 'Đặng Thu Hiền (Content Manager)',
    module: 'VOCABULARY',
    action: 'PUBLISH_WORD',
    target: 'voc-011 (Departure)',
    severity: 'INFO',
    status: 'SUCCESS',
    details: 'Chuyển trạng thái từ DRAFT sang PUBLISHED.',
    diffBefore: { status: 'DRAFT' },
    diffAfter: { status: 'PUBLISHED' }
  },
  {
    id: 'LOG-8907',
    timestamp: '2026-10-09 16:20:10',
    actor: 'Phạm Đức Long (Finance Manager)',
    module: 'PAYMENT',
    action: 'REFUND_APPROVED',
    target: 'TXN-1007 (Lê Văn Hoàng)',
    severity: 'CRITICAL',
    status: 'SUCCESS',
    details: 'Duyệt hoàn tiền 599.000 đ cho gói VIP 1 Năm theo chính sách bảo hành 7 ngày.',
    diffBefore: { txnStatus: 'SUCCESS', amountRefunded: 0 },
    diffAfter: { txnStatus: 'REFUNDED', amountRefunded: 599000, refundRef: 'REF-98214' }
  },
  {
    id: 'LOG-8906',
    timestamp: '2026-10-09 14:10:00',
    actor: 'Vũ Hoàng Nam (AI Manager)',
    module: 'AI_CONFIG',
    action: 'UPDATE_PROMPT',
    target: 'SystemPromptStory',
    severity: 'INFO',
    status: 'SUCCESS',
    details: 'Cập nhật System Prompt sinh truyện theo chuẩn CEFR A1 - B2.',
    diffBefore: { version: '1.2.0' },
    diffAfter: { version: '1.3.0', updatedCriteria: 'Bilingual translation format' }
  }
];

// ==========================================================================
// 14. CHỈ SỐ DASHBOARD TỔNG QUAN (MODULE 1: DASHBOARD)
// ==========================================================================
const DASHBOARD_METRICS = {
  totalUsers: 12480,
  newUsersPeriod: 1420,
  activeUsersMAU: 8620,
  activeUsersDAU: 3450,
  totalSessions: 48290,
  exerciseCompletionRate: '84.6%',
  premiumSubscribers: 3840,
  freeUsers: 8640,
  totalRevenueVND: 485600000,
  revenueFormatted: '485.600.000 ₫',
  successfulPayments: 4120,
  paymentSuccessRate: '96.8%',
  aiUptime: '99.8%',
  aiSlaTarget: '99.9%',
  systemAlerts: [
    {
      id: 'alert-txns',
      level: 'Cần chú ý',
      levelClass: 'level-warning',
      tagClass: 'tag-warning',
      icon: 'fa-triangle-exclamation',
      moduleName: 'Module 12: Payment & Transactions',
      title: '4 giao dịch ngân hàng cần đối soát thủ công',
      desc: 'Phát hiện 2 đơn lệch số tiền (INV-1001 thiếu 10k, INV-1006 thừa 5k), 1 đơn sai cú pháp (INV-1002) và 1 đơn rớt mạng chưa có mã hệ thống.',
      actionText: 'Mở danh sách giao dịch cần xử lý',
      actionHandler: 'handleResolveTxnAlert()'
    },
    {
      id: 'alert-vocab',
      level: 'Cần xử lý',
      levelClass: 'level-info',
      tagClass: 'tag-info',
      icon: 'fa-book-bookmark',
      moduleName: 'Module 3: Vocabulary Management',
      title: '1 từ vựng mới đang chờ phê duyệt xuất bản',
      desc: 'Từ vựng "Biodiversity" (/ˌbaɪ.oʊ.daɪˈvɝː.sə.t̬i/ - Topic Environment) ở trạng thái Bản nháp (DRAFT) cần Content Lead duyệt xuất bản.',
      actionText: 'Mở bản ghi từ vựng',
      actionHandler: 'handleResolveVocabAlert()'
    },
    {
      id: 'alert-ai',
      level: 'Theo dõi SLA',
      levelClass: 'level-sla',
      tagClass: 'tag-sla',
      icon: 'fa-robot',
      moduleName: 'Module 7: AI Configuration',
      title: 'AI Story uptime 99,8% trong 30 ngày qua (SLA cam kết: 99,9%)',
      desc: 'Chỉ số uptime thấp hơn cam kết SLA 0,1% (khoảng 43 phút downtime trong tháng). Khuyến nghị kiểm tra cụm dự phòng OpenAI GPT-4o / Claude.',
      actionText: 'Mở báo cáo vận hành AI',
      actionHandler: 'handleResolveAiAlert()'
    }
  ]
};

// ==========================================================================
// 12. NHẬT KÝ GỌI API AI (AI EXECUTION & TOKEN LOGS)
// ==========================================================================
const AI_EXECUTION_LOGS = [
  {
    id: 'REQ-AI-9021',
    time: '2026-10-11 19:42:15',
    task: 'STORY_GEN',
    taskLabel: 'Sinh Truyện Song Ngữ',
    model: 'gpt-4o-mini',
    userId: 'CUST-001 (Lê Văn An)',
    promptSummary: 'Chủ đề: Business & Finance · Level B1 · 3 từ vựng',
    tokens: 382,
    latency: '1.15s',
    cost: '$0.00045',
    status: 'SUCCESS'
  },
  {
    id: 'REQ-AI-9020',
    time: '2026-10-11 19:35:02',
    task: 'PRONUNCIATION',
    taskLabel: 'Chấm Phát Âm AI',
    model: 'whisper-v3',
    userId: 'CUST-003 (Trần Bảo Ngọc)',
    promptSummary: 'Audio check: "Negotiation" · Khớp âm vị: 94%',
    tokens: 120,
    latency: '0.82s',
    cost: '$0.00012',
    status: 'SUCCESS'
  },
  {
    id: 'REQ-AI-9019',
    time: '2026-10-11 19:18:40',
    task: 'STORY_GEN',
    taskLabel: 'Sinh Truyện Song Ngữ',
    model: 'gpt-4o',
    userId: 'CUST-002 (Phạm Minh Tuấn)',
    promptSummary: 'Chủ đề: Travel · Level B2 · 5 từ vựng mục tiêu',
    tokens: 540,
    latency: '1.85s',
    cost: '$0.00270',
    status: 'SUCCESS'
  },
  {
    id: 'REQ-AI-9018',
    time: '2026-10-11 18:55:12',
    task: 'TRANSLATION',
    taskLabel: 'Dịch Nghĩa & Ví Dụ',
    model: 'claude-3-5-sonnet',
    userId: 'CUST-004 (Hoàng Hải Yến)',
    promptSummary: 'Giải thích ngữ cảnh: "Sustainable development"',
    tokens: 290,
    latency: '1.04s',
    cost: '$0.00087',
    status: 'SUCCESS'
  },
  {
    id: 'REQ-AI-9017',
    time: '2026-10-11 18:30:22',
    task: 'STORY_GEN',
    taskLabel: 'Sinh Truyện Song Ngữ',
    model: 'gpt-4o-mini',
    userId: 'CUST-005 (Đặng Thu Thảo)',
    promptSummary: 'Chủ đề: Animals · Level A1 · 4 từ vựng',
    tokens: 0,
    latency: '3.10s',
    cost: '$0.00000',
    status: 'TIMEOUT'
  }
];

