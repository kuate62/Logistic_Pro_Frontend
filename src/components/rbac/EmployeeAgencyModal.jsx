import { useState, useEffect } from 'react';
import { Building2, Shield, Save, X } from 'lucide-react';
import { agenciesService } from '../../api/agenciesService';
import { employeesService } from '../../api/employeesService';
import toast from 'react-hot-toast';

export const BACKEND_ROLES = [
  { value: 'depot_agent', label: 'Agent de Dépôt (Guichet)' },
  { value: 'retrait_agent', label: 'Agent de Retrait (Guichet)' },
  { value: 'manager', label: 'Manager / Responsable' },
  { value: 'supervisor', label: 'Superviseur de Stock' },
  { value: 'accountant', label: 'Comptable / Gestionnaire Paiements' },
  { value: 'delivery_driver', label: 'Chauffeur / Livreurs' },
];

export function EmployeeAgencyModal({ employee, companyId, onClose, onSuccess }) {
  const [agencies, setAgencies] = useState([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState(employee?.agencyId || '');
  const [selectedRole, setSelectedRole] = useState(employee?.role || 'depot_agent');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (companyId) {
      agenciesService.list(companyId, { limit: 100 }).then((res) => {
        setAgencies(res.data || []);
      }).catch(() => {});
    }
  }, [companyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAgencyId) {
      toast.error('Veuillez sélectionner une agence');
      return;
    }

    setSaving(true);
    try {
      await employeesService.update(companyId, employee.id, {
        agencyId: Number(selectedAgencyId),
        role: selectedRole,
      });

      toast.success(`Affectation de ${employee.firstName} mise à jour !`);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'affectation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1060 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <Building2 size={20} />
              Affecter l'employé à une Agence
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Fermer" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="alert alert-light border mb-3">
                <div className="fw-bold">{employee.firstName} {employee.lastName}</div>
                <div className="text-muted small">Matricule: {employee.employeeCode} · Email: {employee.email}</div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold d-flex align-items-center gap-1">
                  <Building2 size={14} /> Agence d'affectation *
                </label>
                <select
                  className="form-select"
                  value={selectedAgencyId}
                  onChange={(e) => setSelectedAgencyId(e.target.value)}
                  required
                >
                  <option value="">Sélectionner une agence</option>
                  {agencies.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} — {ag.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold d-flex align-items-center gap-1">
                  <Shield size={14} /> Rôle Opérationnel *
                </label>
                <select
                  className="form-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  required
                >
                  {BACKEND_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={saving}>
                <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer l\'affectation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAgencyModal;
