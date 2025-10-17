import { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import InvoicesList from './components/InvoicesList';
import InvoiceDetail from './components/InvoiceDetail';

export default function CobranzaPage() {
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'detail'>('form');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Módulo de Cobranza</h1>
        <p className="text-gray-600 mt-2">Gestión de compras y proveedores</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-6 py-2 rounded-md font-medium transition ${
              activeTab === 'form'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Nueva Compra
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-md font-medium transition ${
              activeTab === 'list'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Listado de Compras
          </button>
          <button
            onClick={() => setActiveTab('detail')}
            className={`px-6 py-2 rounded-md font-medium transition ${
              activeTab === 'detail'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Ver Compra
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pb-8">
        {activeTab === 'form' && <InvoiceForm />}
        {activeTab === 'list' && <InvoicesList />}
        {activeTab === 'detail' && <InvoiceDetail />}
      </div>
    </div>
  );
}
