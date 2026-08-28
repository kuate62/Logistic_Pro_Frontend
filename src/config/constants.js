export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  COMPANY_ADMIN: 'company_admin',
  COMPANY_DIRECTOR: 'company_director',
  AGENCY_MANAGER: 'agency_manager',
  COUNTER_AGENT: 'counter_agent',
  PICKUP_AGENT: 'pickup_agent',
  DEPOT_AGENT: 'depot_agent',
  RETRAIT_AGENT: 'retrait_agent',
  CLIENT: 'client',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Administrateur',
  [ROLES.COMPANY_ADMIN]: 'Administrateur',
  [ROLES.COMPANY_DIRECTOR]: 'Directeur',
  [ROLES.AGENCY_MANAGER]: 'Responsable d\'agence',
  [ROLES.COUNTER_AGENT]: 'Agent comptoir',
  [ROLES.PICKUP_AGENT]: 'Agent de collecte',
  [ROLES.DEPOT_AGENT]: 'Agent de dépôt',
  [ROLES.RETRAIT_AGENT]: 'Agent de retrait',
  [ROLES.CLIENT]: 'Client',
  manager: 'Responsable d\'agence',
  supervisor: 'Superviseur de stock',
  accountant: 'Comptable',
  delivery_driver: 'Chauffeur / Livreur',
  admin: 'Administrateur',
};

export const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'token',
};

export const PACKAGE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  REGISTERED: 'registered',
  READY: 'ready',
  PREPARING: 'preparing',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
  AVAILABLE_PICKUP: 'available_pickup',
  COLLECTED: 'collected',
  CANCELLED: 'cancelled',
  LOST: 'lost',
  DAMAGED: 'damaged',
};

export const PACKAGE_STATUS_LABELS = {
  [PACKAGE_STATUS.DRAFT]: 'Brouillon',
  [PACKAGE_STATUS.PENDING]: 'En attente',
  [PACKAGE_STATUS.REGISTERED]: 'Enregistré',
  [PACKAGE_STATUS.READY]: 'Prêt',
  [PACKAGE_STATUS.PREPARING]: 'En préparation',
  [PACKAGE_STATUS.IN_TRANSIT]: 'En transit',
  [PACKAGE_STATUS.ARRIVED]: 'Arrivé',
  [PACKAGE_STATUS.AVAILABLE_PICKUP]: 'Disponible',
  [PACKAGE_STATUS.COLLECTED]: 'Récupéré',
  [PACKAGE_STATUS.CANCELLED]: 'Annulé',
  [PACKAGE_STATUS.LOST]: 'Perdu',
  [PACKAGE_STATUS.DAMAGED]: 'Endommagé',
};

export const PACKAGE_STATUS_COLORS = {
  [PACKAGE_STATUS.DRAFT]: 'gray',
  [PACKAGE_STATUS.PENDING]: 'warning',
  [PACKAGE_STATUS.REGISTERED]: 'info',
  [PACKAGE_STATUS.READY]: 'primary',
  [PACKAGE_STATUS.PREPARING]: 'warning',
  [PACKAGE_STATUS.IN_TRANSIT]: 'info',
  [PACKAGE_STATUS.ARRIVED]: 'success',
  [PACKAGE_STATUS.AVAILABLE_PICKUP]: 'success',
  [PACKAGE_STATUS.COLLECTED]: 'success-dark',
  [PACKAGE_STATUS.CANCELLED]: 'danger',
  [PACKAGE_STATUS.LOST]: 'danger-dark',
  [PACKAGE_STATUS.DAMAGED]: 'brown',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  COMPANIES: '/companies',
  AGENCIES: '/agencies',
  COUNTERS: '/counters',
  PACKAGES: '/packages',
  SHIPMENTS: '/shipments',
  TRACKING: '/tracking',
  PAYMENTS: '/payments',
  CUSTOMERS: '/customers',
  ROUTES_APP: '/routes',
  CITIES: '/cities',
  PRICING: '/pricing',
  EMPLOYEES: '/employees',
  REPORTS: '/reports',
  SUBSCRIPTION: '/subscription',
  SETTINGS: '/settings',
};

export const AGENCY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  MAINTENANCE: 'maintenance',
};

export const AGENCY_STATUS_LABELS = {
  [AGENCY_STATUS.ACTIVE]: 'Active',
  [AGENCY_STATUS.INACTIVE]: 'Inactive',
  [AGENCY_STATUS.SUSPENDED]: 'Suspendue',
  [AGENCY_STATUS.MAINTENANCE]: 'En maintenance',
};

export const AGENCY_STATUS_COLORS = {
  [AGENCY_STATUS.ACTIVE]: 'success',
  [AGENCY_STATUS.INACTIVE]: 'secondary',
  [AGENCY_STATUS.SUSPENDED]: 'danger',
  [AGENCY_STATUS.MAINTENANCE]: 'warning',
};

export const AGENCY_SORT_FIELDS = {
  NAME: 'name',
  CITY: 'city',
  STATUS: 'status',
  CREATED_AT: 'createdAt',
  EMPLOYEES: 'employeesCount',
  SHIPMENTS: 'shipmentsCount',
};

export const AGENCY_FILTER_FIELDS = {
  STATUS: 'status',
  CITY: 'city',
  REGION: 'region',
  IS_PRIMARY: 'isPrimary',
  MANAGER: 'manager',
};

export const CONGO_REGIONS = [
  'Kinshasa',
  'Haut-Katanga',
  'Kasaï-Oriental',
  'Tshopo',
  'Nord-Kivu',
  'Sud-Kivu',
  'Kasaï-Central',
  'Kongo-Central',
  'Équateur',
  'Haut-Uélé',
  'Ituri',
  'Lualaba',
];

export const EMPLOYEE_POSITIONS = {
  director: 'Directeur général',
  agency_manager: 'Responsable d\'agence',
  counter_agent: 'Agent de guichet',
  pickup_agent: 'Agent de retrait',
  package_manager: 'Gestionnaire des colis',
  payment_manager: 'Gestionnaire des paiements',
  driver: 'Chauffeur',
};

export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const EMPLOYEE_STATUS_LABELS = {
  [EMPLOYEE_STATUS.ACTIVE]: 'Actif',
  [EMPLOYEE_STATUS.INACTIVE]: 'Inactif',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
};

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Actif',
  [USER_STATUS.INACTIVE]: 'Inactif',
  [USER_STATUS.BLOCKED]: 'Bloqué',
};

export const USER_STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: 'success',
  [USER_STATUS.INACTIVE]: 'secondary',
  [USER_STATUS.BLOCKED]: 'danger',
};

export const CLIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
};

export const CLIENT_STATUS_LABELS = {
  [CLIENT_STATUS.ACTIVE]: 'Actif',
  [CLIENT_STATUS.INACTIVE]: 'Inactif',
  [CLIENT_STATUS.BLOCKED]: 'Bloqué',
};

export const CLIENT_STATUS_COLORS = {
  [CLIENT_STATUS.ACTIVE]: 'success',
  [CLIENT_STATUS.INACTIVE]: 'secondary',
  [CLIENT_STATUS.BLOCKED]: 'danger',
};

export const CLIENT_SORT_FIELDS = ['clientCode', 'lastName', 'firstName', 'phone', 'city', 'status', 'createdAt', 'lastActivity', 'shipmentCount', 'totalSpent'];

export const CLIENT_FILTER_FIELDS = ['status', 'agencyId', 'city', 'isActive', 'isBlocked', 'hasShipments', 'hasPayments'];

export const CLIENT_DOCUMENT_TYPES = {
  cni: 'Carte Nationale d\'Identité',
  passport: 'Passeport',
  driving_license: 'Permis de conduire',
  other: 'Autre pièce',
};

export const CONGO_PROVINCES = [
  'Kinshasa', 'Haut-Katanga', 'Kasaï-Oriental', 'Kasaï-Central', 'Sud-Kivu', 'Nord-Kivu',
  'Équateur', 'Tshopo', 'Tanganyika', 'Lualaba', 'Haut-Uélé', 'Bas-Uélé',
  'Mongala', 'Nord-Ubangi', 'Sud-Ubangi', 'Mai-Ndombe', 'Kwango', 'Kwilu',
  'Sankuru', 'Lomami', 'Maniema', 'Ituri', 'Haut-Lomami', 'Kasaï',
];

export const SHIPMENT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  VALIDATED: 'validated',
  PREPARING: 'preparing',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
  AVAILABLE_PICKUP: 'available_pickup',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  ARCHIVED: 'archived',
};

export const SHIPMENT_STATUS_LABELS = {
  [SHIPMENT_STATUS.DRAFT]: 'Brouillon',
  [SHIPMENT_STATUS.PENDING]: 'En attente',
  [SHIPMENT_STATUS.VALIDATED]: 'Validée',
  [SHIPMENT_STATUS.PREPARING]: 'En préparation',
  [SHIPMENT_STATUS.ASSIGNED]: 'Affectée',
  [SHIPMENT_STATUS.IN_TRANSIT]: 'En transport',
  [SHIPMENT_STATUS.ARRIVED]: 'Arrivée',
  [SHIPMENT_STATUS.AVAILABLE_PICKUP]: 'Disponible au retrait',
  [SHIPMENT_STATUS.DELIVERED]: 'Livrée',
  [SHIPMENT_STATUS.CANCELLED]: 'Annulée',
  [SHIPMENT_STATUS.ARCHIVED]: 'Archivée',
};

export const SHIPMENT_STATUS_COLORS = {
  [SHIPMENT_STATUS.DRAFT]: 'secondary',
  [SHIPMENT_STATUS.PENDING]: 'warning',
  [SHIPMENT_STATUS.VALIDATED]: 'info',
  [SHIPMENT_STATUS.PREPARING]: 'primary',
  [SHIPMENT_STATUS.ASSIGNED]: 'primary',
  [SHIPMENT_STATUS.IN_TRANSIT]: 'info',
  [SHIPMENT_STATUS.ARRIVED]: 'success',
  [SHIPMENT_STATUS.AVAILABLE_PICKUP]: 'success',
  [SHIPMENT_STATUS.DELIVERED]: 'success',
  [SHIPMENT_STATUS.CANCELLED]: 'danger',
  [SHIPMENT_STATUS.ARCHIVED]: 'secondary',
};

export const SHIPMENT_STATUS_FLOW = [
  SHIPMENT_STATUS.VALIDATED,
  SHIPMENT_STATUS.PREPARING,
  SHIPMENT_STATUS.ASSIGNED,
  SHIPMENT_STATUS.IN_TRANSIT,
  SHIPMENT_STATUS.ARRIVED,
  SHIPMENT_STATUS.AVAILABLE_PICKUP,
  SHIPMENT_STATUS.DELIVERED,
];

export const ROUTE_STATUS = {
  PLANNED: 'planned',
  OPEN: 'open',
  LOADING: 'loading',
  READY: 'ready',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  SUSPENDED: 'suspended',
};

export const ROUTE_STATUS_LABELS = {
  [ROUTE_STATUS.PLANNED]: 'Planifié',
  [ROUTE_STATUS.OPEN]: 'Ouvert',
  [ROUTE_STATUS.LOADING]: 'En chargement',
  [ROUTE_STATUS.READY]: 'Prêt au départ',
  [ROUTE_STATUS.IN_TRANSIT]: 'En transport',
  [ROUTE_STATUS.ARRIVED]: 'Arrivé',
  [ROUTE_STATUS.COMPLETED]: 'Terminé',
  [ROUTE_STATUS.CANCELLED]: 'Annulé',
  [ROUTE_STATUS.SUSPENDED]: 'Suspendu',
};

export const ROUTE_STATUS_COLORS = {
  [ROUTE_STATUS.PLANNED]: 'secondary',
  [ROUTE_STATUS.OPEN]: 'info',
  [ROUTE_STATUS.LOADING]: 'warning',
  [ROUTE_STATUS.READY]: 'primary',
  [ROUTE_STATUS.IN_TRANSIT]: 'info',
  [ROUTE_STATUS.ARRIVED]: 'success',
  [ROUTE_STATUS.COMPLETED]: 'success',
  [ROUTE_STATUS.CANCELLED]: 'danger',
  [ROUTE_STATUS.SUSPENDED]: 'danger',
};

export const PRICING_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const PRICING_STATUS_LABELS = {
  [PRICING_STATUS.ACTIVE]: 'Actif',
  [PRICING_STATUS.INACTIVE]: 'Inactif',
};

export const PRICING_STATUS_COLORS = {
  [PRICING_STATUS.ACTIVE]: 'success',
  [PRICING_STATUS.INACTIVE]: 'secondary',
};

export const PRICING_CATEGORIES = [
  { value: 'standard', label: 'Standard' },
  { value: 'électronique', label: 'Électronique' },
  { value: 'documents', label: 'Documents' },
  { value: 'alimentation', label: 'Alimentation' },
  { value: 'mobilier', label: 'Mobilier' },
  { value: 'vêtements', label: 'Vêtements' },
  { value: 'bagages', label: 'Bagages' },
  { value: 'pièces', label: 'Pièces détachées' },
  { value: 'médicaments', label: 'Médicaments' },
  { value: 'autre', label: 'Autre' },
];

export const TRACKING_STATUS = {
  REGISTERED: 'registered',
  PREPARING: 'preparing',
  PICKED_UP: 'picked_up',
  AT_ORIGIN_AGENCY: 'at_origin_agency',
  LOADING: 'loading',
  IN_TRANSIT: 'in_transit',
  AT_TRANSIT_AGENCY: 'at_transit_agency',
  ARRIVED: 'arrived',
  AVAILABLE_PICKUP: 'available_pickup',
  COLLECTED: 'collected',
  DAMAGED: 'damaged',
  ARRIVED_AT_DESTINATION: 'arrived_at_destination',
  AT_DESTINATION_AGENCY: 'at_destination_agency',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERY_ATTEMPTED: 'delivery_attempted',
  DELIVERED_TO_RECIPIENT: 'delivered_to_recipient',
  AVAILABLE_FOR_PICKUP: 'available_for_pickup',
  PICKED_UP_BY_RECIPIENT: 'picked_up_by_recipient',
  CANCELLED: 'cancelled',
  EXCEPTION: 'exception',
};

export const TRACKING_STATUS_LABELS = {
  [TRACKING_STATUS.REGISTERED]: 'Enregistré',
  [TRACKING_STATUS.PREPARING]: 'En préparation',
  [TRACKING_STATUS.PICKED_UP]: 'Récupéré',
  [TRACKING_STATUS.AT_ORIGIN_AGENCY]: 'À l\'agence d\'origine',
  [TRACKING_STATUS.LOADING]: 'En chargement',
  [TRACKING_STATUS.IN_TRANSIT]: 'En transit',
  [TRACKING_STATUS.AT_TRANSIT_AGENCY]: 'À l\'agence de transit',
  [TRACKING_STATUS.ARRIVED]: 'Arrivé',
  [TRACKING_STATUS.AVAILABLE_PICKUP]: 'Disponible au retrait',
  [TRACKING_STATUS.COLLECTED]: 'Retiré',
  [TRACKING_STATUS.DAMAGED]: 'Endommagé',
  [TRACKING_STATUS.ARRIVED_AT_DESTINATION]: 'Arrivé à destination',
  [TRACKING_STATUS.AT_DESTINATION_AGENCY]: 'À l\'agence de destination',
  [TRACKING_STATUS.OUT_FOR_DELIVERY]: 'En cours de livraison',
  [TRACKING_STATUS.DELIVERY_ATTEMPTED]: 'Tentative de livraison',
  [TRACKING_STATUS.DELIVERED_TO_RECIPIENT]: 'Livré au destinataire',
  [TRACKING_STATUS.AVAILABLE_FOR_PICKUP]: 'Disponible pour retrait',
  [TRACKING_STATUS.PICKED_UP_BY_RECIPIENT]: 'Récupéré par le destinataire',
  [TRACKING_STATUS.CANCELLED]: 'Annulé',
  [TRACKING_STATUS.EXCEPTION]: 'Exception',
};

export const TRACKING_STATUS_COLORS = {
  [TRACKING_STATUS.REGISTERED]: 'secondary',
  [TRACKING_STATUS.PREPARING]: 'warning',
  [TRACKING_STATUS.PICKED_UP]: 'info',
  [TRACKING_STATUS.AT_ORIGIN_AGENCY]: 'info',
  [TRACKING_STATUS.LOADING]: 'warning',
  [TRACKING_STATUS.IN_TRANSIT]: 'primary',
  [TRACKING_STATUS.AT_TRANSIT_AGENCY]: 'info',
  [TRACKING_STATUS.ARRIVED]: 'success',
  [TRACKING_STATUS.AVAILABLE_PICKUP]: 'success',
  [TRACKING_STATUS.COLLECTED]: 'success',
  [TRACKING_STATUS.DAMAGED]: 'danger',
  [TRACKING_STATUS.ARRIVED_AT_DESTINATION]: 'success',
  [TRACKING_STATUS.AT_DESTINATION_AGENCY]: 'success',
  [TRACKING_STATUS.OUT_FOR_DELIVERY]: 'warning',
  [TRACKING_STATUS.DELIVERY_ATTEMPTED]: 'warning',
  [TRACKING_STATUS.DELIVERED_TO_RECIPIENT]: 'success',
  [TRACKING_STATUS.AVAILABLE_FOR_PICKUP]: 'success',
  [TRACKING_STATUS.PICKED_UP_BY_RECIPIENT]: 'success',
  [TRACKING_STATUS.CANCELLED]: 'danger',
  [TRACKING_STATUS.EXCEPTION]: 'danger',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  FAILED: 'failed',
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'En attente',
  [PAYMENT_STATUS.PARTIAL]: 'Partiellement payé',
  [PAYMENT_STATUS.PAID]: 'Payé',
  [PAYMENT_STATUS.CANCELLED]: 'Annulé',
  [PAYMENT_STATUS.REFUNDED]: 'Remboursé',
  [PAYMENT_STATUS.FAILED]: 'Échoué',
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PENDING]: 'warning',
  [PAYMENT_STATUS.PARTIAL]: 'info',
  [PAYMENT_STATUS.PAID]: 'success',
  [PAYMENT_STATUS.CANCELLED]: 'danger',
  [PAYMENT_STATUS.REFUNDED]: 'secondary',
  [PAYMENT_STATUS.FAILED]: 'danger',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  MOBILE_MONEY: 'mobile_money',
  MOBILE_MONEY_ORANGE: 'mobile_money_orange',
  MOBILE_MONEY_MTN: 'mobile_money_mtn',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  CHECK: 'check',
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Espèces',
  [PAYMENT_METHODS.MOBILE_MONEY]: 'Mobile Money',
  [PAYMENT_METHODS.MOBILE_MONEY_ORANGE]: 'Orange Money',
  [PAYMENT_METHODS.MOBILE_MONEY_MTN]: 'MTN Mobile Money',
  [PAYMENT_METHODS.CARD]: 'Carte bancaire',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Virement bancaire',
  [PAYMENT_METHODS.CHECK]: 'Chèque',
};

export const PACKAGE_CATEGORIES = [
  { value: 'standard', label: 'Standard' },
  { value: 'vêtements', label: 'Vêtements' },
  { value: 'alimentation', label: 'Alimentation' },
  { value: 'électronique', label: 'Électronique' },
  { value: 'documents', label: 'Documents' },
  { value: 'bagages', label: 'Bagages' },
  { value: 'médicaments', label: 'Médicaments' },
];

export const PARCEL_STATUS_OPTIONS = [
  'registered', 'preparing', 'in_transit', 'arrived', 'available_pickup', 'collected', 'damaged', 'cancelled',
];

export const PACKAGE_METHOD_LABELS = {
  cash: 'Espèces',
  mobile_money: 'Mobile Money',
  mobile_money_orange: 'Orange Money',
  mobile_money_mtn: 'MTN Mobile Money',
  bank_transfer: 'Virement bancaire',
  card: 'Carte bancaire',
};

export const TOAST_DURATION = 4000;

export const DEBOUNCE_DELAY = 300;
