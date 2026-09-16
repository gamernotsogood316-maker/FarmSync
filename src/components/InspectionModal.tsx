import React, { useState } from 'react';

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLockEscrow: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  isOpen,
  onClose,
  onLockEscrow,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!isOpen) return null;

  const photos = [
    {
      title: 'Bulb Caliber Scale (Digital Vernier)',
      desc: 'Vernier caliper measurement showing 58.4 mm uniform diameter across 25 random samples from lot.',
      tag: '58.4 mm Grade A',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy_paWB56X8oFPlaepAXdh7eplSVbFc4aOeXPdsphyYtnl3ZydwTatTX2_ejS2qy8dpXwJoN1vmyYh3O239kEsyoyDcHHuBiEp-YxzE_jnal2OAoyv8umJwydGYDh2cBQEGtT6Qj3iVB1s1B1v4jZoUqp8_Jh24yeYtWHIxWtAb-55gOZoPqjoBBoIG1gBdfkwH6pha9pxqMM5vwnxq6DLTuKsjXWQ3kk0opGCp-Xqwcl2wLDH6zU',
    },
    {
      title: 'Moisture Meter Probe Test',
      desc: 'Tested with calibrated digital insertion probe. Dry outer husk and cured neck ensures 25-day transit life.',
      tag: '11.4% Moisture (Safe)',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcCOFx2zcWUxXzuK-9nTrdu21v7EhIqNf_JnT_y30jVeI-1-xDMthhXGSqg1fYko1eSUQHdBXj7rikCP-3RghDha9X8Dg-FEKwWMyUu3_bt-asj4kaLUYCfaTp6O4o3BOn31g7BrOZnXCqbwGdhmiSIDKiO8GEEWJbf3-Yfe7slazgyBD4tKcfOkAUqkg4faS-ot3Tz67QFUZB9-j_TVPiUV3xJ521cjq_17YNOhCLZT_ziXg1TI4',
    },
    {
      title: 'Field Stack in Leno Mesh Bags',
      desc: 'Packed in standard 50 kg red breathable leno bags, stacked on dry wooden pallets ready for truck loading.',
      tag: '300 Bags (150 Qtl)',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOXsEnkqAoIkY9LUtkHnGrhfJb53k5bQCwTZR4_vZVILs_2zEyIkBkL4I4Ps3CZbQ3tBp8_jNpl-loKaZ79xxFG7CwnleqN08Tpe78fnU_63EJMmc4-_NSQA1nnR5-OYt2ZbHRJ-YbqN4EAF_9LaABRzwHMDZJmGKnhTIOvYpS0a7YXRGO3QWXKw9geROmN-ngaG6OR3vp6RGZFeiHgm0N96xsD0rgycY43yWBgSfjLALEVXFedTs',
    },
    {
      title: 'Transverse Cut & Internal Core Test',
      desc: 'Transverse slice inspection revealing dense, succulent concentric rings without any black mold or rot.',
      tag: '0.0% Internal Defect',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2VmOiBMQ5AsPSXrge5mXMIMp-1QzRPLMyAQl0IlIwWtiO_NOwzLykv5jKGv3EKWF5KHR2XTHBM7rG3xghN-2wm6geJwaLnD42NdzbA_k6Px_f6LdAO1TCaGu3q5tj1iv-X_Tc774wgbevibeA-pmgRbzQyzEKTzqEsjnZWuHBNyMiV4jlHwWDD9tfYl-t1jPdtjTsqitzRfDKrwRZy5BXX587FUD0fWuCYXfs22ke2W67HzTRlUs',
    },
    {
      title: 'KVK Agronomy Quality Certificate',
      desc: 'Certified by Krishi Vigyan Kendra, Nashik District Agricultural testing cell for export & domestic grade.',
      tag: 'Govt e-NAM Verified',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkhFCyhsmsmnnvkcePejFSE8DdF-NSBB1yCgj8M-56vhQuI8Jk2UQwhwNOfMFyldidabEYtUvyCpE0evpPF5Pm_3m8plwws9aKg_YFDNj0VvUdAnE-t4EvYA2djkXs6qsCvDJ26o1JI_hHltX3mRhlsLYzc6abHlmQdECw78YuHHJ-jzjbb2UMBHCV1YHsmyDfzsE50f8XLzS5bshzLYFKVNIvS-LHpKgBX3kyaDpbKK3qpaVjRA8',
    },
  ];

  const current = photos[activePhotoIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface-container-lowest rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-surface-container-high">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">
                verified
              </span>
              <h3 className="font-headline-sm font-bold text-on-surface">
                Crop Authenticity & Moisture Check
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm font-bold">
                Batch #FS-NSK-8821
              </span>
            </div>
            <p className="font-body-sm text-on-surface-variant mt-0.5">
              Farmer: <strong className="text-on-surface">Ramesh Patil</strong> (Niphad, Nashik • 14.2 km away) • Geo-Tag: 20.0768° N, 74.1122° E • Harvested 48 hrs ago
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer"
            id="modal-close-btn"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Photo Display with Overlay Badge */}
          <div className="relative aspect-video sm:aspect-[16/9] md:aspect-[21/9] bg-surface-container rounded-xl overflow-hidden border border-surface-container-high shadow-inner">
            <img
              src={current.url}
              alt={current.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-black/75 text-white font-label-md font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-[#91d78a]">
                  check_circle
                </span>
                {current.tag}
              </span>
              <span className="px-2.5 py-1.5 rounded-lg bg-white/90 text-[#111c2d] font-label-sm font-semibold backdrop-blur-md">
                Photo {activePhotoIndex + 1} of 5
              </span>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
              <h4 className="font-title-md font-bold">{current.title}</h4>
              <p className="font-body-sm text-white/80">{current.desc}</p>
            </div>
          </div>

          {/* Thumbnails Row */}
          <div>
            <span className="font-label-sm uppercase font-bold text-on-surface-variant tracking-wider block mb-2">
              All 5 Geo-Tagged Evidence Photos
            </span>
            <div className="grid grid-cols-5 gap-3">
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIndex === idx
                      ? 'border-primary ring-2 ring-primary/30 scale-[1.03]'
                      : 'border-surface-container-high opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                    #{idx + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Agronomist Quality Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <div>
              <span className="font-label-sm text-on-surface-variant block">Moisture Ratio</span>
              <span className="font-headline-sm font-bold text-primary">11.4%</span>
              <span className="font-body-sm text-[#0c5216] block text-xs">Safe Threshold &lt;13.0%</span>
            </div>
            <div>
              <span className="font-label-sm text-on-surface-variant block">Average Caliber</span>
              <span className="font-headline-sm font-bold text-on-surface">55–65 mm</span>
              <span className="font-body-sm text-on-surface-variant block text-xs">Grade A Uniform</span>
            </div>
            <div>
              <span className="font-label-sm text-on-surface-variant block">Rot / Sprouting</span>
              <span className="font-headline-sm font-bold text-primary">0.0%</span>
              <span className="font-body-sm text-[#0c5216] block text-xs">Zero Internal Decay</span>
            </div>
            <div>
              <span className="font-label-sm text-on-surface-variant block">Curing Quality</span>
              <span className="font-headline-sm font-bold text-secondary">3-Layer Husk</span>
              <span className="font-body-sm text-on-surface-variant block text-xs">Dry Sun Cured</span>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-4 border-t border-surface-container-high bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm">
            <span className="material-symbols-outlined text-[18px] text-primary">
              security
            </span>
            <span>Buyer Protection: Escrow released only after weighbridge match</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-surface-container-high font-label-md text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onLockEscrow();
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              Lock Escrow for this Batch (₹2,450/Qtl)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
