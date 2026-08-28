import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, Shield, Camera, Building2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEmployee, useEmployeeForm } from '../../hooks/useEmployee';
import { useAuth } from '../../hooks/useAuth';
import ListSkeleton from '../../components/rbac/ListSkeleton';
import StatusBadge from '../../components/rbac/StatusBadge';
import Avatar from '../../components/rbac/Avatar';
import EmployeeAgencyModal from '../../components/rbac/EmployeeAgencyModal';
import { EMPLOYEE_POSITIONS } from '../../config/constants';
import { employeesService } from '../../api/employeesService';
import toast from 'react-hot-toast';

export default function EmployeeDetailPage() {
  const { companyId } = useAuth();
  const { id } = useParams();
  const { employee, loading, fetch, clearSelected } = useEmployee();
  const { update } = useEmployeeForm();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showAgencyModal, setShowAgencyModal] = useState(false);

  useEffect(() => { fetch(id); return () => clearSelected(); }, [id, fetch, clearSelected]);

  if (loading.detail || !employee) return <ListSkeleton />;

  const handleToggle = async () => {
    try {
      const newStatus = employee.status === 'active' ? 'inactive' : 'active';
      await update(id, { status: newStatus });
      toast.success(`Employé ${newStatus === 'active' ? 'activé' : 'désactivé'}`);
      fetch(id);
    } catch { toast.error('Erreur'); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await employeesService.uploadAvatar(null, id, file);
      toast.success('Photo mise à jour');
      fetch(id);
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur lors de l\'upload'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/employees" className="btn btn-outline-secondary btn-sm rounded-pill"><ArrowLeft size={16} /></Link>
        <div className="flex-grow-1">
          <h4 className="fw-bold text-dark mb-1">{employee.firstName} {employee.lastName}</h4>
          <p className="text-muted mb-0 small">Matricule: {employee.employeeCode}</p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-info btn-sm d-flex align-items-center gap-1"
            onClick={() => setShowAgencyModal(true)}
          >
            <Building2 size={14} /> Affecter Agence
          </button>
          <Link to={`/employees/${id}/edit`} className="btn btn-outline-primary btn-sm">Modifier</Link>
          <button type="button" className={`btn btn-sm ${employee.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`} onClick={handleToggle}>
            {employee.status === 'active' ? 'Désactiver' : 'Activer'}
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
            <h6 className="fw-semibold mb-3">Informations personnelles</h6>
            <div className="row g-3">
              <div className="col-md-6 d-flex align-items-center gap-3">
                <div className="position-relative">
                  <Avatar firstName={employee.firstName} lastName={employee.lastName} size={56} src={employee.avatar} />
                  <button
                    type="button"
                    className="position-absolute rounded-circle border-0 text-white d-inline-flex align-items-center justify-content-center"
                    style={{ bottom: -2, right: -2, width: 22, height: 22, background: 'var(--color-primary)' }}
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Changer la photo"
                  >
                    <Camera size={12} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </div>
                <div>
                  <div className="fw-medium">{employee.firstName} {employee.lastName} {uploading && <small className="text-muted">(upload...)</small>}</div>
                  <div className="text-muted small">{employee.gender === 'male' ? 'Masculin' : 'Féminin'}</div>
                </div>
              </div>
              <div className="col-md-6"><StatusBadge status={employee.status} /></div>
              <div className="col-md-6 d-flex align-items-center gap-2 small"><Mail size={14} className="text-muted" /> {employee.email}</div>
              <div className="col-md-6 d-flex align-items-center gap-2 small"><Phone size={14} className="text-muted" /> {employee.phone}</div>
              <div className="col-md-6 d-flex align-items-center gap-2 small"><MapPin size={14} className="text-muted" /> {employee.address || '—'}, {employee.city}</div>
              <div className="col-md-6 d-flex align-items-center gap-2 small"><Calendar size={14} className="text-muted" /> Né(e) le {employee.dateOfBirth}</div>
              <div className="col-md-6 d-flex align-items-center gap-2 small"><Shield size={14} className="text-muted" /> CNI: {employee.nationalId}</div>
              <div className="col-md-6 small text-muted">Nationalité: {employee.nationality}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
            <h6 className="fw-semibold mb-3">Poste & Agence</h6>
            <div className="d-flex align-items-center gap-2 mb-2"><Briefcase size={14} className="text-muted" /> <span className="small">{EMPLOYEE_POSITIONS[employee.position] || employee.position} ({employee.role || 'non-défini'})</span></div>
            <div className="small text-muted mb-1">Agence: <strong>{employee.agencyName || 'Non affecté'}</strong></div>
            <div className="small text-muted mb-1">Embauché le: {employee.hireDate}</div>
            {employee.observation && <div className="small text-muted mt-2 fst-italic">"{employee.observation}"</div>}
          </div>
        </div>
      </div>

      {showAgencyModal && (
        <EmployeeAgencyModal
          employee={employee}
          companyId={companyId}
          onClose={() => setShowAgencyModal(false)}
          onSuccess={() => fetch(id)}
        />
      )}
    </div>
  );
}
