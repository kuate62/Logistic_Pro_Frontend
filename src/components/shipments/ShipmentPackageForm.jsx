import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PACKAGE_CATEGORIES } from '../../config/constants';
import toast from 'react-hot-toast';

export default function ShipmentPackageForm({ packages, maxWeight, currentWeight, onAdd, onUpdate, onRemove }) {
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [form, setForm] = useState({ label: '', category: '', description: '', weight: '', length: '', width: '', height: '', declaredValue: '', fragile: false, insured: false });

  const remaining = Math.max(0, maxWeight - currentWeight);

  const resetForm = () => { setForm({ label: '', category: '', description: '', weight: '', length: '', width: '', height: '', declaredValue: '', fragile: false, insured: false }); setEditIdx(-1); setShowForm(false); };

  const openAdd = () => { resetForm(); setShowForm(true); };
  const openEdit = (idx) => { const p = packages[idx]; setForm({ ...p, weight: String(p.weight), length: String(p.length), width: String(p.width), height: String(p.height), declaredValue: String(p.declaredValue) }); setEditIdx(idx); setShowForm(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const weight = parseFloat(form.weight);
    if (weight <= 0) { toast.error('Poids invalide'); return; }
    if (editIdx === -1 && weight > remaining) { toast.error(`Poids dépasse la capacité restante (${remaining} kg)`); return; }
    if (editIdx >= 0 && weight > remaining + packages[editIdx].weight) { toast.error(`Poids dépasse la capacité restante`); return; }
    const pkg = { ...form, weight, length: parseFloat(form.length) || 0, width: parseFloat(form.width) || 0, height: parseFloat(form.height) || 0, declaredValue: parseFloat(form.declaredValue) || 0 };
    if (editIdx >= 0) { onUpdate(editIdx, pkg); toast.success('Colis modifié'); }
    else { onAdd(pkg); toast.success('Colis ajouté'); }
    resetForm();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0">Colis ({packages.length})</h6>
        <button type="button" className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={openAdd} disabled={remaining <= 0}>
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="bg-light rounded-3 p-3 mb-3 border">
          <form onSubmit={handleSubmit}>
            <Row className="g-2">
              <Col md={3}><Form.Control size="sm" placeholder="Libellé *" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required /></Col>
              <Col md={2}>
                <Form.Select size="sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Catégorie</option>
                  {PACKAGE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </Form.Select>
              </Col>
              <Col md={1}><Form.Control size="sm" type="number" step="0.1" placeholder="Poids *" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required /></Col>
              <Col md={1}><Form.Control size="sm" type="number" placeholder="L × l × h" value={form.length} onChange={(e) => setForm({ ...form, length: e.target.value })} title="Longueur" /></Col>
              <Col md={1}><Form.Control size="sm" type="number" placeholder="Largeur" value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} /></Col>
              <Col md={1}><Form.Control size="sm" type="number" placeholder="Hauteur" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} /></Col>
              <Col md={2}><Form.Control size="sm" type="number" placeholder="Valeur déclarée" value={form.declaredValue} onChange={(e) => setForm({ ...form, declaredValue: e.target.value })} /></Col>
              <Col md={1} className="d-flex gap-1">
                <Form.Check size="sm" type="switch" label="F" checked={form.fragile} onChange={(e) => setForm({ ...form, fragile: e.target.checked })} title="Fragile" />
                <Form.Check size="sm" type="switch" label="A" checked={form.insured} onChange={(e) => setForm({ ...form, insured: e.target.checked })} title="Assuré" />
              </Col>
            </Row>
            <Row className="g-2 mt-1">
              <Col md={8}><Form.Control size="sm" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Col>
              <Col md={4} className="d-flex gap-2 justify-content-end">
                <Button size="sm" variant="primary" type="submit">{editIdx >= 0 ? 'Modifier' : 'Ajouter'}</Button>
                <Button size="sm" variant="outline-secondary" onClick={resetForm}>Annuler</Button>
              </Col>
            </Row>
          </form>
        </div>
      )}

      {packages.length === 0 ? (
        <div className="text-center text-muted py-4 small">Aucun colis ajouté</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>#</th><th>Libellé</th><th>Catégorie</th><th>Poids</th><th>Dimensions</th><th>Valeur</th><th>F/A</th><th>Montant</th><th></th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p, idx) => (
                <tr key={idx}>
                  <td className="small">{idx + 1}</td>
                  <td className="small fw-medium">{p.label}</td>
                  <td className="small">{p.category}</td>
                  <td className="small">{p.weight} kg</td>
                  <td className="small text-muted">{p.length}×{p.width}×{p.height}</td>
                  <td className="small">{(p.declaredValue || 0).toLocaleString('fr-FR')} FCFA</td>
                  <td className="small">{p.fragile ? '🔋' : ''}{p.insured ? '🛡️' : ''}</td>
                  <td className="small fw-medium">{(p.totalAmount || 0).toLocaleString('fr-FR')} FCFA</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-2 py-1" onClick={() => openEdit(idx)}><Edit size={12} /></button>
                      <button type="button" className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1" onClick={() => { onRemove(idx); toast.success('Colis supprimé'); }}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
