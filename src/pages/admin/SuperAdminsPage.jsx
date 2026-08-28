import { useState, useEffect } from 'react';
import { Users, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import EmptyState from '../../components/admin/EmptyState';
import LoadingState from '../../components/admin/LoadingState';
import { usePlatformUsers } from '../../hooks/useAdmin';
import './SuperAdminsPage.css';

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

function getInitials(firstName, lastName) {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
}

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phone: '', password: '' };

export default function SuperAdminsPage() {
  const { platformUsers, loading, error, fetchPlatformUsers, createSuperAdmin } = usePlatformUsers();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPlatformUsers();
  }, [fetchPlatformUsers]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const superAdmins = (platformUsers || []).filter((u) => u.role === 'super_admin');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createSuperAdmin(formData);
      toast.success('SuperAdmin créé avec succès');
      setShowModal(false);
      setFormData(EMPTY_FORM);
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sa-super-admins">
      <PageHeader
        title="Super Admins"
        subtitle={`${superAdmins.length} administrateur(s)`}
        actions={[{ label: 'Nouveau SuperAdmin', icon: Plus, onClick: () => setShowModal(true) }]}
      />

      {loading ? (
        <LoadingState />
      ) : superAdmins.length === 0 ? (
        <EmptyState icon={Users} title="Aucun super administrateur" message="Aucun super administrateur trouvé sur la plateforme." />
      ) : (
        <div className="sa-super-admins__table-wrap">
          <table className="sa-super-admins__table">
            <thead>
              <tr>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Dernière connexion</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {superAdmins.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="sa-super-admins__user">
                      <span className="sa-super-admins__avatar">{getInitials(user.firstName, user.lastName)}</span>
                      <span className="sa-super-admins__name">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="sa-super-admins__email">{user.email}</td>
                  <td className="sa-super-admins__date">{formatDate(user.lastLogin)}</td>
                  <td>
                    <StatusBadge status={user.isActive ? 'active' : 'inactive'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="sa-plans__overlay" onClick={() => setShowModal(false)}>
          <div className="sa-plans__modal" onClick={(e) => e.stopPropagation()}>
            <div className="sa-plans__modal-header">
              <h3>Nouveau SuperAdmin</h3>
              <button className="sa-plans__modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form className="sa-plans__form" onSubmit={handleSubmit}>
              <div className="sa-plans__row">
                <div className="sa-plans__field">
                  <label className="sa-plans__label">Prénom</label>
                  <input
                    className="sa-plans__input"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Prénom"
                  />
                </div>
                <div className="sa-plans__field">
                  <label className="sa-plans__label">Nom</label>
                  <input
                    className="sa-plans__input"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div className="sa-plans__row">
                <div className="sa-plans__field">
                  <label className="sa-plans__label">Adresse email</label>
                  <input
                    className="sa-plans__input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="sa-plans__field">
                  <label className="sa-plans__label">Téléphone (optionnel)</label>
                  <input
                    className="sa-plans__input"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+2376..."
                  />
                </div>
              </div>

              <div className="sa-plans__field">
                <label className="sa-plans__label">Mot de passe</label>
                <input
                  className="sa-plans__input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Mot de passe sécurisé"
                />
              </div>

              <div className="sa-plans__modal-footer">
                <button type="button" className="sa-plans__modal-btn sa-plans__modal-btn--cancel" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="sa-plans__modal-btn sa-plans__modal-btn--primary" disabled={submitting}>
                  {submitting ? 'Création...' : 'Créer le SuperAdmin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
