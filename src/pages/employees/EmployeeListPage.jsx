import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, List as ListIcon, Users, Building2 } from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployee';
import { useAuth } from '../../hooks/useAuth';
import SearchBar from '../../components/rbac/SearchBar';
import ListSkeleton from '../../components/rbac/ListSkeleton';
import EmptyState from '../../components/rbac/EmptyState';
import EmployeeTable from '../../components/rbac/EmployeeTable';
import EmployeeAgencyModal, { BACKEND_ROLES } from '../../components/rbac/EmployeeAgencyModal';
import Avatar from '../../components/rbac/Avatar';
import PaginationBar from '../../components/rbac/PaginationBar';
import { EMPLOYEE_STATUS, EMPLOYEE_POSITIONS } from '../../config/constants';
import toast from 'react-hot-toast';

export default function EmployeeListPage() {
  const { companyId } = useAuth();
  const { employees, loading, error, search, filters, sort, pagination, setSearch, setFilters, setSort, setPage, toggleStatus, refresh } = useEmployees();
  const [view, setView] = useState('table');
  const [selectedEmployeeForAgency, setSelectedEmployeeForAgency] = useState(null);

  const handleToggle = async (id) => {
    try { await toggleStatus(id); toast.success('Statut mis à jour'); } catch { toast.error('Erreur'); }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2"><Users size={24} className="text-primary" /> Gestion des Employés</h4>
          <p className="text-muted mb-0 small">Liste des employés de votre entreprise</p>
        </div>
        <Link to="/employees/new" className="btn btn-primary d-flex align-items-center gap-2"><Plus size={16} /> Ajouter un employé</Link>
      </div>

      <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <SearchBar value={search} onChange={setSearch} placeholder="Nom, email, matricule..." />
            <select className="form-select form-select-sm" style={{ width: 140 }} value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}>
              <option value="">Tous statuts</option>
              {Object.entries(EMPLOYEE_STATUS).map(([k, v]) => <option key={k} value={v}>{v === 'active' ? 'Actif' : 'Inactif'}</option>)}
            </select>
            <select className="form-select form-select-sm" style={{ width: 180 }} value={filters.position} onChange={(e) => setFilters({ position: e.target.value })}>
              <option value="">Tous les postes / rôles</option>
              {BACKEND_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              {Object.entries(EMPLOYEE_POSITIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group btn-group-sm">
              <button type="button" className={`btn ${view === 'table' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('table')}><ListIcon size={14} /></button>
              <button type="button" className={`btn ${view === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('grid')}><LayoutGrid size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      {loading.list ? <ListSkeleton /> : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : employees.length === 0 ? (
        <EmptyState type="employee" onCreateLink="/employees/new" />
      ) : view === 'table' ? (
        <div className="bg-white rounded-3 shadow-sm p-3">
          <EmployeeTable
            employees={employees}
            sort={sort}
            onSort={setSort}
            onToggle={handleToggle}
            onAssignAgency={(emp) => setSelectedEmployeeForAgency(emp)}
          />
          <PaginationBar pagination={pagination} onPageChange={setPage} />
        </div>
      ) : (
        <>
          <div className="row g-3">
            {employees.map((emp) => (
              <div key={emp.id} className="col-md-6 col-lg-4">
                <div className="bg-white rounded-3 shadow-sm p-3 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <Avatar firstName={emp.firstName} lastName={emp.lastName} size={40} src={emp.avatar} />
                      <div>
                        <div className="fw-medium">{emp.firstName} {emp.lastName}</div>
                        <small className="text-muted">{EMPLOYEE_POSITIONS[emp.position] || emp.position} ({emp.role || 'non-défini'})</small>
                      </div>
                    </div>
                    <div className="small text-muted mb-2">
                      Agence: <strong>{emp.agencyName || 'Non affecté'}</strong>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className={`badge ${emp.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{emp.status === 'active' ? 'Actif' : 'Inactif'}</span>
                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-info"
                        title="Affecter à une agence"
                        onClick={() => setSelectedEmployeeForAgency(emp)}
                      >
                        <Building2 size={14} />
                      </button>
                      <Link to={`/employees/${emp.id}`} className="btn btn-sm btn-outline-primary">Voir</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <PaginationBar pagination={pagination} onPageChange={setPage} />
        </>
      )}

      {selectedEmployeeForAgency && (
        <EmployeeAgencyModal
          employee={selectedEmployeeForAgency}
          companyId={companyId}
          onClose={() => setSelectedEmployeeForAgency(null)}
          onSuccess={() => refresh()}
        />
      )}
    </div>
  );
}
