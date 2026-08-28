export default function ShipmentPriceSummary({ packages, maxWeight }) {
  const totalWeight = packages.reduce((sum, p) => sum + (p.weight || 0), 0);
  const transportAmount = packages.reduce((sum, p) => sum + (p.transportAmount || 0), 0);
  const insuranceAmount = packages.reduce((sum, p) => sum + (p.insuranceAmount || 0), 0);
  const totalAmount = transportAmount + insuranceAmount;

  return (
    <div className="bg-white border rounded-3 p-3">
      <h6 className="fw-semibold mb-3">Récapitulatif</h6>
      <div className="d-flex justify-content-between small mb-2">
        <span className="text-muted">Nombre de colis</span>
        <span className="fw-medium">{packages.length}</span>
      </div>
      <div className="d-flex justify-content-between small mb-2">
        <span className="text-muted">Poids total</span>
        <span className="fw-medium">{totalWeight} / {maxWeight} kg</span>
      </div>
      <hr className="my-2" />
      <div className="d-flex justify-content-between small mb-2">
        <span className="text-muted">Transport</span>
        <span className="fw-medium">{(transportAmount || 0).toLocaleString('fr-FR')} FCFA</span>
      </div>
      <div className="d-flex justify-content-between small mb-2">
        <span className="text-muted">Assurances</span>
        <span className="fw-medium">{(insuranceAmount || 0).toLocaleString('fr-FR')} FCFA</span>
      </div>
      <hr className="my-2" />
      <div className="d-flex justify-content-between">
        <span className="fw-semibold">Total à payer</span>
        <span className="fw-bold text-primary fs-5">{(totalAmount || 0).toLocaleString('fr-FR')} FCFA</span>
      </div>
    </div>
  );
}
