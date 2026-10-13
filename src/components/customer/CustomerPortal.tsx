'use client';

import React, { useState } from 'react';
import { Order, OrderStatus, MeasurementData, OrderItem } from '@/lib/types';
import { 
  ShoppingBag, 
  Ruler, 
  Sparkles, 
  Truck, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  PlusCircle, 
  Info,
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface CustomerPortalProps {
  orders: Order[];
  onCreateOrder: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: OrderItem[];
    measurements: MeasurementData;
    targetDeliveryDate: string;
    notes?: string;
    depositAmount?: number;
  }) => void;
  onMakePayment: (orderId: string, amount: number) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  orders,
  onCreateOrder,
  onMakePayment,
  activeTab,
  onTabChange,
}) => {
  const tab = activeTab || 'orders';
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order>(orders[0] || null);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  // New Order Form states
  const [clientName, setClientName] = useState('Nana Yaa Agyemang');
  const [clientEmail, setClientEmail] = useState('nanayaa.client@stitchflow.io');
  const [clientPhone, setClientPhone] = useState('+233 24 555 0105');
  const [garmentName, setGarmentName] = useState('Bespoke Silk Evening Corset Gown');
  const [category, setCategory] = useState<'Bridal / Evening' | 'Traditional Kente / Agbada' | 'Casual / Ready-to-Wear' | 'Corporate Suit' | 'Alteration'>('Bridal / Evening');
  const [fabricType, setFabricType] = useState('Emerald Green Silk Satin + Organza Drape');
  const [fabricProvidedBy, setFabricProvidedBy] = useState<'customer' | 'shop'>('shop');
  const [unitPrice, setUnitPrice] = useState<number>(1650);
  const [targetDate, setTargetDate] = useState('2026-10-25');
  const [deposit, setDeposit] = useState<number>(1000);
  const [orderNotes, setOrderNotes] = useState('Need high leg slit on left side with boned corset structure.');

  // Measurements
  const [bust, setBust] = useState(36);
  const [waist, setWaist] = useState(28);
  const [hips, setHips] = useState(40);
  const [shoulder, setShoulder] = useState(15.5);
  const [fullLength, setFullLength] = useState(58);

  const stages: { key: OrderStatus; label: string }[] = [
    { key: 'received', label: 'Order Received' },
    { key: 'designing', label: 'Designing' },
    { key: 'sewing', label: 'Sewing' },
    { key: 'finishing', label: 'Finishing' },
    { key: 'ready', label: 'Ready' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStageIndex = (status: OrderStatus) => {
    return stages.findIndex((s) => s.key === status);
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateOrder({
      customerName: clientName,
      customerEmail: clientEmail,
      customerPhone: clientPhone,
      items: [
        {
          id: `item-${Date.now()}`,
          garmentName,
          category,
          fabricType,
          fabricProvidedBy,
          unitPrice,
          notes: orderNotes,
        },
      ],
      measurements: {
        unit: 'inches',
        bust,
        waist,
        hips,
        shoulder,
        fullLength,
      },
      targetDeliveryDate: targetDate,
      notes: orderNotes,
      depositAmount: deposit,
    });

    setShowNewOrderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Hero Showcase (Direct replica of Customer Portal in Infographic) */}
      {tab === 'orders' && (
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-900 via-pink-900 to-purple-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-rose-800/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            Bespoke Haute Couture Experience
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Custom Outfits, <span className="bg-gradient-to-r from-pink-300 to-rose-200 bg-clip-text text-transparent">Made for You</span>
          </h1>
          <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
            Upload your dream design, enter your body measurements, and watch our master tailors stitch your bespoke outfit to perfection.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowNewOrderModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-rose-500/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Place a Custom Order</span>
            </button>

            <button
              onClick={() => setShowMeasurementGuide(true)}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Ruler className="w-4 h-4" />
              <span>Measurement Guide</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Measurement Vault */}
      {tab === 'measurements' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-black text-gray-900">Measurement Vault</h3>
              <p className="text-xs text-gray-500">Body measurements saved with your orders</p>
            </div>
            <button
              onClick={() => setShowMeasurementGuide(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Ruler className="w-4 h-4" />
              <span>Measurement Guide</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-gray-500">No orders yet, so no measurements are saved.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((ord) => {
                const m = ord.measurements;
                const entries: [string, number | undefined][] = [
                  ['Bust', m?.bust],
                  ['Chest', m?.chest],
                  ['Waist', m?.waist],
                  ['Hips', m?.hips],
                  ['Shoulder', m?.shoulder],
                  ['Arm Length', m?.armLength],
                  ['Inseam', m?.inseam],
                  ['Neck', m?.neck],
                  ['Thigh', m?.thigh],
                  ['Full Length', m?.fullLength],
                ];
                return (
                  <div key={ord.id} className="p-4 rounded-2xl border border-rose-100 bg-rose-50/40 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">{ord.orderNumber}</span>
                      <span className="text-[10px] text-gray-500 font-semibold uppercase">{m?.unit || 'inches'}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-xs truncate">{ord.items[0]?.garmentName}</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {entries
                        .filter(([, v]) => v !== undefined && v !== null)
                        .map(([label, v]) => (
                          <div key={label} className="bg-white rounded-xl border border-gray-100 p-2 text-center">
                            <div className="text-[10px] text-gray-500 font-bold">{label}</div>
                            <div className="text-sm font-black text-gray-900">{v}</div>
                          </div>
                        ))}
                    </div>
                    {m?.notes && <p className="text-[11px] text-gray-600">{m.notes}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Live Order Tracking Stepper Card (Directly from infographic) */}
      {tab === 'track' && selectedOrder && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full w-fit">
                <span>{selectedOrder.orderNumber}</span>
                <span>•</span>
                <span>Due: {selectedOrder.targetDeliveryDate}</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mt-2">{selectedOrder.items[0]?.garmentName}</h3>
              <p className="text-xs text-gray-500">Fabric: {selectedOrder.items[0]?.fabricType}</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-400 block font-semibold">Total Price</span>
              <span className="text-2xl font-black text-gray-900">GH₵ {selectedOrder.totalAmount.toLocaleString()}</span>
              <div className="text-[11px] text-emerald-700 font-bold">
                Paid: GH₵ {selectedOrder.paidAmount.toLocaleString()} (
                {selectedOrder.paymentStatus === 'paid' ? 'Paid in Full' : 'Deposit Received'}
                )
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar (Visual Replica from Infographic) */}
          <div className="pt-2">
            <div className="text-center font-bold text-gray-800 text-xs mb-6 uppercase tracking-wider">
              Track Your Order Live
            </div>

            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-6 right-6 h-1 bg-gray-200 -translate-y-1/2 -z-0" />
              <div 
                className="absolute top-1/2 left-6 h-1 bg-rose-500 -translate-y-1/2 -z-0 transition-all duration-700" 
                style={{
                  width: `${(getStageIndex(selectedOrder.status) / (stages.length - 1)) * 100}%`,
                }}
              />

              {/* Steps */}
              <div className="relative z-10 flex justify-between items-center">
                {stages.map((st, idx) => {
                  const currentIdx = getStageIndex(selectedOrder.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={st.key} className="flex flex-col items-center space-y-2 text-center max-w-[80px]">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCurrent
                            ? 'bg-rose-600 text-white ring-4 ring-rose-200 scale-110'
                            : isCompleted
                            ? 'bg-rose-500 text-white'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold leading-tight ${
                        isCurrent ? 'text-rose-900 font-extrabold' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status Timeline logs */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-2">
            <h5 className="text-xs font-bold text-gray-700">Workshop Progress Updates:</h5>
            <div className="space-y-1.5 text-xs text-gray-600">
              {selectedOrder.statusHistory.map((hist, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-gray-900 uppercase font-mono text-[10px]">[{hist.status}]</strong> {hist.note}{' '}
                    <span className="text-[10px] text-gray-400">({new Date(hist.timestamp).toLocaleDateString()})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'track' && !selectedOrder && (
        <div className="bg-white rounded-3xl p-8 border border-rose-100 text-center text-xs text-gray-500">
          You have no orders to track yet.
        </div>
      )}

      {/* Orders Directory / Switcher */}
      {(tab === 'orders' || tab === 'track') && (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base">Your Custom Garment Orders</h3>
          <span className="text-xs text-gray-500">{orders.length} Orders Placed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => {
                setSelectedOrder(ord);
                setViewOrder(ord);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedOrder?.id === ord.id
                  ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200'
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                  {ord.orderNumber}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {ord.status}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-xs truncate">{ord.items[0]?.garmentName}</h4>
              <p className="text-[11px] text-gray-500 mt-1">Due: {ord.targetDeliveryDate}</p>
              <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-xs font-bold">
                <span className="text-gray-900">GH₵ {ord.totalAmount.toLocaleString()}</span>
                <span className="text-rose-600 text-[11px]">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Order Details Modal */}
      {viewOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setViewOrder(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-3 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                  {viewOrder.orderNumber}
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-2">{viewOrder.items[0]?.garmentName}</h3>
                <p className="text-xs text-gray-500">
                  Ordered {viewOrder.orderDate} • Due {viewOrder.targetDeliveryDate}
                </p>
              </div>
              <button
                onClick={() => setViewOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] text-gray-500 font-bold uppercase">Stage</div>
                <div className="font-black text-rose-800 uppercase">{viewOrder.status}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] text-gray-500 font-bold uppercase">Total</div>
                <div className="font-black text-gray-900">GH₵ {viewOrder.totalAmount.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] text-gray-500 font-bold uppercase">Paid</div>
                <div className="font-black text-emerald-700">GH₵ {viewOrder.paidAmount.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] text-gray-500 font-bold uppercase">Balance</div>
                <div className="font-black text-amber-700">
                  GH₵ {Math.max(0, viewOrder.totalAmount - viewOrder.paidAmount).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-gray-700">Garments</h5>
              {viewOrder.items.map((item) => (
                <div key={item.id} className="p-3 rounded-xl border border-gray-100 text-xs space-y-0.5">
                  <div className="font-bold text-gray-900">{item.garmentName}</div>
                  <div className="text-gray-500">{item.category}</div>
                  <div className="text-gray-500">
                    Fabric: {item.fabricType} ({item.fabricProvidedBy === 'customer' ? 'supplied by you' : 'supplied by shop'})
                  </div>
                  {item.notes && <div className="text-gray-600">Notes: {item.notes}</div>}
                  <div className="font-bold text-gray-900">GH₵ {item.unitPrice.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-gray-700">
                Measurements ({viewOrder.measurements?.unit || 'inches'})
              </h5>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(
                  [
                    ['Bust', viewOrder.measurements?.bust],
                    ['Chest', viewOrder.measurements?.chest],
                    ['Waist', viewOrder.measurements?.waist],
                    ['Hips', viewOrder.measurements?.hips],
                    ['Shoulder', viewOrder.measurements?.shoulder],
                    ['Arm', viewOrder.measurements?.armLength],
                    ['Inseam', viewOrder.measurements?.inseam],
                    ['Neck', viewOrder.measurements?.neck],
                    ['Thigh', viewOrder.measurements?.thigh],
                    ['Length', viewOrder.measurements?.fullLength],
                  ] as [string, number | undefined][]
                )
                  .filter(([, v]) => v !== undefined && v !== null)
                  .map(([label, v]) => (
                    <div key={label} className="bg-rose-50/60 rounded-xl border border-rose-100 p-2 text-center">
                      <div className="text-[10px] text-gray-500 font-bold">{label}</div>
                      <div className="text-sm font-black text-gray-900">{v}</div>
                    </div>
                  ))}
              </div>
            </div>

            {viewOrder.notes && (
              <p className="text-xs text-gray-600">
                <strong className="text-gray-800">Order notes:</strong> {viewOrder.notes}
              </p>
            )}

            <div className="flex space-x-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setViewOrder(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedOrder(viewOrder);
                  setViewOrder(null);
                  if (onTabChange) onTabChange('track');
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs"
              >
                Track Live Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Place Custom Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900">Place Bespoke Custom Order</h3>
                <p className="text-xs text-gray-500">Provide garment details, fabric options and precision measurements</p>
              </div>
              <button 
                onClick={() => setShowNewOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number (WhatsApp)</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Garment Style / Title</label>
                  <input
                    type="text"
                    value={garmentName}
                    onChange={(e) => setGarmentName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
                  >
                    <option value="Bridal / Evening">Bridal / Evening Wear</option>
                    <option value="Traditional Kente / Agbada">Traditional Kente / Agbada</option>
                    <option value="Casual / Ready-to-Wear">Casual / Ready-to-Wear</option>
                    <option value="Corporate Suit">Corporate Suit / Blazer</option>
                    <option value="Alteration">Garment Alteration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Fabric Details &amp; Sourcing</label>
                <input
                  type="text"
                  value={fabricType}
                  onChange={(e) => setFabricType(e.target.value)}
                  placeholder="e.g. Royal Blue Velvet or Bonwire Kente"
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
                  required
                />
              </div>

              {/* Body Measurements */}
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-rose-950 text-xs">Body Measurements (Inches)</span>
                  <button
                    type="button"
                    onClick={() => setShowMeasurementGuide(true)}
                    className="text-[11px] text-rose-700 font-bold underline"
                  >
                    View Visual Guide
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold">Bust/Chest</label>
                    <input
                      type="number"
                      value={bust}
                      onChange={(e) => setBust(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold">Waist</label>
                    <input
                      type="number"
                      value={waist}
                      onChange={(e) => setWaist(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold">Hips</label>
                    <input
                      type="number"
                      value={hips}
                      onChange={(e) => setHips(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold">Shoulder</label>
                    <input
                      type="number"
                      value={shoulder}
                      onChange={(e) => setShoulder(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold">Length</label>
                    <input
                      type="number"
                      value={fullLength}
                      onChange={(e) => setFullLength(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Due Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Initial Deposit (GH₵)</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Special Design Notes &amp; Fit Preferences</label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-600/30 transition-colors"
                >
                  Submit Bespoke Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visual Measurement Guide Modal */}
      {showMeasurementGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-gray-900 text-base">Bespoke Measurement Guide</h3>
              </div>
              <button 
                onClick={() => setShowMeasurementGuide(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <p className="leading-relaxed">
                Use a flexible measuring tape snug against the body (do not pull too tight).
              </p>

              <div className="space-y-2 bg-rose-50/60 p-4 rounded-2xl border border-rose-100">
                <div>
                  <strong className="text-gray-900">1. Bust / Chest:</strong> Measure around the fullest part across the shoulder blades.
                </div>
                <div>
                  <strong className="text-gray-900">2. Waist:</strong> Measure around your natural waistline (usually 1 inch above navel).
                </div>
                <div>
                  <strong className="text-gray-900">3. Hips:</strong> Stand with feet together and measure around the fullest part of hips/derriere.
                </div>
                <div>
                  <strong className="text-gray-900">4. Shoulder Width:</strong> Across the back from tip of left shoulder bone to right.
                </div>
                <div>
                  <strong className="text-gray-900">5. Full Length:</strong> From shoulder top down to desired hemline (floor length or ankle).
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMeasurementGuide(false)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
