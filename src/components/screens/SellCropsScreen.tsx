import React, { useState } from 'react';
import { ScreenId } from '../../types';

interface SellCropsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SellCropsScreen: React.FC<SellCropsScreenProps> = ({ onNavigate }) => {
  // Form State
  const [cropName, setCropName] = useState('Nashik Red Onion (Garwa)');
  const [varietyGrade, setVarietyGrade] = useState('Grade A Export (55mm+)');
  const [curingDetail, setCuringDetail] = useState('Harvested 3 days ago, Sun Cured 18 days');
  const [totalQuantity, setTotalQuantity] = useState(150);
  const [minOrderQty, setMinOrderQty] = useState(20);
  const [packagingType, setPackagingType] = useState('50 kg Ventilated Red Leno Mesh Bags');
  const [askingPrice, setAskingPrice] = useState(2450);
  const [truckAccess, setTruckAccess] = useState(true);
  const [weighbridgeNearby, setWeighbridgeNearby] = useState(true);

  // 5th Photo upload state
  const [photo5Uploaded, setPhoto5Uploaded] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Pre-loaded verification photos
  const photoSlots = [
    {
      title: 'Slot 1: Field Stack View',
      desc: 'Gunny bags stacked in dry shed',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1jdnEsIzU4M0ZZN10CEww_TjuHTTsvswv_IDc15jw0qNkwUE50q78O8p3gZdEnM1NoNHaJHe31YaPGp1eUD7kOhav46zcrRmZOb5WXab7pCC1aL5CTwnsilZnkhHHoLqkaCZpVzD9owjmf3dB2Bs10xQJGuLOE7iRigb9a53mBtOWus9vzX6PZxRe_GvIztzl0g1zct-zUtWlSu_9VHAGbbiRFmNpcwXJ_CVN2ZHfRZuR5IN0H4Y',
    },
    {
      title: 'Slot 2: Produce Detail',
      desc: 'Tight dry husk, zero sprouting',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmQxWJ1jiOs6Jd8BHebuMxux8XJzgYAFjf6TC--sB7bDdzRCf9h7tZGp7leuUpOF2gKRGva42wkPHQcncJ-tvStp1STd2ymY_uUxYnfWUEU5hmADkuTgCDLvS1Ug4x1GhL8PJzCulSsSsrWBAstE_UdcwnJwMLSrFy8OiUpt1WkIvdR1UnOkUVyU7Hv0R9ScQuyDl-85G5cfqBPdoV7eIimWUoJl5K8Vr1BGNFaoQ7whQpPQ8_m3o',
    },
    {
      title: 'Slot 3: Hand Scale Check',
      desc: 'Caliber size scale in palm',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkrQVueOVxMhsQBWdHn-zgNUXFHBcSuhStgYUlVNTQ8mfmc9y6BT4HwEJ5-G5vy1HnoC8uaZgPxtCX36oIX9IQrtE6X5zkNllvh7I8xpBfhjV6sPdou3dsY-x2_vsBs_3LrKu30v79d1i0L1_hy-BBUxoPsp8YMGbgrOOhIKDqh_BZuUHCKV3ZkqgbM9d5p-IUCCuGK8uQkqvpg702mqapsK502F78M2CezDmpu95KXxfoFGlNHko',
    },
    {
      title: 'Slot 4: Cross-Section Cut',
      desc: 'Dense internal rings, 0% cavity',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5F9DMBTI-vySkjMODsgEeR7B5UiYn-vkEauwHMrbSEkaBo1jAg0vq4SK6pKbQekngwCTOhxeH6e8QFfitgPHk6X8JVEa9sAuGuiZHW02USv2R8rfMjDrFAc6qV0E3ECrBc0ACE5-Rg43I6xzKO4jnHovwwlUJcQtsNL53sTYN2w-uvmjMUxG5N276AUW7fOKlbD8iEv_2xTTYh1ULD7LCWJEM01k0WXRi9aVvPEX5daHUeTu1vrU',
    },
  ];

  const photo5Url =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBOXsEnkqAoIkY9LUtkHnGrhfJb53k5bQCwTZR4_vZVILs_2zEyIkBkL4I4Ps3CZbQ3tBp8_jNpl-loKaZ79xxFG7CwnleqN08Tpe78fnU_63EJMmc4-_NSQA1nnR5-OYt2ZbHRJ-YbqN4EAF_9LaABRzwHMDZJmGKnhTIOvYpS0a7YXRGO3QWXKw9geROmN-ngaG6OR3vp6RGZFeiHgm0N96xsD0rgycY43yWBgSfjLALEVXFedTs';

  // Preview card onion photo
  const previewCardPhoto =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCAM5k-tj33IxBkI9oDgDyuh_nszESvg9d9XDetFtQmwQ4oP7D42Yx7vd6cznLmb7yDKCTheGpg1leXMOGh6vDZOXD0tqYD2gsP0AN1z8BVTyE-nIz7ewum9n8dKtN2_ljmOz63kvs5pmPGdGSvmBlybgnjJiYkKN8OvjK-T6JYFNWdQ66PTxhLwYt6u_woaF4mOZHTjiSxwvgWGpRBesNZ8H8aLTplg7nOP1GCOrEKYbxs0BoxZeI';

  // Calculations
  const grossFarmerEarnings = totalQuantity * askingPrice;
  const savedDalaliMoney = Math.round(grossFarmerEarnings * 0.08); // 8% commission saved

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-6 space-y-8">
      {/* Mandi Live Pulse Ticker */}
      <div className="p-3.5 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold overflow-hidden">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0 animate-ping" />
          <span className="font-bold text-secondary uppercase tracking-wider shrink-0">
            Mandi Live Pulse:
          </span>
          <span className="truncate">
            Nashik Mandi Onion rates up by ₹150/qtl today • Wheat prices stable • Heavy demand for Himsona Tomatoes from Mumbai retail chains
          </span>
        </div>
        <span className="text-xs font-bold text-secondary shrink-0 ml-2 hidden sm:inline">
          e-NAM Verified Ticker
        </span>
      </div>

      {/* Farmer Profile & Progress Bar */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-xl shadow-md">
              RP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline-sm text-2xl font-bold text-on-surface">
                  Ramesh Patil
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm font-bold">
                  Verified Annadata (MH-NSK-4491)
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant">
                Niphad, Nashik District • Bank of Maharashtra DBT Account Linked (Aadhaar Verified ✓)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('farmer-dashboard-orders')}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high font-label-md font-semibold text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              My Farmer Dashboard
            </button>
          </div>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-primary text-on-primary font-label-sm font-bold flex items-center gap-2 shadow-xs">
            <span className="w-5 h-5 rounded-full bg-white text-primary flex items-center justify-center text-xs">
              1
            </span>
            <span>1. Crop Information</span>
          </div>
          <div className="p-3 rounded-xl bg-primary-fixed text-on-primary-fixed-variant font-label-sm font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">
              2
            </span>
            <span>2. 5-Photo Proof (96%)</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-container text-on-surface font-label-sm font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center text-xs">
              3
            </span>
            <span>3. Fair Price Setting</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-container text-on-surface font-label-sm font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center text-xs">
              4
            </span>
            <span>4. Farm Logistics</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Steps (Col 8) + Sidebar Preview & Chart (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: Multi-step Form */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Crop Information */}
          <div className="p-6 md:p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div>
                <h3 className="font-headline-sm text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-primary-fixed text-primary flex items-center justify-center text-sm font-black">
                    1
                  </span>
                  Fasal Ki Jaankari (Crop Information)
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Select your produce and specify grade, packaging, and available volume.
                </p>
              </div>
              <span className="font-label-sm text-primary font-bold">Step 1 of 4</span>
            </div>

            {/* Quick-Select Crop Name Chips */}
            <div className="space-y-2">
              <label className="font-label-md font-bold text-on-surface block">
                Select Crop / Produce Name:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Nashik Red Onion (Garwa)',
                  'Sharbati MP Wheat',
                  'Himsona Table Tomato',
                  'Desi Toor Dal',
                  'Sona Masoori Paddy',
                ].map((crop) => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => setCropName(crop)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      cropName === crop
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>

            {/* Variety & Curing Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-label-sm font-semibold text-on-surface block">
                  Grade / Variety Specification:
                </label>
                <input
                  type="text"
                  value={varietyGrade}
                  onChange={(e) => setVarietyGrade(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm font-semibold text-on-surface block">
                  Harvest & Sun Curing Status:
                </label>
                <input
                  type="text"
                  value={curingDetail}
                  onChange={(e) => setCuringDetail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Quantity and MOQ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-label-sm font-semibold text-on-surface block">
                  Total Available Stock (Qtl):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md focus:outline-none focus:border-primary font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                    Quintals
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-label-sm font-semibold text-on-surface block">
                  Minimum Order (MOQ):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={minOrderQty}
                    onChange={(e) => setMinOrderQty(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md focus:outline-none focus:border-primary font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                    Quintals
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-label-sm font-semibold text-on-surface block">
                  Packaging Type:
                </label>
                <select
                  value={packagingType}
                  onChange={(e) => setPackagingType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-label-md focus:outline-none cursor-pointer"
                >
                  <option value="50 kg Ventilated Red Leno Mesh Bags">50 kg Red Leno Bags</option>
                  <option value="50 kg Heavy Jute Gunny Sacks">50 kg Jute Sacks</option>
                  <option value="25 kg Plastic Crates (Vegetable Grade)">25 kg Plastic Crates</option>
                  <option value="Loose Bulk / Trolley Dump">Loose Bulk / Trolley</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Mandatory 5-Photo Proof of Harvest */}
          <div className="p-6 md:p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-container gap-2">
              <div>
                <h3 className="font-headline-sm text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-primary-fixed text-primary flex items-center justify-center text-sm font-black">
                    2
                  </span>
                  Mandatory 5-Photo Proof of Harvest
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  High-res photos guarantee retail buyers pay top fair-value without demanding dalali cuts.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  AI Quality Score: 96%
                </span>
              </div>
            </div>

            {/* Photo Grid with 4 verified + 1 upload slot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {photoSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden border border-surface-container-high bg-surface-container-low p-2 space-y-2 flex flex-col justify-between group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-container">
                    <img
                      src={slot.url}
                      alt={slot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/70 text-white rounded-md px-1.5 py-0.5 text-[10px] font-bold">
                      #{idx + 1}
                    </div>
                    <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-0.5">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-label-sm font-bold text-on-surface truncate">
                      {slot.title}
                    </h4>
                    <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                      {slot.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* Slot 5: Active Upload Slot */}
              <div
                onClick={() => setPhoto5Uploaded(!photo5Uploaded)}
                className={`rounded-2xl overflow-hidden border-2 border-dashed p-2 space-y-2 flex flex-col justify-between cursor-pointer transition-all ${
                  photo5Uploaded
                    ? 'border-primary bg-primary-fixed/20'
                    : 'border-secondary bg-secondary-fixed/20 hover:border-secondary'
                }`}
              >
                {photo5Uploaded ? (
                  <>
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-container">
                      <img
                        src={photo5Url}
                        alt="Slot 5: Bags and Weigh Scale"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-black/70 text-white rounded-md px-1.5 py-0.5 text-[10px] font-bold">
                        #5
                      </div>
                      <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-0.5">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-label-sm font-bold text-primary truncate">
                        Slot 5: Bags & Scale Test
                      </h4>
                      <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                        Verified 50kg weighbridge photo
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-3 text-center space-y-2">
                    <span className="material-symbols-outlined text-secondary text-[32px]">
                      add_a_photo
                    </span>
                    <span className="font-label-sm font-bold text-secondary">
                      Upload Slot 5
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      Click to capture or upload weigh scale
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Uchit Dam Nirdharan (Fair Price Setting) */}
          <div className="p-6 md:p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div>
                <h3 className="font-headline-sm text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-primary-fixed text-primary flex items-center justify-center text-sm font-black">
                    3
                  </span>
                  Uchit Dam Nirdharan (Fair Price Setting)
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Set your price with live APMC mandi benchmarks. No forced distress selling.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm font-bold">
                0% Middleman Commission
              </span>
            </div>

            {/* Price Slider Section */}
            <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <span className="font-label-sm text-on-surface-variant block uppercase font-bold tracking-wider">
                    Your Asking Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-currency-display text-4xl font-black text-primary">
                      ₹{askingPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="font-title-md text-on-surface-variant">/ Quintal</span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="font-label-sm text-on-surface-variant block">
                    Govt Minimum Support Price (MSP Floor)
                  </span>
                  <span className="font-title-lg font-bold text-secondary">
                    ₹2,100 / Qtl (Mandatory Minimum)
                  </span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="space-y-1.5 pt-2">
                <input
                  type="range"
                  min="2100"
                  max="2850"
                  step="25"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-3 bg-surface-container rounded-lg"
                />
                <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                  <span>MSP Floor: ₹2,100</span>
                  <span className="text-primary font-bold">Recommended Zone: ₹2,350 – ₹2,600</span>
                  <span>Ceiling: ₹2,850</span>
                </div>
              </div>

              {/* Real-time Math Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-surface-container">
                <div className="p-3 bg-surface-container-lowest rounded-xl border border-surface-container">
                  <span className="font-label-sm text-on-surface-variant block">
                    Estimated Gross Annadata Payout:
                  </span>
                  <span className="font-display-lg text-2xl font-black text-primary">
                    ₹{grossFarmerEarnings.toLocaleString('en-IN')}
                  </span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block">
                    100% credited to your bank account via DBT
                  </span>
                </div>

                <div className="p-3 bg-primary-fixed/40 rounded-xl border border-primary-fixed">
                  <span className="font-label-sm text-primary font-bold block">
                    Commission Kept in Your Pocket:
                  </span>
                  <span className="font-display-lg text-2xl font-black text-[#00450d]">
                    +₹{savedDalaliMoney.toLocaleString('en-IN')} Saved
                  </span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block">
                    Zero cuts for katoti, arhatiya dalali or hidden grading fees
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Farm Logistics & Pickup Location */}
          <div className="p-6 md:p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div>
                <h3 className="font-headline-sm text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-primary-fixed text-primary flex items-center justify-center text-sm font-black">
                    4
                  </span>
                  Farm Logistics & Pickup Location
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Truck transports collect directly from your farm. No transit stress for you.
                </p>
              </div>
              <span className="font-label-sm text-primary font-bold">Step 4 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-label-sm font-semibold text-on-surface block">
                  Farm / Godown Address:
                </label>
                <input
                  type="text"
                  defaultValue="Survey No. 142/2, Mouje Sukene, Niphad Taluka, Nashik"
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-sm font-semibold text-on-surface block">
                  Nearest Landmark / Highway:
                </label>
                <input
                  type="text"
                  defaultValue="Niphad-Lasalgaon State Highway Gate 4"
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-body-md focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div>
                  <span className="font-label-md font-bold text-on-surface block">
                    Heavy Truck Road Access
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    6-wheeler & 10-wheeler accessible
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={truckAccess}
                  onChange={(e) => setTruckAccess(e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div>
                  <span className="font-label-md font-bold text-on-surface block">
                    Weighbridge (Dharam Kanta)
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Certified scale within 2 km radius
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={weighbridgeNearby}
                  onChange={(e) => setWeighbridgeNearby(e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Live Listing Preview & Tiranga Vachan */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          {/* Live Card Preview */}
          <div className="rounded-3xl bg-surface-container-lowest border-2 border-primary/20 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <span className="font-label-sm uppercase font-bold text-primary tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live Retailer Card Preview
              </span>
              <span className="font-label-sm text-on-surface-variant">How buyers see it</span>
            </div>

            {/* Produce Card Simulation */}
            <div className="rounded-2xl overflow-hidden border border-surface-container-high bg-surface-container-low shadow-sm">
              <div className="relative aspect-[4/3] bg-surface-container">
                <img
                  src={previewCardPhoto}
                  alt={cropName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/75 text-white font-label-sm font-bold px-2.5 py-1 rounded-lg backdrop-blur-md">
                  {varietyGrade}
                </div>
                <div className="absolute bottom-3 right-3 bg-primary text-on-primary font-currency-display text-lg px-3 py-1 rounded-xl shadow-md font-black">
                  ₹{askingPrice}/Qtl
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-title-md font-bold text-on-surface">{cropName}</h4>
                    <p className="font-body-sm text-on-surface-variant text-xs">
                      Farmer: Ramesh Patil • Niphad (14 km)
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm font-bold text-xs">
                    ★ 4.9 (48)
                  </span>
                </div>

                <div className="pt-2 border-t border-surface-container flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">Available Lot:</span>
                  <strong className="text-on-surface">{totalQuantity} Quintals</strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">Packaging:</span>
                  <strong className="text-on-surface truncate max-w-[160px]">{packagingType}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* FarmSync Tiranga Vachan */}
          <div className="rounded-3xl bg-surface-container-lowest border border-surface-container-high p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-primary font-title-md font-bold">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
              <span>FarmSync Tiranga Vachan</span>
            </div>
            <ul className="space-y-2 text-xs font-body-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                  check
                </span>
                <span><strong>100% Direct Benefit Transfer (DBT):</strong> Full payment directly into your Aadhaar linked bank account.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">
                  check
                </span>
                <span><strong>Escrow Secured:</strong> Buyer funds are locked before the truck is dispatched to your farm.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                  check
                </span>
                <span><strong>Zero Unauthorized Cuts:</strong> No katoti or sudden deductions at delivery.</span>
              </li>
            </ul>
          </div>

          {/* 7-Day Price Trend Sparkline */}
          <div className="rounded-3xl bg-surface-container-lowest border border-surface-container-high p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                7-Day Nashik Onion Trend
              </span>
              <span className="text-xs font-bold text-[#0c5216] bg-primary-fixed px-2 py-0.5 rounded-full">
                +6.5% Up
              </span>
            </div>

            {/* Sparkline SVG */}
            <div className="h-14 w-full flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
                <path
                  d="M0,50 Q40,42 80,45 T160,30 T240,22 T300,12"
                  fill="none"
                  stroke="#00450d"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="300" cy="12" r="4" fill="#00450d" />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] text-on-surface-variant">
              <span>Day 1: ₹2,280</span>
              <span>Day 4: ₹2,360</span>
              <span className="font-bold text-primary">Today: ₹2,480</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-40 bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-4 border border-surface-container-high shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="font-label-md font-bold text-on-surface block">
              Draft Auto-Saved (1 min ago)
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant">
              All 5 photo proofs verified • Ready for direct retail discovery
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              setTotalQuantity(150);
              setAskingPrice(2450);
            }}
            className="px-4 py-2.5 rounded-xl border border-surface-container-high font-label-md text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
          >
            Reset Form
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing || publishSuccess}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-label-lg font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all ${
              publishSuccess
                ? 'bg-primary-fixed text-primary'
                : 'bg-primary text-on-primary hover:bg-primary/90'
            }`}
            id="publish-crop-btn"
          >
            <span className="material-symbols-outlined text-[20px]">
              {publishSuccess ? 'task_alt' : isPublishing ? 'sync' : 'rocket_launch'}
            </span>
            {publishSuccess
              ? 'Listing Published Live!'
              : isPublishing
              ? 'Broadcasting to Retailers...'
              : 'Publish Crop to 18,000+ Retailers'}
          </button>
        </div>
      </div>

      {publishSuccess && (
        <div className="p-4 rounded-2xl bg-primary-fixed text-on-primary-fixed-variant flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 font-title-md font-bold">
            <span className="material-symbols-outlined text-[24px] text-primary">
              check_circle
            </span>
            <span>
              Congratulations Ramesh Patil! Your batch of {cropName} is now live on the marketplace.
            </span>
          </div>
          <button
            onClick={() => onNavigate('farmer-dashboard-orders')}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md font-bold cursor-pointer"
          >
            Go to Farmer Dashboard & Track Bids →
          </button>
        </div>
      )}
    </div>
  );
};
