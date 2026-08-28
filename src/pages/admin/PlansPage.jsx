import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Building2, Users, HardDrive, Check } from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import LoadingState from '../../components/admin/LoadingState';
import EmptyState from '../../components/admin/EmptyState';
import { usePlans } from '../../hooks/useAdmin';
import toast from 'react-hot-toast';
import './PlansPage.css';

const EMPTY_FORM = {
  code: '',
  name: '',
  price: '',
  maxAgencies: '',
  maxUsers: '',
  maxStorage: '',
  features: '',
  description: '',
};

const slugifyCode = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const formatCurrency = (value) =>
  new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(value);

function parseFeatures(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') return raw.split(',').map((f) => f.trim()).filter(Boolean);
  return [];
}

export default function PlansPage() {
  const { plans, loading, fetchPlans, createPlan, updatePlan, deletePlan } = usePlans();

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const openCreate = () => {
    setEditingPlan(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      code: plan.code || '',
      name: plan.name,
      price: String(plan.price),
      maxAgencies: String(plan.maxAgencies),
      maxUsers: String(plan.maxUsers),
      maxStorage: String(plan.maxStorage),
      features: parseFeatures(plan.features).join(', '),
      description: plan.description || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData(EMPTY_FORM);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'name' && !editingPlan && (!prev.code || prev.code === slugifyCode(prev.name))) {
        next.code = slugifyCode(value);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: slugifyCode(formData.code || formData.name),
        name: formData.name,
        price: Number(formData.price),
        maxAgencies: Number(formData.maxAgencies),
        maxUsers: Number(formData.maxUsers),
        maxStorage: Number(formData.maxStorage),
        features: parseFeatures(formData.features),
        description: formData.description,
      };

      if (editingPlan) {
        await updatePlan(editingPlan.id, payload);
        toast.success('Plan mis à jour avec succès');
      } else {
        await createPlan(payload);
        toast.success('Plan créé avec succès');
      }
      closeModal();
    } catch {
      toast.error(editingPlan ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePlan(deleteTarget.id);
      toast.success('Plan supprimé avec succès');
      setDeleteTarget(null);
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const limitLabel = (val) => (val === -1 || val === -1) ? 'Illimité' : val;

  if (loading && plans.length === 0) return <LoadingState />;

  return (
    <div className="sa-plans">
      <PageHeader
        title="Plans d'abonnement"
        subtitle={`${plans.length} plan${plans.length > 1 ? 's' : ''} disponible${plans.length > 1 ? 's' : ''}`}
        actions={[{ label: 'Nouveau plan', icon: Plus, onClick: openCreate }]}
      />

      {plans.length === 0 ? (
        <EmptyState message="Aucun plan disponible" />
      ) : (
        <div className="sa-plans__grid">
          {plans.map((plan) => (
            <div key={plan.id} className="sa-plans__card">
              <div className="sa-plans__card-header">
                <h3 className="sa-plans__card-name">{plan.name}</h3>
                <span className="sa-plans__card-price">
                  {formatCurrency(plan.price)} <small>FCFA/mois</small>
                </span>
              </div>

              {plan.description && (
                <p className="sa-plans__card-desc">{plan.description}</p>
              )}

              <div className="sa-plans__card-limits">
                <div className="sa-plans__limit">
                  <Building2 size={14} />
                  <span>{limitLabel(plan.maxAgencies)} agence{plan.maxAgencies !== 1 ? 's' : ''}</span>
                </div>
                <div className="sa-plans__limit">
                  <Users size={14} />
                  <span>{limitLabel(plan.maxUsers)} utilisateur{plan.maxUsers !== 1 ? 's' : ''}</span>
                </div>
                <div className="sa-plans__limit">
                  <HardDrive size={14} />
                  <span>{limitLabel(plan.maxStorage)} Go de stockage</span>
                </div>
              </div>

              {plan.features && plan.features.length > 0 && (
                <ul className="sa-plans__card-features">
                  {parseFeatures(plan.features).map((feat, i) => (
                    <li key={i} className="sa-plans__feature">
                      <Check size={12} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="sa-plans__card-actions">
                <button className="sa-plans__btn sa-plans__btn--edit" onClick={() => openEdit(plan)}>
                  <Edit size={14} />
                  Modifier
                </button>
                <button className="sa-plans__btn sa-plans__btn--delete" onClick={() => setDeleteTarget(plan)}>
                  <Trash2 size={14} />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="sa-plans__overlay" onClick={closeModal}>
          <div className="sa-plans__modal" onClick={(e) => e.stopPropagation()}>
            <div className="sa-plans__modal-header">
              <h3>{editingPlan ? 'Modifier le plan' : 'Nouveau plan'}</h3>
              <button className="sa-plans__modal-close" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>
            <form className="sa-plans__form" onSubmit={handleSubmit}>
              <div className="sa-plans__row">
                <div className="sa-plans__field">
                  <label className="sa-plans__label">Nom du plan</label>
                  <input
                    className="sa-plans__input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Starter"
                  />
                </div>
                <div className="sa-plans__field">
                  <label className="sa-plans__label">Code du plan (unique)</label>
                  <input
                    className="sa-plans__input"
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    disabled={!!editingPlan}
                    placeholder="Ex: starter"
                  />
                </div>
              </div>

              <div className="sa-plans__row">
                <div className="sa-plans__field">
                  <label className="sa-plans__label">Prix (FCFA/mois)</label>
                  <input
                    className="sa-plans__input"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="25000"
                  />
                </div>
                <div className="sa-plans__field">
                  <label className="sa-plans__label">Agences max (-1 = illimité)</label>
                  <input
                    className="sa-plans__input"
                    type="number"
                    name="maxAgencies"
                    value={formData.maxAgencies}
                    onChange={handleChange}
                    required
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="sa-plans__row">
                <div className="sa-plans__field">
                  <label className="sa-plans__label">Utilisateurs max (-1 = illimité)</label>
                  <input
                    className="sa-plans__input"
                    type="number"
                    name="maxUsers"
                    value={formData.maxUsers}
                    onChange={handleChange}
                    required
                    placeholder="5"
                  />
                </div>
                <div className="sa-plans__field">
                  <label className="sa-plans__label">Stockage max (Go)</label>
                  <input
                    className="sa-plans__input"
                    type="number"
                    name="maxStorage"
                    value={formData.maxStorage}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="sa-plans__field">
                <label className="sa-plans__label">Fonctionnalités (séparées par virgules)</label>
                <textarea
                  className="sa-plans__textarea"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Gestion d'agence, Suivi des colis, Rapports de base"
                />
              </div>

              <div className="sa-plans__field">
                <label className="sa-plans__label">Description</label>
                <textarea
                  className="sa-plans__textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Description du plan..."
                />
              </div>

              <div className="sa-plans__modal-footer">
                <button type="button" className="sa-plans__modal-btn sa-plans__modal-btn--cancel" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="sa-plans__modal-btn sa-plans__modal-btn--primary" disabled={saving}>
                  {saving ? 'Enregistrement...' : editingPlan ? 'Mettre à jour' : 'Créer le plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        show={!!deleteTarget}
        title="Supprimer le plan"
        message={`Êtes-vous sûr de vouloir supprimer le plan "${deleteTarget?.name}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
